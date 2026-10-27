package pipeline

import (
	"errors"
	"fmt"
	"strings"
)

var (
	ErrVideoDurationExceeded = errors.New("video exceeds maximum permitted duration")
	ErrInvalidAspectRatio    = errors.New("invalid video aspect ratio for specified media category")
)

type VideoCategory string

const (
	CategoryFeedPost VideoCategory = "FEED"
	CategoryStory    VideoCategory = "STORY"
	CategoryReel     VideoCategory = "REEL"
)

type VideoSpecs struct {
	DurationSeconds float64
	Width           int
	Height          int
	FileSize        int64
	MimeType        string
}

type HLSStreamVariant struct {
	Resolution string
	Bandwidth  int
	PlaylistURI string
}

type HLSManifestResult struct {
	MasterPlaylistContent string
	Variants              []HLSStreamVariant
	ThumbnailURL          string
}

type VideoProcessor struct{}

func NewVideoProcessor() *VideoProcessor {
	return &VideoProcessor{}
}

func (vp *VideoProcessor) ValidateSpecs(category VideoCategory, specs VideoSpecs) error {
	switch category {
	case CategoryStory:
		if specs.DurationSeconds > 60.0 {
			return fmt.Errorf("%w: stories max duration is 60s (got %.1fs)", ErrVideoDurationExceeded, specs.DurationSeconds)
		}
	case CategoryReel:
		if specs.DurationSeconds > 90.0 {
			return fmt.Errorf("%w: reels max duration is 90s (got %.1fs)", ErrVideoDurationExceeded, specs.DurationSeconds)
		}
		// Reels must be vertical aspect ratio (~9:16)
		ratio := float64(specs.Width) / float64(specs.Height)
		if ratio > 0.65 { // 9/16 is 0.5625
			return fmt.Errorf("%w: reels requires vertical aspect ratio 9:16 (aspect ratio %.2f)", ErrInvalidAspectRatio, ratio)
		}
	case CategoryFeedPost:
		if specs.DurationSeconds > 60.0 {
			return fmt.Errorf("%w: feed video max duration is 60s (got %.1fs)", ErrVideoDurationExceeded, specs.DurationSeconds)
		}
	}
	return nil
}

// GenerateHLSManifest creates the master HLS (.m3u8) adaptive bitrate playlist
func (vp *VideoProcessor) GenerateHLSManifest(mediaID string, baseURL string) HLSManifestResult {
	cleanBase := strings.TrimSuffix(baseURL, "/")

	variants := []HLSStreamVariant{
		{Resolution: "1080x1920", Bandwidth: 4500000, PlaylistURI: fmt.Sprintf("%s/%s/1080p/index.m3u8", cleanBase, mediaID)},
		{Resolution: "720x1280",  Bandwidth: 2500000, PlaylistURI: fmt.Sprintf("%s/%s/720p/index.m3u8", cleanBase, mediaID)},
		{Resolution: "480x854",   Bandwidth: 1200000, PlaylistURI: fmt.Sprintf("%s/%s/480p/index.m3u8", cleanBase, mediaID)},
	}

	var sb strings.Builder
	sb.WriteString("#EXTM3U\n")
	sb.WriteString("#EXT-X-VERSION:4\n\n")

	for _, v := range variants {
		sb.WriteString(fmt.Sprintf("#EXT-X-STREAM-INF:BANDWIDTH=%d,RESOLUTION=%s,FRAME-RATE=30.000,CODECS=\"avc1.640028,mp4a.40.2\"\n", v.Bandwidth, v.Resolution))
		sb.WriteString(v.PlaylistURI + "\n\n")
	}

	return HLSManifestResult{
		MasterPlaylistContent: sb.String(),
		Variants:              variants,
		ThumbnailURL:          fmt.Sprintf("%s/%s/thumbnails/poster.jpg", cleanBase, mediaID),
	}
}

