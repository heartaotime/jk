import Vue from 'vue';
import Vuex from 'vuex';
// import axios from "axios";

Vue.use(Vuex);


let guideNav = [];
let leftCommon = [];

let openUserInfo = {
    change: false, // 该字段用来触发改变
    user: {
        userCode: '-1',
        userName: '访客'
    },
    ext: {
        bg: {
            bgImgShowType: 'lasted',
            bgImg: '',
            bgColor: 'white',
            shareBgImg: ''
        },
        cardTransparency: '2',
        searchEngineList: [],
        index: []
    }

};


let popConfig = {
    show: false,
    componentName: '',
    title: '',
    data: {}
};

let tipsConfig = {
    show: false,
    content: '',
};


let loadingConfig = {
    show: false
};


let state = {
    guideNav,
    leftCommon,
    openUserInfo,
    popConfig,
    tipsConfig,
    loadingConfig
};

let mutations = {
    uLoadingConfig(state, loadingConfig) {
        state.loadingConfig = loadingConfig;
    },
    uTipsConfig(state, tipsConfig) {
        // state.popConfig = {};
        state.tipsConfig = tipsConfig;
    },
    uPopConfig(state, popConfig) {
        // state.popConfig = {};
        state.popConfig = popConfig;
    },
    uGuideNav(state, guideNav) {
        state.guideNav = guideNav;
    },
    uLeftCommon(state, leftCommon) {
        state.leftCommon = leftCommon;
    },
    uOpenUserInfo(state, openUserInfo) {
        console.log('uOpenUserInfo:', openUserInfo);
        // 清空  this.openUserInfo 并重新设置值 触发 watch
        // state.openUserInfo = {};
        state.openUserInfo = openUserInfo;
    },
    // uCardTransparency(state, cardTransparency) {
    //
    //     // 1. 设置 默认值
    //     if (!cardTransparency || cardTransparency === '') {
    //         cardTransparency = state.cardTransparency;
    //     }
    //
    //     // 2. 更新显示 样式
    //     let elements = document.querySelectorAll('.card');
    //     for (let i = 0; i < elements.length; i++) {
    //         elements[i].style.backgroundColor = 'rgba(255, 255, 255, ' + (1 - cardTransparency / 10) + ')';
    //     }
    //
    //     // 3.保存至本地
    //     state.cardTransparency = cardTransparency;
    //     let openUserInfo = localStorage.getItem("openUserInfo");
    //     if (openUserInfo && openUserInfo !== '') {
    //         openUserInfo = JSON.parse(openUserInfo);
    //     } else {
    //         openUserInfo = {};
    //     }
    //     openUserInfo.cardTransparency = cardTransparency;
    //     localStorage.setItem("openUserInfo", JSON.stringify(openUserInfo))
    // }
};

let store = new Vuex.Store({
    state,
    mutations
});


export default store;