/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
const __VLS_props = defineProps();
const __VLS_emit = defineEmits(['add-story', 'select-story']);
const authStore = useAuthStore();
const currentUserAvatar = computed(() => {
    return authStore.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['stories-scroll-container']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stories-scroll-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('add-story');
        } },
    ...{ class: "story-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar-wrapper current-user" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.currentUserAvatar),
    alt: "My Story",
    ...{ class: "story-avatar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "add-badge" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "username-label" },
});
for (const [tray] of __VLS_getVForSourceType((__VLS_ctx.stories))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.$emit('select-story', tray);
            } },
        key: (tray.id),
        ...{ class: "story-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "avatar-wrapper" },
        ...{ class: ({
                'ring-unseen': tray.has_unseen_stories,
                'ring-close-friends': tray.is_close_friends
            }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "avatar-inner-ring" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (tray.user.avatar_url),
        alt: (tray.user.username),
        ...{ class: "story-avatar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "username-label" },
    });
    (tray.user.username);
}
/** @type {__VLS_StyleScopedClasses['stories-scroll-container']} */ ;
/** @type {__VLS_StyleScopedClasses['story-item']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['current-user']} */ ;
/** @type {__VLS_StyleScopedClasses['story-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['add-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['username-label']} */ ;
/** @type {__VLS_StyleScopedClasses['story-item']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-inner-ring']} */ ;
/** @type {__VLS_StyleScopedClasses['story-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['username-label']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            currentUserAvatar: currentUserAvatar,
        };
    },
    emits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=StoryTray.vue.js.map