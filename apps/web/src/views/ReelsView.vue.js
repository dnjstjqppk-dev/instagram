/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
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
]);
function toggleLike(reel) {
    reel.is_liked = !reel.is_liked;
    reel.likes_count += reel.is_liked ? 1 : -1;
}
function openComments(reel) {
    alert(`Viewing ${reel.comments_count} comments for reel`);
}
function shareReel(reel) {
    alert('Reel link copied!');
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['reels-scroll-container']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "reels-viewport" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "reels-scroll-container" },
});
for (const [reel] of __VLS_getVForSourceType((__VLS_ctx.reels))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (reel.id),
        ...{ class: "reel-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.video, __VLS_intrinsicElements.video)({
        src: (reel.video_url),
        ...{ class: "reel-video" },
        loop: true,
        autoplay: true,
        muted: true,
        playsinline: true,
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "reel-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.toggleLike(reel);
            } },
        ...{ class: "action-btn" },
        ...{ class: ({ 'liked': reel.is_liked }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        viewBox: "0 0 24 24",
        ...{ class: "action-icon" },
        fill: (reel.is_liked ? '#ED4956' : 'none'),
        stroke: (reel.is_liked ? '#ED4956' : '#fff'),
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "action-count" },
    });
    (reel.likes_count.toLocaleString());
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.openComments(reel);
            } },
        ...{ class: "action-btn" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        viewBox: "0 0 24 24",
        ...{ class: "action-icon" },
        fill: "none",
        stroke: "#fff",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "action-count" },
    });
    (reel.comments_count);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.shareReel(reel);
            } },
        ...{ class: "action-btn" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        viewBox: "0 0 24 24",
        ...{ class: "action-icon" },
        fill: "none",
        stroke: "#fff",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
        x1: "22",
        y1: "2",
        x2: "11",
        y2: "13",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.polygon)({
        points: "22 2 15 22 11 13 2 9 22 2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "audio-disc" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (reel.creator.avatar_url),
        alt: "",
        ...{ class: "disc-avatar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "reel-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "creator-row" },
    });
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        to: (`/${reel.creator.username}`),
        ...{ class: "creator-meta" },
    }));
    const __VLS_2 = __VLS_1({
        to: (`/${reel.creator.username}`),
        ...{ class: "creator-meta" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (reel.creator.avatar_url),
        alt: "",
        ...{ class: "creator-avatar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "creator-name" },
    });
    (reel.creator.username);
    var __VLS_3;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ class: "follow-btn" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "reel-caption" },
    });
    (reel.caption);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "audio-track-ticker" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        viewBox: "0 0 24 24",
        ...{ class: "music-icon" },
        fill: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M9 18V5l12-2v13",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
        cx: "6",
        cy: "18",
        r: "3",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
        cx: "18",
        cy: "16",
        r: "3",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "audio-title" },
    });
    (reel.creator.username);
}
/** @type {__VLS_StyleScopedClasses['reels-viewport']} */ ;
/** @type {__VLS_StyleScopedClasses['reels-scroll-container']} */ ;
/** @type {__VLS_StyleScopedClasses['reel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['reel-video']} */ ;
/** @type {__VLS_StyleScopedClasses['reel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-count']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-count']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['audio-disc']} */ ;
/** @type {__VLS_StyleScopedClasses['disc-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['reel-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['creator-row']} */ ;
/** @type {__VLS_StyleScopedClasses['creator-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['creator-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['creator-name']} */ ;
/** @type {__VLS_StyleScopedClasses['follow-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['reel-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['audio-track-ticker']} */ ;
/** @type {__VLS_StyleScopedClasses['music-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['audio-title']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            reels: reels,
            toggleLike: toggleLike,
            openComments: openComments,
            shareReel: shareReel,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ReelsView.vue.js.map