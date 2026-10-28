<template>
  <div class="home-layout">
    <!-- Main Feed Stream -->
    <main class="feed-stream">
      <!-- Stories Tray -->
      <StoryTray
        :stories="stories"
        @add-story="triggerAddStory"
        @select-story="viewStory"
      />

      <!-- Posts List -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <div v-else class="posts-stream">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @like="handleLike"
          @unlike="handleUnlike"
          @comment="handleComment"
          @share-post="handleShare"
        />
      </div>
    </main>

    <!-- Right Sidebar (Profile + Suggestions) -->
    <aside class="suggestions-sidebar">
      <!-- Current User Mini Profile -->
      <div v-if="authStore.user" class="current-user-row">
        <router-link :to="`/${authStore.user.username}`" class="user-meta">
          <img :src="authStore.user.avatar_url || defaultAvatar" alt="" class="user-avatar" />
          <div class="user-text">
            <span class="user-username">{{ authStore.user.username }}</span>
            <span class="user-fullname">{{ authStore.user.full_name }}</span>
          </div>
        </router-link>
        <button class="switch-btn">Switch</button>
      </div>

      <!-- Suggested for you header -->
      <div class="suggestions-header">
        <span>Suggested for you</span>
        <button class="see-all-btn">See All</button>
      </div>

      <!-- Suggested accounts -->
      <div class="suggestions-list">
        <div v-for="item in suggestedUsers" :key="item.id" class="suggestion-item">
          <router-link :to="`/${item.username}`" class="item-meta">
            <img :src="item.avatar_url" alt="" class="item-avatar" />
            <div class="item-text">
              <span class="item-username">{{ item.username }}</span>
              <span class="item-relation">{{ item.relation }}</span>
            </div>
          </router-link>
          <button
            class="follow-btn"
            :class="{ 'following': item.is_following }"
            @click="item.is_following = !item.is_following"
          >
            {{ item.is_following ? 'Following' : 'Follow' }}
          </button>
        </div>
      </div>

      <!-- Footer links -->
      <footer class="legal-footer">
        <p>About • Help • Press • API • Jobs • Privacy • Terms • Locations • Language</p>
        <p class="copyright">© 2026 AURA SOCIAL PLATFORM</p>
      </footer>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import StoryTray from '../components/StoryTray.vue'
import PostCard from '../components/PostCard.vue'

const authStore = useAuthStore()
const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'

const loading = ref(true)
const posts = ref<any[]>([])
const stories = ref<any[]>([])

const suggestedUsers = ref([
  {
    id: 'sug_1',
    username: 'aura_travel',
    relation: 'Followed by sarah_art + 12 more',
    avatar_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100',
    is_following: false
  },
  {
    id: 'sug_2',
    username: 'minimal_vibes',
    relation: 'Suggested for you',
    avatar_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=100',
    is_following: false
  },
  {
    id: 'sug_3',
    username: 'tokyo_nights',
    relation: 'Popular in photography',
    avatar_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=100',
    is_following: false
  }
])

async function fetchFeed() {
  loading.value = true
  try {
    const res = await fetch('/api/v1/feed/home')
    const data = await res.json()
    if (data.success && data.data?.items?.length) {
      posts.value = data.data.items
    } else {
      posts.value = getFallbackPosts()
    }
  } catch {
    posts.value = getFallbackPosts()
  }

  try {
    const sRes = await fetch('/api/v1/stories/feed')
    const sData = await sRes.json()
    if (sData.success && sData.data?.length) {
      stories.value = sData.data
    } else {
      stories.value = getFallbackStories()
    }
  } catch {
    stories.value = getFallbackStories()
  } finally {
    loading.value = false
  }
}

function handleLike(postId: string) {
  const p = posts.value.find(item => item.id === postId)
  if (p) {
    p.is_liked = true
    p.likes_count++
    fetch(`/api/v1/posts/${postId}/likes`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    }).catch(() => {})
  }
}

function handleUnlike(postId: string) {
  const p = posts.value.find(item => item.id === postId)
  if (p) {
    p.is_liked = false
    p.likes_count = Math.max(0, p.likes_count - 1)
    fetch(`/api/v1/posts/${postId}/likes`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    }).catch(() => {})
  }
}

function handleComment(payload: { postId: string; content: string }) {
  const p = posts.value.find(item => item.id === payload.postId)
  if (p) {
    p.comments_count++
    fetch(`/api/v1/posts/${payload.postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ content: payload.content })
    }).catch(() => {})
  }
}

function handleShare(post: any) {
  navigator.clipboard?.writeText(window.location.origin + `/p/${post.id}`)
  alert('Link copied to clipboard!')
}

function triggerAddStory() {
  alert('Story camera integration active! Select photo or video to upload.')
}

function viewStory(tray: any) {
  alert(`Viewing ${tray.user.username}'s active story.`)
}

function getFallbackPosts() {
  return [
    {
      id: 'post_001',
      author: {
        id: 'usr_02',
        username: 'sarah_art',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        is_verified: true
      },
      caption: 'Golden hour through the prism lens ✨ #aesthetic #sunset #photography',
      location: 'Han River Park, Seoul',
      post_type: 'IMAGE',
      media: [
        {
          id: 'med_001',
          media_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080',
          media_type: 'IMAGE'
        }
      ],
      likes_count: 428,
      comments_count: 12,
      is_liked: false,
      is_saved: false,
      created_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'post_002',
      author: {
        id: 'usr_03',
        username: 'alex_photo',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        is_verified: false
      },
      caption: 'Architecture in motion: the geometric curves of modern Seoul 🏛️',
      location: 'Dongdaemun Design Plaza',
      post_type: 'IMAGE',
      media: [
        {
          id: 'med_002',
          media_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1080',
          media_type: 'IMAGE'
        }
      ],
      likes_count: 1042,
      comments_count: 45,
      is_liked: true,
      is_saved: true,
      created_at: new Date(Date.now() - 14400000).toISOString()
    }
  ]
}

function getFallbackStories() {
  return [
    {
      id: 'st_1',
      user: {
        id: 'usr_02',
        username: 'sarah_art',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      },
      has_unseen_stories: true
    },
    {
      id: 'st_2',
      user: {
        id: 'usr_03',
        username: 'alex_photo',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      has_unseen_stories: true,
      is_close_friends: true
    },
    {
      id: 'st_3',
      user: {
        id: 'usr_01',
        username: 'aura_official',
        avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'
      },
      has_unseen_stories: false
    }
  ]
}

onMounted(() => {
  fetchFeed()
})
</script>

<style scoped>
.home-layout {
  display: flex;
  justify-content: center;
  gap: 64px;
  max-width: 1020px;
  margin: 0 auto;
  padding: 24px 20px;
}

.feed-stream {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
}

.posts-stream {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 48px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--aura-color-border);
  border-top-color: var(--aura-color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.suggestions-sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
  padding-top: 16px;
}

.current-user-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.user-text {
  display: flex;
  flex-direction: column;
}

.user-username {
  font-size: 14px;
  font-weight: 600;
}

.user-fullname {
  font-size: 12px;
  color: var(--aura-color-text-secondary);
}

.switch-btn {
  font-size: 12px;
  font-weight: 600;
  color: var(--aura-color-accent);
}

.suggestions-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  color: var(--aura-color-text-secondary);
  margin-bottom: 16px;
}

.see-all-btn {
  font-size: 12px;
  font-weight: 600;
  color: var(--aura-color-text-primary);
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
}

.item-text {
  display: flex;
  flex-direction: column;
}

.item-username {
  font-size: 13px;
  font-weight: 600;
}

.item-relation {
  font-size: 11px;
  color: var(--aura-color-text-secondary);
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.follow-btn {
  font-size: 12px;
  font-weight: 600;
  color: var(--aura-color-accent);
}

.follow-btn.following {
  color: var(--aura-color-text-secondary);
}

.legal-footer {
  font-size: 11px;
  color: var(--aura-color-text-secondary);
  line-height: 1.6;
}

.copyright {
  margin-top: 12px;
  text-transform: uppercase;
}

@media (max-width: 1024px) {
  .suggestions-sidebar {
    display: none;
  }
}
</style>

