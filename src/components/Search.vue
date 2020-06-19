<template>
    <div class="module-search">
        <div class="search" id="searchModule">
            <div class="searchEngineDiv">
                <div class="searchEngineShow" @click="searchEngineShow = !searchEngineShow">
                    <!--                        <span :value="searchEngineList[searchEngineIndex].codeValue">{{searchEngineList[searchEngineIndex].codeName}}</span>-->
                    <img :src="searchEngineList.length > 0 ? searchEngineList[searchEngineIndex].icon : ''"
                         class="searchIcon" alt=""/>
                    <i :class="searchEngineShow ? 'fa fa-angle-up' : 'fa fa-angle-down'"></i>
                </div>
                <transition enter-active-class="animated fadeInUp faster"
                            leave-active-class="animated fadeOutDown faster">
                    <ul v-show="searchEngineShow" @focus="inputFocus()">
                        <li v-for="(item, index) in searchEngineList" :key="index" :value="item.url"
                            @click="setSearchEngine(index)">
                            <img :src="item.icon" class="searchIcon"/>
                            <span>{{item.name}}</span>
                        </li>
                    </ul>
                </transition>

            </div>
            <div>
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

        <div class="search-history">
            <div class="trash">
                <i class="fas fa-trash-alt" aria-hidden="true" @click="clearSearchHis()"></i>
            </div>

            <div style="margin-top: 20px;">

            </div>
            <span v-for="(item) in searchHistory" :key="item.uuid"
                  @click="putSearchHis(item.word)"
                  class="search-history-item animated fadeIn">
                    {{item.word}}
            </span>
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
                clearIShow: false
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


            document.addEventListener('mouseup', (e) => {
                // console.log(e.target);
                // console.log((e.target).closest('#searchBox'));
                // console.log((e.target).closest('#searchModule'));
                let target = e.target;
                if (target.closest('#searchModule') == null && target.closest('#searchBox') == null
                    && target.closest('.search-history') == null) {
                    this.$store.commit('uSearchFixShow', false);
                }
            });

            if (localStorage.getItem('searchHistory')) {
                this.searchHistoryOrg = JSON.parse(localStorage.getItem('searchHistory'));
                if (this.searchHistoryOrg.length > 0) {
                    this.searchHistory = [].concat(this.searchHistoryOrg.reverse());
                }
            }


            // window.addEventListener("popstate", function () {
            //     // window.location = 'http://www.baidu.com';
            //     alert(1111);
            //     // this.$store.commit('uSearchFixShow', false);
            // }, false);

        },
        methods: {
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

        font-size: 18px;

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
        background-color: rgba(255, 255, 255, 0.8);
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
        top: 90px;
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
        /*border: 1px solid red;*/

        /*width: 20px;*/
        /*height: 20px;*/
        position: fixed;
        display: inline-block;

        text-align: right;

        font-size: 20px;

        max-width: 1200px;
        width: 95%;

    }

    .search-history > span {

        max-width: 300px;
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
        outline: none;
        background-color: white;
        font-size: 20px;
        display: inline-block;
        margin: 5px;


        text-overflow: ellipsis;
        white-space: nowrap;

    }

    @media screen and (max-width: 700px) {
        .search {
            /*grid-template-columns: 50px 1fr 150px;*/
        }

    }
</style>