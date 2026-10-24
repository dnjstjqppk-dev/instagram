/// <reference types="../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import Navigation from './components/Navigation.vue';
import CreatePostModal from './components/CreatePostModal.vue';
const isCreateModalOpen = ref(false);
function onPostCreated(post) {
    console.log('New post created:', post);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['content-viewport']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-layout" },
});
/** @type {[typeof Navigation, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Navigation, new Navigation({
    ...{ 'onOpenCreate': {} },
}));
const __VLS_1 = __VLS_0({
    ...{ 'onOpenCreate': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onOpenCreate: (...[$event]) => {
        __VLS_ctx.isCreateModalOpen = true;
    }
};
var __VLS_2;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "content-viewport" },
});
const __VLS_7 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({}));
const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
if (__VLS_ctx.isCreateModalOpen) {
    /** @type {[typeof CreatePostModal, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(CreatePostModal, new CreatePostModal({
        ...{ 'onClose': {} },
        ...{ 'onCreated': {} },
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onClose': {} },
        ...{ 'onCreated': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    let __VLS_14;
    let __VLS_15;
    let __VLS_16;
    const __VLS_17 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.isCreateModalOpen))
                return;
            __VLS_ctx.isCreateModalOpen = false;
        }
    };
    const __VLS_18 = {
        onCreated: (__VLS_ctx.onPostCreated)
    };
    var __VLS_13;
}
/** @type {__VLS_StyleScopedClasses['app-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['content-viewport']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Navigation: Navigation,
            CreatePostModal: CreatePostModal,
            isCreateModalOpen: isCreateModalOpen,
            onPostCreated: onPostCreated,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=App.vue.js.map