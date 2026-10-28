package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/dnjstjqppk-dev/instagram/workers/event-consumers/consumer"
	"github.com/dnjstjqppk-dev/instagram/workers/event-consumers/outbox"
)

func main() {
	log.Println("Starting Aura Event Consumer & Outbox Worker Daemon...")

	cache := consumer.NewFeedCache()
	dispatcher := consumer.NewDispatcher(3)

	handlers := consumer.BuildEventHandlers(cache, nil)

	for eventType, handler := range handlers {
		dispatcher.Register(eventType, handler)
	}

	store := outbox.NewInMemoryOutboxStore()
	publisher := outbox.NewOutboxPublisher(store, dispatcher, 50, 200*time.Millisecond)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go publisher.Start(ctx)

	log.Println("Aura Event Consumers & Outbox Worker successfully running.")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down Outbox Worker...")
	publisher.Stop()
	cancel()
	log.Println("Worker exited cleanly.")
}

