<template>
  <aside class="sidebar-container">
    <div class="sidebar-brand">
      <router-link to="/" class="brand-link">
        <div class="brand-logo-icon">
          <svg viewBox="0 0 24 24" class="logo-svg">
            <defs>
              <linearGradient id="auraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FF007A" />
                <stop offset="50%" stop-color="#7928CA" />
                <stop offset="100%" stop-color="#0070F3" />
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="url(#auraGradient)" stroke-width="2.2"/>
            <circle cx="12" cy="12" r="4.5" fill="none" stroke="url(#auraGradient)" stroke-width="2.2"/>
            <circle cx="17.5" cy="6.5" r="1.3" fill="url(#auraGradient)"/>
          </svg>
        </div>
        <span class="brand-name">Aura</span>
      </router-link>
    </div>

    <nav class="nav-menu">
      <router-link to="/" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span class="nav-label">Home</span>
      </router-link>

      <router-link to="/explore" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span class="nav-label">Explore</span>
      </router-link>

      <router-link to="/reels" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="4"/>
          <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"/>
        </svg>
        <span class="nav-label">Reels</span>
      </router-link>

      <router-link to="/direct" class="nav-item" active-class="active">
        <div class="icon-wrapper">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
          <span class="badge">3</span>
        </div>
        <span class="nav-label">Messages</span>
      </router-link>

      <button class="nav-item" @click="$emit('open-create')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="4"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        <span class="nav-label">Create</span>
      </button>

      <router-link :to="profileLink" class="nav-item" active-class="active">
        <div class="avatar-ring">
          <img :src="userAvatar" alt="Avatar" class="profile-avatar" />
        </div>
        <span class="nav-label">Profile</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button class="nav-item theme-toggle" @click="toggleTheme">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <span class="nav-label">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

defineEmits(['open-create'])

const authStore = useAuthStore()
const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark')

const profileLink = computed(() => {
  return authStore.user ? `/${authStore.user.username}` : '/login'
})

const userAvatar = computed(() => {
  return authStore.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
})

function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}
</script>

<style scoped>
.sidebar-container {
  width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid var(--aura-color-border);
  background-color: var(--aura-color-bg);
  display: flex;
  flex-direction: column;
  padding: 24px 12px;
  z-index: 100;
}

.sidebar-brand {
  padding: 12px 14px 32px;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo-icon {
  width: 32px;
  height: 32px;
}

.logo-svg {
  width: 100%;
  height: 100%;
}

.brand-name {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(45deg, #FF007A, #7928CA, #0070F3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: var(--aura-color-text-primary);
  transition: background-color 0.15s ease, transform 0.1s ease;
  width: 100%;
  text-align: left;
}

.nav-item:hover {
  background-color: var(--aura-color-surface);
}

.nav-item.active {
  font-weight: 700;
}

.nav-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.badge {
  position: absolute;
  top: -4px;
  right: -6px;
  background-color: var(--aura-color-danger);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 10px;
}

.avatar-ring {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  overflow: hidden;
  border: 1.5px solid var(--aura-color-border);
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-footer {
  margin-top: auto;
  border-top: 1px solid var(--aura-color-border-subtle);
  padding-top: 12px;
}

/* Mobile responsive bottom navigation */
@media (max-width: 768px) {
  .sidebar-container {
    width: 100%;
    height: 60px;
    top: auto;
    bottom: 0;
    flex-direction: row;
    padding: 0 16px;
    border-right: none;
    border-top: 1px solid var(--aura-color-border);
  }

  .sidebar-brand,
  .nav-label,
  .sidebar-footer {
    display: none;
  }

  .nav-menu {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .nav-item {
    padding: 10px;
    width: auto;
    justify-content: center;
  }
}
</style>

