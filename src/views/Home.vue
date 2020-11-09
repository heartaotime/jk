<template>
    <div class="home">
        <!--        <transition enter-active-class="animated fadeInUp faster"-->
        <!--                    leave-active-class="animated fadeOut faster">-->
        <!--            <PopCommon v-show="popConfig.show"></PopCommon>-->
        <!--        </transition>-->

        <!--        <Search v-show="searchFixShow"></Search>-->
        <SearchBox></SearchBox>
        <Index></Index>
        <Set></Set>
    </div>
</template>

<script>
    import SearchBox from "../components/SearchBox";
    import Index from "../components/Index";
    import Set from "../components/Set";

    export default {
        name: 'Home',
        components: {
            SearchBox,
            Index,
            Set
        },
        data() {
            return {
                appStyle: {}
            }
        },
        computed: {
            // tipsConfig() {
            //     return this.$store.getters.tipsConfig;
            // },
            // loadingConfig() {
            //     return this.$store.getters.loadingConfig;
            // },
            popConfig() {
                return this.$store.getters.popConfig;
            },
            openUserInfo() {
                return JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(this.$store.getters.openUserInfo))));
            },
            searchFixShow() {
                return this.$store.getters.searchFixShow;
            },
        },
        watch: {
            openUserInfo: {
                handler(newVal, oldVal) {
                    // newVal = this.Utils.convert(newVal);
                    // oldVal = JSON.parse(JSON.stringify(oldVal));
                    //
                    // if (newVal.change == oldVal.change) {
                    //     // console.log('值相同');
                    //     // 第一次的时候，即使值相同也是在触发，因为 immediate == false,让实际上的第一次没有触发
                    // }
                    // console.log('oldVal, ', oldVal);
                    // console.log('newVal, ', newVal);
                    let openUserInfo = this.Utils.convert(newVal);
                    let user = openUserInfo.user;
                    let ext = openUserInfo.ext;
                    // console.log('openUserInfo changed-1-o, ', this.openUserInfo);
                    // console.log('openUserInfo changed-1, ', openUserInfo);
                    // console.log('openUserInfo changed-1-user, ', user);
                    // console.log('openUserInfo changed-1-ext, ', ext);
                    // console.log('openUserInfo changed-1-1, ', this.openUserInfo.ext);
                    // console.log('openUserInfo changed-1-2, ', this.openUserInfo.ext.searchEngineList);
                    // console.log('openUserInfo changed-1-3, ', openUserInfo);


                    this.$nextTick(() => {
                        // 1.更新卡片 透明度
                        this.Utils.uCardStyle(ext.cardTransparency || '2');
                        // 2.查看背景图的 展示 模式
                        let bgImgShowType = ext.bg.bgImgShowType || 'lasted';
                        this.getBgImg(bgImgShowType);
                    })

                    if (user.userCode && user.userCode !== '-1') {
                        // 校验数据是否发生改变
                        let newValTmp = this.Utils.convert(newVal);
                        let oldValTmp = this.Utils.convert(oldVal);
                        delete newValTmp.change;
                        delete oldValTmp.change;
                        let isEquals = this.Utils.compreObj(newValTmp, oldValTmp);
                        if (isEquals) {
                            console.log('用户信息实际未发生改变，不执行同步到服务器');
                            return;
                        }

                        console.log('同步用户设置数据, ', user.userCode);
                        // 同步数据
                        // console.log('openUserInfo ext changed-2, ', openUserInfo);
                        // console.log('openUserInfo ext changed-3, ', ext);
                        let url = this.Utils.basicUrl() + '/user/v1/setUserExtInfo';
                        let param = {
                            "userCode": user.userCode,
                            "userSet": JSON.stringify(ext),
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
                deep: true,
                // immediate: true // watch 从 无 到 有 会触发一次
            },
            searchFixShow() {

            }
        },
        beforeCreate() {
        },
        created() {
            // 把 this 传入 工具类
            this.Utils.setVue(this);
            //document.getElementsByTagName('body')[0].style.height = window.innerHeight+'px';

            // 设置按键监听
            window.document.addEventListener('keyup', (e) => {
                //此处填写你的业务逻辑即可
                if (e.keyCode == 27) {
                    if (this.popConfig && this.popConfig.show) {
                        this.Utils.closePop();
                    }
                    if (this.searchFixShow) {
                        this.$store.commit('uSearchFixShow', false);
                    }
                }
            });

            // window.onpopstate = function(event) {
            //     alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
            // };
            // history.pushState({page: 1}, "title 1", "?page=1");
            // history.pushState({page: 2}, "title 2", "?page=2");
            // history.replaceState({page: 3}, "title 3", "?page=3");

            // 返回按键被点击
            window.addEventListener("popstate", () => {
                if (this.searchFixShow || (this.popConfig && this.popConfig.show)) {
                    // $('body').css("pointer-events", "none");
                    history.replaceState(null, document.title, location.origin + location.pathname);
                    // window.location.reload();
                }

                if (this.popConfig && this.popConfig.show) {
                    this.Utils.closePop();
                }
                if (this.searchFixShow) {
                    this.$store.commit('uSearchFixShow', false);
                }
            }, false);

        },
        mounted() {
            this.uOpenUserInfo();
        },
        methods: {
            uOpenUserInfo() {

                // 强制改变,触发用户信息更新
                // this.openUserInfo.change = !this.openUserInfo.change;

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

            getImageColor(img) {

                let width = img.width;
                // let height = img.height;
                let height = 50;

                let canvas = document.createElement('canvas');
                // let canvas = document.querySelector('#myCanvas');
                canvas.width = width;
                canvas.height = height;
                var context = canvas.getContext("2d");
                // context.drawImage(img, 0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, width, height);
                // 获取像素数据
                // var data = context.getImageData(0, 0, img.width, img.height).data;
                var data = context.getImageData(0, 0, width, height).data;
                // console.log(data);
                var r = 1, g = 1, b = 1;
                // 取所有像素的平均值
                for (var row = 0; row < height; row++) {
                    for (var col = 0; col < width; col++) {
                        // console.log(data[((img.width * row)+ col) * 4])
                        if (row == 0) {
                            r += data[((width * row) + col)];
                            g += data[((width * row) + col) + 1];
                            b += data[((width * row) + col) + 2];
                        } else {
                            r += data[((width * row) + col) * 4];
                            g += data[((width * row) + col) * 4 + 1];
                            b += data[((width * row) + col) * 4 + 2];
                        }
                    }
                }
                // console.log(r, g, b);
                // 求取平均值
                r /= (width * height);
                g /= (width * height);
                b /= (width * height);
                // 将最终的值取整
                r = Math.round(r);
                g = Math.round(g);
                b = Math.round(b)

                canvas.remove();

                console.log("rgb(" + r + "," + g + "," + b + ")");
                return "rgb(" + r + "," + g + "," + b + ")";
            },

            // isNeed, ext
            judgeNeedGetSearchEngine(callback) {
                // 获取 用户信息 里面是否有
                let openUserInfoLocal = this.Utils.getUserInfo();

                // 把 用户信息放入 openUserInfo
                if (openUserInfoLocal && openUserInfoLocal.user) {
                    this.openUserInfo.user = openUserInfoLocal.user;
                }

                // 1.用户信息不存在
                if (!openUserInfoLocal) {
                    callback(true);
                    return;
                }

                // 2.用户信息里面 searchEngineList 没有
                if (!openUserInfoLocal || !openUserInfoLocal.ext || !openUserInfoLocal.ext.searchEngineList || openUserInfoLocal.ext.searchEngineList.length < 1) {
                    callback(true);
                    return;
                }

                // 3.服务器上用户拓展信息中 searchEngineList 没有
                if (openUserInfoLocal && openUserInfoLocal.user && openUserInfoLocal.user.userCode && openUserInfoLocal.user.userCode !== '-1') {
                    let url = this.Utils.basicUrl() + '/user/v1/getUserExtInfo';
                    let param = {
                        "userCode": this.openUserInfo.user.userCode
                    };
                    this.Utils.postJson(url, this.Utils.getCommonReq(param)).then(response => {
                        if (!response || response.code !== '0') {
                            console.error(response.message);
                            callback(true);
                            return;
                        }
                        if (response.data != null && response.data.userSet != null && response.data.userSet != '' && response.data.userSet != {}
                            && JSON.parse(response.data.userSet).searchEngineList && JSON.parse(response.data.userSet).searchEngineList.length > 0) {
                            this.openUserInfo.ext = JSON.parse(response.data.userSet);
                            this.$store.commit('uOpenUserInfo', this.openUserInfo);
                            callback(false, JSON.parse(response.data.userSet));
                            return;
                        } else {
                            callback(true);
                            return;
                        }
                    });
                }
                callback(true);
                return;
            },

            getBgImg(bgImgShowType) {

                let bgImg = this.openUserInfo.ext.bg.bgImg;
                let bgColor = this.openUserInfo.ext.bg.bgColor;


                let bgImgUrl = '';

                let bgImgChecked = [];
                for (let i = 0; i < bgImg.length; i++) {
                    if (bgImg[i].checked) {
                        bgImgChecked.push(bgImg[i]);
                    }
                }

                if (bgImgChecked && bgImgChecked.length > 0) {
                    let size = bgImgChecked.length;
                    let index = parseInt(Math.random() * size); // 生成 [0,size-1] 的随机整数
                    bgImgUrl = bgImgChecked[index].url;

                    if (bgImgUrl.indexOf('cn.bing.com') > -1) {
                        if (this.Utils.isPhone()) {
                            // 1080x1920
                            bgImgUrl = bgImgUrl.replace('1920x1080', '1080x1920');
                        } else {
                            // 1920x1080
                            bgImgUrl = bgImgUrl.replace('1080x1920', '1920x1080');
                        }
                    }
                }


                if (bgImgShowType === 'url') {
                    bgColor = '';
                } else if (bgImgShowType === 'none') {
                    bgImgUrl = '';
                    bgColor = '';
                } else if (bgImgShowType === 'color') {
                    bgImgUrl = '';
                } else if (bgImgShowType === 'lasted') {
                    bgImgUrl = 'https://www.ystel.cn/api/common/v1/getPicture/lastest/';
                    if (this.Utils.isPhone()) {
                        bgImgUrl += 'phone';
                    } else {
                        bgImgUrl += 'pc';
                    }
                    bgColor = '';
                } else if (bgImgShowType === 'random') {
                    bgImgUrl = 'https://www.ystel.cn/api/common/v1/getPicture/random/';
                    if (this.Utils.isPhone()) {
                        bgImgUrl += 'phone';
                    } else {
                        bgImgUrl += 'pc';
                    }
                    bgColor = '';
                }

                this.appStyle = {
                    backgroundImage: 'url(' + bgImgUrl + ')',
                    backgroundColor: bgColor,
                }

                let appStyle = document.querySelector('#app').style;

                appStyle.backgroundImage = 'url(' + bgImgUrl + ')';
                appStyle.backgroundColor = bgColor;

                // 如果是手机
                if (this.Utils.isPhone()) {
                    // appStyle.backgroundSize = (Math.abs(document.documentElement.clientWidth / document.documentElement.clientHeight - 1080 / 1920) + 1.05) * 100 + '%';
                    // appStyle.backgroundSize = (Math.abs(document.documentElement.clientWidth / document.documentElement.clientHeight - 1080 / 1920) + 1.05) * 100 + '%';
                }
                if (bgImgUrl && bgImgUrl !== '') {
                    let img = new Image();
                    img.src = bgImgUrl;
                    img.onload = () => {
                        let clientWidth = document.documentElement.clientWidth;
                        let clientHeight = document.documentElement.clientHeight;
                        let screenScale = clientWidth / clientHeight;

                        let imgWidth = img.width;
                        let imgHeight = img.height;
                        let scale = imgWidth / imgHeight;
                        // console.log(imgWidth + '-' + imgHeight);

                        let backgroundSize;
                        if (screenScale > scale) {
                            //以宽为标准
                            backgroundSize = clientWidth + 'px ' + clientWidth / scale + 'px';
                        } else {
                            backgroundSize = clientHeight * scale + 'px ' + clientHeight + 'px';
                        }
                        appStyle.backgroundSize = backgroundSize;
                    }
                }


                // let that = this;
                // if (bgImg !== '') {
                //     let img = document.createElement('img');
                //     img.src = bgImg;
                //     img.crossOrigin = "Anonymous";
                //     img.addEventListener('load', () => {
                //         // console.log(that.getImageColor(img));
                //         let imageColor = that.getImageColor(img);
                //         document.querySelector('meta[name=theme-color]').content = imageColor;
                //         document.querySelector('#span').style.backgroundColor = imageColor;
                //         img.remove();
                //     });
                // } else if (bgColor !== '') {
                //     let str = "rgb("
                //     let r = parseInt(bgColor.slice(1, 3), 16).toString();   //ff  slice不包括end
                //     let g = parseInt(bgColor.slice(3, 5), 16).toString();   //00
                //     let b = parseInt(bgColor.slice(5, 7), 16).toString();   //ff
                //     str += r + "," + g + "," + b + ")";
                //     console.log(str);  //rgb(171,0,0)
                //     document.querySelector('meta[name=theme-color]').content = str;
                //     document.querySelector('#span').style.backgroundColor = str;
                // }
            }
        }
    }
</script>
