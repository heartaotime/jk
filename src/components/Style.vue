<template>
    <div class="">
        <div class="top">
            <div class="item">
                <span>面板透明度：</span>
                <input type="range" min="0" max="10" v-model="cardTransparency">
                <span>{{cardTransparency}}</span>
                <span>tips:数值越大，越透明</span>
            </div>

            <nav>
                <a class="nav-item" v-for="(item,index) in navList" :key="index"
                   :class="{'active-bottom':index === activeTabIndex}"
                   @click="changeTab(index)">
                    <i :class="'fas fa-' + item.guideIcon" aria-hidden="true"></i>
                    <span>{{item.guideName}}</span>
                </a>
            </nav>
        </div>

        <div class="show-item">
            <div class="biying" v-show="activeTabIndex === 0">
                <div>
                    <a v-for="(item, index) in bgImgShowTypes" :key="'biying' + index">
                        <input type="radio" :id="'radio' + index" name="bgImgShowType" :value="item.code"
                               v-model="bgImgShowType"/>
                        <label :for="'radio' + index" :title="item.desc">{{item.name}}</label></a>
                    <span>tips:以下图片来自必应，每日更新一张</span>
                </div>
                <div class="biyings">
                    <a v-for="(item, index) in showList" :key="index"
                       :style="{
                                   backgroundSize: '100% 100%',
                                   backgroundRepeat: 'no-repeat',
                                   backgroundImage: 'url('+item.codeValue+')'
                                }"
                       class="biyings-item enlargeAnimation"
                       @click="setBgImg(index)"
                       :target="item.codeValue || '_blank'"
                    >
                        <div class="hide set-bg"><span>设置皮肤</span></div>
                    </a>
                </div>
                <a class="more" @click="more()" v-show="pageInfo.hasNextPage">
                    <!--                    <span>{{navigatepageNums}}</span>-->
                    <span><i class="fas fa-angle-down" aria-hidden="true"></i> 加载更多</span>
                </a>
            </div>

            <div class="purecolor" v-show="activeTabIndex === 1">
                <div class="purecolor-item" v-for="(item, index) in pureColorList"
                     :key="'purecolor-item' + index">
                            <span class="purecolor-item-title">
                                {{item.codeName}}
                            </span>
                    <div class="purecolor-item-colors">
                        <div v-for="(itemc, indexc) in JSON.parse(item.bigData || [])"
                             :key="'purecolor-item-colors' + indexc" :style="{
                                         backgroundColor: itemc.guideName,
                                        }"
                             class="enlargeAnimation"
                             @click="setBgColor(itemc.guideName)"
                        >
                            {{itemc.guideName}}
                        </div>
                    </div>
                </div>
            </div>

            <div class="user-cust-bg" v-show="activeTabIndex === 2">
                <div>
                    <label for="shareBgImg">背景图链接: </label>
                    <textarea spellcheck="false" id="shareBgImg" rows="3" v-model="shareBgImg"></textarea>
                    <button @click="setShareBgImg()">保存</button>
                </div>

                <div :style="{
                               backgroundSize: '100% 100%',
                               backgroundRepeat: 'no-repeat',
                               backgroundImage: 'url('+shareBgImg+')'
                        }">

                </div>

                <!--                        <img :src="bgImg"/>-->
            </div>

        </div>

    </div>
</template>

<script>
    export default {
        name: "Style",
        props: {
            show: Boolean
        },
        data() {
            return {
                cardTransparency: '0',
                activeTabIndex: -1,
                navList: [
                    {
                        guideName: '图片背景'
                    },
                    {
                        guideName: '纯色背景'
                    },
                    {
                        guideName: '自定义背景'
                    }
                ],
                showList: [],
                bgImgShowType: '',
                bgImgShowTypes: [
                    {
                        code: 'lasted',
                        name: '每日最新',
                        desc: '每日获取最新的图片当作背景'
                    },
                    {
                        code: 'random',
                        name: '随机背景',
                        desc: '每次刷新页面从以下图片中随机抽取一张当作背景'
                    },
                    {
                        code: 'none',
                        name: '无背景',
                        desc: ''
                    }
                ],
                pureColorList: [],
                shareBgImg: '',
                pageInfo: {}
            }
        },
        computed: {
            openUserInfo() {
                return this.$store.state.openUserInfo;
            },
        },
        watch: {
            cardTransparency(newVal) {
                this.setCardTransparency(newVal);
            },
            activeTabIndex(newVal) {
                if (newVal === 0) {
                    this.getByImg(1);
                } else if (newVal === 1) {
                    this.getPureColorList();
                }
            },
            openUserInfo: {
                handler() {
                    this.uStyle();
                },
                deep: true
            },
            bgImgShowType() {
                this.setBgImgShowType();
            }

            // newCustSet(newVal) {
            //     window.console.log(newVal);
            //     this.$store.commit('uOpenUserInfo', newVal);
            // },
            // newCustSet: {
            //     handler(newVal) {
            //         window.console.log(newVal);//但是这两个值打印出来却都是一样的
            //         this.$store.commit('uOpenUserInfo', newVal);
            //     },
            //     deep: true
            // }

        },
        mounted() {
            // window.console.log(this.openUserInfo);
            this.activeTabIndex = 0;
            // this.cardTransparency = this.openUserInfo.cardTransparency;
            this.uStyle();

        },
        methods: {
            uStyle() {
                // 更新显示 cardTransparency
                this.bgImgShowType = this.openUserInfo.ext.bg.bgImgShowType;
                this.cardTransparency = this.openUserInfo.ext.cardTransparency;
                this.shareBgImg = this.openUserInfo.ext.bg.bgImg;
            },
            changeTab: function (activeTabIndex) {
                this.activeTabIndex = activeTabIndex;
            },
            getByImg(nextPage) {
                let url = this.Utils.basicUrl() + '/common/v1/getOpenStaticData';
                let param = {
                    "codeType": 'BY_IMG'
                };
                param = this.Utils.getCommonReq(param);
                param.pageFlag = true;
                param.pageNum = nextPage;
                param.pageSize = 12;
                param.orderBy = 'SORT DESC';
                this.Utils.postJson(url, param).then(response => {
                    if (!response || response.code !== '0') {
                        this.Utils.errorTips(response.message);
                        return;
                    }
                    if (nextPage == 1) {
                        this.showList = [];
                    }
                    // this.showList = response.data.list.reverse();
                    this.showList = this.showList.concat(response.data.list);
                    this.pageInfo = response.data;

                    // let top = document.querySelector(".more").offsetTop - 80;
                    // alert(top);
                    // this.$nextTick(() => {
                    //     if (nextPage !== 1) {
                    //         window.scrollTo({
                    //             top: top,
                    //             behavior: "smooth"
                    //         });
                    //     }
                    // });
                });
            },
            more() {
                let hasNextPage = this.pageInfo.hasNextPage;
                if (!hasNextPage) {
                    alert('没有更多了');
                    return;
                }
                let nextPage = this.pageInfo.nextPage;
                this.getByImg(nextPage);
            },
            getPureColorList() {
                let url = this.Utils.basicUrl() + '/common/v1/getOpenStaticData';
                let param = {
                    "codeType": 'PURE_COLORS'
                };
                param = this.Utils.getCommonReq(param);
                param.pageFlag = false;
                this.Utils.postJson(url, param).then(response => {
                    if (!response || response.code !== '0') {
                        this.Utils.errorTips(response.message);
                        return;
                    }
                    this.pureColorList = response.data.list;
                });
            },
            setCardTransparency(cardTransparency) {
                this.openUserInfo.ext.cardTransparency = cardTransparency;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
            },
            setBgImgShowType() {
                this.openUserInfo.ext.bg.bgImgShowType = this.bgImgShowType;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
            },
            setBgImg(index) {
                this.openUserInfo.ext.bg.bgImgShowType = 'one'; // 选择其一
                this.openUserInfo.ext.bg.bgImg = this.showList[index].codeValue;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
                // alert(this.openUserInfo.bgImgShowType);
            },
            setBgColor(color) {
                this.openUserInfo.ext.bg.bgImgShowType = 'color'; // 纯色背景
                this.openUserInfo.ext.bg.bgColor = color;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
            },
            setShareBgImg() {
                this.openUserInfo.ext.bg.bgImgShowType = 'one'; // 自定义背景图
                // this.openUserInfo.shareBgImg = this.shareBgImg;
                this.openUserInfo.ext.bg.bgImg = this.shareBgImg;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
            }
        }
    }
</script>

<style scoped>


    .top {
        background-color: #f9f9f9;

        padding: 10px 20px 0;

        display: grid;
        grid-template-columns: 1fr;

    }


    nav {
        display: grid;
        grid-template-columns: repeat(3, auto);
        justify-content: start;
        align-content: center;

        grid-column-gap: 20px;
    }

    .nav-item {
        line-height: 40px;
        /*margin: 0 20px;*/
    }

    .item {
        line-height: 50px;

        display: grid;
        grid-template-columns: repeat(4, auto);
        align-content: center;
        justify-content: start;
        align-items: center;
        grid-column-gap: 10px;
    }

    .item span:last-child {
        color: rgba(95, 95, 95, 0.52);
    }

    .item input {
        /*width: 200px;*/
    }

    .show-item {
        height: 310px;
        padding: 0 20px 0;
        overflow-y: auto;
    }

    .biying {
        display: grid;
        grid-template-columns: 1fr;
        align-content: center;
        align-items: center;
    }

    .biying > div:first-child {
        height: 50px;

        display: grid;
        grid-template-columns: repeat(5, auto);
        grid-column-gap: 20px;
        justify-content: start;
        align-content: center;
        align-items: center;
    }

    .biying > div:first-child span {
        color: rgba(95, 95, 95, 0.52);
    }


    span, label {
        cursor: pointer;
    }

    label {
        margin-left: 5px;
    }

    .biyings {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        align-items: start;
        grid-gap: 15px;
    }

    .biying a {
        display: grid;
        grid-template-columns: repeat(2, auto);
        align-items: center;
    }

    .biyings-item {
        height: 120px;
        border-radius: 3px;

        cursor: pointer;
        display: grid;
        grid-template-columns: 1fr;
        place-content: center;
        place-items: center;
        /*align-items: end;*/
        /*align-content: space-between;*/
        /*align-self: start;*/

        font-size: 13px;

        overflow: hidden;
    }

    .biyings-item:hover .set-bg {
        display: block;
    }

    .biyings-item .set-bg {
        padding: 5px;
        box-shadow: 0 0 18px rgba(70, 70, 40, .255);
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 5px;

        /*display: grid;*/
        /*grid-template-columns: 1fr;*/
        /*place-content: center;*/
        /*place-items: center;*/
    }


    .purecolor {
        margin-top: 10px;
        display: grid;
        grid-template-columns: 1fr;
        grid-row-gap: 10px;
    }

    .purecolor-item-title {
        color: #6b7386;
    }

    .purecolor-item {
        display: grid;
        grid-template-columns: 1fr;
        grid-row-gap: 10px;
    }

    .purecolor-item-colors {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-content: center;
        align-content: center;
        grid-gap: 15px;
    }


    .purecolor-item-colors > div {
        cursor: pointer;
        /*width: 20px;*/
        height: 120px;

        display: grid;
        grid-template-columns: 1fr;
        place-content: center;
        place-items: center;

        border-radius: 3px;
    }

    .purecolor-item-colors > div:hover {
        /*border: 2px dashed lightgrey;*/
    }


    .user-cust-bg {
        margin-top: 10px;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        grid-row-gap: 10px;
    }

    .user-cust-bg > div:first-child {
        display: grid;
        grid-template-columns: auto 4fr 1fr;
        justify-content: start;
        /*align-items: center;*/
        grid-column-gap: 10px;
    }

    label {
        align-self: center;
    }

    textarea {
        /*width: ;*/
        border-radius: 5px;
        border: 1px solid lightgrey;
        padding: 5px 10px;
    }

    .user-cust-bg > div:last-child {
        height: 240px;
    }

    .user-cust-bg > img {
        width: 300px;
        height: 300px;
    }

    button {
        outline: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        font-weight: bold;

        /*color: #8590a6;*/

        color: white;
        background-color: #409EFF;

        border-radius: 5px;

        /*text-shadow: 0 1px 0 #fff;*/

        /*border-left: 1px solid #ccd8e1;*/
    }

    input[type="range"] {
        -webkit-appearance: none;
        background: linear-gradient(75deg, orange, cornsilk);
        border-radius: 5px;
        outline: none;
        height: 10px;
        /*box-shadow:  0 0 6px rgb(28,);*/
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 15px;
        height: 15px;
        background: darkorange;
        border-radius: 50%;
        transition: 0.3s;
    }

    input[type="range"]:active::-webkit-slider-thumb {
        background: orangered;
        box-shadow: 0 0 6px orange;
    }

    input[type=radio] {
        -webkit-appearance: none;
        border: 1px orange solid;
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }


    input[type=radio]:focus, input[type=radio]:checked {
        -webkit-appearance: none;
        /*border: 1px orange solid;*/

        background-color: coral;
        /*box-shadow: inset 0 0 0 4px #f4f4f4;*/

        /*width: 10px;*/
        /*height: 10px;*/
        /*border-radius: 50%;*/
    }

    .more {
        display: grid;
        grid-template-columns: 1fr;
        place-content: center;
        line-height: 30px;
        margin-top: 10px;
    }

    .more > span {
        text-align: center;
    }

    @media screen and (max-width: 700px) {
        .item {
            grid-template-columns: auto 1fr 20px;
            line-height: 30px;
        }

        .item > span:last-child {
            grid-column: 1/4;
        }

        .biying > div:first-child {
            margin-top: 5px;
            /*height: 40px;*/
            line-height: 40px;
            grid-template-columns: repeat(3, auto);
            /*justify-content: space-between;*/
            padding: 5px 0;
        }

        .biying > div:first-child > span:last-child {
            grid-column: 1/4;
        }

        .biyings {
            grid-template-columns: 1fr;
        }

        .biyings-item {
            height: 200px;
        }

        .purecolor-item-colors {
            grid-template-columns: 1fr;
        }

        .user-cust-bg > div:last-child {
            height: 200px;
        }

        span, a, label {
            font-size: 13px;
        }

        .user-cust-bg > div:first-child {
            grid-template-columns: auto 1fr;
            grid-row-gap: 5px;
        }

        .user-cust-bg button {
            grid-column: 1/3;
            line-height: 40px;
        }
    }


</style>