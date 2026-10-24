<template>
  <div class="stories-scroll-container">
    <!-- Current User Add Story -->
    <div class="story-item" @click="$emit('add-story')">
      <div class="avatar-wrapper current-user">
        <img :src="currentUserAvatar" alt="My Story" class="story-avatar" />
        <div class="add-badge">+</div>
      </div>
      <span class="username-label">Your story</span>
    </div>

    <!-- Active Stories -->
    <div
      v-for="tray in stories"
      :key="tray.id"
      class="story-item"
      @click="$emit('select-story', tray)"
    >
      <div
        class="avatar-wrapper"
        :class="{
          'ring-unseen': tray.has_unseen_stories,
          'ring-close-friends': tray.is_close_friends
        }"
      >
        <div class="avatar-inner-ring">
          <img :src="tray.user.avatar_url" :alt="tray.user.username" class="story-avatar" />
        </div>
      </div>
      <span class="username-label">{{ tray.user.username }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

defineProps<{
  stories: Array<{
    id: string
    user: {
      id: string
      username: string
      avatar_url: string
    }
    has_unseen_stories: boolean
    is_close_friends?: boolean
  }>
}>()

defineEmits(['add-story', 'select-story'])

const authStore = useAuthStore()
const currentUserAvatar = computed(() => {
  return authStore.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
})
</script>

<style scoped>
.stories-scroll-container {
  display: flex;
  gap: 18px;
  padding: 16px 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.stories-scroll-container::-webkit-scrollbar {
  display: none;
}

.story-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex-shrink: 0;
  width: 76px;
}

.avatar-wrapper {
  position: relative;
  width: 66px;
  height: 66px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--aura-color-border);
}

.avatar-wrapper.ring-unseen {
  background: var(--aura-ring-story);
}

.avatar-wrapper.ring-close-friends {
  background: var(--aura-ring-close-friends);
}

.avatar-inner-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--aura-color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.story-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-wrapper.current-user {
  background: transparent;
}

.add-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 22px;
  height: 22px;
  background-color: var(--aura-color-accent);
  color: white;
  border-radius: 50%;
  border: 2px solid var(--aura-color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
}

.username-label {
  font-size: 12px;
  color: var(--aura-color-text-primary);
  max-width: 74px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
