<template>
  <div class="app-layout">
    <Navigation @open-create="isCreateModalOpen = true" />

    <div class="content-viewport">
      <router-view />
    </div>

    <CreatePostModal
      v-if="isCreateModalOpen"
      @close="isCreateModalOpen = false"
      @created="onPostCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Navigation from './components/Navigation.vue'
import CreatePostModal from './components/CreatePostModal.vue'

const isCreateModalOpen = ref(false)

function onPostCreated(post: any) {
  console.log('New post created:', post)
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.content-viewport {
  margin-left: var(--sidebar-width);
  flex: 1;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .content-viewport {
    margin-left: 0;
    margin-bottom: 60px;
  }
}
</style>

