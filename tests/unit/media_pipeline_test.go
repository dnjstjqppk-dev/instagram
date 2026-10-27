package unit_test

import (
	"bytes"
	"image/color"
	"image/jpeg"
	"strings"
	"testing"

	"github.com/dnjstjqppk-dev/instagram/services/media-service/pipeline"
)

func TestImageProcessorMultiResolutionAndCrop(t *testing.T) {
	processor := pipeline.NewImageProcessor()

	// Create a synthetic 1920x1080 image
	synthetic := pipeline.CreateSyntheticImage(1920, 1080, color.RGBA{R: 255, G: 0, B: 128, A: 255})
	var buf bytes.Buffer
	if err := jpeg.Encode(&buf, synthetic, nil); err != nil {
		t.Fatalf("Failed to encode test image: %v", err)
	}

	result, err := processor.ProcessImage(&buf, "landscape_shot.jpg")
	if err != nil {
		t.Fatalf("ProcessImage failed: %v", err)
	}

	if result.OriginalWidth != 1920 || result.OriginalHeight != 1080 {
		t.Errorf("Expected dimensions 1920x1080, got %dx%d", result.OriginalWidth, result.OriginalHeight)
	}

	if len(result.ThumbnailBytes) == 0 {
		t.Fatal("Expected non-empty thumbnail bytes")
	}

	if len(result.FeedFormatBytes) == 0 {
		t.Fatal("Expected non-empty feed format bytes")
	}
}

func TestVideoProcessorValidationAndHLS(t *testing.T) {
	vp := pipeline.NewVideoProcessor()

	// 1. Stories: max duration 60s
	validStory := pipeline.VideoSpecs{DurationSeconds: 45.0, Width: 1080, Height: 1920}
	if err := vp.ValidateSpecs(pipeline.CategoryStory, validStory); err != nil {
		t.Errorf("Valid story failed validation: %v", err)
	}

	invalidStory := pipeline.VideoSpecs{DurationSeconds: 75.0, Width: 1080, Height: 1920}
	if err := vp.ValidateSpecs(pipeline.CategoryStory, invalidStory); err == nil {
		t.Fatal("Expected error for story exceeding 60s, got nil")
	}

	// 2. Reels: vertical aspect ratio required
	validReel := pipeline.VideoSpecs{DurationSeconds: 30.0, Width: 1080, Height: 1920} // 9:16
	if err := vp.ValidateSpecs(pipeline.CategoryReel, validReel); err != nil {
		t.Errorf("Valid reel failed validation: %v", err)
	}

	horizontalReel := pipeline.VideoSpecs{DurationSeconds: 30.0, Width: 1920, Height: 1080} // 16:9 (horizontal)
	if err := vp.ValidateSpecs(pipeline.CategoryReel, horizontalReel); err == nil {
		t.Fatal("Expected error for non-vertical reel aspect ratio, got nil")
	}

	// 3. HLS Master Playlist generation
	hls := vp.GenerateHLSManifest("med_video_123", "https://cdn.aurasocial.net/hls")
	if !strings.Contains(hls.MasterPlaylistContent, "#EXTM3U") {
		t.Errorf("Expected valid HLS manifest header")
	}
	if len(hls.Variants) != 3 {
		t.Errorf("Expected 3 bitrate variants, got %d", len(hls.Variants))
	}
	if !strings.Contains(hls.ThumbnailURL, "thumbnails/poster.jpg") {
		t.Errorf("Unexpected thumbnail url: %s", hls.ThumbnailURL)
	}
}

func TestStorageManagerPresignedUpload(t *testing.T) {
	sm := pipeline.NewStorageManager("secret-key-storage", "https://s3.aurasocial.net", "aura-media")

	mediaID, uploadURL, token := sm.GeneratePresignedUploadURL("usr_artist", "photo.jpg", "image/jpeg")
	if mediaID == "" || uploadURL == "" || token == "" {
		t.Fatal("Expected valid presigned upload outputs")
	}

	if !strings.Contains(uploadURL, "raw/usr_artist/"+mediaID) {
		t.Errorf("Unexpected upload URL path: %s", uploadURL)
	}

	meta, exists := sm.GetMetadata(mediaID)
	if !exists {
		t.Fatal("Expected metadata to exist after generation")
	}
	if meta.Status != pipeline.StatusQueued {
		t.Errorf("Expected status QUEUED, got %s", meta.Status)
	}

	sm.UpdateStatus(mediaID, pipeline.StatusReady, "https://cdn.aurasocial.net/ready.jpg", "https://cdn.aurasocial.net/thumb.jpg")
	updatedMeta, _ := sm.GetMetadata(mediaID)
	if updatedMeta.Status != pipeline.StatusReady || updatedMeta.URL == "" {
		t.Errorf("Status update failed: %+v", updatedMeta)
	}
}

