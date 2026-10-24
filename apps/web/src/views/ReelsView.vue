<template>
  <div class="reels-viewport">
    <div class="reels-scroll-container">
      <div
        v-for="reel in reels"
        :key="reel.id"
        class="reel-card"
      >
        <!-- Video Player -->
        <video
          :src="reel.video_url"
          class="reel-video"
          loop
          autoplay
          muted
          playsinline
        ></video>

        <!-- Right Side Floating Actions -->
        <div class="reel-actions">
          <button class="action-btn" :class="{ 'liked': reel.is_liked }" @click="toggleLike(reel)">
            <svg viewBox="0 0 24 24" class="action-icon" :fill="reel.is_liked ? '#ED4956' : 'none'" :stroke="reel.is_liked ? '#ED4956' : '#fff'" stroke-width="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="action-count">{{ reel.likes_count.toLocaleString() }}</span>
          </button>

          <button class="action-btn" @click="openComments(reel)">
            <svg viewBox="0 0 24 24" class="action-icon" fill="none" stroke="#fff" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span class="action-count">{{ reel.comments_count }}</span>
          </button>

          <button class="action-btn" @click="shareReel(reel)">
            <svg viewBox="0 0 24 24" class="action-icon" fill="none" stroke="#fff" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>

          <div class="audio-disc">
            <img :src="reel.creator.avatar_url" alt="" class="disc-avatar" />
          </div>
        </div>

        <!-- Bottom Metadata Overlay -->
        <div class="reel-overlay">
          <div class="creator-row">
            <router-link :to="`/${reel.creator.username}`" class="creator-meta">
              <img :src="reel.creator.avatar_url" alt="" class="creator-avatar" />
              <span class="creator-name">{{ reel.creator.username }}</span>
            </router-link>
            <button class="follow-btn">Follow</button>
          </div>

          <p class="reel-caption">{{ reel.caption }}</p>

          <div class="audio-track-ticker">
            <svg viewBox="0 0 24 24" class="music-icon" fill="currentColor">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
            <span class="audio-title">Original Audio - {{ reel.creator.username }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const reels = ref([
  {
    id: 'reel_001',
    creator: {
      id: 'usr_03',
      username: 'alex_photo',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    caption: 'Capturing mountain sunrise with high speed drone footage 🏔️ #nature #reels',
    likes_count: 14200,
    comments_count: 320,
    is_liked: false
  },
  {
    id: 'reel_002',
    creator: {
      id: 'usr_02',
      username: 'sarah_art',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    caption: 'Studio process: mixing natural pigments for the summer collection 🎨 #art #creator',
    likes_count: 9820,
    comments_count: 145,
    is_liked: true
  }
])

function toggleLike(reel: any) {
  reel.is_liked = !reel.is_liked
  reel.likes_count += reel.is_liked ? 1 : -1
}

function openComments(reel: any) {
  alert(`Viewing ${reel.comments_count} comments for reel`)
}

function shareReel(reel: any) {
  alert('Reel link copied!')
}
</script>

<style scoped>
.reels-viewport {
  height: calc(100vh - 40px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.reels-scroll-container {
  height: 100%;
  aspect-ratio: 9 / 16;
  max-width: 440px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  border-radius: 16px;
  background-color: #000;
  box-shadow: 0 8px 30px rgba(0,0,0,0.4);
}

.reels-scroll-container::-webkit-scrollbar {
  display: none;
}

.reel-card {
  position: relative;
  width: 100%;
  height: 100%;
  scroll-snap-align: start;
  overflow: hidden;
}

.reel-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reel-actions {
  position: absolute;
  right: 12px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  z-index: 10;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #fff;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}

.action-icon {
  width: 28px;
  height: 28px;
}

.action-count {
  font-size: 12px;
  font-weight: 600;
}

.audio-disc {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  overflow: hidden;
  animation: rotateDisc 4s linear infinite;
}

@keyframes rotateDisc {
  to { transform: rotate(360deg); }
}

.disc-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reel-overlay {
  position: absolute;
  left: 16px;
  right: 64px;
  bottom: 20px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
  text-shadow: 0 1px 3px rgba(0,0,0,0.6);
}

.creator-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.creator-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
}

.creator-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #fff;
}

.creator-name {
  font-size: 14px;
  font-weight: 700;
}

.follow-btn {
  border: 1px solid rgba(255, 255, 255, 0.7);
  color: #fff;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.reel-caption {
  font-size: 13px;
  line-height: 1.4;
}

.audio-track-ticker {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.music-icon {
  width: 14px;
  height: 14px;
}
</style>
