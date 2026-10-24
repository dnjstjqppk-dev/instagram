<template>
  <article class="post-card">
    <!-- Header -->
    <header class="post-header">
      <router-link :to="`/${post.author.username}`" class="author-info">
        <div class="avatar-ring">
          <img :src="post.author.avatar_url || defaultAvatar" :alt="post.author.username" class="author-avatar" />
        </div>
        <div class="author-meta">
          <div class="username-row">
            <span class="username">{{ post.author.username }}</span>
            <svg v-if="post.author.is_verified" class="verified-badge" viewBox="0 0 24 24" fill="#0095F6">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span class="timestamp">• {{ timeAgo(post.created_at) }}</span>
          </div>
          <span v-if="post.location" class="location">{{ post.location }}</span>
        </div>
      </router-link>
      <button class="options-btn" aria-label="More options">
        <svg viewBox="0 0 24 24" class="icon" fill="currentColor">
          <circle cx="12" cy="12" r="1.5"/>
          <circle cx="6" cy="12" r="1.5"/>
          <circle cx="18" cy="12" r="1.5"/>
        </svg>
      </button>
    </header>

    <!-- Media Area with Double-Tap Heart -->
    <div class="media-container" @dblclick="handleDoubleTap">
      <img
        :src="currentMediaUrl"
        :alt="post.caption || 'Post image'"
        class="post-media"
      />
      <!-- Animated Heart Pop -->
      <transition name="heart-pop">
        <div v-if="showHeartPop" class="heart-pop-wrapper">
          <svg viewBox="0 0 24 24" class="heart-pop-icon" fill="#ED4956">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      </transition>
    </div>

    <!-- Actions Bar -->
    <div class="actions-bar">
      <div class="left-actions">
        <button class="action-btn" :class="{ 'liked': post.is_liked }" @click="toggleLike" aria-label="Like">
          <svg viewBox="0 0 24 24" class="icon" :fill="post.is_liked ? '#ED4956' : 'none'" :stroke="post.is_liked ? '#ED4956' : 'currentColor'" stroke-width="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>

        <button class="action-btn" @click="focusComment" aria-label="Comment">
          <svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </button>

        <button class="action-btn" @click="$emit('share-post', post)" aria-label="Share">
          <svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      <button class="action-btn" :class="{ 'saved': post.is_saved }" @click="toggleSave" aria-label="Save">
        <svg viewBox="0 0 24 24" class="icon" :fill="post.is_saved ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
    </div>

    <!-- Engagement Counts & Caption -->
    <div class="content-body">
      <div class="likes-count">{{ post.likes_count.toLocaleString() }} likes</div>
      <div v-if="post.caption" class="caption-row">
        <router-link :to="`/${post.author.username}`" class="caption-username">{{ post.author.username }}</router-link>
        <span class="caption-text">{{ post.caption }}</span>
      </div>

      <!-- View Comments Link -->
      <button v-if="post.comments_count > 0" class="view-comments-btn" @click="showCommentsModal = true">
        View all {{ post.comments_count }} comments
      </button>

      <!-- Add Comment Form -->
      <form class="comment-form" @submit.prevent="submitComment">
        <input
          ref="commentInput"
          v-model="newCommentText"
          type="text"
          placeholder="Add a comment..."
          class="comment-input"
        />
        <button v-if="newCommentText.trim()" type="submit" class="post-comment-btn">Post</button>
      </form>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  post: {
    id: string
    author: {
      id: string
      username: string
      avatar_url: string | null
      is_verified?: boolean
    }
    caption?: string
    location?: string
    media: Array<{
      id: string
      media_url: string
      media_type: string
    }>
    likes_count: number
    comments_count: number
    is_liked: boolean
    is_saved: boolean
    created_at: string
  }
}>()

const emit = defineEmits(['like', 'unlike', 'comment', 'share-post'])

const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
const showHeartPop = ref(false)
const showCommentsModal = ref(false)
const newCommentText = ref('')
const commentInput = ref<HTMLInputElement | null>(null)

const currentMediaUrl = computed(() => {
  return props.post.media[0]?.media_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080'
})

function handleDoubleTap() {
  if (!props.post.is_liked) {
    emit('like', props.post.id)
  }
  showHeartPop.value = true
  setTimeout(() => {
    showHeartPop.value = false
  }, 900)
}

function toggleLike() {
  if (props.post.is_liked) {
    emit('unlike', props.post.id)
  } else {
    emit('like', props.post.id)
  }
}

function toggleSave() {
  props.post.is_saved = !props.post.is_saved
}

function focusComment() {
  commentInput.value?.focus()
}

function submitComment() {
  if (!newCommentText.value.trim()) return
  emit('comment', { postId: props.post.id, content: newCommentText.value.trim() })
  newCommentText.value = ''
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'JUST NOW'
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}
</script>

<style scoped>
.post-card {
  background-color: var(--aura-color-card);
  border: 1px solid var(--aura-color-border);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  max-width: 480px;
  width: 100%;
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-ring {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
}

.author-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-meta {
  display: flex;
  flex-direction: column;
}

.username-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: var(--aura-color-text-primary);
}

.verified-badge {
  width: 14px;
  height: 14px;
}

.timestamp {
  font-size: 12px;
  color: var(--aura-color-text-secondary);
}

.location {
  font-size: 11px;
  color: var(--aura-color-text-secondary);
}

.options-btn {
  color: var(--aura-color-text-secondary);
  padding: 4px;
}

.media-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.post-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.heart-pop-wrapper {
  position: absolute;
  pointer-events: none;
}

.heart-pop-icon {
  width: 90px;
  height: 90px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
}

.heart-pop-enter-active {
  animation: heartPopAnimation 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes heartPopAnimation {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 0.95; }
  100% { transform: scale(1); opacity: 0; }
}

.actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 6px;
}

.left-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-btn {
  color: var(--aura-color-text-primary);
  display: flex;
  align-items: center;
}

.action-btn .icon {
  width: 24px;
  height: 24px;
  transition: transform 0.15s ease;
}

.action-btn:hover .icon {
  transform: scale(1.1);
}

.content-body {
  padding: 0 14px 12px;
}

.likes-count {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}

.caption-row {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 6px;
}

.caption-username {
  font-weight: 600;
  margin-right: 6px;
}

.view-comments-btn {
  font-size: 13px;
  color: var(--aura-color-text-secondary);
  margin-bottom: 8px;
}

.comment-form {
  display: flex;
  align-items: center;
  border-top: 1px solid var(--aura-color-border-subtle);
  padding-top: 8px;
  margin-top: 8px;
}

.comment-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--aura-color-text-primary);
  font-size: 13px;
  outline: none;
}

.post-comment-btn {
  color: var(--aura-color-accent);
  font-size: 13px;
  font-weight: 600;
  padding-left: 8px;
}
</style>
