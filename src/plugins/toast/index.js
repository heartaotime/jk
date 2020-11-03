import Vue from 'vue'
import toast from './toast.vue'
import Utils from "../util";

// 返回一个 扩展实例构造器
const ToastConstructor = Vue.extend(toast)

let app;

function init() {
    app = new ToastConstructor({
        el: document.createElement('div'),
        data() {
            return {
                list: [],
            }
        },
        computed: {
            toasts() {
                return [].concat(this.list).reverse();
            },
        },
        watch: {
            list: {
                handler() {
                    for (let i = 0; i < this.list.length; i++) {
                        let item = this.list[i];
                        item.tipsContentStyle = {};
                        item.iStyle = {};

                        if (item.status === 1) { // 主要的
                            item.iClass = 'fas fa-exclamation';
                            item.tipsContentStyle.backgroundColor = 'var(--success)';
                        } else if (item.status === 2) { // 次要的
                            item.iClass = 'fas fa-exclamation';
                            item.tipsContentStyle.backgroundColor = 'var(--secondary)';
                        } else if (item.status === 3) { // 成功
                            item.iClass = 'fas fa-check';
                            item.tipsContentStyle.backgroundColor = 'var(--success)';
                        } else if (item.status === 4) { // 信息
                            item.iClass = 'fas fa-exclamation';
                            item.tipsContentStyle.backgroundColor = 'var(--info)';
                        } else if (item.status === 5) { // 警告
                            item.iClass = 'fas fa-exclamation';
                            item.tipsContentStyle.backgroundColor = 'var(--warning)';
                        } else if (item.status === 6) { // 错误
                            item.iClass = 'fas fa-exclamation';
                            item.tipsContentStyle.backgroundColor = 'var(--danger)';
                        }
                        item.iStyle.color = item.tipsContentStyle.backgroundColor;


                        // if (item.status === 1) { // 成功
                        //     item.iClass = 'fas fa-check';
                        //     item.tipsContentStyle.backgroundColor = 'var(--success)';
                        //     item.iStyle.color = 'var(--success)';
                        // } else if (item.status === 2) { // 信息
                        //     item.iClass = 'fas fa-exclamation';
                        //     item.tipsContentStyle.backgroundColor = 'var(--primary)';
                        //     item.iStyle.color = 'var(--primary)';
                        // } else if (item.status === 3) { // 失败
                        //     item.iClass = 'fas fa-exclamation';
                        //     item.tipsContentStyle.backgroundColor = 'var(--danger)';
                        //     item.iStyle.color = 'var(--danger)';
                        // } else if (item.status === 4) { // 警告
                        //     item.iClass = 'fas fa-exclamation';
                        //     item.tipsContentStyle.backgroundColor = 'var(--warning)';
                        //     item.iStyle.color = 'var(--warning)';
                        // }

                        // 增加定时器，到时间后自动删除
                        if (!item.isSetAutoDel) {
                            setTimeout(() => {
                                this.del(item.uuid);
                            }, item.duration);
                        }
                        item.isSetAutoDel = true;
                    }
                },
                deep: true
            },
        },
        mounted() {

        },
        methods: {
            add(item) {
                this.list.push(item);
            },
            del(uuid) {
                // this.list.splice(index, 1);
                // this.list.filter(item => item.uuid === uuid);
                let delIndex;
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].uuid === uuid) {
                        delIndex = i;
                        break;
                    }
                }
                this.list.splice(delIndex, 1);
            }
        }
    });
    // 把 实例化的 toast.vue 添加到 body 里
    document.body.appendChild(app.$el);
}


// 定义弹出组件的函数 接收2个参数, 要显示的文本 和 显示时间
// function create(status = 2, text, duration = 2000) {
//     let app = new ToastConstructor({
//         el: document.createElement('div'),
//         data() {
//             return {
//                 show: true,
//                 text: text,
//                 status: status,
//                 iClass: ''
//             }
//         },
//         mounted() {
//             if (this.status === 1) { // 成功
//                 this.iClass = 'fas fa-check';
//                 this.$refs.tipsContent.style.backgroundColor = 'var(--success)';
//                 this.$refs.i.style.color = 'var(--success)';
//             } else if (this.status === 2) { // 信息
//                 this.iClass = 'fas fa-exclamation';
//                 this.$refs.tipsContent.style.backgroundColor = 'var(--primary)';
//                 this.$refs.i.style.color = 'var(--primary)';
//             } else if (this.status === 3) { // 失败
//                 this.iClass = 'fas fa-exclamation';
//                 this.$refs.tipsContent.style.backgroundColor = 'var(--danger)';
//                 this.$refs.i.style.color = 'var(--danger)';
//             } else if (this.status === 4) { // 警告
//                 this.iClass = 'fas fa-exclamation';
//                 this.$refs.tipsContent.style.backgroundColor = 'var(--warning)';
//                 this.$refs.i.style.color = 'var(--warning)';
//             }
//         },
//     })
//
//     // 把 实例化的 toast.vue 添加到 body 里
//     document.body.appendChild(app.$el)
//
//     // 过了 duration 时间后隐藏
//     setTimeout(() => {
//         // app.show = false;
//         // 定时清理掉创建的dom对象，防止html文件过大
//         setTimeout(() => {
//             // app.$el.remove();
//         }, 3000);
//     }, duration)
// }


function defaultToast(text, duration = 2000) {
    app.add({
        uuid: Utils.generateUUID(),
        text: text,
        status: 1,
        duration
    });
}

function success(text, duration = 2000) {
    app.add({
        uuid: Utils.generateUUID(),
        text: text,
        status: 3,
        duration
    });
}

function info(text, duration = 2000) {
    app.add({
        uuid: Utils.generateUUID(),
        text: text,
        status: 4,
        duration
    });
}

function error(text, duration = 2000) {
    app.add({
        uuid: Utils.generateUUID(),
        text: text,
        status: 6,
        duration
    });
}

function warning(text, duration = 2000) {
    app.add({
        uuid: Utils.generateUUID(),
        text: text,
        status: 5,
        duration
    });
}

// 注册为全局组件的函数
function registryToast() {
    init();
    // this.$toast("Default toast"); 1
    // this.$toast.info("Info toast"); 2
    // this.$toast.success("Success toast"); 3
    // this.$toast.error("Error toast"); 4
    // this.$toast.warning("Warning toast"); 5
    // 将组件注册到 vue 的 原型链里去,
    // 这样就可以在所有 vue 的实例里面使用 this.$toast()
    Vue.prototype.$toast = defaultToast
    Vue.prototype.$toast.info = info
    Vue.prototype.$toast.success = success;
    Vue.prototype.$toast.error = error
    Vue.prototype.$toast.warning = warning
}

export default registryToast;