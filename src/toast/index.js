import Vue from 'vue'
import toast from './toast.vue'

// 返回一个 扩展实例构造器
const ToastConstructor = Vue.extend(toast)

// 定义弹出组件的函数 接收2个参数, 要显示的文本 和 显示时间
function create(text, duration = 2000) {


    let app = new ToastConstructor({
        el: document.createElement('div'),
        data() {
            return {
                show: true,
                text: text
            }
        }
    })

    // 把 实例化的 toast.vue 添加到 body 里
    document.body.appendChild(app.$el)

    // 过了 duration 时间后隐藏
    setTimeout(() => {
        app.show = false;
        // 定时清理掉创建的dom对象，防止html文件过大
        setTimeout(() => {
            app.$el.remove();
        }, 3000);
    }, duration)
}

// 注册为全局组件的函数
function registryToast() {
    // 将组件注册到 vue 的 原型链里去,
    // 这样就可以在所有 vue 的实例里面使用 this.$toast()
    Vue.prototype.$toast = create
}

export default registryToast;