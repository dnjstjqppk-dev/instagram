package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"
	"syscall"
	"time"

	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/jwt"
	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/middleware"
	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/response"
)

type GatewayConfig struct {
	Port         string
	JWTSecret    string
	TokenTTL     time.Duration
}

type InMemoryStore struct {
	mu           sync.RWMutex
	users        map[string]map[string]interface{} // user_id -> user
	usernames    map[string]string                 // username -> user_id
	credentials  map[string]string                 // user_id -> password
	posts        map[string]map[string]interface{} // post_id -> post
	comments     map[string][]map[string]interface{} // post_id -> comments
	likes        map[string]map[string]bool        // post_id -> user_id -> bool
	follows      map[string]map[string]bool        // user_id -> following_id -> bool
	stories      []map[string]interface{}
	reels        []map[string]interface{}
	conversations []map[string]interface{}
	messages     map[string][]map[string]interface{} // conv_id -> messages
}

var store = &InMemoryStore{
	users:         make(map[string]map[string]interface{}),
	usernames:     make(map[string]string),
	credentials:   make(map[string]string),
	posts:         make(map[string]map[string]interface{}),
	comments:      make(map[string][]map[string]interface{}),
	likes:         make(map[string]map[string]bool),
	follows:       make(map[string]map[string]bool),
	stories:       make([]map[string]interface{}, 0),
	reels:         make([]map[string]interface{}, 0),
	conversations: make([]map[string]interface{}, 0),
	messages:      make(map[string][]map[string]interface{}),
}

func initSeedData() {
	store.mu.Lock()
	defer store.mu.Unlock()

	// Seed Demo Users
	demoUsers := []struct {
		ID       string
		Username string
		Email    string
		FullName string
		Avatar   string
		Type     string
		Verified bool
	}{
		{"usr_01", "aura_official", "official@aurasocial.net", "Aura Social Official", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150", "BUSINESS", true},
		{"usr_02", "sarah_art", "sarah@example.com", "Sarah Jenkins", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", "CREATOR", true},
		{"usr_03", "alex_photo", "alex@example.com", "Alex Rivera", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", "CREATOR", false},
	}

	for _, u := range demoUsers {
		userObj := map[string]interface{}{
			"id":           u.ID,
			"username":     u.Username,
			"email":        u.Email,
			"full_name":    u.FullName,
			"avatar_url":   u.Avatar,
			"is_private":   false,
			"is_verified":  u.Verified,
			"account_type": u.Type,
			"bio":          fmt.Sprintf("Welcome to %s's official feed! #photography #art", u.FullName),
			"posts_count":  1,
			"followers_count": 1240,
			"following_count": 310,
		}
		store.users[u.ID] = userObj
		store.usernames[u.Username] = u.ID
		store.credentials[u.ID] = "password123!"
	}

	// Seed Demo Post
	postID := "post_001"
	store.posts[postID] = map[string]interface{}{
		"id": postID,
		"author": store.users["usr_02"],
		"caption": "Golden hour through the prism lens ✨ #aesthetic #sunset #photography",
		"post_type": "IMAGE",
		"media": []map[string]interface{}{
			{
				"id": "med_001",
				"media_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080",
				"media_type": "IMAGE",
				"aspect_ratio": "1:1",
			},
		},
		"likes_count": 428,
		"comments_count": 12,
		"is_liked": false,
		"is_saved": false,
		"created_at": time.Now().Add(-2 * time.Hour).Format(time.RFC3339),
	}

	// Seed Demo Stories
	store.stories = append(store.stories, map[string]interface{}{
		"id": "story_001",
		"user": store.users["usr_02"],
		"has_unseen_stories": true,
		"stories": []map[string]interface{}{
			{
				"id": "st_sub_01",
				"media_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=720",
				"is_close_friends": false,
				"expires_at": time.Now().Add(22 * time.Hour).Format(time.RFC3339),
			},
		},
	})

	// Seed Demo Reel
	store.reels = append(store.reels, map[string]interface{}{
		"id": "reel_001",
		"creator": store.users["usr_03"],
		"video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
		"thumbnail_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480",
		"caption": "Capturing mountain sunrise with high speed drone footage 🏔️ #nature #reels",
		"views_count": 14200,
		"likes_count": 1289,
		"comments_count": 56,
		"is_liked": false,
	})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "aura-dev-secret-key-32-bytes-secure"
	}

	initSeedData()
	jwtMgr := jwt.NewJWTManager(jwtSecret, 24*time.Hour)

	mux := http.NewServeMux()

	// Health & System
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]string{
			"status": "UP",
			"service": "api-gateway",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})

	// Auth Endpoints
	mux.HandleFunc("POST /api/v1/auth/register", func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Username string `json:"username"`
			Email    string `json:"email"`
			Password string `json:"password"`
			FullName string `json:"full_name"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid request body", nil)
			return
		}

		store.mu.Lock()
		defer store.mu.Unlock()

		if _, exists := store.usernames[req.Username]; exists {
			response.Error(w, http.StatusConflict, "USER_EXISTS", "Username already taken", nil)
			return
		}

		userID := fmt.Sprintf("usr_%d", time.Now().UnixNano())
		newUser := map[string]interface{}{
			"id":           userID,
			"username":     req.Username,
			"email":        req.Email,
			"full_name":    req.FullName,
			"avatar_url":   nil,
			"is_private":   false,
			"is_verified":  false,
			"account_type": "PERSONAL",
			"bio":          "",
			"posts_count":  0,
			"followers_count": 0,
			"following_count": 0,
		}

		store.users[userID] = newUser
		store.usernames[req.Username] = userID
		store.credentials[userID] = req.Password

		token, exp, _ := jwtMgr.Generate(userID, req.Username, "PERSONAL", []string{"ROLE_USER"})

		response.JSON(w, http.StatusCreated, map[string]interface{}{
			"access_token":  token,
			"refresh_token": "rt_" + token[:16],
			"token_type":    "Bearer",
			"expires_in":    exp - time.Now().Unix(),
			"user":          newUser,
		})
	})

	mux.HandleFunc("POST /api/v1/auth/login", func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Identifier string `json:"identifier"`
			Password   string `json:"password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid body", nil)
			return
		}

		store.mu.RLock()
		defer store.mu.RUnlock()

		var matchedUser map[string]interface{}
		var matchedID string

		if id, ok := store.usernames[req.Identifier]; ok {
			matchedID = id
			matchedUser = store.users[id]
		} else {
			for id, u := range store.users {
				if u["email"] == req.Identifier {
					matchedID = id
					matchedUser = u
					break
				}
			}
		}

		if matchedUser == nil || store.credentials[matchedID] != req.Password {
			response.Error(w, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Invalid username/email or password", nil)
			return
		}

		token, exp, _ := jwtMgr.Generate(matchedID, matchedUser["username"].(string), matchedUser["account_type"].(string), []string{"ROLE_USER"})

		response.JSON(w, http.StatusOK, map[string]interface{}{
			"access_token":  token,
			"refresh_token": "rt_" + token[:16],
			"token_type":    "Bearer",
			"expires_in":    exp - time.Now().Unix(),
			"user":          matchedUser,
		})
	})

	// Authenticated Current User
	mux.Handle("GET /api/v1/auth/me", middleware.Auth(jwtMgr)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, _ := middleware.GetClaims(r.Context())
		store.mu.RLock()
		user, exists := store.users[claims.UserID]
		store.mu.RUnlock()

		if !exists {
			response.Error(w, http.StatusNotFound, "NOT_FOUND", "User not found", nil)
			return
		}
		response.JSON(w, http.StatusOK, user)
	})))

	// Profiles
	mux.HandleFunc("GET /api/v1/profiles/{username}", func(w http.ResponseWriter, r *http.Request) {
		username := r.PathValue("username")
		store.mu.RLock()
		defer store.mu.RUnlock()

		uid, exists := store.usernames[username]
		if !exists {
			response.Error(w, http.StatusNotFound, "NOT_FOUND", "Profile not found", nil)
			return
		}

		user := store.users[uid]
		response.JSON(w, http.StatusOK, map[string]interface{}{
			"user":            user,
			"bio":             user["bio"],
			"website_url":     "https://aurasocial.net",
			"posts_count":     user["posts_count"],
			"followers_count": user["followers_count"],
			"following_count": user["following_count"],
			"is_following":    false,
		})
	})

	// Home Feed
	mux.HandleFunc("GET /api/v1/feed/home", func(w http.ResponseWriter, r *http.Request) {
		store.mu.RLock()
		defer store.mu.RUnlock()

		feedList := make([]map[string]interface{}, 0, len(store.posts))
		for _, p := range store.posts {
			feedList = append(feedList, p)
		}

		response.JSON(w, http.StatusOK, map[string]interface{}{
			"items":       feedList,
			"next_cursor": nil,
			"has_more":    false,
		})
	})

	// Post Management
	mux.Handle("POST /api/v1/posts", middleware.Auth(jwtMgr)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, _ := middleware.GetClaims(r.Context())

		var req struct {
			Caption   string                   `json:"caption"`
			PostType  string                   `json:"post_type"`
			Media     []map[string]interface{} `json:"media"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid post data", nil)
			return
		}

		store.mu.Lock()
		defer store.mu.Unlock()

		author := store.users[claims.UserID]
		postID := fmt.Sprintf("post_%d", time.Now().UnixNano())

		if req.PostType == "" {
			req.PostType = "IMAGE"
		}

		newPost := map[string]interface{}{
			"id":             postID,
			"author":         author,
			"caption":        req.Caption,
			"post_type":      req.PostType,
			"media":          req.Media,
			"likes_count":    0,
			"comments_count": 0,
			"is_liked":       false,
			"is_saved":       false,
			"created_at":     time.Now().Format(time.RFC3339),
		}

		store.posts[postID] = newPost
		if author != nil {
			currentCount := author["posts_count"].(int)
			author["posts_count"] = currentCount + 1
		}

		response.JSON(w, http.StatusCreated, newPost)
	})))

	// Post Likes
	mux.Handle("POST /api/v1/posts/{id}/likes", middleware.Auth(jwtMgr)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		postID := r.PathValue("id")
		claims, _ := middleware.GetClaims(r.Context())

		store.mu.Lock()
		defer store.mu.Unlock()

		post, exists := store.posts[postID]
		if !exists {
			response.Error(w, http.StatusNotFound, "NOT_FOUND", "Post not found", nil)
			return
		}

		if store.likes[postID] == nil {
			store.likes[postID] = make(map[string]bool)
		}

		if !store.likes[postID][claims.UserID] {
			store.likes[postID][claims.UserID] = true
			post["likes_count"] = post["likes_count"].(int) + 1
		}

		response.JSON(w, http.StatusOK, map[string]interface{}{
			"liked": true,
			"likes_count": post["likes_count"],
		})
	})))

	mux.Handle("DELETE /api/v1/posts/{id}/likes", middleware.Auth(jwtMgr)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		postID := r.PathValue("id")
		claims, _ := middleware.GetClaims(r.Context())

		store.mu.Lock()
		defer store.mu.Unlock()

		post, exists := store.posts[postID]
		if !exists {
			response.Error(w, http.StatusNotFound, "NOT_FOUND", "Post not found", nil)
			return
		}

		if store.likes[postID] != nil && store.likes[postID][claims.UserID] {
			delete(store.likes[postID], claims.UserID)
			if cnt := post["likes_count"].(int); cnt > 0 {
				post["likes_count"] = cnt - 1
			}
		}

		response.JSON(w, http.StatusOK, map[string]interface{}{
			"liked": false,
			"likes_count": post["likes_count"],
		})
	})))

	// Post Comments
	mux.HandleFunc("GET /api/v1/posts/{id}/comments", func(w http.ResponseWriter, r *http.Request) {
		postID := r.PathValue("id")
		store.mu.RLock()
		defer store.mu.RUnlock()

		comments := store.comments[postID]
		if comments == nil {
			comments = make([]map[string]interface{}, 0)
		}

		response.JSON(w, http.StatusOK, map[string]interface{}{
			"items": comments,
		})
	})

	mux.Handle("POST /api/v1/posts/{id}/comments", middleware.Auth(jwtMgr)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		postID := r.PathValue("id")
		claims, _ := middleware.GetClaims(r.Context())

		var req struct {
			Content  string  `json:"content"`
			ParentID *string `json:"parent_id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || strings.TrimSpace(req.Content) == "" {
			response.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Content is required", nil)
			return
		}

		store.mu.Lock()
		defer store.mu.Unlock()

		post, exists := store.posts[postID]
		if !exists {
			response.Error(w, http.StatusNotFound, "NOT_FOUND", "Post not found", nil)
			return
		}

		author := store.users[claims.UserID]
		commentID := fmt.Sprintf("cmt_%d", time.Now().UnixNano())
		newComment := map[string]interface{}{
			"id":          commentID,
			"post_id":     postID,
			"author":      author,
			"content":     req.Content,
			"parent_id":   req.ParentID,
			"likes_count": 0,
			"created_at":  time.Now().Format(time.RFC3339),
		}

		store.comments[postID] = append(store.comments[postID], newComment)
		post["comments_count"] = post["comments_count"].(int) + 1

		response.JSON(w, http.StatusCreated, newComment)
	})))

	// Stories & Reels Trays
	mux.HandleFunc("GET /api/v1/stories/feed", func(w http.ResponseWriter, r *http.Request) {
		store.mu.RLock()
		defer store.mu.RUnlock()
		response.JSON(w, http.StatusOK, store.stories)
	})

	mux.HandleFunc("GET /api/v1/reels/feed", func(w http.ResponseWriter, r *http.Request) {
		store.mu.RLock()
		defer store.mu.RUnlock()
		response.JSON(w, http.StatusOK, map[string]interface{}{
			"items": store.reels,
		})
	})

	// Wrap root router with CORS and Logger
	handler := middleware.Logger(middleware.CORS(mux))

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      handler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("🚀 Aura API Gateway running on port %s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down Aura API Gateway...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
	log.Println("Server gracefully stopped.")
}

