package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/jwt"
	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/middleware"
	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/response"
	"github.com/dnjstjqppk-dev/instagram/services/messaging-service/broker"
)

type MessageStore struct {
	mu       sync.RWMutex
	messages map[string][]broker.WSMessage // conv_id -> messages
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8085"
	}
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "aura-dev-secret-key-32-bytes-secure"
	}

	jwtMgr := jwt.NewJWTManager(jwtSecret, 24*time.Hour)
	store := &MessageStore{
		messages: make(map[string][]broker.WSMessage),
	}

	// Hub with persistence callback
	hub := broker.NewHub(func(msg broker.WSMessage) error {
		if msg.Type == broker.TypeChat && msg.ConversationID != "" {
			store.mu.Lock()
			store.messages[msg.ConversationID] = append(store.messages[msg.ConversationID], msg)
			store.mu.Unlock()
			log.Printf("[Messaging Service] Stored chat message in conv=%s from user=%s", msg.ConversationID, msg.SenderID)
		}
		return nil
	})
	go hub.Run()

	mux := http.NewServeMux()

	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]interface{}{
			"status":        "UP",
			"service":       "messaging-service",
			"active_clients": hub.GetActiveClientsCount(),
		})
	})

	// WebSocket Upgrade Endpoint: /ws/direct
	mux.HandleFunc("GET /ws/direct", func(w http.ResponseWriter, r *http.Request) {
		tokenStr := r.URL.Query().Get("token")
		if tokenStr == "" {
			authHeader := r.Header.Get("Authorization")
			if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
				tokenStr = authHeader[7:]
			}
		}

		if tokenStr == "" {
			http.Error(w, "Unauthorized: missing token", http.StatusUnauthorized)
			return
		}

		claims, err := jwtMgr.Verify(tokenStr)
		if err != nil {
			http.Error(w, "Unauthorized: invalid token", http.StatusUnauthorized)
			return
		}

		deviceID := r.URL.Query().Get("device_id")
		if deviceID == "" {
			deviceID = "default-web-client"
		}

		if err := broker.ServeWs(hub, w, r, claims.UserID, deviceID); err != nil {
			log.Printf("[Messaging Service] WS upgrade error: %v", err)
		}
	})

	// History REST endpoint: GET /api/v1/direct/conversations/{id}/messages
	mux.Handle("GET /api/v1/direct/conversations/{id}/messages", middleware.Auth(jwtMgr)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		convID := r.PathValue("id")
		store.mu.RLock()
		msgs := store.messages[convID]
		if msgs == nil {
			msgs = make([]broker.WSMessage, 0)
		}
		store.mu.RUnlock()

		response.JSON(w, http.StatusOK, map[string]interface{}{
			"items": msgs,
		})
	})))

	handler := middleware.Logger(middleware.CORS(mux))

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      handler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	go func() {
		log.Printf("💬 Aura Real-time Messaging Broker listening on port %s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	hub.Stop()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = server.Shutdown(ctx)
	log.Println("Messaging Service stopped gracefully.")
}
