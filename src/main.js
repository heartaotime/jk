import Vue from 'vue'
import App from './App.vue'
import axios from "axios";
import Utils from './utils/util.js'
import store from './store' //引入store


Vue.config.productionTip = false
Vue.prototype.Utils = Utils;
Vue.prototype.axios = axios;

new Vue({
    store, //使用store
    render: h => h(App),
}).$mount('#app')
