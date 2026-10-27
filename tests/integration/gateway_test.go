package integration_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/jwt"
	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/middleware"
	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/response"
)

func setupTestServer() http.Handler {
	jwtMgr := jwt.NewJWTManager("test-secret-gateway-key-32-chars-ok!", 1*time.Hour)
	mux := http.NewServeMux()

	// In-memory demo state for integration test
	users := make(map[string]map[string]interface{})
	posts := make(map[string]map[string]interface{})
	likes := make(map[string]map[string]bool)

	// Health
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]string{"status": "UP"})
	})

	// Register
	mux.HandleFunc("POST /api/v1/auth/register", func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Username string `json:"username"`
			Email    string `json:"email"`
			Password string `json:"password"`
		}
		_ = json.NewDecoder(r.Body).Decode(&req)
		uid := "usr_int_1"
		u := map[string]interface{}{
			"id": uid, "username": req.Username, "email": req.Email, "account_type": "PERSONAL",
		}
		users[uid] = u
		token, _, _ := jwtMgr.Generate(uid, req.Username, "PERSONAL", []string{"ROLE_USER"})
		response.JSON(w, http.StatusCreated, map[string]interface{}{
			"access_token": token, "user": u,
		})
	})

	// Me
	mux.Handle("GET /api/v1/auth/me", middleware.Auth(jwtMgr)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, _ := middleware.GetClaims(r.Context())
		response.JSON(w, http.StatusOK, users[claims.UserID])
	})))

	// Create Post
	mux.Handle("POST /api/v1/posts", middleware.Auth(jwtMgr)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, _ := middleware.GetClaims(r.Context())
		var req struct {
			Caption string `json:"caption"`
		}
		_ = json.NewDecoder(r.Body).Decode(&req)
		pid := "post_int_1"
		p := map[string]interface{}{
			"id": pid, "caption": req.Caption, "author_id": claims.UserID, "likes_count": 0,
		}
		posts[pid] = p
		response.JSON(w, http.StatusCreated, p)
	})))

	// Like Post
	mux.Handle("POST /api/v1/posts/{id}/likes", middleware.Auth(jwtMgr)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		pid := r.PathValue("id")
		claims, _ := middleware.GetClaims(r.Context())
		if likes[pid] == nil {
			likes[pid] = make(map[string]bool)
		}
		likes[pid][claims.UserID] = true
		posts[pid]["likes_count"] = posts[pid]["likes_count"].(int) + 1
		response.JSON(w, http.StatusOK, map[string]interface{}{"liked": true, "likes_count": posts[pid]["likes_count"]})
	})))

	return middleware.CORS(mux)
}

func TestE2EAuthAndPostLifecycle(t *testing.T) {
	handler := setupTestServer()
	ts := httptest.NewServer(handler)
	defer ts.Close()

	client := ts.Client()

	// 1. Healthcheck
	resp, err := client.Get(ts.URL + "/healthz")
	if err != nil || resp.StatusCode != http.StatusOK {
		t.Fatalf("Healthcheck failed: %v, status: %d", err, resp.StatusCode)
	}

	// 2. Register
	regBody := []byte(`{"username":"testuser","email":"test@aura.net","password":"Pass123!"}`)
	resp, err = client.Post(ts.URL+"/api/v1/auth/register", "application/json", bytes.NewReader(regBody))
	if err != nil || resp.StatusCode != http.StatusCreated {
		t.Fatalf("Registration failed: %v, status: %d", err, resp.StatusCode)
	}

	var regData struct {
		Success bool `json:"success"`
		Data    struct {
			AccessToken string `json:"access_token"`
			User        struct {
				ID       string `json:"id"`
				Username string `json:"username"`
			} `json:"user"`
		} `json:"data"`
	}
	_ = json.NewDecoder(resp.Body).Decode(&regData)
	token := regData.Data.AccessToken
	if token == "" {
		t.Fatal("Expected access token in response")
	}

	// 3. Authenticated /me
	req, _ := http.NewRequest("GET", ts.URL+"/api/v1/auth/me", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err = client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to fetch /me: %v, status: %d", err, resp.StatusCode)
	}

	// 4. Create Post
	postBody := []byte(`{"caption":"First test post on Aura Social! #hello"}`)
	req, _ = http.NewRequest("POST", ts.URL+"/api/v1/posts", bytes.NewReader(postBody))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	resp, err = client.Do(req)
	if err != nil || resp.StatusCode != http.StatusCreated {
		t.Fatalf("Failed to create post: %v, status: %d", err, resp.StatusCode)
	}

	// 5. Like Post
	req, _ = http.NewRequest("POST", ts.URL+"/api/v1/posts/post_int_1/likes", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err = client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to like post: %v, status: %d", err, resp.StatusCode)
	}

	var likeData struct {
		Success bool `json:"success"`
		Data    struct {
			Liked      bool `json:"liked"`
			LikesCount int  `json:"likes_count"`
		} `json:"data"`
	}
	_ = json.NewDecoder(resp.Body).Decode(&likeData)
	if !likeData.Data.Liked || likeData.Data.LikesCount != 1 {
		t.Errorf("Unexpected like response: %+v", likeData.Data)
	}
}

