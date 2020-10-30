import Vue from 'vue'
import App from './App.vue'
import store from './plugins/store' //引入store
import router from "./plugins/router";

import axios from "axios";
import Utils from './plugins/util.js'
import toast from './plugins/toast'
import loading from "./plugins/loading";
import plugins from "./plugins";

// import 'tailwindcss/tailwind.css'
// 这里也可以直接执行 registryToast()
Vue.use(toast);
Vue.use(loading);
Vue.use(router)
Vue.use(plugins)

Vue.config.productionTip = false
Vue.prototype.Utils = Utils;
Vue.prototype.axios = axios;

new Vue({
    store, //使用store
    router,
    render: h => h(App),
}).$mount('#app')
