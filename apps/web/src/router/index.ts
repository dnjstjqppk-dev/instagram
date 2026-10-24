import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExploreView from '../views/ExploreView.vue'
import ReelsView from '../views/ReelsView.vue'
import ProfileView from '../views/ProfileView.vue'
import DirectView from '../views/DirectView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/explore',
    name: 'Explore',
    component: ExploreView
  },
  {
    path: '/reels',
    name: 'Reels',
    component: ReelsView
  },
  {
    path: '/direct',
    name: 'Direct',
    component: DirectView
  },
  {
    path: '/:username',
    name: 'Profile',
    component: ProfileView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
