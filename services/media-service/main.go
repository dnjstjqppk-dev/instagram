package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/jwt"
	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/middleware"
	"github.com/dnjstjqppk-dev/instagram/packages/shared-go/pkg/response"
	"github.com/dnjstjqppk-dev/instagram/services/media-service/pipeline"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8086"
	}
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "aura-dev-secret-key-32-bytes-secure"
	}

	jwtMgr := jwt.NewJWTManager(jwtSecret, 24*time.Hour)
	storageMgr := pipeline.NewStorageManager("aura-storage-secret-key", "https://s3.aurasocial.net", "media")
	imgProcessor := pipeline.NewImageProcessor()
	videoProcessor := pipeline.NewVideoProcessor()

	mux := http.NewServeMux()

	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]string{
			"status":  "UP",
			"service": "media-service",
		})
	})

	// Generate Presigned Upload URL: POST /api/v1/media/upload-url
	mux.Handle("POST /api/v1/media/upload-url", middleware.Auth(jwtMgr)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, _ := middleware.GetClaims(r.Context())

		var req struct {
			Filename    string `json:"filename"`
			ContentType string `json:"content_type"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Filename == "" {
			response.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Filename and content_type required", nil)
			return
		}

		mediaID, uploadURL, token := storageMgr.GeneratePresignedUploadURL(claims.UserID, req.Filename, req.ContentType)

		response.JSON(w, http.StatusOK, map[string]string{
			"media_id":   mediaID,
			"upload_url": uploadURL,
			"token":      token,
		})
	})))

	// Direct Process Image: POST /api/v1/media/process-image (multipart file upload)
	mux.Handle("POST /api/v1/media/process-image", middleware.Auth(jwtMgr)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Limit to 20MB
		r.Body = http.MaxBytesReader(w, r.Body, 20*1024*1024)
		if err := r.ParseMultipartForm(20 * 1024 * 1024); err != nil {
			response.Error(w, http.StatusBadRequest, "PAYLOAD_TOO_LARGE", "File exceeds 20MB limit", nil)
			return
		}

		file, header, err := r.FormFile("file")
		if err != nil {
			response.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Missing file field", nil)
			return
		}
		defer file.Close()

		result, err := imgProcessor.ProcessImage(file, header.Filename)
		if err != nil {
			response.Error(w, http.StatusUnprocessableEntity, "PROCESSING_ERROR", err.Error(), nil)
			return
		}

		mediaID := fmt.Sprintf("img_%d", time.Now().UnixNano())
		publicURL := fmt.Sprintf("https://cdn.aurasocial.net/media/%s/feed.%s", mediaID, result.Format)
		thumbURL := fmt.Sprintf("https://cdn.aurasocial.net/media/%s/thumb.jpg", mediaID)

		response.JSON(w, http.StatusOK, map[string]interface{}{
			"media_id":        mediaID,
			"url":             publicURL,
			"thumbnail_url":   thumbURL,
			"original_width":  result.OriginalWidth,
			"original_height": result.OriginalHeight,
			"format":          result.Format,
		})
	})))

	// Video Transcoding Verification: POST /api/v1/media/validate-video
	mux.Handle("POST /api/v1/media/validate-video", middleware.Auth(jwtMgr)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Category pipeline.VideoCategory `json:"category"`
			Specs    pipeline.VideoSpecs    `json:"specs"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.Error(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid video specs", nil)
			return
		}

		if err := videoProcessor.ValidateSpecs(req.Category, req.Specs); err != nil {
			response.Error(w, http.StatusUnprocessableEntity, "VALIDATION_FAILED", err.Error(), nil)
			return
		}

		mediaID := fmt.Sprintf("vid_%d", time.Now().UnixNano())
		hlsResult := videoProcessor.GenerateHLSManifest(mediaID, "https://cdn.aurasocial.net/hls")

		response.JSON(w, http.StatusOK, map[string]interface{}{
			"media_id":       mediaID,
			"status":         pipeline.StatusReady,
			"hls_manifest":   hlsResult.MasterPlaylistContent,
			"variants_count": len(hlsResult.Variants),
			"thumbnail_url":  hlsResult.ThumbnailURL,
		})
	})))

	// Status Poll: GET /api/v1/media/{id}/status
	mux.HandleFunc("GET /api/v1/media/{id}/status", func(w http.ResponseWriter, r *http.Request) {
		mediaID := r.PathValue("id")
		meta, exists := storageMgr.GetMetadata(mediaID)
		if !exists {
			response.Error(w, http.StatusNotFound, "NOT_FOUND", "Media not found", nil)
			return
		}
		response.JSON(w, http.StatusOK, meta)
	})

	handler := middleware.Logger(middleware.CORS(mux))

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      handler,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	go func() {
		log.Printf("📹 Aura Media Processing Pipeline listening on port %s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Media server error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = server.Shutdown(ctx)
	log.Println("Media service stopped.")
}

