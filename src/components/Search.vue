<template>
    <div class="module-search">
        <div class="search">
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
            <input id="search" placeholder="请输入关键字，回车搜索~~~" @keyup.enter="search()" @focus="inputFocus()" v-model="searchKey"
                   spellcheck="false"/>
            <div class="search-fa" @click="close()">
                <i class="fas fa-times" aria-hidden="true"></i>
            </div>
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
                phone: true
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
            }
        },
        created() {
        },
        mounted() {

        },
        methods: {
            inputFocus() {
                this.searchEngineShow = false;
            },
            search() {
                window.open(this.searchEngineList[this.searchEngineIndex].url.replace("%s", this.searchKey));
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
                this.$store.commit('uSearchFixShow', false);
            }
        }
    }
</script>

<style scoped>

    .module-search {

        z-index: 2;
        /*background-color: rgba(255, 255, 255, 1);*/
        background-color: white;


        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;


    }

    .search {
        width: 90%;
        position: fixed;
        top: 20px;
        bottom: unset;
        left: 5px;
        right: 5px;

        margin: 0 auto;
        /*margin-top: calc(100vh - 120px);*/

        border-radius: 5px;
        outline: none;
        -webkit-box-shadow: inset 0 1px 2px rgba(27, 31, 35, .075), 0 0 0 0.2em rgba(3, 102, 214, .3);
        box-shadow: inset 0 1px 2px rgba(27, 31, 35, .075), 0 0 0 0.2em rgba(3, 102, 214, .3);


        display: grid;
        /*grid-template-columns: 1fr 50px;*/

        grid-template-rows: 50px;

        grid-template-columns: 50px auto 50px;

    }

    .search-fa {
        display: grid;
        cursor: pointer;
    }

    .search-fa > i {
        font-size: 20px;

        align-self: center;
        line-height: 50px;
        text-align: center;
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

    @media screen and (max-width: 700px) {
        .search {
            top: unset;
            bottom: 20px;
        }

    }
</style>