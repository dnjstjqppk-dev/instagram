<template>
  <div class="profile-layout">
    <!-- Profile Header -->
    <header class="profile-header">
      <div class="avatar-container">
        <div class="avatar-ring ring-unseen">
          <div class="avatar-inner">
            <img :src="profile.avatar_url" :alt="profile.username" class="profile-image" />
          </div>
        </div>
      </div>

      <div class="profile-details">
        <div class="top-row">
          <h1 class="username">{{ profile.username }}</h1>
          <svg v-if="profile.is_verified" class="verified-badge" viewBox="0 0 24 24" fill="#0095F6">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <div class="actions">
            <button v-if="isOwnProfile" class="edit-btn">Edit profile</button>
            <button v-else class="follow-btn" :class="{ 'following': profile.is_following }" @click="profile.is_following = !profile.is_following">
              {{ profile.is_following ? 'Following' : 'Follow' }}
            </button>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat"><span class="stat-number">{{ profile.posts_count }}</span> posts</div>
          <div class="stat"><span class="stat-number">{{ profile.followers_count.toLocaleString() }}</span> followers</div>
          <div class="stat"><span class="stat-number">{{ profile.following_count }}</span> following</div>
        </div>

        <div class="bio-section">
          <div class="full-name">{{ profile.full_name }}</div>
          <div v-if="profile.category" class="category">{{ profile.category }}</div>
          <p class="bio-text">{{ profile.bio }}</p>
          <a v-if="profile.website_url" :href="profile.website_url" target="_blank" class="website-link">
            🔗 {{ profile.website_url }}
          </a>
        </div>
      </div>
    </header>

    <!-- Highlights Tray -->
    <div class="highlights-tray">
      <div v-for="hl in highlights" :key="hl.id" class="highlight-item">
        <div class="highlight-ring">
          <img :src="hl.cover" alt="" class="highlight-cover" />
        </div>
        <span class="highlight-title">{{ hl.title }}</span>
      </div>
    </div>

    <!-- Profile Tabs -->
    <nav class="profile-tabs">
      <button class="tab-btn" :class="{ 'active': activeTab === 'posts' }" @click="activeTab = 'posts'">
        <svg viewBox="0 0 24 24" class="tab-icon" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
        <span>POSTS</span>
      </button>

      <button class="tab-btn" :class="{ 'active': activeTab === 'saved' }" @click="activeTab = 'saved'">
        <svg viewBox="0 0 24 24" class="tab-icon" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <span>SAVED</span>
      </button>

      <button class="tab-btn" :class="{ 'active': activeTab === 'tagged' }" @click="activeTab = 'tagged'">
        <svg viewBox="0 0 24 24" class="tab-icon" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
        <span>TAGGED</span>
      </button>
    </nav>

    <!-- Grid of Posts -->
    <div class="posts-grid">
      <div v-for="p in userPosts" :key="p.id" class="grid-card">
        <img :src="p.media_url" alt="" class="card-img" />
        <div class="hover-stats">
          <div class="stat-item">❤️ {{ p.likes }}</div>
          <div class="stat-item">💬 {{ p.comments }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const activeTab = ref('posts')

const profile = ref({
  id: 'usr_02',
  username: (route.params.username as string) || 'sarah_art',
  full_name: 'Sarah Jenkins',
  category: 'Visual Artist & Photographer',
  avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  bio: 'Capturing light, architectural rhythms & minimalist forms in Seoul. 📷 Sony Alpha A7 IV',
  website_url: 'https://sarahjenkins.studio',
  is_verified: true,
  posts_count: 24,
  followers_count: 4890,
  following_count: 320,
  is_following: false
})

const isOwnProfile = computed(() => {
  return authStore.user?.username === profile.value.username
})

const highlights = ref([
  { id: 'hl_1', title: 'Studio', cover: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=100' },
  { id: 'hl_2', title: 'Exhibition', cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100' },
  { id: 'hl_3', title: 'Seoul', cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100' }
])

const userPosts = ref([
  { id: 'p_1', media_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600', likes: 428, comments: 12 },
  { id: 'p_2', media_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600', likes: 1042, comments: 45 },
  { id: 'p_3', media_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600', likes: 890, comments: 33 },
  { id: 'p_4', media_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', likes: 720, comments: 19 }
])
</script>

<style scoped>
.profile-layout {
  max-width: 935px;
  margin: 0 auto;
  padding: 30px 20px 60px;
}

.profile-header {
  display: flex;
  gap: 80px;
  margin-bottom: 44px;
}

.avatar-container {
  flex-shrink: 0;
}

.avatar-ring {
  width: 156px;
  height: 156px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-ring.ring-unseen {
  background: var(--aura-ring-story);
}

.avatar-inner {
  width: 146px;
  height: 146px;
  border-radius: 50%;
  background: var(--aura-color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-image {
  width: 138px;
  height: 138px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
}

.top-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  font-size: 20px;
  font-weight: 500;
}

.verified-badge {
  width: 18px;
  height: 18px;
}

.edit-btn, .follow-btn {
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background-color: var(--aura-color-surface);
  border: 1px solid var(--aura-color-border);
  color: var(--aura-color-text-primary);
}

.follow-btn {
  background-color: var(--aura-color-accent);
  color: white;
  border: none;
}

.follow-btn.following {
  background-color: var(--aura-color-surface);
  color: var(--aura-color-text-primary);
  border: 1px solid var(--aura-color-border);
}

.stats-row {
  display: flex;
  gap: 40px;
  font-size: 15px;
}

.stat-number {
  font-weight: 700;
}

.bio-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  line-height: 1.5;
}

.full-name {
  font-weight: 600;
}

.category {
  color: var(--aura-color-text-secondary);
}

.website-link {
  color: var(--aura-color-accent);
  font-weight: 600;
}

.highlights-tray {
  display: flex;
  gap: 32px;
  margin-bottom: 44px;
  padding-bottom: 12px;
  overflow-x: auto;
}

.highlight-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.highlight-ring {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  border: 1px solid var(--aura-color-border);
  padding: 3px;
}

.highlight-cover {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.highlight-title {
  font-size: 12px;
  font-weight: 600;
}

.profile-tabs {
  border-top: 1px solid var(--aura-color-border);
  display: flex;
  justify-content: center;
  gap: 60px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 16px 0;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--aura-color-text-secondary);
  border-top: 1px solid transparent;
  margin-top: -1px;
}

.tab-btn.active {
  color: var(--aura-color-text-primary);
  border-top-color: var(--aura-color-text-primary);
}

.tab-icon {
  width: 14px;
  height: 14px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-top: 12px;
}

.grid-card {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: var(--aura-color-surface);
  cursor: pointer;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hover-stats {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  color: #fff;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.grid-card:hover .hover-stats {
  opacity: 1;
}

@media (max-width: 768px) {
  .profile-header {
    gap: 24px;
  }
  .avatar-ring {
    width: 90px;
    height: 90px;
  }
  .avatar-inner {
    width: 82px;
    height: 82px;
  }
  .profile-image {
    width: 76px;
    height: 76px;
  }
}
</style>

