<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">
      <header class="modal-header">
        <button class="back-btn" @click="$emit('close')">Cancel</button>
        <h2 class="modal-title">Create new post</h2>
        <button class="share-btn" :disabled="!imageUrl || isPublishing" @click="handlePublish">
          {{ isPublishing ? 'Sharing...' : 'Share' }}
        </button>
      </header>

      <div class="modal-body">
        <div class="preview-column">
          <div v-if="imageUrl" class="image-preview" :class="selectedFilter">
            <img :src="imageUrl" alt="Preview" />
          </div>
          <div v-else class="upload-placeholder">
            <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="4"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p>Paste image URL or choose preset</p>
            <div class="preset-buttons">
              <button
                v-for="(preset, i) in presets"
                :key="i"
                class="preset-btn"
                @click="imageUrl = preset.url"
              >
                Sample {{ i + 1 }}
              </button>
            </div>
            <input
              v-model="imageUrl"
              type="text"
              placeholder="Or enter https://..."
              class="url-input"
            />
          </div>

          <!-- Filter Ribbon -->
          <div v-if="imageUrl" class="filter-ribbon">
            <button
              v-for="filter in filters"
              :key="filter.id"
              class="filter-thumb"
              :class="{ 'active': selectedFilter === filter.id }"
              @click="selectedFilter = filter.id"
            >
              <div class="filter-sample" :class="filter.id">
                <img :src="imageUrl" alt="" />
              </div>
              <span class="filter-name">{{ filter.name }}</span>
            </button>
          </div>
        </div>

        <div class="caption-column">
          <div class="author-row">
            <img :src="userAvatar" alt="" class="author-avatar" />
            <span class="author-name">{{ username }}</span>
          </div>

          <textarea
            v-model="caption"
            placeholder="Write a caption..."
            class="caption-textarea"
            maxlength="2200"
          ></textarea>

          <div class="char-count">{{ caption.length }} / 2,200</div>

          <div class="metadata-section">
            <input
              v-model="location"
              type="text"
              placeholder="Add location"
              class="meta-input"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const emit = defineEmits(['close', 'created'])
const authStore = useAuthStore()

const imageUrl = ref('')
const caption = ref('')
const location = ref('')
const selectedFilter = ref('filter-normal')
const isPublishing = ref(false)

const userAvatar = computed(() => authStore.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100')
const username = computed(() => authStore.user?.username || 'user')

const presets = [
  { url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=1080' },
  { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080' },
  { url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1080' }
]

const filters = [
  { id: 'filter-normal', name: 'Normal' },
  { id: 'filter-clarendon', name: 'Clarendon' },
  { id: 'filter-juno', name: 'Juno' },
  { id: 'filter-valencia', name: 'Valencia' },
  { id: 'filter-bw', name: 'Inkwell' }
]

async function handlePublish() {
  if (!imageUrl.value || isPublishing.value) return
  isPublishing.value = true

  const newPostData = {
    caption: caption.value,
    location: location.value,
    post_type: 'IMAGE',
    media: [
      {
        media_url: imageUrl.value,
        media_type: 'IMAGE',
        aspect_ratio: '1:1',
        filter_name: selectedFilter.value
      }
    ]
  }

  try {
    const res = await fetch('/api/v1/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token || 'mock_token'}`
      },
      body: JSON.stringify(newPostData)
    })
    const data = await res.json()
    if (data.success) {
      emit('created', data.data)
    } else {
      emit('created', {
        id: `post_${Date.now()}`,
        author: authStore.user,
        caption: caption.value,
        location: location.value,
        media: newPostData.media,
        likes_count: 0,
        comments_count: 0,
        is_liked: false,
        is_saved: false,
        created_at: new Date().toISOString()
      })
    }
    emit('close')
  } catch {
    emit('created', {
      id: `post_${Date.now()}`,
      author: authStore.user,
      caption: caption.value,
      location: location.value,
      media: newPostData.media,
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
      is_saved: false,
      created_at: new Date().toISOString()
    })
    emit('close')
  } finally {
    isPublishing.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-card {
  background-color: var(--aura-color-card);
  border-radius: 14px;
  width: 780px;
  max-width: 95vw;
  height: 520px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(0,0,0,0.3);
}

.modal-header {
  height: 48px;
  border-bottom: 1px solid var(--aura-color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.modal-title {
  font-size: 15px;
  font-weight: 600;
}

.back-btn {
  font-size: 14px;
  color: var(--aura-color-text-secondary);
}

.share-btn {
  font-size: 14px;
  font-weight: 600;
  color: var(--aura-color-accent);
}

.share-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.modal-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.preview-column {
  flex: 1.2;
  background-color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.image-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #fff;
  padding: 24px;
  text-align: center;
}

.placeholder-icon {
  width: 64px;
  height: 64px;
}

.preset-buttons {
  display: flex;
  gap: 8px;
}

.preset-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
}

.url-input {
  width: 240px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
}

.filter-ribbon {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  overflow-x: auto;
}

.filter-thumb {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 11px;
}

.filter-thumb.active {
  color: var(--aura-color-accent);
}

.filter-sample {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
}

.filter-sample img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.filter-clarendon { filter: contrast(1.2) saturate(1.25); }
.filter-juno { filter: contrast(1.15) saturate(1.3) sepia(0.15); }
.filter-valencia { filter: contrast(1.08) brightness(1.08) sepia(0.08); }
.filter-bw { filter: grayscale(1) contrast(1.2); }

.caption-column {
  flex: 1;
  border-left: 1px solid var(--aura-color-border);
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.author-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 13px;
  font-weight: 600;
}

.caption-textarea {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--aura-color-text-primary);
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
}

.char-count {
  font-size: 11px;
  color: var(--aura-color-text-secondary);
  text-align: right;
  margin-bottom: 12px;
}

.metadata-section {
  border-top: 1px solid var(--aura-color-border-subtle);
  padding-top: 12px;
}

.meta-input {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--aura-color-text-primary);
  font-size: 13px;
  outline: none;
}
</style>
