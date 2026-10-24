/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
const authStore = useAuthStore();
const conversations = ref([
    {
        id: 'c_1',
        participant: {
            username: 'alex_photo',
            full_name: 'Alex Rivera',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
        },
        last_message: 'Loved that last photo shot!',
        last_time: '20m',
        is_online: true
    },
    {
        id: 'c_2',
        participant: {
            username: 'aura_official',
            full_name: 'Aura Social Official',
            avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'
        },
        last_message: 'Welcome to Aura Platform!',
        last_time: '1d',
        is_online: false
    }
]);
const activeConversation = ref(conversations.value[0]);
const inputMessage = ref('');
const messages = ref([
    { id: 'm_1', is_me: false, content: 'Hey Sarah! Loved your new photography exhibition post.' },
    { id: 'm_2', is_me: true, content: 'Thank you Alex! Really appreciate it 🙏' },
    { id: 'm_3', is_me: false, content: 'Are you joining the creators meet this Saturday?' }
]);
function sendMessage() {
    if (!inputMessage.value.trim())
        return;
    messages.value.push({
        id: `m_${Date.now()}`,
        is_me: true,
        content: inputMessage.value.trim()
    });
    inputMessage.value = '';
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['conversation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble-row']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble-row']} */ ;
/** @type {__VLS_StyleScopedClasses['sent']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['received']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "direct-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "direct-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "inbox-pane" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "inbox-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-selector" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "header-username" },
});
(__VLS_ctx.authStore.user?.username || 'Messages');
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "chevron-icon" },
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.polyline)({
    points: "6 9 12 15 18 9",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ class: "new-msg-btn" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    viewBox: "0 0 24 24",
    ...{ class: "icon" },
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "messages-list" },
});
for (const [c] of __VLS_getVForSourceType((__VLS_ctx.conversations))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.activeConversation = c;
            } },
        key: (c.id),
        ...{ class: "conversation-item" },
        ...{ class: ({ 'active': __VLS_ctx.activeConversation?.id === c.id }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item-avatar-wrap" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (c.participant.avatar_url),
        alt: "",
        ...{ class: "item-avatar" },
    });
    if (c.is_online) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "online-dot" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "item-username" },
    });
    (c.participant.username);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "item-last-msg" },
    });
    (c.last_message);
    (c.last_time);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "chat-pane" },
});
if (__VLS_ctx.activeConversation) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chat-view" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
        ...{ class: "chat-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-user" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.activeConversation.participant.avatar_url),
        alt: "",
        ...{ class: "header-avatar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-meta" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "header-name" },
    });
    (__VLS_ctx.activeConversation.participant.full_name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "header-status" },
    });
    (__VLS_ctx.activeConversation.is_online ? 'Active now' : 'Active 2h ago');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ class: "chat-action-btn" },
        'aria-label': "Audio call",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        viewBox: "0 0 24 24",
        ...{ class: "icon" },
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ class: "chat-action-btn" },
        'aria-label': "Video call",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        viewBox: "0 0 24 24",
        ...{ class: "icon" },
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.polygon)({
        points: "23 7 16 12 23 17 23 7",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.rect)({
        x: "1",
        y: "5",
        width: "15",
        height: "14",
        rx: "2",
        ry: "2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "messages-flow" },
    });
    for (const [msg] of __VLS_getVForSourceType((__VLS_ctx.messages))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (msg.id),
            ...{ class: "message-bubble-row" },
            ...{ class: ({ 'sent': msg.is_me, 'received': !msg.is_me }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "bubble" },
        });
        (msg.content);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
        ...{ onSubmit: (__VLS_ctx.sendMessage) },
        ...{ class: "chat-input-bar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        value: (__VLS_ctx.inputMessage),
        type: "text",
        placeholder: "Message...",
        ...{ class: "message-input" },
    });
    if (__VLS_ctx.inputMessage.trim()) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            type: "submit",
            ...{ class: "send-btn" },
        });
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-chat-state" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-icon-wrap" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        viewBox: "0 0 24 24",
        ...{ class: "empty-icon" },
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "1.5",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
/** @type {__VLS_StyleScopedClasses['direct-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['direct-card']} */ ;
/** @type {__VLS_StyleScopedClasses['inbox-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['inbox-header']} */ ;
/** @type {__VLS_StyleScopedClasses['user-selector']} */ ;
/** @type {__VLS_StyleScopedClasses['header-username']} */ ;
/** @type {__VLS_StyleScopedClasses['chevron-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['new-msg-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['messages-list']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['item-avatar-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['item-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['online-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['item-info']} */ ;
/** @type {__VLS_StyleScopedClasses['item-username']} */ ;
/** @type {__VLS_StyleScopedClasses['item-last-msg']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-view']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-user']} */ ;
/** @type {__VLS_StyleScopedClasses['header-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['header-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['header-name']} */ ;
/** @type {__VLS_StyleScopedClasses['header-status']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['messages-flow']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble-row']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['message-input']} */ ;
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-chat-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-icon-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-icon']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            authStore: authStore,
            conversations: conversations,
            activeConversation: activeConversation,
            inputMessage: inputMessage,
            messages: messages,
            sendMessage: sendMessage,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DirectView.vue.js.map