package broker

import "time"

type MessageType string

const (
	TypeChat        MessageType = "CHAT"
	TypeTyping      MessageType = "TYPING"
	TypeReadReceipt MessageType = "READ_RECEIPT"
	TypePresence    MessageType = "PRESENCE"
	TypeReaction    MessageType = "REACTION"
	TypeError       MessageType = "ERROR"
)

type WSMessage struct {
	Type           MessageType `json:"type"`
	ConversationID string      `json:"conversation_id,omitempty"`
	MessageID      string      `json:"message_id,omitempty"`
	SenderID       string      `json:"sender_id,omitempty"`
	RecipientID    string      `json:"recipient_id,omitempty"`
	Content        string      `json:"content,omitempty"`
	MediaURL       string      `json:"media_url,omitempty"`
	Reaction       string      `json:"reaction,omitempty"`
	IsTyping       bool        `json:"is_typing,omitempty"`
	IsEphemeral    bool        `json:"is_ephemeral,omitempty"`
	Timestamp      int64       `json:"timestamp"`
}

func NewChatMessage(msgID, convID, senderID, content, mediaURL string, isEphemeral bool) WSMessage {
	return WSMessage{
		Type:           TypeChat,
		MessageID:      msgID,
		ConversationID: convID,
		SenderID:       senderID,
		Content:        content,
		MediaURL:       mediaURL,
		IsEphemeral:    isEphemeral,
		Timestamp:      time.Now().UnixMilli(),
	}
}

func NewPresenceMessage(userID string, isOnline bool) WSMessage {
	return WSMessage{
		Type:        TypePresence,
		SenderID:    userID,
		IsTyping:    false,
		Content:     map[bool]string{true: "ONLINE", false: "OFFLINE"}[isOnline],
		Timestamp:   time.Now().UnixMilli(),
	}
}

