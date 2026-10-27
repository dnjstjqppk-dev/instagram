package broker

import (
	"encoding/json"
	"log"
	"sync"
)

type MessageHandler func(msg WSMessage) error

type Hub struct {
	mu            sync.RWMutex
	clients       map[string]map[*Client]bool // userID -> set of active clients (multi-device)
	conversations map[string]map[string]bool  // conversationID -> set of userIDs
	presence      map[string]bool             // userID -> isOnline
	onMessage     MessageHandler

	broadcast  chan WSMessage
	register   chan *Client
	unregister chan *Client
	stopChan   chan struct{}
}

func NewHub(handler MessageHandler) *Hub {
	return &Hub{
		clients:       make(map[string]map[*Client]bool),
		conversations: make(map[string]map[string]bool),
		presence:      make(map[string]bool),
		onMessage:     handler,
		broadcast:     make(chan WSMessage, 1024),
		register:      make(chan *Client, 256),
		unregister:    make(chan *Client, 256),
		stopChan:      make(chan struct{}),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			if h.clients[client.UserID] == nil {
				h.clients[client.UserID] = make(map[*Client]bool)
				h.presence[client.UserID] = true
				// Broadcast online presence to contacts
				go h.broadcastPresence(client.UserID, true)
			}
			h.clients[client.UserID][client] = true
			h.mu.Unlock()
			log.Printf("[WebSocket Hub] Client connected: user=%s device=%s", client.UserID, client.DeviceID)

		case client := <-h.unregister:
			h.mu.Lock()
			if clients, ok := h.clients[client.UserID]; ok {
				delete(clients, client)
				if len(clients) == 0 {
					delete(h.clients, client.UserID)
					h.presence[client.UserID] = false
					go h.broadcastPresence(client.UserID, false)
				}
			}
			h.mu.Unlock()
			log.Printf("[WebSocket Hub] Client disconnected: user=%s device=%s", client.UserID, client.DeviceID)

		case msg := <-h.broadcast:
			h.routeMessage(msg)

		case <-h.stopChan:
			return
		}
	}
}

func (h *Hub) Stop() {
	close(h.stopChan)
}

func (h *Hub) RegisterConversation(convID string, memberIDs []string) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if h.conversations[convID] == nil {
		h.conversations[convID] = make(map[string]bool)
	}
	for _, m := range memberIDs {
		h.conversations[convID][m] = true
	}
}

func (h *Hub) Broadcast(msg WSMessage) {
	h.broadcast <- msg
}

func (h *Hub) routeMessage(msg WSMessage) {
	if h.onMessage != nil {
		if err := h.onMessage(msg); err != nil {
			log.Printf("[WebSocket Hub] onMessage callback error: %v", err)
		}
	}

	payload, err := json.Marshal(msg)
	if err != nil {
		return
	}

	h.mu.RLock()
	defer h.mu.RUnlock()

	// Direct delivery to recipient if specified
	if msg.RecipientID != "" {
		if devices, ok := h.clients[msg.RecipientID]; ok {
			for c := range devices {
				select {
				case c.send <- payload:
				default:
					close(c.send)
					delete(devices, c)
				}
			}
		}
	}

	// Also echo back to other devices of sender
	if msg.SenderID != "" {
		if devices, ok := h.clients[msg.SenderID]; ok {
			for c := range devices {
				select {
				case c.send <- payload:
				default:
					close(c.send)
					delete(devices, c)
				}
			}
		}
	}

	// Delivery to group conversation members
	if msg.ConversationID != "" && msg.RecipientID == "" {
		if members, ok := h.conversations[msg.ConversationID]; ok {
			for memberID := range members {
				if devices, hasClient := h.clients[memberID]; hasClient {
					for c := range devices {
						select {
						case c.send <- payload:
						default:
							close(c.send)
							delete(devices, c)
						}
					}
				}
			}
		}
	}
}

func (h *Hub) broadcastPresence(userID string, isOnline bool) {
	msg := NewPresenceMessage(userID, isOnline)
	h.Broadcast(msg)
}

func (h *Hub) IsUserOnline(userID string) bool {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return h.presence[userID]
}

func (h *Hub) GetActiveClientsCount() int {
	h.mu.RLock()
	defer h.mu.RUnlock()
	total := 0
	for _, devMap := range h.clients {
		total += len(devMap)
	}
	return total
}
