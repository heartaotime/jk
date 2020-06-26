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
                <div>
                    <transition-group enter-active-class="animated fadeInUp"
                                      leave-active-class="animated fadeOut" class="biyings">
                        <a v-for="(item, index) in showList" :key="item.codeValue"
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
                    </transition-group>
                </div>
                <a class="more" @click="more()" v-show="pageInfo.hasNextPage">
                    <!--                    <span>{{navigatepageNums}}</span>-->
                    <span><i class="fas fa-angle-down" aria-hidden="true"></i> 加载更多</span>
                </a>
            </div>

            <div v-show="activeTabIndex === 1">
                <transition-group enter-active-class="animated fadeInUp"
                                  leave-active-class="animated fadeOut" class="purecolor">
                    <div class="purecolor-item" v-for="(item, index) in pureColorList"
                         :key="item.codeName" :index="index">
                            <span class="purecolor-item-title">
                                {{item.codeName}}
                            </span>
                        <div class="purecolor-item-colors">
                            <div v-for="(itemc, indexc) in JSON.parse(item.bigData || [])"
                                 :key="indexc.guideName" :style="{
                                         backgroundColor: itemc.guideName,
                                        }"
                                 class="enlargeAnimation"
                                 @click="setBgColor(itemc.guideName)"
                            >
                                {{itemc.guideName}}
                            </div>
                        </div>
                    </div>
                </transition-group>
            </div>

            <div class="user-cust-bg" v-show="activeTabIndex === 2">
                <div class="img" @click="selectImg">
                    <i class="fas fa-plus" aria-hidden="true"></i>
                </div>

                <input type="file" name="file" id="selectImg" @change="upLoadFile()" hidden style="display: none">
            </div>

            <div class="user-cust-url-bg" v-show="activeTabIndex === 3">

                <div class="animated fadeInRight faster">
                    <div class="tips">
                        <span>提示：</span>
                        <span>1.可以多选</span>
                        <span>2.每次刷新页面会从选中的链接中随机获取一个</span>
                        <span>3.下面是一些链接可以供你选择和参考哦</span>
                        <span>4.选择一个或者多个刷新页面试试看</span>
                    </div>
                </div>


                <transition-group enter-active-class="animated fadeInUp"
                                  leave-active-class="animated fadeOutLeft faster">
                    <div class="row" v-for="(item, index) in bgImgList" :key="item.uuid">
                        <div>
                            <input type="checkbox" :index="index" :id="'cu-item-' + index"
                                   @click="bgImgClick(item,index)"
                                   :checked="item.checked" :value="item.checked"/>
                        </div>
                        <div>
                            <input spellcheck="false" placeholder="名称" v-model="item.name"/>
                        </div>
                        <div>
                            <input spellcheck="false" placeholder="链接" v-model="item.url" class="url"/>
                        </div>
                        <div @click="delBgImgUrl(index)">
                            <i class="fa fa-trash-alt" aria-hidden="true"></i>
                        </div>

                    </div>
                </transition-group>


                <div class="btn">
                    <button @click="addBgImgUrl()">新增一个</button>
                    <button @click="saveBgImgUrl()">保存</button>
                    <button @click="resetBgImgUrl()">恢复默认</button>
                </div>


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
                    },
                    {
                        guideName: '自由设置背景链接'
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
                pageInfo: {},
                bgImgUrlDefault: [
                    {
                        name: '自适应大小壁纸',
                        url: 'https://api.btstu.cn/sjbz/zsy.php'
                    },
                    {
                        name: '手机端随机壁纸 1080/1920',
                        url: 'https://picsum.photos/1080/1920'
                    },
                    {
                        name: '电脑端随机壁纸 1920/1080',
                        url: 'https://picsum.photos/1920/1080'
                    },
                    {
                        name: '电脑动漫图片',
                        url: 'https://api.btstu.cn/sjbz/?lx=dongman'
                    },
                    {
                        name: '电脑美女图片',
                        url: 'https://api.btstu.cn/sjbz/?lx=meizi'
                    },
                    {
                        name: '电脑随机动漫妹子',
                        url: 'https://api.btstu.cn/sjbz/?lx=suiji'
                    },
                    {
                        name: '手机动漫图片',
                        url: 'https://api.btstu.cn/sjbz/?lx=m_dongman'
                    },
                    {
                        name: '手机美女图片',
                        url: 'https://api.btstu.cn/sjbz/?lx=m_meizi'
                    },
                    {
                        name: '手机随机动漫妹子',
                        url: 'https://api.btstu.cn/sjbz/?m_lx=suiji'
                    },
                ],
                bgImgList: [],
                checkedUUIDList: [],
                custBgImg: ''
            }
        },
        computed: {
            openUserInfo() {
                return JSON.parse(JSON.stringify(this.$store.getters.openUserInfo));
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

        },
        mounted() {
            for (let i = 0; i < this.bgImgUrlDefault.length; i++) {
                let uuid = this.Utils.generateUUID();
                this.bgImgUrlDefault[i].uuid = uuid;
                this.bgImgUrlDefault[i].checked = false;
            }

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

                if (this.openUserInfo.ext.bg.bgImg.length < 1) {
                    this.bgImgList = [].concat(this.bgImgUrlDefault);
                } else {
                    this.bgImgList = [].concat(this.openUserInfo.ext.bg.bgImg);
                }
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
                        this.$toast(response.message);
                        return;
                    }
                    if (nextPage == 1) {
                        this.showList = [];
                    }
                    // this.showList = response.data.list.reverse();

                    if (this.Utils.isPhone()) {
                        for (let i = 0; i < response.data.list.length; i++) {
                            // 1920x1080
                            let item = response.data.list[i];
                            item.codeValue = item.codeValue.replace('1920x1080', '1080x1920');
                        }
                    }

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
                    this.$toast('没有更多了')
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
                        this.$toast(response.message);
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
                if (this.openUserInfo.ext.bg.bgImgShowType !== this.bgImgShowType) {
                    this.openUserInfo.ext.bg.bgImgShowType = this.bgImgShowType;
                    this.$store.commit('uOpenUserInfo', this.openUserInfo);
                }
            },
            setBgImg(index) {
                this.openUserInfo.ext.bg.bgImgShowType = 'url'; // 选择其一

                let list = [];
                for (let i = 0; i < this.bgImgList.length; i++) {
                    if (!this.bgImgList[i].one) {
                        this.bgImgList[i].checked = false;
                        list.push(this.bgImgList[i]);
                    }
                }
                list.push({
                    url: this.showList[index].codeValue,
                    name: '必应壁纸',
                    uuid: this.Utils.generateUUID(),
                    checked: true,
                    one: true
                })
                this.openUserInfo.ext.bg.bgImg = list;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
            },
            setBgColor(color) {
                this.openUserInfo.ext.bg.bgImgShowType = 'color'; // 纯色背景
                this.openUserInfo.ext.bg.bgColor = color;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
            },

            addBgImgUrl() {
                // console.log('addSearchEngine1', this.searchEngineList);
                this.bgImgList.push(
                    {
                        url: '',
                        name: '',
                        uuid: this.Utils.generateUUID()
                    }
                );
            },
            saveBgImgUrl() {
                this.openUserInfo.ext.bg.bgImgShowType = 'url'; // 自定义背景图

                for (let i = 0; i < this.bgImgList.length; i++) {
                    let item = this.bgImgList[i];
                    if (item.name == '' || item.url == '') {
                        this.$toast('名称和链接不能为空');
                        return;
                    }
                    // if (item.name === '必应壁纸') {
                    //     this.$toast('名称不能为 必应壁纸');
                    //     return;
                    // }
                    // if (item.name === '自定义背景') {
                    //     this.$toast('名称不能为 自定义背景');
                    //     return;
                    // }
                }

                this.openUserInfo.ext.bg.bgImg = [].concat(this.bgImgList);
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
                this.$toast('保存成功');
            },
            bgImgClick(item, index) {
                item.checked = !item.checked;
                // 强制更新下list
                this.$set(this.bgImgList, index, item);
            },
            delBgImgUrl(index) {
                this.bgImgList.splice(index, 1);
            },
            resetBgImgUrl() {
                this.bgImgList = [].concat(this.bgImgUrlDefault);
                this.openUserInfo.ext.bg.bgImg = [].concat(this.bgImgList);
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
                this.$toast('保存成功');
            },
            selectImg() {
                document.querySelector('#selectImg').click();
            },
            upLoadFile() {
                this.Utils.upLoadFile('selectImg', url => {
                    this.openUserInfo.ext.bg.bgImgShowType = 'url'; // 选择其一
                    let list = [];
                    for (let i = 0; i < this.bgImgList.length; i++) {
                        if (!this.bgImgList[i].one) {
                            this.bgImgList[i].checked = false;
                            list.push(this.bgImgList[i]);
                        }
                    }
                    list.push({
                        url: url,
                        name: '自定义背景',
                        uuid: this.Utils.generateUUID(),
                        checked: true,
                        one: true
                    })
                    this.openUserInfo.ext.bg.bgImg = list;
                    this.$store.commit('uOpenUserInfo', this.openUserInfo);
                    this.$toast('保存成功');
                    // this.Utils.closePop();
                })
            },
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
        grid-template-columns: repeat(4, auto);
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
        height: 400px;
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


    label {
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


    .user-cust-url-bg {
        margin-top: 10px;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        /*grid-row-gap: 10px;*/
    }

    /*.user-cust-url-bg > div:first-child {*/
    /*    height: 50px;*/
    /*    display: grid;*/
    /*    grid-template-columns: auto 4fr 1fr;*/
    /*    justify-content: start;*/
    /*    !*align-items: center;*!*/
    /*    grid-column-gap: 10px;*/
    /*}*/

    label {
        align-self: center;
    }

    textarea {
        /*width: ;*/
        border-radius: 5px;
        border: 1px solid lightgrey;
        padding: 5px 10px;
    }

    .user-cust-url-bg > div:last-child {
        /*height: 240px;*/
    }

    .user-cust-url-bg > img {
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
        cursor: pointer;
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


    .row {
        height: 40px;
        border: 1px solid lightgrey;
        border-radius: 3px;

        display: grid;
        grid-template-columns: 30px 200px 1fr 30px;

        margin-top: 10px;
    }

    .row > div:first-child {
        display: grid;
        place-content: center;

    }


    .row > div:first-child > input {
        height: 25px;
        cursor: pointer;
    }


    input {
        outline: none;
        border: none;
        /*padding: 0 10px;*/
        font-size: 13px;

        /*border-left: 1px solid lightgray;*/

        /*width: 50px;*/

        width: 100%;

        /*padding-left: 5px;*/


    }

    .row > input:first-child {
        /*text-align: center;*/
    }


    .icon-select {

    }

    .row > div {
        border-left: 1px solid lightgray;
        height: 100%;
        width: 100%;


        place-self: center;

        display: grid;
        grid-template-columns: 1fr;
        /*place-content: center;*/
        /*place-items: center;*/
    }

    .row > div > i {
        /*height: 100%;*/
        /*line-height: 30px;*/
        place-self: center;
        /*border-left: 1px solid lightgray;*/
        color: red;
        /*margin-left: 5px;*/
    }


    .btn {
        width: 100%;
        margin-top: 10px;

        display: grid;
        grid-row-gap: 10px;
    }

    button {
        height: 40px;
        outline: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: white;
        background-color: #409EFF;
        /*text-shadow: 0 1px 0 #fff;*/

        /*word-spacing: 2px;*/

        letter-spacing: 5px;

        border-radius: 5px;
    }

    button:last-child {
        background-color: orange;
    }

    .user-cust-bg {
        margin-top: 10px;
        display: grid;
        grid-template-columns: 1fr;
        place-content: center;
        place-items: center;
    }

    .img {

        height: 200px;
        width: 200px;

        border: 1px dashed #DCDFE6;;

        display: grid;
        place-content: center;
        place-items: center;
        cursor: pointer;

    }

    .img > img {
        /*height: 300px;*/
        /*width: 300px;*/
    }

    .img > i {
        font-size: 40px;
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
            grid-template-columns: repeat(2, 1fr);
        }

        .biyings-item {
            height: 200px;
        }

        .purecolor-item-colors {
            grid-template-columns: 1fr;
        }

        .user-cust-url-bg > div:last-child {
            /*height: 200px;*/
        }

        span, a, label {
            font-size: 13px;
        }


        .user-cust-url-bg > div:first-child {
            grid-template-columns: auto 1fr;
            grid-row-gap: 5px;
        }

        .user-cust-url-bg button {
            grid-column: 1/3;
            line-height: 40px;
        }


        .row {
            grid-template-columns: 30px 110px 1fr 30px;;
        }
    }


</style>