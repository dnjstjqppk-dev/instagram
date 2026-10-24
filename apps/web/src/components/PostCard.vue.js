import { ref, computed } from 'vue';
const props = defineProps();
const emit = defineEmits(['like', 'unlike', 'comment', 'share-post']);
const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';
const showHeartPop = ref(false);
const showCommentsModal = ref(false);
const newCommentText = ref('');
const commentInput = ref(null);
const currentMediaUrl = computed(() => {
    return props.post.media[0]?.media_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080';
});
function handleDoubleTap() {
    if (!props.post.is_liked) {
        emit('like', props.post.id);
    }
    showHeartPop.value = true;
    setTimeout(() => {
        showHeartPop.value = false;
    }, 900);
}
function toggleLike() {
    if (props.post.is_liked) {
        emit('unlike', props.post.id);
    }
    else {
        emit('like', props.post.id);
    }
}
function toggleSave() {
    props.post.is_saved = !props.post.is_saved;
}
function focusComment() {
    commentInput.value?.focus();
}
function submitComment() {
    if (!newCommentText.value.trim())
        return;
    emit('comment', { postId: props.post.id, content: newCommentText.value.trim() });
    newCommentText.value = '';
}
function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1)
        return 'JUST NOW';
    if (hours < 24)
        return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "post-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "post-header" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: (`/${__VLS_ctx.post.author.username}`),
    ...{ class: "author-info" },
}));
const __VLS_2 = __VLS_1({
    to: (`/${__VLS_ctx.post.author.username}`),
    ...{ class: "author-info" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar-ring" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.post.author.avatar_url || __VLS_ctx.defaultAvatar),
    alt: (__VLS_ctx.post.author.username),
    ...{ class: "author-avatar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "author-meta" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "username-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "username" },
});
(__VLS_ctx.post.author.username);
if (__VLS_ctx.post.author.is_verified) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "verified-badge" },
        viewBox: "0 0 24 24",
        fill: "#0095F6",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "timestamp" },
});
(__VLS_ctx.timeAgo(__VLS_ctx.post.created_at));
if (__VLS_ctx.post.location) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "location" },
    });
    (__VLS_ctx.post.location);
}
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ class: "options-btn" },
    'aria-label': "More options",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    ...{ class: "icon" },
    fill: "currentColor",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
    cx: "12",
    cy: "12",
    r: "1.5",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
    cx: "6",
    cy: "12",
    r: "1.5",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
    cx: "18",
    cy: "12",
    r: "1.5",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onDblclick: (__VLS_ctx.handleDoubleTap) },
    ...{ class: "media-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.currentMediaUrl),
    alt: (__VLS_ctx.post.caption || 'Post image'),
    ...{ class: "post-media" },
});
const __VLS_4 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    name: "heart-pop",
}));
const __VLS_6 = __VLS_5({
    name: "heart-pop",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
if (__VLS_ctx.showHeartPop) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "heart-pop-wrapper" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        viewBox: "0 0 24 24",
        ...{ class: "heart-pop-icon" },
        fill: "#ED4956",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    });
}
var __VLS_7;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "left-actions" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.toggleLike) },
    ...{ class: "action-btn" },
    ...{ class: ({ 'liked': __VLS_ctx.post.is_liked }) },
    'aria-label': "Like",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    ...{ class: "icon" },
    fill: (__VLS_ctx.post.is_liked ? '#ED4956' : 'none'),
    stroke: (__VLS_ctx.post.is_liked ? '#ED4956' : 'currentColor'),
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.focusComment) },
    ...{ class: "action-btn" },
    'aria-label': "Comment",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    ...{ class: "icon" },
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('share-post', __VLS_ctx.post);
        } },
    ...{ class: "action-btn" },
    'aria-label': "Share",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    ...{ class: "icon" },
    fill: "none",
    stroke: "currentColor",
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.toggleSave) },
    ...{ class: "action-btn" },
    ...{ class: ({ 'saved': __VLS_ctx.post.is_saved }) },
    'aria-label': "Save",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    ...{ class: "icon" },
    fill: (__VLS_ctx.post.is_saved ? 'currentColor' : 'none'),
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "content-body" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "likes-count" },
});
(__VLS_ctx.post.likes_count.toLocaleString());
if (__VLS_ctx.post.caption) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "caption-row" },
    });
    const __VLS_8 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        to: (`/${__VLS_ctx.post.author.username}`),
        ...{ class: "caption-username" },
    }));
    const __VLS_10 = __VLS_9({
        to: (`/${__VLS_ctx.post.author.username}`),
        ...{ class: "caption-username" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    (__VLS_ctx.post.author.username);
    var __VLS_11;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "caption-text" },
    });
    (__VLS_ctx.post.caption);
}
if (__VLS_ctx.post.comments_count > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.post.comments_count > 0))
                    return;
                __VLS_ctx.showCommentsModal = true;
            } },
        ...{ class: "view-comments-btn" },
    });
    (__VLS_ctx.post.comments_count);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.submitComment) },
    ...{ class: "comment-form" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ref: "commentInput",
    value: (__VLS_ctx.newCommentText),
    type: "text",
    placeholder: "Add a comment...",
    ...{ class: "comment-input" },
});
/** @type {typeof __VLS_ctx.commentInput} */ ;
if (__VLS_ctx.newCommentText.trim()) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        type: "submit",
        ...{ class: "post-comment-btn" },
    });
}
/** @type {__VLS_StyleScopedClasses['post-card']} */ ;
/** @type {__VLS_StyleScopedClasses['post-header']} */ ;
/** @type {__VLS_StyleScopedClasses['author-info']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-ring']} */ ;
/** @type {__VLS_StyleScopedClasses['author-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['author-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['username-row']} */ ;
/** @type {__VLS_StyleScopedClasses['username']} */ ;
/** @type {__VLS_StyleScopedClasses['verified-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['timestamp']} */ ;
/** @type {__VLS_StyleScopedClasses['location']} */ ;
/** @type {__VLS_StyleScopedClasses['options-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['media-container']} */ ;
/** @type {__VLS_StyleScopedClasses['post-media']} */ ;
/** @type {__VLS_StyleScopedClasses['heart-pop-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['heart-pop-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['actions-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['left-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['content-body']} */ ;
/** @type {__VLS_StyleScopedClasses['likes-count']} */ ;
/** @type {__VLS_StyleScopedClasses['caption-row']} */ ;
/** @type {__VLS_StyleScopedClasses['caption-username']} */ ;
/** @type {__VLS_StyleScopedClasses['caption-text']} */ ;
/** @type {__VLS_StyleScopedClasses['view-comments-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-form']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-input']} */ ;
/** @type {__VLS_StyleScopedClasses['post-comment-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            defaultAvatar: defaultAvatar,
            showHeartPop: showHeartPop,
            showCommentsModal: showCommentsModal,
            newCommentText: newCommentText,
            commentInput: commentInput,
            currentMediaUrl: currentMediaUrl,
            handleDoubleTap: handleDoubleTap,
            toggleLike: toggleLike,
            toggleSave: toggleSave,
            focusComment: focusComment,
            submitComment: submitComment,
            timeAgo: timeAgo,
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
//# sourceMappingURL=PostCard.vue.js.map