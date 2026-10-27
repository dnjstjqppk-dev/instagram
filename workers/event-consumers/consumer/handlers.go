package consumer

import (
	"fmt"
	"log"
	"strings"
	"sync"
	"time"
)

type InMemoryFeedCache struct {
	mu            sync.RWMutex
	timelines     map[string][]string               // userID -> slice of postIDs
	notifications map[string][]map[string]interface{} // userID -> notifications
	searchIndex   map[string][]string               // tag -> slice of postIDs
}

func NewFeedCache() *InMemoryFeedCache {
	return &InMemoryFeedCache{
		timelines:     make(map[string][]string),
		notifications: make(map[string][]map[string]interface{}),
		searchIndex:   make(map[string][]string),
	}
}

func (fc *InMemoryFeedCache) PrependTimeline(userID, postID string) {
	fc.mu.Lock()
	defer fc.mu.Unlock()
	fc.timelines[userID] = append([]string{postID}, fc.timelines[userID]...)
}

func (fc *InMemoryFeedCache) AddNotification(recipientID string, notif map[string]interface{}) {
	fc.mu.Lock()
	defer fc.mu.Unlock()
	fc.notifications[recipientID] = append([]map[string]interface{}{notif}, fc.notifications[recipientID]...)
}

func (fc *InMemoryFeedCache) IndexHashtags(postID string, tags []string) {
	fc.mu.Lock()
	defer fc.mu.Unlock()
	for _, tag := range tags {
		clean := strings.ToLower(strings.TrimPrefix(tag, "#"))
		fc.searchIndex[clean] = append(fc.searchIndex[clean], postID)
	}
}

func (fc *InMemoryFeedCache) GetTimeline(userID string) []string {
	fc.mu.RLock()
	defer fc.mu.RUnlock()
	return fc.timelines[userID]
}

func (fc *InMemoryFeedCache) GetNotifications(userID string) []map[string]interface{} {
	fc.mu.RLock()
	defer fc.mu.RUnlock()
	return fc.notifications[userID]
}

func BuildEventHandlers(cache *InMemoryFeedCache, followersProvider func(authorID string) []string) map[string]EventHandler {
	return map[string]EventHandler{
		"PostCreated": func(e DomainEvent) error {
			postID, ok := e.Payload["post_id"].(string)
			if !ok || postID == "" {
				return fmt.Errorf("missing post_id in PostCreated event")
			}
			authorID, _ := e.Payload["author_id"].(string)

			// 1. Fanout to followers
			if followersProvider != nil {
				followers := followersProvider(authorID)
				for _, followerID := range followers {
					cache.PrependTimeline(followerID, postID)
				}
				log.Printf("[PostCreated Consumer] Fanned out post %s to %d followers", postID, len(followers))
			}

			// 2. Index hashtags
			if tags, ok := e.Payload["hashtags"].([]interface{}); ok {
				strTags := make([]string, 0, len(tags))
				for _, t := range tags {
					if s, isStr := t.(string); isStr {
						strTags = append(strTags, s)
					}
				}
				cache.IndexHashtags(postID, strTags)
				log.Printf("[PostCreated Consumer] Indexed %d hashtags for post %s", len(strTags), postID)
			}

			return nil
		},

		"FollowCreated": func(e DomainEvent) error {
			followerID, _ := e.Payload["follower_id"].(string)
			followingID, _ := e.Payload["following_id"].(string)
			if followerID == "" || followingID == "" {
				return fmt.Errorf("invalid follower or following id")
			}

			// Add Follow Notification
			cache.AddNotification(followingID, map[string]interface{}{
				"id":         fmt.Sprintf("notif_%d", time.Now().UnixNano()),
				"type":       "FOLLOW",
				"actor_id":   followerID,
				"created_at": time.Now().Format(time.RFC3339),
			})

			log.Printf("[FollowCreated Consumer] Processed follow: %s -> %s (notification queued)", followerID, followingID)
			return nil
		},

		"PostLiked": func(e DomainEvent) error {
			postID, _ := e.Payload["post_id"].(string)
			userID, _ := e.Payload["user_id"].(string)
			authorID, _ := e.Payload["author_id"].(string)

			if postID == "" || userID == "" {
				return fmt.Errorf("invalid post_id or user_id in PostLiked event")
			}

			// Do not notify self-likes
			if authorID != "" && authorID != userID {
				cache.AddNotification(authorID, map[string]interface{}{
					"id":         fmt.Sprintf("notif_%d", time.Now().UnixNano()),
					"type":       "LIKE",
					"actor_id":   userID,
					"entity_id":  postID,
					"created_at": time.Now().Format(time.RFC3339),
				})
			}

			log.Printf("[PostLiked Consumer] Processed like on post %s by %s", postID, userID)
			return nil
		},

		"MessageSent": func(e DomainEvent) error {
			recipientID, _ := e.Payload["recipient_id"].(string)
			senderID, _ := e.Payload["sender_id"].(string)
			preview, _ := e.Payload["preview"].(string)

			// In real production, check if recipient has active push tokens
			log.Printf("[MessageSent Consumer] Dispatching offline notification: recipient=%s sender=%s preview=%s", recipientID, senderID, preview)
			return nil
		},
	}
}
