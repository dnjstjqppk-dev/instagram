package pipeline

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"sync"
	"time"
)

type MediaStatus string

const (
	StatusQueued     MediaStatus = "QUEUED"
	StatusProcessing MediaStatus = "PROCESSING"
	StatusReady      MediaStatus = "READY"
	StatusFailed     MediaStatus = "FAILED"
)

type MediaMetadata struct {
	MediaID     string      `json:"media_id"`
	UserID      string      `json:"user_id"`
	Filename    string      `json:"filename"`
	ContentType string      `json:"content_type"`
	Status      MediaStatus `json:"status"`
	URL         string      `json:"url,omitempty"`
	ThumbURL    string      `json:"thumb_url,omitempty"`
	CreatedAt   time.Time   `json:"created_at"`
	ReadyAt     *time.Time  `json:"ready_at,omitempty"`
}

type StorageManager struct {
	mu           sync.RWMutex
	secretKey    []byte
	baseURL      string
	bucket       string
	mediaRecords map[string]*MediaMetadata
}

func NewStorageManager(secretKey, baseURL, bucket string) *StorageManager {
	return &StorageManager{
		secretKey:    []byte(secretKey),
		baseURL:      baseURL,
		bucket:       bucket,
		mediaRecords: make(map[string]*MediaMetadata),
	}
}

func (sm *StorageManager) GeneratePresignedUploadURL(userID, filename, contentType string) (string, string, string) {
	mediaID := fmt.Sprintf("med_%d", time.Now().UnixNano())
	expiresAt := time.Now().Add(15 * time.Minute).Unix()

	stringToSign := fmt.Sprintf("%s:%s:%s:%d", userID, mediaID, contentType, expiresAt)
	h := hmac.New(sha256.New, sm.secretKey)
	h.Write([]byte(stringToSign))
	signature := hex.EncodeToString(h.Sum(nil))

	uploadURL := fmt.Sprintf("%s/%s/raw/%s/%s?exp=%d&sig=%s", sm.baseURL, sm.bucket, userID, mediaID, expiresAt, signature)

	record := &MediaMetadata{
		MediaID:     mediaID,
		UserID:      userID,
		Filename:    filename,
		ContentType: contentType,
		Status:      StatusQueued,
		CreatedAt:   time.Now(),
	}

	sm.mu.Lock()
	sm.mediaRecords[mediaID] = record
	sm.mu.Unlock()

	return mediaID, uploadURL, signature
}

func (sm *StorageManager) UpdateStatus(mediaID string, status MediaStatus, publicURL, thumbURL string) {
	sm.mu.Lock()
	defer sm.mu.Unlock()
	if rec, ok := sm.mediaRecords[mediaID]; ok {
		rec.Status = status
		rec.URL = publicURL
		rec.ThumbURL = thumbURL
		if status == StatusReady {
			now := time.Now()
			rec.ReadyAt = &now
		}
	}
}

func (sm *StorageManager) GetMetadata(mediaID string) (*MediaMetadata, bool) {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	rec, ok := sm.mediaRecords[mediaID]
	if !ok {
		return nil, false
	}
	copyRec := *rec
	return &copyRec, true
}

