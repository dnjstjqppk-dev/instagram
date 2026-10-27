package integration_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/jwt"
	"github.com/dnjstjqppk-dev/instagram/services/messaging-service/broker"
	"github.com/gorilla/websocket"
)

func TestWebSocketMessagingE2E(t *testing.T) {
	jwtMgr := jwt.NewJWTManager("test-secret-websocket-key-32-chars!", 1*time.Hour)

	var receivedMessages []broker.WSMessage
	hub := broker.NewHub(func(msg broker.WSMessage) error {
		receivedMessages = append(receivedMessages, msg)
		return nil
	})
	go hub.Run()
	defer hub.Stop()

	// Register a shared conversation
	convID := "conv_e2e_test"
	hub.RegisterConversation(convID, []string{"usr_alice", "usr_bob"})

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenStr := r.URL.Query().Get("token")
		claims, err := jwtMgr.Verify(tokenStr)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		_ = broker.ServeWs(hub, w, r, claims.UserID, "test-device")
	}))
	defer server.Close()

	// Generate tokens for Alice & Bob
	tokenAlice, _, _ := jwtMgr.Generate("usr_alice", "alice", "PERSONAL", []string{"ROLE_USER"})
	tokenBob, _, _ := jwtMgr.Generate("usr_bob", "bob", "PERSONAL", []string{"ROLE_USER"})

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")

	// Connect Alice
	connAlice, _, err := websocket.DefaultDialer.Dial(wsURL+"?token="+tokenAlice, nil)
	if err != nil {
		t.Fatalf("Failed to connect Alice: %v", err)
	}
	defer connAlice.Close()

	// Connect Bob
	connBob, _, err := websocket.DefaultDialer.Dial(wsURL+"?token="+tokenBob, nil)
	if err != nil {
		t.Fatalf("Failed to connect Bob: %v", err)
	}
	defer connBob.Close()

	// Wait briefly for presence registrations
	time.Sleep(100 * time.Millisecond)

	if !hub.IsUserOnline("usr_alice") || !hub.IsUserOnline("usr_bob") {
		t.Errorf("Expected both Alice and Bob to be online")
	}

	// Alice sends a CHAT message to Bob in convID
	chatMsg := broker.WSMessage{
		Type:           broker.TypeChat,
		ConversationID: convID,
		Content:        "Hello Bob! Welcome to real-time Aura Direct.",
		RecipientID:    "usr_bob",
	}
	payload, _ := json.Marshal(chatMsg)
	if err := connAlice.WriteMessage(websocket.TextMessage, payload); err != nil {
		t.Fatalf("Alice failed to write message: %v", err)
	}

	// Bob reads messages until receiving TypeChat (filtering out initial presence broadcasts)
	var bobReceived broker.WSMessage
	deadline := time.Now().Add(2 * time.Second)
	for time.Now().Before(deadline) {
		_ = connBob.SetReadDeadline(time.Now().Add(500 * time.Millisecond))
		_, respPayload, err := connBob.ReadMessage()
		if err != nil {
			t.Fatalf("Bob read error: %v", err)
		}
		var tmp broker.WSMessage
		if err := json.Unmarshal(respPayload, &tmp); err == nil && tmp.Type == broker.TypeChat {
			bobReceived = tmp
			break
		}
	}

	if bobReceived.Type != broker.TypeChat {
		t.Fatalf("Bob never received TypeChat message before deadline")
	}
	if bobReceived.Content != chatMsg.Content {
		t.Errorf("Expected content '%s', got '%s'", chatMsg.Content, bobReceived.Content)
	}
	if bobReceived.SenderID != "usr_alice" {
		t.Errorf("Expected sender 'usr_alice', got '%s'", bobReceived.SenderID)
	}
}
