<template>
  <div class="direct-layout">
    <div class="direct-card">
      <!-- Left Inbox Pane -->
      <aside class="inbox-pane">
        <header class="inbox-header">
          <div class="user-selector">
            <span class="header-username">{{ authStore.user?.username || 'Messages' }}</span>
            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <button class="new-msg-btn">
            <svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </header>

        <div class="messages-list">
          <div
            v-for="c in conversations"
            :key="c.id"
            class="conversation-item"
            :class="{ 'active': activeConversation?.id === c.id }"
            @click="activeConversation = c"
          >
            <div class="item-avatar-wrap">
              <img :src="c.participant.avatar_url" alt="" class="item-avatar" />
              <div v-if="c.is_online" class="online-dot"></div>
            </div>
            <div class="item-info">
              <span class="item-username">{{ c.participant.username }}</span>
              <span class="item-last-msg">{{ c.last_message }} • {{ c.last_time }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Right Chat Pane -->
      <main class="chat-pane">
        <div v-if="activeConversation" class="chat-view">
          <header class="chat-header">
            <div class="header-user">
              <img :src="activeConversation.participant.avatar_url" alt="" class="header-avatar" />
              <div class="header-meta">
                <span class="header-name">{{ activeConversation.participant.full_name }}</span>
                <span class="header-status">{{ activeConversation.is_online ? 'Active now' : 'Active 2h ago' }}</span>
              </div>
            </div>
            <div class="header-actions">
              <button class="chat-action-btn" aria-label="Audio call">
                <svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </button>
              <button class="chat-action-btn" aria-label="Video call">
                <svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </button>
            </div>
          </header>

          <div class="messages-flow">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="message-bubble-row"
              :class="{ 'sent': msg.is_me, 'received': !msg.is_me }"
            >
              <div class="bubble">
                {{ msg.content }}
              </div>
            </div>
          </div>

          <form class="chat-input-bar" @submit.prevent="sendMessage">
            <input
              v-model="inputMessage"
              type="text"
              placeholder="Message..."
              class="message-input"
            />
            <button v-if="inputMessage.trim()" type="submit" class="send-btn">Send</button>
          </form>
        </div>

        <div v-else class="empty-chat-state">
          <div class="empty-icon-wrap">
            <svg viewBox="0 0 24 24" class="empty-icon" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </div>
          <h3>Your messages</h3>
          <p>Send a message to start a chat with a friend or creator.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const conversations = ref([
  {
    id: 'c_1',
    participant: {
      username: 'alex_photo',
      full_name: 'Alex Rivera',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    last_message: 'Loved that last photo shot!',
    last_time: '20m',
    is_online: true
  },
  {
    id: 'c_2',
    participant: {
      username: 'aura_official',
      full_name: 'Aura Social Official',
      avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'
    },
    last_message: 'Welcome to Aura Platform!',
    last_time: '1d',
    is_online: false
  }
])

const activeConversation = ref<any>(conversations.value[0])
const inputMessage = ref('')

const messages = ref([
  { id: 'm_1', is_me: false, content: 'Hey Sarah! Loved your new photography exhibition post.' },
  { id: 'm_2', is_me: true, content: 'Thank you Alex! Really appreciate it 🙏' },
  { id: 'm_3', is_me: false, content: 'Are you joining the creators meet this Saturday?' }
])

function sendMessage() {
  if (!inputMessage.value.trim()) return
  messages.value.push({
    id: `m_${Date.now()}`,
    is_me: true,
    content: inputMessage.value.trim()
  })
  inputMessage.value = ''
}
</script>

<style scoped>
.direct-layout {
  max-width: 935px;
  margin: 0 auto;
  padding: 24px 20px;
  height: calc(100vh - 40px);
}

.direct-card {
  height: 100%;
  border: 1px solid var(--aura-color-border);
  border-radius: 12px;
  background-color: var(--aura-color-card);
  display: flex;
  overflow: hidden;
}

.inbox-pane {
  width: 350px;
  border-right: 1px solid var(--aura-color-border);
  display: flex;
  flex-direction: column;
}

.inbox-header {
  height: 60px;
  border-bottom: 1px solid var(--aura-color-border);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 16px;
}

.chevron-icon {
  width: 16px;
  height: 16px;
}

.new-msg-btn .icon {
  width: 22px;
  height: 22px;
  color: var(--aura-color-text-primary);
}

.messages-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.1s ease;
}

.conversation-item:hover {
  background-color: var(--aura-color-surface);
}

.conversation-item.active {
  background-color: var(--aura-color-surface);
}

.item-avatar-wrap {
  position: relative;
  width: 50px;
  height: 50px;
}

.item-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #10B981;
  border: 2px solid var(--aura-color-card);
}

.item-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.item-username {
  font-size: 14px;
  font-weight: 500;
}

.item-last-msg {
  font-size: 12px;
  color: var(--aura-color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-header {
  height: 60px;
  border-bottom: 1px solid var(--aura-color-border);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.header-meta {
  display: flex;
  flex-direction: column;
}

.header-name {
  font-size: 14px;
  font-weight: 600;
}

.header-status {
  font-size: 11px;
  color: var(--aura-color-text-secondary);
}

.header-actions {
  display: flex;
  gap: 16px;
}

.chat-action-btn .icon {
  width: 22px;
  height: 22px;
  color: var(--aura-color-text-primary);
}

.messages-flow {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-bubble-row {
  display: flex;
  width: 100%;
}

.message-bubble-row.sent {
  justify-content: flex-end;
}

.message-bubble-row.received {
  justify-content: flex-start;
}

.bubble {
  max-width: 60%;
  padding: 10px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
}

.sent .bubble {
  background-color: var(--aura-color-accent);
  color: #fff;
}

.received .bubble {
  background-color: var(--aura-color-surface);
  border: 1px solid var(--aura-color-border);
  color: var(--aura-color-text-primary);
}

.chat-input-bar {
  padding: 16px 20px;
  display: flex;
  align-items: center;
}

.message-input {
  flex: 1;
  border: 1px solid var(--aura-color-border);
  background-color: var(--aura-color-surface);
  color: var(--aura-color-text-primary);
  padding: 10px 18px;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
}

.send-btn {
  color: var(--aura-color-accent);
  font-weight: 600;
  font-size: 14px;
  margin-left: 12px;
}

.empty-chat-state {
  margin: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--aura-color-text-secondary);
}

.empty-icon-wrap {
  width: 72px;
  height: 72px;
  border: 2px solid var(--aura-color-text-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--aura-color-text-primary);
  margin-bottom: 6px;
}

.empty-icon {
  width: 36px;
  height: 36px;
}
</style>

