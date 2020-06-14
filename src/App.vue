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

        <!--        <canvas id="myCanvas"></canvas>-->
        <!--        <img id="imgs" src="https://cn.bing.com/th?id=OHR.SantaElena_ZH-CN8036210800_1080x1920.jpg&rf=LaDigue_1920x1080.jpg&pid=hp"-->
        <!--             width='422' height="200"/>-->
        <!--        <img id="imgs" src="https://www.myindex.top/api/common/v1/getPicture/random/pc" width="422px" height="200px"/>-->
        <!--        <span id="span"></span>-->
    </div>
</template>

<script>
    // import ColorThief from "colorthief";
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
        data() {
            return {}
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

            // let domImg = document.querySelector('body');
            // let colorthief = new ColorThief();
            // domImg.addEventListener('load', () => {
            //     console.log('加载好了并取色', colorthief.getColor(domImg))
            //     // this.colors = colorthief.getPalette(domImg);
            // })


        },
        methods: {
            getImageColor(img) {
                let canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                var context = canvas.getContext("2d");
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                // 获取像素数据
                var data = context.getImageData(0, 0, img.width, img.height).data;
                // console.log(data);
                var r = 1, g = 1, b = 1;
                // 取所有像素的平均值
                for (var row = 0; row < img.height; row++) {
                    for (var col = 0; col < img.width; col++) {
                        // console.log(data[((img.width * row)+ col) * 4])
                        if (row == 0) {
                            r += data[((img.width * row) + col)];
                            g += data[((img.width * row) + col) + 1];
                            b += data[((img.width * row) + col) + 2];
                        } else {
                            r += data[((img.width * row) + col) * 4];
                            g += data[((img.width * row) + col) * 4 + 1];
                            b += data[((img.width * row) + col) * 4 + 2];
                        }
                    }
                }
                // console.log(r, g, b);
                // 求取平均值
                r /= (img.width * img.height);
                g /= (img.width * img.height);
                b /= (img.width * img.height);
                // 将最终的值取整
                r = Math.round(r);
                g = Math.round(g);
                b = Math.round(b);
                return "rgb(" + r + "," + g + "," + b + ")";
            },
            uOpenUserInfo() {
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


                // TODO.. 点击 图片也会进来？？


                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.style.backgroundSize = '100%';


                let bgImg = this.openUserInfo.ext.bg.bgImg;
                let bgColor = this.openUserInfo.ext.bg.bgColor;
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
                    bgColor = '';
                } else if (bgImgShowType === 'share') {
                    bgColor = '';
                } else if (bgImgShowType === 'none') {
                    bgImg = '';
                    bgColor = '';
                } else if (bgImgShowType === 'color') {
                    bgImg = '';
                } else if (bgImgShowType === 'lasted') {
                    bgImg = 'https://www.myindex.top/api/common/v1/getPicture/lastest/';
                    if (this.Utils.isPhone()) {
                        bgImg += 'phone';
                    } else {
                        bgImg += 'pc';
                    }
                    bgColor = '';
                } else if (bgImgShowType === 'random') {
                    bgImg = 'https://www.myindex.top/api/common/v1/getPicture/random/';
                    if (this.Utils.isPhone()) {
                        bgImg += 'phone';
                    } else {
                        bgImg += 'pc';
                    }
                    bgColor = '';
                }

                document.body.style.backgroundImage = 'url(' + bgImg + ')';
                document.body.style.backgroundColor = bgColor;

                alert(bgColor);
                if (bgImg !== '') {
                    let img = document.createElement('img');
                    img.src = bgImg;
                    img.crossOrigin = "Anonymous"
                    img.addEventListener('load', () => {
                        console.log(this.getImageColor(img));
                        document.querySelector('meta[name=theme-color]').content = this.getImageColor(img);
                    });
                } else if (bgColor !== '') {
                    document.querySelector('meta[name=theme-color]').content = bgColor;
                }
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
