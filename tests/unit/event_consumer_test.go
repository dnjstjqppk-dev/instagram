package unit_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/dnjstjqppk-dev/instagram/workers/event-consumers/consumer"
	"github.com/dnjstjqppk-dev/instagram/workers/event-consumers/outbox"
)

func TestEventConsumerTimelineFanoutAndNotifications(t *testing.T) {
	cache := consumer.NewFeedCache()
	dispatcher := consumer.NewDispatcher(3)

	followers := map[string][]string{
		"usr_creator": {"usr_fan_1", "usr_fan_2", "usr_fan_3"},
	}

	handlers := consumer.BuildEventHandlers(cache, func(authorID string) []string {
		return followers[authorID]
	})

	for eventType, handler := range handlers {
		dispatcher.Register(eventType, handler)
	}

	// 1. Dispatch PostCreated
	postEvent := consumer.DomainEvent{
		EventID:       "evt_post_100",
		EventType:     "PostCreated",
		AggregateType: "POST",
		AggregateID:   "post_100",
		Payload: map[string]interface{}{
			"post_id":   "post_100",
			"author_id": "usr_creator",
			"hashtags":  []interface{}{"#photography", "#seoul"},
		},
		Timestamp: time.Now(),
	}

	if err := dispatcher.Dispatch(postEvent); err != nil {
		t.Fatalf("Failed to dispatch PostCreated: %v", err)
	}

	// Verify timeline fanout to all 3 followers
	for _, follower := range followers["usr_creator"] {
		timeline := cache.GetTimeline(follower)
		if len(timeline) != 1 || timeline[0] != "post_100" {
			t.Errorf("Expected timeline for %s to contain 'post_100', got %v", follower, timeline)
		}
	}

	// 2. Dispatch PostLiked
	likeEvent := consumer.DomainEvent{
		EventID:       "evt_like_200",
		EventType:     "PostLiked",
		AggregateType: "POST",
		AggregateID:   "post_100",
		Payload: map[string]interface{}{
			"post_id":   "post_100",
			"user_id":   "usr_fan_1",
			"author_id": "usr_creator",
		},
		Timestamp: time.Now(),
	}

	if err := dispatcher.Dispatch(likeEvent); err != nil {
		t.Fatalf("Failed to dispatch PostLiked: %v", err)
	}

	// Verify notification generated for author
	notifs := cache.GetNotifications("usr_creator")
	if len(notifs) != 1 {
		t.Fatalf("Expected 1 notification for usr_creator, got %d", len(notifs))
	}
	if notifs[0]["type"] != "LIKE" || notifs[0]["actor_id"] != "usr_fan_1" {
		t.Errorf("Unexpected notification structure: %+v", notifs[0])
	}
}

func TestDispatcherIdempotencyAndDLQ(t *testing.T) {
	dispatcher := consumer.NewDispatcher(2)

	callCount := 0
	dispatcher.Register("FlakyEvent", func(e consumer.DomainEvent) error {
		callCount++
		if e.Payload["should_fail"] == true {
			return errors.New("simulated fatal processing error")
		}
		return nil
	})

	// 1. Success event with duplicate dispatch
	successEvent := consumer.DomainEvent{
		EventID:   "evt_success_1",
		EventType: "FlakyEvent",
		Payload:   map[string]interface{}{"should_fail": false},
	}

	_ = dispatcher.Dispatch(successEvent)
	_ = dispatcher.Dispatch(successEvent) // Duplicate dispatch

	if callCount != 1 {
		t.Errorf("Expected exactly 1 execution due to idempotency, got %d", callCount)
	}

	// 2. Failing event leading to DLQ
	failingEvent := consumer.DomainEvent{
		EventID:   "evt_fail_1",
		EventType: "FlakyEvent",
		Payload:   map[string]interface{}{"should_fail": true},
	}

	err := dispatcher.Dispatch(failingEvent)
	if err == nil {
		t.Fatal("Expected dispatch to fail for failing event")
	}

	dlq := dispatcher.GetDLQ()
	if len(dlq) != 1 {
		t.Fatalf("Expected 1 record in DLQ, got %d", len(dlq))
	}
	if dlq[0].Event.EventID != "evt_fail_1" {
		t.Errorf("Expected DLQ record for 'evt_fail_1', got %s", dlq[0].Event.EventID)
	}
}

func TestOutboxPublisherWorkflow(t *testing.T) {
	dispatcher := consumer.NewDispatcher(3)
	processed := make(map[string]bool)

	dispatcher.Register("OrderPaid", func(e consumer.DomainEvent) error {
		processed[e.EventID] = true
		return nil
	})

	store := outbox.NewInMemoryOutboxStore()
	store.Add(outbox.OutboxRecord{
		EventID:       "evt_outbox_1",
		EventType:     "OrderPaid",
		AggregateType: "ORDER",
		AggregateID:   "ord_999",
		Payload:       map[string]interface{}{"amount": 2500},
		CreatedAt:     time.Now(),
	})

	publisher := outbox.NewOutboxPublisher(store, dispatcher, 10, 50*time.Millisecond)
	ctx, cancel := context.WithTimeout(context.Background(), 200*time.Millisecond)
	defer cancel()

	go publisher.Start(ctx)
	<-ctx.Done()
	publisher.Stop()

	if !processed["evt_outbox_1"] {
		t.Errorf("Expected OutboxPublisher to process 'evt_outbox_1'")
	}
}



func TestEventConsumerFollowGraphFanout(t *testing.T) {
	cache := consumer.NewFeedCache()
	dispatcher := consumer.NewDispatcher(3)

	handlers := consumer.BuildEventHandlers(cache, nil)
	for eventType, handler := range handlers {
		dispatcher.Register(eventType, handler)
	}

	// Establish follow relation via domain event instead of mock provider
	followEvent := consumer.DomainEvent{
		EventID:       "evt_follow_1",
		EventType:     "FollowCreated",
		AggregateType: "USER",
		AggregateID:   "usr_creator",
		Payload: map[string]interface{}{
			"follower_id":  "usr_fan_1",
			"following_id": "usr_creator",
		},
		Timestamp: time.Now(),
	}
	if err := dispatcher.Dispatch(followEvent); err != nil {
		t.Fatalf("Failed to dispatch FollowCreated: %v", err)
	}

	postEvent := consumer.DomainEvent{
		EventID:       "evt_post_200",
		EventType:     "PostCreated",
		AggregateType: "POST",
		AggregateID:   "post_200",
		Payload: map[string]interface{}{
			"post_id":   "post_200",
			"author_id": "usr_creator",
			"hashtags":  []interface{}{"#test"},
		},
		Timestamp: time.Now(),
	}
	if err := dispatcher.Dispatch(postEvent); err != nil {
		t.Fatalf("Failed to dispatch PostCreated: %v", err)
	}

	timeline := cache.GetTimeline("usr_fan_1")
	if len(timeline) != 1 || timeline[0] != "post_200" {
		t.Errorf("Expected follower timeline to contain 'post_200', got %v", timeline)
	}
}
