import Vue from 'vue'
import App from './App.vue'
import axios from "axios";
import Utils from './utils/util.js'
import store from './store' //引入store
import registryToast from './toast'
import registryLoading from "./loading";
import router from "./router";

import pop from "./pop";
import draggable from "./plugins/draggable";

// import 'tailwindcss/tailwind.css'
// 这里也可以直接执行 registryToast()
Vue.use(registryToast);
Vue.use(registryLoading);
Vue.use(router)
Vue.use(pop)
Vue.use(draggable)


Vue.config.productionTip = false
Vue.prototype.Utils = Utils;
Vue.prototype.axios = axios;

new Vue({
    store, //使用store
    router,
    render: h => h(App),
}).$mount('#app')
