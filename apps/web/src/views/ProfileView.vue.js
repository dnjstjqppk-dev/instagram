/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
const route = useRoute();
const authStore = useAuthStore();
const activeTab = ref('posts');
const profile = ref({
    id: 'usr_02',
    username: route.params.username || 'sarah_art',
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
});
const isOwnProfile = computed(() => {
    return authStore.user?.username === profile.value.username;
});
const highlights = ref([
    { id: 'hl_1', title: 'Studio', cover: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=100' },
    { id: 'hl_2', title: 'Exhibition', cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100' },
    { id: 'hl_3', title: 'Seoul', cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100' }
]);
const userPosts = ref([
    { id: 'p_1', media_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600', likes: 428, comments: 12 },
    { id: 'p_2', media_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600', likes: 1042, comments: 45 },
    { id: 'p_3', media_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600', likes: 890, comments: 33 },
    { id: 'p_4', media_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', likes: 720, comments: 19 }
]);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['avatar-ring']} */ ;
/** @type {__VLS_StyleScopedClasses['follow-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['follow-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-card']} */ ;
/** @type {__VLS_StyleScopedClasses['hover-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-header']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-ring']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-image']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "profile-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "profile-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar-ring ring-unseen" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar-inner" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.profile.avatar_url),
    alt: (__VLS_ctx.profile.username),
    ...{ class: "profile-image" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "profile-details" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "top-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "username" },
});
(__VLS_ctx.profile.username);
if (__VLS_ctx.profile.is_verified) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "verified-badge" },
        viewBox: "0 0 24 24",
        fill: "#0095F6",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
if (__VLS_ctx.isOwnProfile) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ class: "edit-btn" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.isOwnProfile))
                    return;
                __VLS_ctx.profile.is_following = !__VLS_ctx.profile.is_following;
            } },
        ...{ class: "follow-btn" },
        ...{ class: ({ 'following': __VLS_ctx.profile.is_following }) },
    });
    (__VLS_ctx.profile.is_following ? 'Following' : 'Follow');
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stats-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "stat-number" },
});
(__VLS_ctx.profile.posts_count);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "stat-number" },
});
(__VLS_ctx.profile.followers_count.toLocaleString());
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "stat-number" },
});
(__VLS_ctx.profile.following_count);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bio-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "full-name" },
});
(__VLS_ctx.profile.full_name);
if (__VLS_ctx.profile.category) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "category" },
    });
    (__VLS_ctx.profile.category);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "bio-text" },
});
(__VLS_ctx.profile.bio);
if (__VLS_ctx.profile.website_url) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
        href: (__VLS_ctx.profile.website_url),
        target: "_blank",
        ...{ class: "website-link" },
    });
    (__VLS_ctx.profile.website_url);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "highlights-tray" },
});
for (const [hl] of __VLS_getVForSourceType((__VLS_ctx.highlights))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (hl.id),
        ...{ class: "highlight-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "highlight-ring" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (hl.cover),
        alt: "",
        ...{ class: "highlight-cover" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "highlight-title" },
    });
    (hl.title);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "profile-tabs" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.activeTab = 'posts';
        } },
    ...{ class: "tab-btn" },
    ...{ class: ({ 'active': __VLS_ctx.activeTab === 'posts' }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    ...{ class: "tab-icon" },
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.rect)({
    x: "3",
    y: "3",
    width: "7",
    height: "7",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.rect)({
    x: "14",
    y: "3",
    width: "7",
    height: "7",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.rect)({
    x: "14",
    y: "14",
    width: "7",
    height: "7",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.rect)({
    x: "3",
    y: "14",
    width: "7",
    height: "7",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.activeTab = 'saved';
        } },
    ...{ class: "tab-btn" },
    ...{ class: ({ 'active': __VLS_ctx.activeTab === 'saved' }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    ...{ class: "tab-icon" },
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.activeTab = 'tagged';
        } },
    ...{ class: "tab-btn" },
    ...{ class: ({ 'active': __VLS_ctx.activeTab === 'tagged' }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    ...{ class: "tab-icon" },
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
    x1: "7",
    y1: "7",
    x2: "7.01",
    y2: "7",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "posts-grid" },
});
for (const [p] of __VLS_getVForSourceType((__VLS_ctx.userPosts))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (p.id),
        ...{ class: "grid-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (p.media_url),
        alt: "",
        ...{ class: "card-img" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "hover-stats" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-item" },
    });
    (p.likes);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-item" },
    });
    (p.comments);
}
/** @type {__VLS_StyleScopedClasses['profile-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-header']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-container']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-ring']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-unseen']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-image']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-details']} */ ;
/** @type {__VLS_StyleScopedClasses['top-row']} */ ;
/** @type {__VLS_StyleScopedClasses['username']} */ ;
/** @type {__VLS_StyleScopedClasses['verified-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['follow-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-row']} */ ;
/** @type {__VLS_StyleScopedClasses['stat']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-number']} */ ;
/** @type {__VLS_StyleScopedClasses['stat']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-number']} */ ;
/** @type {__VLS_StyleScopedClasses['stat']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-number']} */ ;
/** @type {__VLS_StyleScopedClasses['bio-section']} */ ;
/** @type {__VLS_StyleScopedClasses['full-name']} */ ;
/** @type {__VLS_StyleScopedClasses['category']} */ ;
/** @type {__VLS_StyleScopedClasses['bio-text']} */ ;
/** @type {__VLS_StyleScopedClasses['website-link']} */ ;
/** @type {__VLS_StyleScopedClasses['highlights-tray']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight-item']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight-ring']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight-title']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['posts-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-img']} */ ;
/** @type {__VLS_StyleScopedClasses['hover-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            activeTab: activeTab,
            profile: profile,
            isOwnProfile: isOwnProfile,
            highlights: highlights,
            userPosts: userPosts,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ProfileView.vue.js.map