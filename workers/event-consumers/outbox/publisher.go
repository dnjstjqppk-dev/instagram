package outbox

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/dnjstjqppk-dev/instagram/workers/event-consumers/consumer"
)

type OutboxRecord struct {
	ID            string
	EventID       string
	EventType     string
	AggregateType string
	AggregateID   string
	Payload       map[string]interface{}
	Status        string // PENDING, PUBLISHED, FAILED
	RetryCount    int
	CreatedAt     time.Time
}

type OutboxStore interface {
	GetPending(ctx context.Context, batchSize int) ([]OutboxRecord, error)
	MarkPublished(ctx context.Context, eventID string) error
	MarkFailed(ctx context.Context, eventID string, err error) error
}

type InMemoryOutboxStore struct {
	mu      sync.Mutex
	records map[string]OutboxRecord
}

func NewInMemoryOutboxStore() *InMemoryOutboxStore {
	return &InMemoryOutboxStore{
		records: make(map[string]OutboxRecord),
	}
}

func (s *InMemoryOutboxStore) Add(rec OutboxRecord) {
	s.mu.Lock()
	defer s.mu.Unlock()
	rec.Status = "PENDING"
	s.records[rec.EventID] = rec
}

func (s *InMemoryOutboxStore) GetPending(ctx context.Context, batchSize int) ([]OutboxRecord, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	pending := make([]OutboxRecord, 0, batchSize)
	for _, rec := range s.records {
		if rec.Status == "PENDING" {
			pending = append(pending, rec)
			if len(pending) >= batchSize {
				break
			}
		}
	}
	return pending, nil
}

func (s *InMemoryOutboxStore) MarkPublished(ctx context.Context, eventID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if rec, ok := s.records[eventID]; ok {
		rec.Status = "PUBLISHED"
		s.records[eventID] = rec
	}
	return nil
}

func (s *InMemoryOutboxStore) MarkFailed(ctx context.Context, eventID string, err error) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if rec, ok := s.records[eventID]; ok {
		rec.RetryCount++
		if rec.RetryCount >= 3 {
			rec.Status = "FAILED"
		}
		s.records[eventID] = rec
	}
	return nil
}

type OutboxPublisher struct {
	store      OutboxStore
	dispatcher *consumer.Dispatcher
	batchSize  int
	pollPeriod time.Duration
	stopChan   chan struct{}
}

func NewOutboxPublisher(store OutboxStore, dispatcher *consumer.Dispatcher, batchSize int, pollPeriod time.Duration) *OutboxPublisher {
	return &OutboxPublisher{
		store:      store,
		dispatcher: dispatcher,
		batchSize:  batchSize,
		pollPeriod: pollPeriod,
		stopChan:   make(chan struct{}),
	}
}

func (p *OutboxPublisher) Start(ctx context.Context) {
	ticker := time.NewTicker(p.pollPeriod)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			p.processBatch(ctx)
		case <-p.stopChan:
			return
		case <-ctx.Done():
			return
		}
	}
}

func (p *OutboxPublisher) Stop() {
	close(p.stopChan)
}

func (p *OutboxPublisher) processBatch(ctx context.Context) {
	records, err := p.store.GetPending(ctx, p.batchSize)
	if err != nil {
		log.Printf("[Outbox Publisher] Error fetching pending events: %v", err)
		return
	}

	for _, rec := range records {
		event := consumer.DomainEvent{
			EventID:       rec.EventID,
			EventType:     rec.EventType,
			AggregateType: rec.AggregateType,
			AggregateID:   rec.AggregateID,
			Payload:       rec.Payload,
			Timestamp:     rec.CreatedAt,
			RetryCount:    rec.RetryCount,
		}

		err := p.dispatcher.Dispatch(event)
		if err == nil {
			_ = p.store.MarkPublished(ctx, rec.EventID)
		} else {
			_ = p.store.MarkFailed(ctx, rec.EventID, err)
		}
	}
}

