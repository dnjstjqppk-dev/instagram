/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
const searchQuery = ref('');
const activeCategory = ref('For You');
const categories = ['For You', 'Architecture', 'Travel', 'Art', 'Nature', 'Fashion', 'Food', 'Design'];
const items = ref([
    {
        id: 'exp_1',
        media_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        caption: 'Prism reflections',
        likes_count: 3410,
        comments_count: 88,
        is_video: false,
        featured: true
    },
    {
        id: 'exp_2',
        media_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        caption: 'City portrait series',
        likes_count: 1205,
        comments_count: 42,
        is_video: true,
        featured: false
    },
    {
        id: 'exp_3',
        media_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
        caption: 'Studio daylight portraits',
        likes_count: 980,
        comments_count: 21,
        is_video: false,
        featured: false
    },
    {
        id: 'exp_4',
        media_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
        caption: 'Night skyline in neon',
        likes_count: 5120,
        comments_count: 140,
        is_video: false,
        featured: false
    },
    {
        id: 'exp_5',
        media_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
        caption: 'Architectural minimalism',
        likes_count: 2200,
        comments_count: 67,
        is_video: false,
        featured: false
    },
    {
        id: 'exp_6',
        media_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
        caption: 'Mountain peak sunrise',
        likes_count: 4410,
        comments_count: 99,
        is_video: true,
        featured: false
    }
]);
const filteredItems = computed(() => {
    return items.value;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['tag-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-item']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-image']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-item']} */ ;
/** @type {__VLS_StyleScopedClasses['hover-overlay']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "explore-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "explore-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "search-icon" },
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
    cx: "11",
    cy: "11",
    r: "8",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    value: (__VLS_ctx.searchQuery),
    type: "text",
    placeholder: "Search accounts, tags, or locations",
    ...{ class: "search-input" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tags-ribbon" },
});
for (const [cat] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.activeCategory = cat;
            } },
        key: (cat),
        ...{ class: "tag-pill" },
        ...{ class: ({ 'active': __VLS_ctx.activeCategory === cat }) },
    });
    (cat);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "explore-grid" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.filteredItems))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (item.id),
        ...{ class: "grid-item" },
        ...{ class: ({ 'featured-item': item.featured }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (item.media_url),
        alt: (item.caption || 'Explore'),
        ...{ class: "grid-image" },
    });
    if (item.is_video) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "video-indicator" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            viewBox: "0 0 24 24",
            ...{ class: "video-icon" },
            fill: "currentColor",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.polygon)({
            points: "5 3 19 12 5 21 5 3",
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "hover-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "overlay-stat" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        viewBox: "0 0 24 24",
        ...{ class: "overlay-icon" },
        fill: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.likes_count.toLocaleString());
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "overlay-stat" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        viewBox: "0 0 24 24",
        ...{ class: "overlay-icon" },
        fill: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.comments_count.toLocaleString());
}
/** @type {__VLS_StyleScopedClasses['explore-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['explore-header']} */ ;
/** @type {__VLS_StyleScopedClasses['search-box']} */ ;
/** @type {__VLS_StyleScopedClasses['search-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['tags-ribbon']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['explore-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-item']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-image']} */ ;
/** @type {__VLS_StyleScopedClasses['video-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['video-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['hover-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['overlay-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['overlay-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['overlay-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['overlay-icon']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            searchQuery: searchQuery,
            activeCategory: activeCategory,
            categories: categories,
            filteredItems: filteredItems,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ExploreView.vue.js.map