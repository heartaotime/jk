export default {

    // 返回一个函数，就可以传参了
    // weekDate: (state) => (fm) => {
    //     return moment(state.date).format(fm ? fm : 'dddd');
    // }

    openUserInfo: (state) => {
        return state.openUserInfo;
    },
    popConfig: (state) => {
        return state.popConfig;
    },
    tipsConfig: (state) => {
        return state.tipsConfig;
    },
    loadingConfig: (state) => {
        return state.loadingConfig;
    },
    searchFixShow: (state) => {
        return state.searchFixShow;
    },

};