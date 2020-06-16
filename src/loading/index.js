import Vue from 'vue'
import loading from './loading.vue'

// 返回一个 扩展实例构造器
const LoadingConstructor = Vue.extend(loading)

// 定义弹出组件的函数 接收2个参数, 要显示的文本 和 显示时间
function create(text) {

    let app = new LoadingConstructor({
        el: document.createElement('div'),
        data() {
            return {
                text
            }
        }
    })

    // 把 实例化的 toast.vue 添加到 body 里
    document.body.appendChild(app.$el);
    return app.$el;
}

// 注册为全局组件的函数
function registryLoading() {
    // 将组件注册到 vue 的 原型链里去,
    // 这样就可以在所有 vue 的实例里面使用 this.$loading()
    Vue.prototype.$loading = create
}

export default registryLoading;