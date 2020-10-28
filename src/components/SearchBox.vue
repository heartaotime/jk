<template>
    <div class="module-searchBox">

        <div class="search-fix" v-show="searchFocus"></div>

        <div class="logo animated fadeInDown">
            <img v-show="logoShowType == 'url' && url !== ''" :src="url"/>
            <span v-show="logoShowType == 'time'">{{time}}</span>
            <Weather class="weather" v-show="logoShowType == 'weather'"></Weather>
        </div>

        <div class="card form animated fadeInDown" id="search-form">
            <div class="form-left">
                <div class="show-engine" @click="searchEngineShow = !searchEngineShow,isNeedShowSug = false">
                    <img :src="searchEngineList.length > 0 ? searchEngineList[searchEngineIndex].icon : ''"
                         class="searchIcon"/>
                    <i :class="!searchEngineShow ? 'fa fa-angle-down' : 'fa fa-angle-up'" style="font-size: 15px;"></i>
                </div>

                <!--                <transition enter-active-class="animated fadeInUp faster"-->
                <!--                            leave-active-class="animated fadeOutDown faster"-->
                <!--                            @before-leave="searchengIsLeave = false"-->
                <!--                            @after-leave="searchengIsLeave = true">-->
                <ul v-show="searchEngineShow">
                    <li v-for="(item, index) in searchEngineList" :key="index" :value="item.url"
                        @click="setSearchEngine(index)">
                        <img :src="item.icon" class="searchIcon"/>
                        <span>{{item.name}}</span>
                    </li>
                </ul>
                <!--                </transition>-->
            </div>
            <div class="form-center">
                <div>
                    <!--                    @blur="inputBlur"-->
                    <input type="text" spellcheck="false" id="searchInput" @keyup.enter="search()"
                           @focus="inputFocus" @blur="inputBlur"
                           v-model="searchKey">
                </div>
            </div>
            <div class="form-right" @click="search()">
                <i class="fa fa-search" style="font-size: 15px;"></i>
            </div>
            <div style="clear: both"></div>
            <!--            <transition enter-active-class="animated fadeIn faster"-->
            <!--                        leave-active-class="animated fadeOut faster">-->
            <ul v-show="suggestionShow" class="suggestion" @mousedown="ulMousedown($event)">
                <li v-for="(item, index) in suggestion" :key="item.uuid" :index="index">
                    <!--                            <div @click="sugClick(item.orgSug, true)">-->
                    <!--                                <i class="fa fa-search" aria-hidden="true"></i>-->
                    <!--                            </div>-->
                    <div @click="sugClick(item.orgSug, true)" class="sug-item">
                        <span v-html="item.sug"></span>
                    </div>
                    <div @click="sugClick(item.orgSug, false)">
                        <i class="fa fa-pencil-alt" aria-hidden="true"></i>
                    </div>
                </li>

                <li class="clear-search-his" @click="clearSearchHis()" v-show="searchKey === ''">
                    <div>
                        <i class="fas fa-trash-alt" aria-hidden="true" style="font-size: 15px;"></i>
                        <span>清空</span>
                    </div>
                </li>
            </ul>
            <!--            </transition>-->
        </div>
    </div>


</template>

<script>

    import Weather from "./Weather";

    export default {
        name: 'SearchBox',
        props: {
            // msg: String
        },
        components: {
            Weather
        },
        data() {
            return {
                searchengIsLeave: true,
                searchFocus: false,
                yiyan: {},
                yiyanStr: '',
                logoShowType: 'none',
                url: '',
                time: '',
                enterClass: 'animated fadeInUp faster',
                leaveClass: 'animated fadeOutDown faster',
                suggestion: [],
                searchHistory: [],
                searchHistoryOrg: [],
                isPhone: false,
                searchEngineList: [],
                searchEngineShow: false,
                searchEngineIndex: 0,
                searchKey: '',
                isNeedShowSug: false,
            }
        },
        computed: {
            openUserInfo() {
                return JSON.parse(JSON.stringify(this.$store.getters.openUserInfo));
            },
            suggestionShow() {
                // 是否展示有3个条件，1.动画完成 2.需要展示 2.suggestion的长度大于0
                return this.searchengIsLeave && this.isNeedShowSug && this.suggestion.length > 0;
            }
        },
        watch: {
            openUserInfo: {
                handler() {
                    // 获取Logo
                    this.logoShowType = this.openUserInfo.ext.logo.logoShowType;
                    this.url = this.openUserInfo.ext.logo.url;

                    this.searchEngineList = this.openUserInfo.ext.searchEngineList.concat();
                    console.log('SearchBox getSearchEngine from openUserInfo, ', this.searchEngineList);
                    for (let i = 0; i < this.searchEngineList.length; i++) {
                        let isDefault = this.searchEngineList[i].isDefault;
                        if (isDefault) {
                            this.searchEngineIndex = i;
                            break;
                        }
                    }

                },
                deep: true
            },
            searchKey() {
                this.isNeedShowSug && this.getSug();
            }
        },
        created() {
        },
        mounted() {
            this.getSearchHis();
            this.getYiyan();
            setInterval(() => {
                let now = new Date();
                let hours = now.getHours() > 9 ? now.getHours() : '0' + now.getHours();
                let minutes = now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes();
                // let seconds = now.getSeconds() > 9 ? now.getSeconds() : '0' + now.getSeconds();
                this.time = hours + ':' + minutes;
            }, 1000);
            // document.addEventListener('click', (ele) => {
            //     console.log(ele.target.id);
            //     if (ele.target.id !== 'search-form' && ele.target.id !== 'searchInput') {
            //         this.isNeedShowSug = false;
            //     }
            // })
        },
        methods: {
            ulMousedown(event) {
                let target = event.target;
                // console.log(target);
                if (target && target.preventDefault) {
                    target.preventDefault();
                } else {
                    window.event.returnValue = false;
                }
            },
            clearSearchHis() {
                this.searchHistory = [];
                this.searchHistoryOrg = [];
                localStorage.removeItem('searchHistory');
                this.suggestion = [];
            },
            getSug() {
                if (this.searchKey === '') {
                    this.suggestion = []
                    for (let i = 0; i < this.searchHistory.length; i++) {
                        this.suggestion.push({
                            uuid: this.Utils.generateUUID(),
                            sug: this.searchHistory[i].word,
                            orgSug: this.searchHistory[i].word
                        });
                    }
                } else {
                    let url = 'https://suggestion.baidu.com/su?callback=sug&wd=' + this.searchKey + '&cb=sug&_=' + new Date().getTime();
                    window.sug = (result) => {
                        // console.log(result);
                        this.suggestion = [];
                        if (result && result.s && result.s.length > 0) {
                            let data = result.s;
                            let size = data.length > 6 ? 6 : data.length;
                            for (let i = 0; i < size; i++) {
                                this.suggestion.push({
                                    uuid: this.Utils.generateUUID(),
                                    sug: data[i].replace(this.searchKey, '<b>' + this.searchKey + '</b>'),
                                    orgSug: data[i]
                                });
                            }
                        }
                    }
                    var JSONP = document.createElement("script");
                    JSONP.type = "text/javascript";
                    JSONP.src = `${url}&callback=sug`;
                    document.getElementsByTagName("head")[0].appendChild(JSONP);
                    setTimeout(() => {
                        JSONP.remove();
                    }, 500);
                }
            },
            getSearchHis() {
                if (localStorage.getItem('searchHistory')) {
                    this.searchHistoryOrg = JSON.parse(localStorage.getItem('searchHistory'));
                    if (this.searchHistoryOrg.length > 0) {
                        this.searchHistory = [].concat(this.searchHistoryOrg.reverse());
                    }
                }
            },
            sugClick(sug, search) {
                // document.querySelector('#searchInput').focus();
                // this.searchKey = sug.replace('<b>', '').replace('</b>', '');
                if (search) {
                    this.searchKey = sug;
                    this.search();
                } else {
                    this.isNeedShowSug = true; // 需要刷新sug
                    this.searchKey = sug;
                }

            },
            inputFocus() {
                // this.$store.commit('uSearchFixShow', true);
                // history.pushState({page: 1}, "搜索", "?page=search");

                // 1.创建一个全屏的毛玻璃效果的div，并且他的z-index < form 的 z-index
                this.searchFocus = true;

                history.pushState(null, '搜索', null);

                this.searchEngineShow = false; // 取消展示搜索引擎
                this.isNeedShowSug = true; // 需要展示搜索建议
                this.getSug(); // 开始搜索

            },
            inputBlur() {
                //  alert('inputBlur');
                this.searchFocus = false;
                this.searchEngineShow = false;
                this.isNeedShowSug = false;
                setTimeout(() => {
                    // 防止立刻隐藏后，导致的 sugClick 触发不了
                    // this.isNeedShowSug = false;
                }, 300);
            },
            setSearchEngine(index) {
                this.searchEngineIndex = index;
                for (let i = 0; i < this.searchEngineList.length; i++) {
                    this.searchEngineList[i].isDefault = false;
                }
                this.searchEngineList[index].isDefault = true;

                this.openUserInfo.ext.searchEngineList = this.searchEngineList;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);

                this.searchEngineShow = false;

                // document.querySelector('#searchInput').focus();

                // 强制更新数组，让vue可以监听到数组的变化
                // this.$set(this.searchEngineList, index, this.searchEngineList[index]);
            },
            search() {
                // 移除焦点
                this.searchEngineShow = false; // 取消展示搜索引擎
                this.isNeedShowSug = false; // 不需要展示搜索建议
                document.querySelector('#searchInput').blur();

                // window.open(this.searchEngineList[this.searchEngineIndex].url.replace("%s", this.searchKey));
                this.Utils.go2Link(this.searchEngineList[this.searchEngineIndex].url.replace("%s", this.searchKey));

                if (this.searchKey !== '') {

                    let needSave = true;
                    for (let i = 0; i < this.searchHistoryOrg.length; i++) {
                        if (this.searchKey === this.searchHistoryOrg[i].word) {
                            needSave = false;
                            break;
                        }
                    }
                    if (needSave) {
                        // 最多存储 6 个
                        if (this.searchHistoryOrg.length > 5) {
                            this.searchHistoryOrg.splice(0, 1);
                        }
                        this.searchHistoryOrg.push({
                            uuid: this.Utils.generateUUID(),
                            word: this.searchKey
                        });
                        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistoryOrg));
                        this.searchHistory = [];
                        for (let i = this.searchHistoryOrg.length - 1; i >= 0; i--) {
                            this.searchHistory.push(this.searchHistoryOrg[i]);
                        }
                    }
                }

                this.searchKey = '';


                // setTimeout(() => {
                //     this.searchKey = '';
                //     // document.querySelector('#searchInput').focus();
                // }, 500);
            },
            getYiyan() {
                let url = 'https://v1.hitokoto.cn';
                this.Utils.getJson(url, {}).then(response => {
                    if (!response || response.hitokoto === '') {
                        return;
                    }
                    this.yiyan = response;
                    this.yiyanStr = response.hitokoto + '  from~ ' + response.from;

                    document.title = document.title + '-' + this.yiyanStr;
                });
            }

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


    .module-searchBox {

        max-width: 1200px;

        width: 95%;

        /*height: 90vh;*/


        margin: 10% auto 0;

        display: grid;
        grid-template-columns: 1fr;
        place-content: center;
        place-items: center;

        /*overflow-x: hidden;*/
        /*overflow-y: hidden;*/

    }

    .logo {
        width: 100%;
        height: 108px;
        text-align: center;
        background: transparent;

        display: grid;
        place-content: center;
        place-items: center;
    }

    .logo > img {
        height: 108px;
        max-width: 250px;
    }

    .logo > span {
        font-size: 50px;
        /*line-height: 108px;*/
        letter-spacing: 10px;
    }

    .logo > .weather {
        /*background-color: rgba(255, 255, 255, 0.2);*/
        pointer-events: none;
    }

    .row {
        width: 98vw;
        max-width: 500px;

        display: grid;
        grid-template-columns: 2fr 8fr 1fr;
        justify-content: space-between;
        justify-items: center;
        align-content: center;
        align-items: center;
    }

    .search-fix {

        visibility: visible;
        opacity: 0.55;

        width: 100%;
        height: 100%;

        /*background-color: rgb(255, 255, 255, 0.5);*/
        background: #000;

        z-index: 5;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }


    .form {

        z-index: 10;

        margin: 20px 0 5px;

        width: 95%;
        max-width: 500px;

        $height: 45px;
        $div1-width: 15%;
        $div3-width: 8%;
        $div2-width: calc(100% - #{$div1-width} - #{$div3-width});


        > div {
            float: left;

            &:nth-child(1) {
                width: $div1-width;
            }

            &:nth-child(2) {
                width: $div2-width;
                cursor: pointer;
            }

            &:nth-child(3) {
                width: $div3-width;
                float: right;
                line-height: $height;
                cursor: pointer;
                text-align: center;
            }
        }


        border-radius: $height;
        box-shadow: 0 0 18px rgba(70, 70, 40, .255);
        background-color: rgba(255, 255, 255, 0.4);
        /*background-color: white;*/
        height: $height;

        .form-left {
            .show-engine {
                height: $height;
                width: 100%;
                display: grid;
                grid-template-columns: repeat(2, auto);
                justify-content: center;
                align-content: center;
                align-items: center;
                grid-column-gap: 5px;
                cursor: pointer;
            }

            ul {
                // margin-top: calc(#{$height + 2px});
                margin-top: 2px;
                z-index: 1;
                border-radius: 5px;
                box-shadow: 0 0 18px rgba(70, 70, 40, .255);
                border-top: none;
                background-color: rgba(255, 255, 255, 0.9);
                width: 120px;

                li {
                    list-style: none;
                    cursor: pointer;
                    padding-left: 15px;
                    line-height: calc(#{$height} - 2px);
                    display: grid;
                    grid-template-columns: repeat(2, auto);
                    grid-column-gap: 10px;
                    justify-content: start;
                    align-content: center;
                    place-items: center;
                    border-bottom: 1px dashed #DCDFE6;

                    &:last-child {
                        border-bottom: none;
                    }

                    &:hover {
                        border-radius: 5px;
                        background-color: #ecf5ff;
                        color: #409EFF;
                    }
                }
            }
        }

        .form-center {
            input {
                width: 100%;
                font-size: 18px;
                background-color: transparent;
                outline: none;
                border: none;
                line-height: $height;

                &::-webkit-input-placeholder {
                    color: #333;
                }
            }
        }

        .suggestion {
            width: 98%;
            margin: 0 auto;
            margin-top: calc(#{$height} + 2px);
            font-size: 13px;
            z-index: 1;
            border-radius: 5px;
            box-shadow: 0 0 18px rgba(70, 70, 40, .255);
            background-color: rgba(255, 255, 255, 0.9);

            li {
                list-style: none;
                cursor: pointer;
                line-height: calc(#{$height} - 2px);
                display: grid;
                grid-template-columns: 1fr 50px;
                align-content: center;
                align-items: center;
                border-bottom: 1px dashed #DCDFE6;

                &:last-child {
                    border-bottom: none;
                }

                &:hover {
                    border-radius: 5px;
                    background-color: #ecf5ff;
                    color: #409EFF;
                }

                .sug-item {
                    padding-left: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                > div {
                    &:last-child {
                        text-align: center;
                    }
                }
            }

            .clear-search-his {
                line-height: 30px;

                > div {
                    grid-column: 1/3;
                    color: #9a9a9e;

                    span {
                        margin-left: 5px;
                    }
                }

                &:hover > div {
                    color: red;
                }
            }
        }
    }


    .eng-list {
        @extend .row;

        width: 98vw;
        max-width: 500px;
        grid-template-columns: 1fr;
        justify-content: left;
        justify-items: left;
        align-content: center;
        align-items: center;


    }


    .searchIcon {
        width: 23px;
        height: 23px;
    }


    .suggest {
        -webkit-animation: fadeInDown 0.2s;
        animation: fadeInDown 0.2s;
        /*display: none;*/
        position: absolute;
        text-align: left;
        border-radius: 10px;
        box-shadow: 0 0 18px rgba(70, 70, 40, .255);
        border-top: none;
        background-color: rgba(255, 255, 255, 0.7);
        width: 100%;
    }

    .suggest a {
        display: inherit;
        margin-top: 1px;
        margin-bottom: 2px;
        line-height: 35px;
        padding: 0px 20px;
        border-radius: 10px;
    }

    .boxs {
        display: -webkit-flex; /* Safari */
        display: flex;
        margin: 40px auto;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    .icon {
        width: 45px;
        height: 45px;
        border: none;
    }

    .url {
        margin-top: 5px;
        font-size: 13px;
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 5px;
        padding: 0 2px;
    }


    .boxs a:hover {
        -webkit-animation: fadeInS 2s;
        animation: fadeInS 2s;
        margin-top: -5px;
    }


    .item {
        display: -webkit-flex;
        display: flex;
        flex-direction: column; /*主轴为垂直方向，起点在上沿*/
        justify-content: center;
        align-items: center;
    }

    .suggest span {
        border-radius: 10px;
        /*line-height: 35px;*/
        text-align: center;
        display: inherit;
        cursor: pointer;
        color: darkgray;
    }

    .search-engines {
        -webkit-animation: fadeInDown 0.2s;
        animation: fadeInDown 0.2s;
        display: none;
        position: absolute;
        text-align: left;
        border-radius: 10px;
        box-shadow: 0 0 18px rgba(70, 70, 40, .255);
        border-top: none;
        background-color: rgba(255, 255, 255, 0.7);
        width: 110px;

        a {
            cursor: pointer;
            display: inherit;
            margin-top: 1px;
            margin-bottom: 2px;
            line-height: 35px;
            padding: 0px 20px;
            border-radius: 10px;
            font-size: 15px;
        }
    }

    @media screen and (max-width: 600px) {
        .module-searchBox {
            margin: 20% auto 0;
            /*grid-template-columns: 1fr;*/
        }

        .form {
            $div1-width: 20%;
            $div3-width: 12%;
            $div2-width: calc(100% - #{$div1-width} - #{$div3-width});

            > div {
                &:nth-child(1) {
                    width: $div1-width;
                }

                &:nth-child(2) {
                    width: $div2-width;
                }

                &:nth-child(3) {
                    width: $div3-width;
                }
            }

            .form-center {
                input {
                    font-size: 15px;
                }
            }

        }
    }


</style>
