package consumer

import "time"

type DomainEvent struct {
	EventID        string                 `json:"event_id"`
	EventType      string                 `json:"event_type"`
	AggregateType  string                 `json:"aggregate_type"`
	AggregateID    string                 `json:"aggregate_id"`
	Payload        map[string]interface{} `json:"payload"`
	Timestamp      time.Time              `json:"timestamp"`
	RetryCount     int                    `json:"retry_count"`
}

type EventHandler func(event DomainEvent) error

type DLQRecord struct {
	Event      DomainEvent `json:"event"`
	ErrorMsg   string      `json:"error_msg"`
	FailedAt   time.Time   `json:"failed_at"`
	RetryCount int         `json:"retry_count"`
}

