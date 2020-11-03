let openUserInfo = {
    change: false, // 该字段用来触发改变
    user: {
        userCode: '-1',
        userName: '访客'
    },
    ext: {
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

let searchFixShow = false;

let editIndexShow = false;


export default {
    openUserInfo,
    popConfig,
    tipsConfig,
    loadingConfig,
    searchFixShow,
    editIndexShow
}