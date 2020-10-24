import draggable from 'vuedraggable';

// 导出组件
export default {
    install: function (Vue) {
        Vue.component('draggable', draggable);
    }
};
