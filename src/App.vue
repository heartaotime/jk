<template>
    <div id="app">
        <transition enter-active-class="animated fadeInUp faster"
                    leave-active-class="animated fadeOut faster">
            <PopCommon v-show="popConfig.show"></PopCommon>
        </transition>
        <transition enter-active-class="animated fadeInUp faster">
            <Tips v-show="tipsConfig.show"></Tips>
        </transition>
        <transition enter-active-class="animated fadeIn faster"
                    leave-active-class="animated fadeOut faster">
            <Loading v-show="loadingConfig.show"></Loading>
        </transition>

        <Top></Top>
        <SearchBox></SearchBox>

        <!--        <img alt="Vue logo" src="./assets/logo.png">-->
        <!--        -->
    </div>
</template>

<script>
    import PopCommon from "./components/PopCommon";
    import Tips from "./components/Tips";
    import Top from "./components/Top";
    import Loading from "./components/Loading";

    import SearchBox from "./components/SearchBox";


    export default {
        name: 'App',
        components: {
            Loading,
            PopCommon,
            Tips,
            Top,
            SearchBox
        },
        computed: {
            tipsConfig() {
                return this.$store.state.tipsConfig;
            },
            popConfig() {
                return this.$store.state.popConfig;
            },
            loadingConfig() {
                return this.$store.state.loadingConfig;
            },
            openUserInfo() {
                return this.$store.state.openUserInfo;
            }
        },
        watch: {
            openUserInfo: {
                handler() {
                    // 1.更新卡片 透明度
                    this.Utils.uCardStyle(this.openUserInfo.ext.cardTransparency || '2');
                    // 2.查看背景图的 展示 模式
                    let bgImgShowType = this.openUserInfo.ext.bg.bgImgShowType || 'lasted';
                    this.getByImg(bgImgShowType);


                    if (this.openUserInfo.user.userCode && this.openUserInfo.user.userCode !== '-1') {
                        // 同步数据
                        let url = this.Utils.basicUrl() + '/user/v1/setUserExtInfo';
                        let param = {
                            "userCode": this.openUserInfo.user.userCode,
                            "userSet": JSON.stringify(this.openUserInfo.ext),
                            "userSet1": "",
                            "userSet2": ""
                        };
                        this.Utils.postJson(url, this.Utils.getCommonReq(param)).then(response => {
                            if (!response || response.code !== '0') {
                                console.error('同步用户配置数据失败')
                                return;
                            }
                        });
                    }

                },
                deep: true
            },
        },
        beforeCreate() {
        },
        created() {
            // 把 this 传入 工具类
            this.Utils.setVue(this);
        },
        mounted() {
            // let clientWidth = document.body.clientWidth; // 网页可见区域宽
            // let background = '';
            // if (clientWidth > 700) {
            //     background = "url('https://www.myindex.top/api/common/v1/getPicture/lastest/pc') center no-repeat fixed"
            // } else {
            //     background = "url('https://www.myindex.top/api/common/v1/getPicture/lastest/phone') center no-repeat fixed";
            // }
            //
            // document.body.style.background = background;

            this.uOpenUserInfo();
        },
        methods: {
            uOpenUserInfo() {
                this.openUserInfo.change = !this.openUserInfo.change;

                let openUserInfoLocal = this.Utils.getUserInfo();
                if (openUserInfoLocal) {
                    if (openUserInfoLocal.user) {
                        this.openUserInfo.user = openUserInfoLocal.user;
                    }

                    // 如果用户已经登陆每次都从服务器获取拓展信息
                    if (this.openUserInfo.user.userCode && this.openUserInfo.user.userCode !== '-1') {
                        let url = this.Utils.basicUrl() + '/user/v1/getUserExtInfo';
                        let param = {
                            "userCode": this.openUserInfo.user.userCode
                        };
                        this.Utils.postJson(url, this.Utils.getCommonReq(param)).then(response => {
                            if (response.data != null && response.data.userSet != null && response.data.userSet != '' && response.data.userSet != {}
                                && JSON.parse(response.data.userSet).searchEngineList && JSON.parse(response.data.userSet).searchEngineList.length > 0) {
                                this.openUserInfo.ext = JSON.parse(response.data.userSet);
                                this.$store.commit('uOpenUserInfo', this.openUserInfo);
                            } else {
                                this.Utils.getSearchEngine(list => {
                                    this.openUserInfo.ext.searchEngineList = list;
                                    this.$store.commit('uOpenUserInfo', this.openUserInfo);
                                });
                            }
                            if (!response || response.code !== '0') {
                                console.error(response.message)
                                return;
                            }
                        });
                    } else {
                        if (!openUserInfoLocal.ext || !openUserInfoLocal.ext.searchEngineList || openUserInfoLocal.ext.searchEngineList.length < 1) {
                            this.Utils.getSearchEngine(list => {
                                this.openUserInfo.ext.searchEngineList = list;
                                this.$store.commit('uOpenUserInfo', this.openUserInfo);
                            });
                        } else {
                            this.openUserInfo.ext = openUserInfoLocal.ext;
                            this.$store.commit('uOpenUserInfo', this.openUserInfo);
                        }
                    }
                } else {
                    this.Utils.getSearchEngine(list => {
                        this.openUserInfo.ext.searchEngineList = list;
                        this.$store.commit('uOpenUserInfo', this.openUserInfo);
                    });
                }
            },
            getByImg(bgImgShowType) {
                // let that = this;
                // const url = '/bingBgImg?format=js&idx=0&n=1&nc=' + new Date().getTime() + '&pid=hp&video=0';
                // this.Utils.getJson(url, {}, function (response) {
                //     if (response && response.images && response.images.length > 0) {
                //         that.appStyle.backgroundImage = "url('https://cn.bing.com/" + response.images[0].url +
                //             "')";
                //     }
                // });

                // document.body.style.backgroundImage = '';
                // document.body.style.backgroundColor = '';

                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.style.backgroundSize = '100%';


                let bgImg = this.openUserInfo.ext.bg.bgImg;
                if (bgImg.indexOf('cn.bing.com') > -1) {
                    if (this.Utils.isPhone()) {
                        // 1080x1920
                        bgImg = bgImg.replace('1920x1080', '1080x1920');
                        document.body.style.backgroundSize = '122%';
                    } else {
                        // 1920x1080
                        bgImg = bgImg.replace('1080x1920', '1920x1080');
                        // this.openUserInfo.ext.bg.bgImg = this.openUserInfo.ext.bg.bgImg.replace('1920x1080', 'UHD');
                    }
                }

                if (bgImgShowType === 'one') {
                    document.body.style.backgroundImage = 'url(' + bgImg + ')';
                    document.body.style.backgroundColor = '';
                    return;
                }

                if (bgImgShowType === 'share') {
                    document.body.style.backgroundImage = 'url(' + bgImg + ')';
                    document.body.style.backgroundColor = '';
                    return;
                }

                if (bgImgShowType === 'none') {
                    document.body.style.backgroundImage = '';
                    document.body.style.backgroundColor = '';
                    return;
                }

                if (bgImgShowType === 'color') {
                    document.body.style.backgroundImage = '';
                    document.body.style.backgroundColor = this.openUserInfo.ext.bg.bgColor;
                    return;
                }

                let backgroundImage = '';
                if (bgImgShowType === 'lasted') {
                    backgroundImage = 'https://www.myindex.top/api/common/v1/getPicture/lastest/';
                } else if (bgImgShowType === 'random') {
                    backgroundImage = 'https://www.myindex.top/api/common/v1/getPicture/random/';
                }

                if (this.Utils.isPhone()) {
                    backgroundImage += 'phone';
                } else {
                    backgroundImage += 'pc';
                }
                document.body.style.backgroundImage = 'url(' + backgroundImage + ')';
            }
        }
    }
</script>

<style>
    @import "assets/css/common.css";
</style>

<style scoped>

    #app {
        margin: 0 auto;
        display: grid;
    }
</style>
