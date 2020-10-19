<template>
    <div class="module-searchBox animated fadeInDown">

        <div class="logo">
            <img v-show="logoShowType == 'url' && url !== ''" :src="url"/>
            <span v-show="logoShowType == 'time'">{{time}}</span>
            <Weather class="weather" v-show="logoShowType == 'weather'"></Weather>
        </div>

        <div class="form">
            <div class="form-left">
                <div class="show-engine" @click="searchEngineShow = !searchEngineShow">
                    <img :src="searchEngineList.length > 0 ? searchEngineList[searchEngineIndex].icon : ''"
                         class="searchIcon"/>
                    <i :class="!searchEngineShow ? 'fa fa-angle-down' : 'fa fa-angle-up'"></i>
                </div>

                <transition :enter-active-class="enterClass"
                            :leave-active-class="leaveClass">
                    <ul v-show="searchEngineShow">
                        <li v-for="(item, index) in searchEngineList" :key="index" :value="item.url"
                            @click="setSearchEngine(index)">
                            <img :src="item.icon" class="searchIcon"/>
                            <span>{{item.name}}</span>
                        </li>
                    </ul>
                </transition>
            </div>
            <div>
                <input type="text" spellcheck="false" id="searchInput" @keyup.enter="search()"
                       @focus="searchEngineShow = false"
                       v-model="searchKey">
            </div>
            <div class="form-right" @click="search()">
                <i class="fa fa-search"></i>
            </div>
            <div style="clear: both"></div>
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
                searchKey: ''
            }
        },
        computed: {
            openUserInfo() {
                return JSON.parse(JSON.stringify(this.$store.getters.openUserInfo));
            },
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
        },
        created() {
        },
        mounted() {
            this.getYiyan();
            setInterval(() => {
                let now = new Date();
                let hours = now.getHours() > 9 ? now.getHours() : '0' + now.getHours();
                let minutes = now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes();
                // let seconds = now.getSeconds() > 9 ? now.getSeconds() : '0' + now.getSeconds();
                this.time = hours + ':' + minutes;
            }, 1000);
        },
        methods: {
            inputFocus() {
                this.$store.commit('uSearchFixShow', true);
                // history.pushState({page: 1}, "搜索", "?page=search");
                history.pushState(null, '搜索', null);
            },
            inputBlur() {
                // document.querySelector('[name=tmp]').remove();
            },
            setSearchEngine(index) {
                this.searchEngineIndex = index;
                for (let i = 0; i < this.searchEngineList.length; i++) {
                    this.searchEngineList[i].isDefault = false;
                }
                this.searchEngineList[index].isDefault = true;

                this.openUserInfo.ext.searchEngineList = this.searchEngineList;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);

                document.querySelector('#searchInput').focus();

                // 强制更新数组，让vue可以监听到数组的变化
                // this.$set(this.searchEngineList, index, this.searchEngineList[index]);
            },
            search() {
                document.querySelector('#searchInput').focus();

                window.open(this.searchEngineList[this.searchEngineIndex].url.replace("%s", this.searchKey));

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

                setTimeout(() => {
                    this.searchKey = '';
                }, 500);
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


    .form {

        margin: 20px 0 5px;

        width: 95%;
        max-width: 500px;

        $height: 40px;
        $div1-width: 15%;
        $div3-width: 8%;
        $div2-width: calc(100% - #{$div1-width} - #{$div3-width});


        div {
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
            }
        }


        border-radius: 40px;
        box-shadow: 0 0 18px rgba(70, 70, 40, .255);
        background-color: rgba(255, 255, 255, 0.4);
        /*background-color: white;*/
        height: $height;

        .form-left {
            .show-engine {
                height: 40px;
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
                margin-top: 45px;
                position: relative;

                font-size: 15px;

                z-index: 1;
                border-radius: 5px;
                box-shadow: 0 0 18px rgba(70, 70, 40, .255);
                border-top: none;
                background-color: transparent;
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
        width: 20px;
        height: 20px;
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


    @media screen and (max-width: 700px) {

        .module-searchBox {
            margin: 20% auto 0;
            /*grid-template-columns: 1fr;*/
        }

        .row {
            /*grid-template-columns: 50px auto 50px;*/

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
