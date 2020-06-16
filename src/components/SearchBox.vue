<template>
    <div class="card module-searchBox">


        <!--            <div class="row">-->
        <!--                <div></div>-->
        <!--                <div class="search-li">-->
        <!--                    <a v-for="(item, index) in searchList" :key="index" :type="item.type"-->
        <!--                       @click="changeSearchType(item.type)"-->
        <!--                       :class="{'search-li-active':item.active}">{{item.desc}}</a>-->
        <!--                </div>-->
        <!--                <div></div>-->
        <!--            </div>-->
        <div class="row row1">
            <!--                <div class="col1">-->
            <!--                    <a><img :src="searchImg" alt="首页"></a>-->
            <!--                </div>-->
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
            <!--                <i class="fa fa-search" style="font-size: 20px;"></i>-->
            <input v-model="searchKey" @keyup.enter="search()" @focus="inputFocus()" @blur="inputBlur()"
                   spellcheck="false"
            />
            <button @click="search()" v-if="!this.Utils.isPhone()">{{searchEngineList.length > 0 ?
                searchEngineList[searchEngineIndex].name : ''}}
            </button>

            <div v-if="this.Utils.isPhone()" class="search-fa">
                <i class="fa fa-search" aria-hidden="true" @click="search()"></i>
            </div>
        </div>

        <!--        <div class="engines">-->
        <!--            <transition enter-active-class="animated fadeInUp faster"-->
        <!--                        leave-active-class="animated fadeOutDown faster">-->
        <!--                <ul v-show="searchEngineShow" @focus="inputFocus()">-->
        <!--                    <li v-for="(item, index) in searchEngineList" :key="index" :value="item.url"-->
        <!--                        @click="setSearchEngine(index)">-->
        <!--                        <img :src="item.icon" class="searchIcon"/>-->
        <!--                        <span>{{item.name}}</span>-->
        <!--                    </li>-->
        <!--                </ul>-->
        <!--            </transition>-->
        <!--        </div>-->

        <div class="row row2" style="display: none">
            <!--            <div><span>热点:</span></div>-->
            <div class="hotWordDiv">
                <a v-for="(item,index) in searchHotWord" :key="index" class="hotWord animated" target="_blank"
                   :href="'https://www.toutiao.com' + item.open_url"
                   :title="item.title">
                            <span class="">
                                <i class="fas fa-hand-point-right" aria-hidden="true"></i> {{item.title}}
                            </span>
                </a>
            </div>
            <!--            <div></div>-->
        </div>
    </div>

</template>

<script>

    export default {
        // name: 'HelloWorld',
        props: {
            // msg: String
        },
        components: {},
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
                phone: true
            }
        },
        computed: {
            openUserInfo() {
                return this.$store.getters.openUserInfo;
            },
        },
        watch: {
            openUserInfo: {
                handler() {
                    // alert(1);
                    // this.getSearchEngine();
                    this.searchEngineList = this.openUserInfo.ext.searchEngineList;
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
        },
        created() {
        },
        mounted() {
        },
        methods: {
            changeSearchType: function (searchType) {
                for (let i = 0; i < this.searchList.length; i++) {
                    this.searchList[i].active = false;
                    if (this.searchList[i].type === searchType) {
                        this.searchList[i].active = true;
                        this.searchImg = './img/' + searchType + '.gif';
                        this.searchBtn = this.searchList[i].name;
                    }
                }
            },
            search() {
                const that = this;
                window.open(this.searchEngineList[this.searchEngineIndex].url.replace("%s", this.searchKey));
                setTimeout(function () {
                    that.searchKey = '';
                }, 500);
            },
            getSearchEngine() {
                this.searchEngineList = this.openUserInfo.ext.searchEngineList;
                console.log('enter SearchBox getSearchEngine, ', this.searchEngineList);
                if (this.searchEngineList.length > 0) {
                    return;
                }
                console.log('getSearchEngine from openUserInfo is null, next step getSearchEngine from server!');
                this.Utils.getSearchEngine(list => {
                    this.searchEngineList = list;
                })

            },
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
            inputFocus() {
                this.searchEngineShow = false;
                // let div = '<div name="tmp" style="width: 100%; height: 100%; z-index: 999; position:fixed; background-color: rgba(255, 255, 255, 0.6);"></div>';
                // document.body.append(div);

                // var div = document.createElement("div");
                // let style = 'width: 100%; height: 100%; z-index: 999; position:fixed; top: 0; background-color: rgba(255, 255, 255, 0.6);';
                // div.setAttribute('name', 'tmp');
                // div.setAttribute('style', style);
                // document.body.appendChild(div);

            },
            inputBlur() {
                // document.querySelector('[name=tmp]').remove();
            },
            getrealTimeNews() {
                let width = document.body.clientWidth;
                const that = this;
                const url = '/toutiao/api/pc/realtime_news/';
                this.Utils.getJson(url, {}).then(response => {
                    that.searchHotWord = [];
                    if (response && response.message === 'success') {
                        for (let i = 0; i < response.data.length; i++) {
                            if (width < 700) {
                                if (that.searchHotWord.length === 2) {
                                    break;
                                }
                            }
                            if (that.searchHotWord.length === 3) {
                                break;
                            }

                            that.searchHotWord.push(response.data[i]);
                        }
                    }
                    // let flag = true;
                    // let setObj = {};
                    // while (flag) {
                    //     if (that.searchHotWord.length === 3) {
                    //         break;
                    //     }
                    //
                    //     let random = Math.random() * response.data.length;
                    //     // while (setObj.hasOwnProperty(random)) {
                    //     //     random = Math.random() * response.data.length;
                    //     // }
                    //     var key = "'" + random + "'";
                    //     setObj[key] = true;
                    //     that.searchHotWord.push(response.data[random]);
                    // }
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .module-searchBox {

        max-width: 1200px;

        width: 95%;


        margin: 10% auto 0;

        display: grid;
        grid-template-columns: 100%;
        /*grid-template-rows: 30px 40px 30px;*/
        grid-row-gap: 5px;
        place-content: center;
        place-items: center;
    }

    .row {
        width: 100%;
        height: 100%;

        display: grid;
        /*grid-template-columns: 50px 80% auto;*/

        grid-template-columns: 50px auto 100px;

        grid-template-rows: 45px;
        /*place-content: center;*/
        /*align-items: stretch;*/
        /*place-items: center;*/
        /*align-content: center;*/
        /*align-items: center;*/
    }

    .row1 {
        /*border: 1px solid #DCDFE6;*/
        border-radius: 5px;

        outline: none;
        -webkit-box-shadow: inset 0 1px 2px rgba(27, 31, 35, .075), 0 0 0 0.2em rgba(3, 102, 214, .3);
        box-shadow: inset 0 1px 2px rgba(27, 31, 35, .075), 0 0 0 0.2em rgba(3, 102, 214, .3);
    }

    /*.row1:hover {*/
    /*    border: 1px solid #409EFF;*/
    /*    outline: none;*/
    /*    -webkit-box-shadow: inset 0 1px 2px rgba(27, 31, 35, .075), 0 0 0 0.2em rgba(3, 102, 214, .3);*/
    /*    box-shadow: inset 0 1px 2px rgba(27, 31, 35, .075), 0 0 0 0.2em rgba(3, 102, 214, .3);*/
    /*}*/


    .row2 {
        grid-template-rows: 20px;
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
        grid-template-rows: 45px;
        /*justify-content: space-between;*/
        align-content: center;
        place-items: center;

        grid-column-gap: 5px;
        background-color: transparent;
    }

    .searchEngineShow:hover {
        cursor: pointer;
        /*background-color: #409EFF;*/
        /*border-radius: 3px;*/
    }

    .searchEngineDiv i {
        width: 100%;
        /*padding-right: 5px;*/
        /*margin-right: 5px;*/
    }

    ul {

        position: relative;

        z-index: 1;
        /*line-height: 30px;*/

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

        font-size: 15px;
        /*border: 1px solid #DCDFE6;*/
        padding: 0 10px;

        background-color: transparent;
        /*background-color: rgba(255, 255, 255, 0.7);*/

        font-size: 20px;

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

    .search-li {
        display: grid;
        grid-template-columns: repeat(auto-fill, 45px);
        justify-content: start;
        align-content: center;
        justify-items: start;
        align-items: center;
    }


    .search-li a {
        color: #6d6d6d;;
        font-weight: bold;
        border-radius: 3px;
        padding: 2px 5px;

    }


    body .search-li-active {
        background-color: #409EFF;
        color: white;
    }


    .search-li a:hover {
        /*background-color: #409EFF;*/
        /*color: white;*/
    }

    .hotWordDiv {
        grid-column: 1 / 3;

        display: grid;
        grid-template-columns: repeat(3, auto);
        grid-column-gap: 20px;
        justify-content: start;
        align-content: center;
        /*justify-items: start;*/
        align-items: stretch;
    }


    .hotWordDiv a {
        /*overflow: hidden;*/
        /*text-overflow: ellipsis;*/
        /*white-space: nowrap;*/
        font-size: 13px;
        color: orangered;
    }

    .hotWord:hover {
        /*animation-name: pulse;*/
    }

    .search-fa {
        display: grid;
        place-content: center;
    }

    .search-fa > i {
        font-size: 20px;
    }


    /*.hotWordDiv a:last-child {*/
    /*    margin-right: 0;*/
    /*}*/

    @media screen and (max-width: 700px) {

        .module-searchBox {
            margin: 45% auto 0;
            grid-template-columns: 1fr;
        }

        .row {
            grid-template-columns: 50px auto 50px;

            /*grid-template-rows: 40px;*/
        }

        .searchEngineShow {
            /*grid-template-rows: 40px;*/
        }

        button {
            /*padding: 0 5px;*/
        }

        input {
            font-size: 16px;
        }

    }
</style>
