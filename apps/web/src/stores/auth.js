import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('aura_token'));
    const user = ref(localStorage.getItem('aura_user') ? JSON.parse(localStorage.getItem('aura_user')) : {
        id: 'usr_02',
        username: 'sarah_art',
        email: 'sarah@example.com',
        full_name: 'Sarah Jenkins',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        is_private: false,
        is_verified: true,
        account_type: 'CREATOR',
        bio: 'Visual artist & landscape photographer based in Seoul.',
        posts_count: 24,
        followers_count: 4890,
        following_count: 320
    });
    const isAuthenticated = computed(() => !!token.value || !!user.value);
    function setAuth(newToken, newUser) {
        token.value = newToken;
        user.value = newUser;
        localStorage.setItem('aura_token', newToken);
        localStorage.setItem('aura_user', JSON.stringify(newUser));
    }
    function logout() {
        token.value = null;
        user.value = null;
        localStorage.removeItem('aura_token');
        localStorage.removeItem('aura_user');
    }
    return {
        token,
        user,
        isAuthenticated,
        setAuth,
        logout
    };
});
//# sourceMappingURL=auth.js.map