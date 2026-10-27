package consumer

import (
	"fmt"
	"log"
	"sync"
	"time"
)

type Dispatcher struct {
	mu           sync.RWMutex
	handlers     map[string]EventHandler
	processedIDs map[string]time.Time // Dedup store with timestamp
	dlq          []DLQRecord
	maxRetries   int
}

func NewDispatcher(maxRetries int) *Dispatcher {
	return &Dispatcher{
		handlers:     make(map[string]EventHandler),
		processedIDs: make(map[string]time.Time),
		dlq:          make([]DLQRecord, 0),
		maxRetries:   maxRetries,
	}
}

func (d *Dispatcher) Register(eventType string, handler EventHandler) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.handlers[eventType] = handler
}

func (d *Dispatcher) Dispatch(event DomainEvent) error {
	d.mu.Lock()
	// Idempotency check: exactly-once processing guarantee
	if _, exists := d.processedIDs[event.EventID]; exists {
		d.mu.Unlock()
		log.Printf("[Event Dispatcher] Duplicate event skipped: id=%s type=%s", event.EventID, event.EventType)
		return nil
	}
	handler, exists := d.handlers[event.EventType]
	d.mu.Unlock()

	if !exists {
		log.Printf("[Event Dispatcher] No handler registered for event type: %s", event.EventType)
		return nil
	}

	var lastErr error
	for attempt := 0; attempt <= d.maxRetries; attempt++ {
		err := handler(event)
		if err == nil {
			d.mu.Lock()
			d.processedIDs[event.EventID] = time.Now()
			d.mu.Unlock()
			log.Printf("[Event Dispatcher] Event successfully processed: id=%s type=%s attempt=%d", event.EventID, event.EventType, attempt+1)
			return nil
		}

		lastErr = err
		log.Printf("[Event Dispatcher] Attempt %d failed for event id=%s: %v", attempt+1, event.EventID, err)
		if attempt < d.maxRetries {
			time.Sleep(time.Duration(100*(1<<attempt)) * time.Millisecond) // Exponential backoff
		}
	}

	// Move to Dead Letter Queue (DLQ)
	d.mu.Lock()
	d.dlq = append(d.dlq, DLQRecord{
		Event:      event,
		ErrorMsg:   lastErr.Error(),
		FailedAt:   time.Now(),
		RetryCount: d.maxRetries,
	})
	d.mu.Unlock()

	log.Printf("[Event Dispatcher] Event moved to DLQ: id=%s type=%s error=%v", event.EventID, event.EventType, lastErr)
	return fmt.Errorf("failed to process event %s after %d retries: %w", event.EventID, d.maxRetries, lastErr)
}

func (d *Dispatcher) GetDLQ() []DLQRecord {
	d.mu.RLock()
	defer d.mu.RUnlock()
	copied := make([]DLQRecord, len(d.dlq))
	copy(copied, d.dlq)
	return copied
}

func (d *Dispatcher) ClearProcessedOlderThan(ttl time.Duration) int {
	d.mu.Lock()
	defer d.mu.Unlock()
	cutoff := time.Now().Add(-ttl)
	cleared := 0
	for id, t := range d.processedIDs {
		if t.Before(cutoff) {
			delete(d.processedIDs, id)
			cleared++
		}
	}
	return cleared
}
