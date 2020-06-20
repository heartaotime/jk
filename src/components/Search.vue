<template>
    <div class="module-search" @click="clickFunc($event)">


        <!--        <transition enter-active-class="animated fadeInUp"-->
        <!--                          leave-active-class="animated fadeOutDown faster" class="">-->

        <div class="search animated fadeInUp" id="searchModule">
            <div class="searchEngineDiv">
                <div class="searchEngineShow" @click="searchEngineShow = !searchEngineShow">
                    <!--                        <span :value="searchEngineList[searchEngineIndex].codeValue">{{searchEngineList[searchEngineIndex].codeName}}</span>-->
                    <img :src="searchEngineList.length > 0 ? searchEngineList[searchEngineIndex].icon : ''"
                         class="searchIcon" alt=""/>
                    <i v-show="!isPhone" :class="searchEngineShow ? 'fa fa-angle-up' : 'fa fa-angle-down'"></i>
                    <i v-show="isPhone" :class="!searchEngineShow ? 'fa fa-angle-up' : 'fa fa-angle-down'"></i>
                </div>

                <transition :enter-active-class="enterClass"
                            :leave-active-class="leaveClass">
                    <ul v-show="searchEngineShow" @focus="inputFocus()">
                        <li v-for="(item, index) in searchEngineList" :key="index" :value="item.url"
                            @click="setSearchEngine(index)">
                            <img :src="item.icon" class="searchIcon"/>
                            <span>{{item.name}}</span>
                        </li>
                    </ul>
                </transition>

            </div>
            <div style="padding: 0 10px;">
                <input id="search" placeholder="请输入关键字，回车搜索~~~" @keyup.enter="search()" @focus="inputFocus()"
                       v-model="searchKey"
                       spellcheck="false"/>
            </div>

            <div class="search-clear">
                <i class="fas fa-times" aria-hidden="true" v-show="clearIShow" @click="clearSearchKey()"></i>
            </div>

            <div class="search-fa">
                <span @click="close()">{{showName}}</span>
            </div>
        </div>
        <!--        </transition>-->

        <div class="search-history animated fadeInUp" v-show="searchKey === ''">
            <div class="trash" v-show="searchHistory.length > 0">
                <i class="fas fa-trash-alt" aria-hidden="true" @click="clearSearchHis()"></i>
            </div>

            <transition-group enter-active-class="animated fadeInLeft"
                              leave-active-class="animated fadeOutRight faster" class="search-history-items">
                <span v-for="(item) in searchHistory" :key="item.uuid"
                      @click="putSearchHis(item.word)"
                      class="search-history-item">
                        {{item.word}}
                </span>
            </transition-group>
        </div>

        <div v-show="searchKey !== ''">
            <transition-group :enter-active-class="enterClass_sug" class="suggestion">
                <div v-for="(item) in suggestion" :key="item.uuid" class="suggestion-item">
                    <div @click="sugClick(item.sug, true)"><i class="fa fa-search" aria-hidden="true"></i></div>
                    <div @click="sugClick(item.sug, true)"><span v-html="item.sug"></span></div>
                    <!--                    <div @click="sugClick(item.sug, false)"><i class="fa fa-mouse-pointer" aria-hidden="true"></i></div>-->
                    <div @click="sugClick(item.sug, false)"><i class="fa fa-pencil-alt" aria-hidden="true"></i></div>
                </div>
            </transition-group>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Search",
        data() {
            return {
                searchKey: '',
                searchBtn: '百度一下',
                searchHotWord: [{
                    title: ''
                }],
                searchEngineList: [],
                searchEngineShow: false,
                searchEngineIndex: 0,
                showHover: false,
                phone: true,
                searchHistory: [],
                searchHistoryOrg: [],
                showName: '取消',
                clearIShow: false,
                enterClass: 'animated fadeInUp faster',
                leaveClass: 'animated fadeOutDown faster',
                suggestion: [],
                enterClass_sug: 'animated fadeInUp',
                isPhone: false
            }
        },
        computed: {
            openUserInfo() {
                return JSON.parse(JSON.stringify(this.$store.getters.openUserInfo));
            },
            searchFixShow() {
                return this.$store.getters.searchFixShow;
            },
        },
        watch: {
            openUserInfo: {
                handler() {
                    // this.getSearchEngine();
                    this.searchEngineList = this.openUserInfo.ext.searchEngineList.concat();
                    // alert('SearchBox getSearchEngine from openUserInfo, ' + this.searchEngineList.length);
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
            searchFixShow() {
                if (this.searchFixShow) {
                    document.querySelector('#search').focus();
                }
            },
            searchKey() {
                if (this.searchKey !== '') {
                    this.showName = '搜索';
                    // 展示清空按钮
                    this.clearIShow = true;

                    // 获取推荐 https://suggestion.baidu.com/su?callback=sug&wd=21&cb=sug&_=1592621056387

                    let url = 'https://suggestion.baidu.com/su?callback=sug&wd=' + this.searchKey + '&cb=sug&_=' + new Date().getTime();
                    // this.Utils.getJson(url, {}).then(response => {
                    //     console.log(response);
                    // })

                    window.sug = (result) => {
                        // console.log(result);
                        this.suggestion = [];
                        if (result && result.s && result.s.length > 0) {
                            let data = result.s;
                            for (let i = 0; i < data.length; i++) {
                                this.suggestion.push({
                                    uuid: this.Utils.generateUUID(),
                                    sug: data[i].replace(this.searchKey, '<b>' + this.searchKey + '</b>')
                                });
                            }
                            if (this.Utils.isPhone()) {
                                this.suggestion = this.suggestion.reverse();
                            }
                        }
                    }
                    var JSONP = document.createElement("script");
                    JSONP.type = "text/javascript";
                    JSONP.src = `${url}&callback=sug`;
                    document.getElementsByTagName("head")[0].appendChild(JSONP);
                    setTimeout(() => {
                        document.getElementsByTagName("head")[0].removeChild(JSONP);
                    }, 500);

                    // axios.jsonp(url, params)
                    //     .then(res => console.log(res))
                    //     .catch(err => console.log(err))

                    // $.ajax({
                    //     url: "https://suggestion.baidu.com/su",
                    //     type: "GET",
                    //     dataType: "jsonp",
                    //     data: {wd: wd, cb: "sug"},
                    //     timeout: 5000,
                    //     jsonpCallback: "sug",
                    //     success: function (res) {
                    //         if ($(_).val() !== wd) {
                    //             return;
                    //         }
                    //         var data = res.s;
                    //         var isStyle = $(".suggestion").html();
                    //         var html = "";
                    //         for (var i = data.length; i > 0; i--) {
                    //             var style = "";
                    //             if (isStyle === "") {
                    //                 style = "animation: fadeInDown both .5s " + (i - 1) * 0.05 + 's"';
                    //             }
                    //             html += '<li style="' + style + '"><div>' + data[i - 1].replace(wd, '<b>' + wd + '</b>') + "</div><span></span></li>";
                    //         }
                    //         $(".suggestion").show().html(html).scrollTop($(".suggestion")[0].scrollHeight);
                    //     }
                    // });
                    // $.ajax({
                    //     url: "https://quark.sm.cn/api/qs",
                    //     type: "GET",
                    //     dataType: "jsonp",
                    //     data: {query: wd},
                    //     timeout: 5000,
                    //     success: function (res) {
                    //         var data = res.data;
                    //         var html = '<li>快搜:</li>';
                    //         for (var i = 0, l = data.length; i < l; i++) {
                    //             html += '<li>' + data[i] + '</li>';
                    //         }
                    //         $('.shortcut3').html(html);
                    //     }
                    // });


                } else {
                    this.showName = '取消';
                    this.clearIShow = false;
                }


            }
        },
        created() {

        },
        mounted() {
            // document.addEventListener('mouseup', (e) => {
            //     console.log(e.target);
            //     if (!(e.target).closest('#searchModule', '#searchBox')) {
            //         this.$store.commit('uSearchFixShow', false);
            //     }
            // });


            // document.addEventListener('mouseup', (e) => {
            //     console.log(e.target);
            //     // console.log((e.target).closest('#searchBox'));
            //     // console.log((e.target).closest('#searchModule'));
            //     let target = e.target;
            //     if (target.closest('#searchModule') == null
            //         && target.closest('#searchBox') == null
            //         && target.closest('.search-history') == null
            //         && target.closest('.suggestion') == null) {
            //         this.$store.commit('uSearchFixShow', false);
            //     }
            // });

            if (localStorage.getItem('searchHistory')) {
                this.searchHistoryOrg = JSON.parse(localStorage.getItem('searchHistory'));
                if (this.searchHistoryOrg.length > 0) {
                    this.searchHistory = [].concat(this.searchHistoryOrg.reverse());
                }
            }

            if (this.Utils.isPhone()) {
                this.isPhone = true;
                this.enterClass = 'animated fadeInDown faster';
                this.leaveClass = 'animated fadeOutUp faster';
                this.enterClass_sug = 'animated fadeInDown';
            }


            // window.addEventListener("popstate", function () {
            //     // window.location = 'http://www.baidu.com';
            //     alert(1111);
            //     // this.$store.commit('uSearchFixShow', false);
            // }, false);

        },
        methods: {
            clickFunc(evt) {
                if (evt.target === evt.currentTarget) {
                    this.$store.commit('uSearchFixShow', false);
                }
            },
            sugClick(sug, search) {
                this.searchKey = sug.replace('<b>', '').replace('</b>', '');
                if (search) {
                    this.search();
                }

            },
            clearSearchKey() {
                this.searchKey = '';
            },
            inputFocus() {
                this.searchEngineShow = false;
            },
            search() {
                window.open(this.searchEngineList[this.searchEngineIndex].url.replace("%s", this.searchKey));

                if (this.searchKey !== '') {

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


                setTimeout(() => {
                    this.searchKey = '';
                }, 500);
            },
            // getSearchEngine() {
            //     this.searchEngineList = this.openUserInfo.ext.searchEngineList.concat();
            //     console.log('enter SearchBox getSearchEngine, ', this.searchEngineList);
            //     if (this.searchEngineList.length > 0) {
            //         return;
            //     }
            //     console.log('getSearchEngine from openUserInfo is null, next step getSearchEngine from server!');
            //     this.Utils.getSearchEngine(list => {
            //         this.searchEngineList = list;
            //     })
            //
            // },
            setSearchEngine(index) {
                this.searchEngineIndex = index;
                this.searchEngineShow = false;

                for (let i = 0; i < this.searchEngineList.length; i++) {
                    this.searchEngineList[i].isDefault = false;
                }
                this.searchEngineList[index].isDefault = true;

                this.openUserInfo.ext.searchEngineList = this.searchEngineList;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);

                // 强制更新数组，让vue可以监听到数组的变化
                // this.$set(this.searchEngineList, index, this.searchEngineList[index]);
            },
            close() {
                if (this.clearIShow) {
                    this.search();
                } else {
                    this.$store.commit('uSearchFixShow', false);
                }
            },
            clearSearchHis() {
                this.searchHistory = [];
                this.searchHistoryOrg = [];
                localStorage.removeItem('searchHistory');
            },
            putSearchHis(word) {
                this.searchKey = word;
            }
        }
    }
</script>

<style scoped>

    .module-search {


        z-index: 2;
        /*background-color: rgba(255, 255, 255, 1);*/
        background-color: whitesmoke;


        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;


        width: 100%;
    }

    .search {

        max-width: 1200px;
        width: 95%;
        position: fixed;
        top: 20px;
        bottom: unset;
        left: 0px;
        right: 0px;

        margin: 0 auto;
        /*margin-top: calc(100vh - 120px);*/

        border-radius: 5px;
        outline: none;
        -webkit-box-shadow: inset 0 1px 2px rgba(27, 31, 35, .075), 0 0 0 0.2em rgba(3, 102, 214, .3);
        box-shadow: inset 0 1px 2px rgba(27, 31, 35, .075), 0 0 0 0.2em rgba(3, 102, 214, .3);


        display: grid;
        grid-template-rows: 50px;
        grid-template-columns: 50px 1fr 30px 50px;

    }

    .search-clear {
        cursor: pointer;
        line-height: 50px;
        text-align: center;
    }

    .search-fa {
        cursor: pointer;
        line-height: 50px;
        text-align: center;
    }

    /*.search-fa i, span {*/
    /*    font-size: 20px;*/

    /*    align-self: center;*/
    /*    line-height: 50px;*/
    /*    text-align: center;*/
    /*}*/

    .search-fa > div {
        text-align: center;
    }

    .search-fa > div > i {
        font-size: 18px;

        align-self: center;
        line-height: 50px;
        text-align: center;
    }


    .search-fa > span {

        font-size: 16px;

        align-self: center;
        line-height: 50px;
        text-align: center;
        padding: 0 5px

    }

    .search-left img {
        width: 100px;
        height: 35px;
    }


    .searchEngineDiv {
        width: 100%;
        margin: 0 auto;
        border-radius: 3px 0 0 3px;

        /*height: 50px;*/


        /*border: 1px solid #DCDFE6;*/

        /*box-shadow: 0 0 18px rgba(70, 70, 40, .255);*/
        /*background-color: rgba(255, 255, 255, 0.7);*/


    }

    .searchEngineShow {
        padding-left: 5px;
        display: grid;
        grid-template-columns: 4fr 1fr;
        grid-template-rows: 50px;
        /*justify-content: space-between;*/
        align-content: center;
        place-items: center;

        grid-column-gap: 5px;
        background-color: transparent;
    }

    .searchEngineShow:hover {
        cursor: pointer;
    }

    .searchEngineDiv i {
        width: 100%;
    }

    ul {

        position: relative;

        z-index: 1;

        margin-top: 5px;
        border-radius: 5px;
        box-shadow: 0 0 18px rgba(70, 70, 40, .255);
        border-top: none;
        background-color: transparent;
        background-color: rgba(255, 255, 255, 0.9);
        /*width: 100%;*/
        width: 120px;
    }

    ul li {
        list-style: none;
        cursor: pointer;
        padding-left: 15px;

        line-height: 40px;


        display: grid;
        grid-template-columns: repeat(2, auto);
        grid-column-gap: 10px;
        justify-content: start;
        align-content: center;
        place-items: center;
        border-bottom: 1px dashed #DCDFE6;
    }

    ul li:last-child {
        border-bottom: none;
    }


    ul li:hover {
        border-radius: 3px;
        background-color: #ecf5ff;
        color: #409EFF;
    }


    .searchIcon {
        width: 20px;
        height: 20px;
    }

    input {
        outline: none;
        border: none;


        width: 100%;
        height: 100%;

        padding: 0 10px;

        background-color: transparent;
        /*background-color: rgba(255, 255, 255, 0.7);*/

        font-size: 16px;

    }

    input:focus {
        /*border: none;*/
    }


    button {
        /*width: 100px;*/
        /*height: 37px;*/
        background-color: #409EFF;
        /*border: none;*/
        outline: none;
        border: none;
        /* color: white; */
        font-size: 16px;
        cursor: pointer;
        /*color: #fff;*/
        font-weight: bold;

        /*color: #8590a6;*/

        color: white;

        /*background-color: #f2f2f2;*/
        /*text-shadow: 0 1px 0 #fff;*/
        /*border: 3px solid #ccd8e1;*/

        /*border-left: 1px solid #ccd8e1;*/

        border-radius: 0 5px 5px 0;

    }

    .search-history {
        max-width: 1200px;
        width: 95%;
        position: fixed;
        z-index: -1;
        top: 80px;
        bottom: unset;
        left: 0px;
        right: 0px;

        margin: 0 auto;
        /*margin-top: calc(100vh - 120px);*/

        /*border-radius: 5px;*/
        /*outline: none;*/
        /*-webkit-box-shadow: inset 0 1px 2px rgba(27, 31, 35, .075), 0 0 0 0.2em rgba(3, 102, 214, .3);*/
        /*box-shadow: inset 0 1px 2px rgba(27, 31, 35, .075), 0 0 0 0.2em rgba(3, 102, 214, .3);*/

        /*display: grid;*/

        /*grid-template-columns: repeat(auto-fill, auto);*/
    }

    .search-history > .trash {
        position: relative;
        display: inline-block;

        text-align: right;

        font-size: 20px;

        max-width: 1200px;
        width: 100%;

        margin-bottom: 10px;

    }

    .search-history-items {
        max-width: 1200px;
        width: 100%;
        margin-bottom: 10px;
        white-space: unset;
    }

    .search-history-item {
        max-width: 300px;
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
        outline: none;
        background-color: white;
        font-size: 15px;
        display: inline-block;
        margin: 5px;

        line-height: 20px;


        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .suggestion {
        max-width: 1200px;
        width: 95%;
        position: fixed;
        z-index: -1;
        top: 90px;
        bottom: unset;
        left: 0px;
        right: 0px;
        margin: 0 auto;
    }

    .suggestion-item {

        display: grid;
        grid-template-columns: 50px 1fr 50px;
        align-content: center;
        align-items: center;

        font-size: 15px;

        border-bottom: 1px dashed #DCDFE6;

        line-height: 50px;

    }

    .suggestion-item:first-child {
        border-top: 1px dashed #DCDFE6;
    }

    .suggestion-item > div {
        cursor: pointer;
    }

    .suggestion-item > div:first-child {
        align-self: center;
        justify-self: stretch;
        text-align: center;
    }

    .suggestion-item > div:last-child {
        align-self: center;
        justify-self: stretch;
        text-align: center;
    }

    .suggestion-item > div:nth-child(2) {
        display: grid;
    }

    @media screen and (max-width: 700px) {
        .search {
            top: unset;
            bottom: 20px;
            /*grid-template-columns: 50px 1fr 150px;*/
        }

        ul {
            position: fixed;
            bottom: 80px;
        }

        .search-history > .trash {
            /*position: relative;*/
            /*right: -10px;*/
        }

        .search-history {
            top: unset;
            bottom: 80px;
        }

        .suggestion {
            top: unset;
            bottom: 80px;
        }


    }
</style>