export default {
    uOpenUserInfo(state, openUserInfo) {
        console.log('uOpenUserInfo:', openUserInfo);
        // 清空  this.openUserInfo 并重新设置值 触发 watch
        // state.openUserInfo = {};
        // openUserInfo.change = !state.openUserInfo.change;
        state.openUserInfo = openUserInfo;

        if (localStorage) {
            // 将用户信息存入本地
            localStorage.setItem("openUserInfo", JSON.stringify(state.openUserInfo));
        }
    },
    uPopConfig(state, popConfig) {
        console.log('uPopConfig:', popConfig);
        state.popConfig = popConfig;
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