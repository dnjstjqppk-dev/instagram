/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
const emit = defineEmits(['close', 'created']);
const authStore = useAuthStore();
const imageUrl = ref('');
const caption = ref('');
const location = ref('');
const selectedFilter = ref('filter-normal');
const isPublishing = ref(false);
const userAvatar = computed(() => authStore.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100');
const username = computed(() => authStore.user?.username || 'user');
const presets = [
    { url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=1080' },
    { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080' },
    { url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1080' }
];
const filters = [
    { id: 'filter-normal', name: 'Normal' },
    { id: 'filter-clarendon', name: 'Clarendon' },
    { id: 'filter-juno', name: 'Juno' },
    { id: 'filter-valencia', name: 'Valencia' },
    { id: 'filter-bw', name: 'Inkwell' }
];
async function handlePublish() {
    if (!imageUrl.value || isPublishing.value)
        return;
    isPublishing.value = true;
    const newPostData = {
        caption: caption.value,
        location: location.value,
        post_type: 'IMAGE',
        media: [
            {
                media_url: imageUrl.value,
                media_type: 'IMAGE',
                aspect_ratio: '1:1',
                filter_name: selectedFilter.value
            }
        ]
    };
    try {
        const res = await fetch('/api/v1/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.token}`
            },
            body: JSON.stringify(newPostData)
        });
        const data = await res.json();
        if (data.success) {
            emit('created', data.data);
        }
        else {
            emit('created', {
                id: `post_${Date.now()}`,
                author: authStore.user,
                caption: caption.value,
                location: location.value,
                media: newPostData.media,
                likes_count: 0,
                comments_count: 0,
                is_liked: false,
                is_saved: false,
                created_at: new Date().toISOString()
            });
        }
        emit('close');
    }
    catch {
        emit('created', {
            id: `post_${Date.now()}`,
            author: authStore.user,
            caption: caption.value,
            location: location.value,
            media: newPostData.media,
            likes_count: 0,
            comments_count: 0,
            is_liked: false,
            is_saved: false,
            created_at: new Date().toISOString()
        });
        emit('close');
    }
    finally {
        isPublishing.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['share-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['image-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-sample']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('close');
        } },
    ...{ class: "modal-backdrop" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "modal-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "modal-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('close');
        } },
    ...{ class: "back-btn" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "modal-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.handlePublish) },
    ...{ class: "share-btn" },
    disabled: (!__VLS_ctx.imageUrl || __VLS_ctx.isPublishing),
});
(__VLS_ctx.isPublishing ? 'Sharing...' : 'Share');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "modal-body" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-column" },
});
if (__VLS_ctx.imageUrl) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "image-preview" },
        ...{ class: (__VLS_ctx.selectedFilter) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.imageUrl),
        alt: "Preview",
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "upload-placeholder" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "placeholder-icon" },
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "1.5",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.rect)({
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
        cx: "8.5",
        cy: "8.5",
        r: "1.5",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.polyline)({
        points: "21 15 16 10 5 21",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preset-buttons" },
    });
    for (const [preset, i] of __VLS_getVForSourceType((__VLS_ctx.presets))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.imageUrl))
                        return;
                    __VLS_ctx.imageUrl = preset.url;
                } },
            key: (i),
            ...{ class: "preset-btn" },
        });
        (i + 1);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        value: (__VLS_ctx.imageUrl),
        type: "text",
        placeholder: "Or enter https://...",
        ...{ class: "url-input" },
    });
}
if (__VLS_ctx.imageUrl) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-ribbon" },
    });
    for (const [filter] of __VLS_getVForSourceType((__VLS_ctx.filters))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.imageUrl))
                        return;
                    __VLS_ctx.selectedFilter = filter.id;
                } },
            key: (filter.id),
            ...{ class: "filter-thumb" },
            ...{ class: ({ 'active': __VLS_ctx.selectedFilter === filter.id }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "filter-sample" },
            ...{ class: (filter.id) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (__VLS_ctx.imageUrl),
            alt: "",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "filter-name" },
        });
        (filter.name);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "caption-column" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "author-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.userAvatar),
    alt: "",
    ...{ class: "author-avatar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "author-name" },
});
(__VLS_ctx.username);
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
    value: (__VLS_ctx.caption),
    placeholder: "Write a caption...",
    ...{ class: "caption-textarea" },
    maxlength: "2200",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "char-count" },
});
(__VLS_ctx.caption.length);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "metadata-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    value: (__VLS_ctx.location),
    type: "text",
    placeholder: "Add location",
    ...{ class: "meta-input" },
});
/** @type {__VLS_StyleScopedClasses['modal-backdrop']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-card']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['back-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-title']} */ ;
/** @type {__VLS_StyleScopedClasses['share-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-body']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-column']} */ ;
/** @type {__VLS_StyleScopedClasses['image-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['preset-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['preset-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['url-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-ribbon']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-sample']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-name']} */ ;
/** @type {__VLS_StyleScopedClasses['caption-column']} */ ;
/** @type {__VLS_StyleScopedClasses['author-row']} */ ;
/** @type {__VLS_StyleScopedClasses['author-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['author-name']} */ ;
/** @type {__VLS_StyleScopedClasses['caption-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['char-count']} */ ;
/** @type {__VLS_StyleScopedClasses['metadata-section']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-input']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            imageUrl: imageUrl,
            caption: caption,
            location: location,
            selectedFilter: selectedFilter,
            isPublishing: isPublishing,
            userAvatar: userAvatar,
            username: username,
            presets: presets,
            filters: filters,
            handlePublish: handlePublish,
        };
    },
    emits: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=CreatePostModal.vue.js.map