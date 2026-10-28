/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import StoryTray from '../components/StoryTray.vue';
import PostCard from '../components/PostCard.vue';
const authStore = useAuthStore();
const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';
const loading = ref(true);
const posts = ref([]);
const stories = ref([]);
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
]);
async function fetchFeed() {
    loading.value = true;
    try {
        const res = await fetch('/api/v1/feed/home');
        const data = await res.json();
        if (data.success && data.data?.items?.length) {
            posts.value = data.data.items;
        }
        else {
            posts.value = getFallbackPosts();
        }
    }
    catch {
        posts.value = getFallbackPosts();
    }
    try {
        const sRes = await fetch('/api/v1/stories/feed');
        const sData = await sRes.json();
        if (sData.success && sData.data?.length) {
            stories.value = sData.data;
        }
        else {
            stories.value = getFallbackStories();
        }
    }
    catch {
        stories.value = getFallbackStories();
    }
    finally {
        loading.value = false;
    }
}
function handleLike(postId) {
    const p = posts.value.find(item => item.id === postId);
    if (p) {
        p.is_liked = true;
        p.likes_count++;
        fetch(`/api/v1/posts/${postId}/likes`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authStore.token}` }
        }).catch(() => { });
    }
}
function handleUnlike(postId) {
    const p = posts.value.find(item => item.id === postId);
    if (p) {
        p.is_liked = false;
        p.likes_count = Math.max(0, p.likes_count - 1);
        fetch(`/api/v1/posts/${postId}/likes`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authStore.token}` }
        }).catch(() => { });
    }
}
function handleComment(payload) {
    const p = posts.value.find(item => item.id === payload.postId);
    if (p) {
        p.comments_count++;
        fetch(`/api/v1/posts/${payload.postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.token}`
            },
            body: JSON.stringify({ content: payload.content })
        }).catch(() => { });
    }
}
function handleShare(post) {
    navigator.clipboard?.writeText(window.location.origin + `/p/${post.id}`);
    alert('Link copied to clipboard!');
}
function triggerAddStory() {
    alert('Story camera integration active! Select photo or video to upload.');
}
function viewStory(tray) {
    alert(`Viewing ${tray.user.username}'s active story.`);
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
    ];
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
    ];
}
onMounted(() => {
    fetchFeed();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['follow-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestions-sidebar']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "home-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "feed-stream" },
});
/** @type {[typeof StoryTray, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(StoryTray, new StoryTray({
    ...{ 'onAddStory': {} },
    ...{ 'onSelectStory': {} },
    stories: (__VLS_ctx.stories),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onAddStory': {} },
    ...{ 'onSelectStory': {} },
    stories: (__VLS_ctx.stories),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onAddStory: (__VLS_ctx.triggerAddStory)
};
const __VLS_7 = {
    onSelectStory: (__VLS_ctx.viewStory)
};
var __VLS_2;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-state" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "spinner" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "posts-stream" },
    });
    for (const [post] of __VLS_getVForSourceType((__VLS_ctx.posts))) {
        /** @type {[typeof PostCard, ]} */ ;
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent(PostCard, new PostCard({
            ...{ 'onLike': {} },
            ...{ 'onUnlike': {} },
            ...{ 'onComment': {} },
            ...{ 'onSharePost': {} },
            key: (post.id),
            post: (post),
        }));
        const __VLS_9 = __VLS_8({
            ...{ 'onLike': {} },
            ...{ 'onUnlike': {} },
            ...{ 'onComment': {} },
            ...{ 'onSharePost': {} },
            key: (post.id),
            post: (post),
        }, ...__VLS_functionalComponentArgsRest(__VLS_8));
        let __VLS_11;
        let __VLS_12;
        let __VLS_13;
        const __VLS_14 = {
            onLike: (__VLS_ctx.handleLike)
        };
        const __VLS_15 = {
            onUnlike: (__VLS_ctx.handleUnlike)
        };
        const __VLS_16 = {
            onComment: (__VLS_ctx.handleComment)
        };
        const __VLS_17 = {
            onSharePost: (__VLS_ctx.handleShare)
        };
        var __VLS_10;
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "suggestions-sidebar" },
});
if (__VLS_ctx.authStore.user) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "current-user-row" },
    });
    const __VLS_18 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
        to: (`/${__VLS_ctx.authStore.user.username}`),
        ...{ class: "user-meta" },
    }));
    const __VLS_20 = __VLS_19({
        to: (`/${__VLS_ctx.authStore.user.username}`),
        ...{ class: "user-meta" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    __VLS_21.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.authStore.user.avatar_url || __VLS_ctx.defaultAvatar),
        alt: "",
        ...{ class: "user-avatar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "user-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "user-username" },
    });
    (__VLS_ctx.authStore.user.username);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "user-fullname" },
    });
    (__VLS_ctx.authStore.user.full_name);
    var __VLS_21;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ class: "switch-btn" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "suggestions-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ class: "see-all-btn" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "suggestions-list" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.suggestedUsers))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (item.id),
        ...{ class: "suggestion-item" },
    });
    const __VLS_22 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
        to: (`/${item.username}`),
        ...{ class: "item-meta" },
    }));
    const __VLS_24 = __VLS_23({
        to: (`/${item.username}`),
        ...{ class: "item-meta" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    __VLS_25.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (item.avatar_url),
        alt: "",
        ...{ class: "item-avatar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "item-username" },
    });
    (item.username);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "item-relation" },
    });
    (item.relation);
    var __VLS_25;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                item.is_following = !item.is_following;
            } },
        ...{ class: "follow-btn" },
        ...{ class: ({ 'following': item.is_following }) },
    });
    (item.is_following ? 'Following' : 'Follow');
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({
    ...{ class: "legal-footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "copyright" },
});
/** @type {__VLS_StyleScopedClasses['home-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['feed-stream']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['posts-stream']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestions-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['current-user-row']} */ ;
/** @type {__VLS_StyleScopedClasses['user-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['user-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['user-text']} */ ;
/** @type {__VLS_StyleScopedClasses['user-username']} */ ;
/** @type {__VLS_StyleScopedClasses['user-fullname']} */ ;
/** @type {__VLS_StyleScopedClasses['switch-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestions-header']} */ ;
/** @type {__VLS_StyleScopedClasses['see-all-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestions-list']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestion-item']} */ ;
/** @type {__VLS_StyleScopedClasses['item-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['item-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['item-text']} */ ;
/** @type {__VLS_StyleScopedClasses['item-username']} */ ;
/** @type {__VLS_StyleScopedClasses['item-relation']} */ ;
/** @type {__VLS_StyleScopedClasses['follow-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['legal-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['copyright']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            StoryTray: StoryTray,
            PostCard: PostCard,
            authStore: authStore,
            defaultAvatar: defaultAvatar,
            loading: loading,
            posts: posts,
            stories: stories,
            suggestedUsers: suggestedUsers,
            handleLike: handleLike,
            handleUnlike: handleUnlike,
            handleComment: handleComment,
            handleShare: handleShare,
            triggerAddStory: triggerAddStory,
            viewStory: viewStory,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=HomeView.vue.js.map