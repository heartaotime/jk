import upload from "./upload";

// 导出组件
export default {
    install: function (Vue) {
        Vue.component('upload', upload)
    }
};