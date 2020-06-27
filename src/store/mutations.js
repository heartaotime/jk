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


        function isObject(obj) {
            var type = Object.prototype.toString.call(obj);
            if (type == '[object Object]') {
                return true;
            }
            return false;
        }

        function isArray(obj) {
            var type = Object.prototype.toString.call(obj);
            if (type == '[object Array]') {
                return true;
            }
            return false;
        }

        // 处理下字段
        if (!isObject(openUserInfo.user)) {
            openUserInfo.user = {
                userCode: '-1',
                userName: '访客'
            };
        }

        if (!isObject(openUserInfo.ext)) {
            openUserInfo.ext = {
                bg: {
                    bgImgShowType: 'lasted',
                    bgImg: [],
                    bgColor: 'white'
                },
                cardTransparency: '2',
                searchEngineList: [],
                index: [],
                logo: {
                    logoShowType: 'none',
                    url: ''
                }
            };
        }

        if (!isObject(openUserInfo.ext.bg)) {
            openUserInfo.ext.bg = {
                bgImgShowType: 'lasted',
                bgImg: [],
                bgColor: 'white'
            }
        }

        if (!isArray(openUserInfo.ext.bg.bgImg)) {
            openUserInfo.ext.bg.bgImg = [];
        }

        if (!isArray(openUserInfo.ext.searchEngineList)) {
            openUserInfo.ext.searchEngineList = [];
        }

        if (!isArray(openUserInfo.ext.index)) {
            openUserInfo.ext.index = [];
        }

        if (!isObject(openUserInfo.ext.logo)) {
            openUserInfo.ext.logo = {
                logoShowType: 'none',
                url: ''
            };
        }

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
        // console.log('uSearchFixShow:', searchFixShow);
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