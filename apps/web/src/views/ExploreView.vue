<template>
  <div class="explore-layout">
    <!-- Search and Topic Filter Header -->
    <header class="explore-header">
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search accounts, tags, or locations"
          class="search-input"
        />
      </div>

      <div class="tags-ribbon">
        <button
          v-for="cat in categories"
          :key="cat"
          class="tag-pill"
          :class="{ 'active': activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </header>

    <!-- 3-Column Media Grid -->
    <div class="explore-grid">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="grid-item"
        :class="{ 'featured-item': item.featured }"
      >
        <img :src="item.media_url" :alt="item.caption || 'Explore'" class="grid-image" />
        <div v-if="item.is_video" class="video-indicator">
          <svg viewBox="0 0 24 24" class="video-icon" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
        <!-- Hover Overlay -->
        <div class="hover-overlay">
          <div class="overlay-stat">
            <svg viewBox="0 0 24 24" class="overlay-icon" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>{{ item.likes_count.toLocaleString() }}</span>
          </div>
          <div class="overlay-stat">
            <svg viewBox="0 0 24 24" class="overlay-icon" fill="currentColor">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span>{{ item.comments_count.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const activeCategory = ref('For You')

const categories = ['For You', 'Architecture', 'Travel', 'Art', 'Nature', 'Fashion', 'Food', 'Design']

const items = ref([
  {
    id: 'exp_1',
    media_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    caption: 'Prism reflections',
    likes_count: 3410,
    comments_count: 88,
    is_video: false,
    featured: true
  },
  {
    id: 'exp_2',
    media_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    caption: 'City portrait series',
    likes_count: 1205,
    comments_count: 42,
    is_video: true,
    featured: false
  },
  {
    id: 'exp_3',
    media_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
    caption: 'Studio daylight portraits',
    likes_count: 980,
    comments_count: 21,
    is_video: false,
    featured: false
  },
  {
    id: 'exp_4',
    media_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
    caption: 'Night skyline in neon',
    likes_count: 5120,
    comments_count: 140,
    is_video: false,
    featured: false
  },
  {
    id: 'exp_5',
    media_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
    caption: 'Architectural minimalism',
    likes_count: 2200,
    comments_count: 67,
    is_video: false,
    featured: false
  },
  {
    id: 'exp_6',
    media_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
    caption: 'Mountain peak sunrise',
    likes_count: 4410,
    comments_count: 99,
    is_video: true,
    featured: false
  }
])

const filteredItems = computed(() => {
  return items.value
})
</script>

<style scoped>
.explore-layout {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}

.explore-header {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-box {
  position: relative;
  max-width: 380px;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--aura-color-text-secondary);
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 38px;
  border-radius: 10px;
  border: 1px solid var(--aura-color-border);
  background-color: var(--aura-color-surface);
  color: var(--aura-color-text-primary);
  font-size: 14px;
  outline: none;
}

.tags-ribbon {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.tag-pill {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background-color: var(--aura-color-surface);
  border: 1px solid var(--aura-color-border);
  color: var(--aura-color-text-primary);
  white-space: nowrap;
}

.tag-pill.active {
  background-color: var(--aura-color-text-primary);
  color: var(--aura-color-bg);
  border-color: var(--aura-color-text-primary);
}

.explore-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.grid-item {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  cursor: pointer;
  background-color: var(--aura-color-surface);
}

.featured-item {
  grid-column: span 2;
  grid-row: span 2;
}

.grid-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.grid-item:hover .grid-image {
  transform: scale(1.02);
}

.video-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}

.video-icon {
  width: 20px;
  height: 20px;
}

.hover-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  color: #fff;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.grid-item:hover .hover-overlay {
  opacity: 1;
}

.overlay-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 15px;
}

.overlay-icon {
  width: 20px;
  height: 20px;
}
</style>
