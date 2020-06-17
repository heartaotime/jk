export default {
    uOpenUserInfo(state, openUserInfo) {
        // alert('uOpenUserInfo');
        console.log('uOpenUserInfo before:', JSON.parse(JSON.stringify(state.openUserInfo)));
        // console.log('uOpenUserInfo openUserInfo.change:', openUserInfo.change);
        // console.log('uOpenUserInfo state.openUserInfo.change:', state.openUserInfo.change);
        // 清空  this.openUserInfo 并重新设置值 触发 watch
        // state.openUserInfo = {};
        openUserInfo.change = !state.openUserInfo.change;

        // console.log('uOpenUserInfo openUserInfo.change:', openUserInfo.change);

        state.openUserInfo = openUserInfo;

        console.log('uOpenUserInfo after:', JSON.parse(JSON.stringify(state.openUserInfo)));

        // console.log('uOpenUserInfo state.openUserInfo.change:', state.openUserInfo.change);

        if (localStorage) {
            // 将用户信息存入本地
            localStorage.setItem("openUserInfo", JSON.stringify(state.openUserInfo));
        }
    },
    uPopConfig(state, popConfig) {
        console.log('uPopConfig:', popConfig);
        state.popConfig = popConfig;
    },

    uSearchFixShow(state, searchFixShow) {
        console.log('uSearchFixShow:', searchFixShow);
        state.searchFixShow = searchFixShow;
    },

    uTipsConfig(state, tipsConfig) {
        console.log('uTipsConfig:', tipsConfig);
        state.tipsConfig = tipsConfig;
    },
    uLoadingConfig(state, loadingConfig) {
        console.log('uLoadingConfig:', loadingConfig);
        state.loadingConfig = loadingConfig;
    }
}