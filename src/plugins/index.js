import draggable from 'vuedraggable';
import upload from "./upload/upload";
import pop from "./pop/pop";

// 导出组件
export default {
    install: function (Vue) {
        Vue.component('draggable', draggable);
        Vue.component('upload', upload);
        Vue.component('pop', pop);
    }
};