<template>
    <div class="module-searchBox animated fadeInDown">

        <div class="logo">
            <img v-show="logoShowType == 'url' && url !== ''" :src="url"/>
            <span v-show="logoShowType == 'time'">{{time}}</span>
        </div>

        <div class="card row row1" id="searchBox">
            <input spellcheck="false" @focus="inputFocus" :placeholder="yiyanStr"/>
        </div>
    </div>

</template>

<script>

    export default {
        name: 'SearchBox',
        props: {
            // msg: String
        },
        components: {},
        data() {
            return {
                yiyan: {},
                yiyanStr: '',
                logoShowType: 'none',
                url: '',
                time: ''
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
                    // if (logoShowType == 'url' && url !== '') {
                    //     this.url = url;
                    // } else if (logoShowType == 'time') {
                    //     this.url = '';
                    // } else if (logoShowType == 'none') {
                    //     this.url = '';
                    // }


                    // // this.getSearchEngine();
                    // this.searchEngineList = this.openUserInfo.ext.searchEngineList.concat();
                    // // alert('SearchBox getSearchEngine from openUserInfo, ' + this.searchEngineList.length);
                    // console.log('SearchBox getSearchEngine from openUserInfo, ', this.searchEngineList);
                    // for (let i = 0; i < this.searchEngineList.length; i++) {
                    //     let isDefault = this.searchEngineList[i].isDefault;
                    //     if (isDefault) {
                    //         this.searchEngineIndex = i;
                    //         break;
                    //     }
                    // }
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
            getYiyan() {
                let url = 'https://v1.hitokoto.cn';
                this.Utils.getJson(url, {}).then(response => {
                    if (!response || response.hitokoto === '') {
                        return;
                    }
                    this.yiyan = response;
                    this.yiyanStr = response.hitokoto + '  from~ ' + response.from;
                });
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
        grid-row-gap: 20px;
        place-content: center;
        place-items: center;

    }

    .logo {
        width: 100%;
        height: 108px;
        text-align: center;
        background: transparent;
    }

    .logo > img {
        height: 108px;
        max-width: 250px;
    }

    .logo > span {
        font-size: 50px;
        line-height: 108px;
        letter-spacing: 10px;
    }

    .row {
        width: 100%;
        height: 100%;

        display: grid;

        grid-template-columns: 1fr;

        grid-template-rows: 50px;
    }

    .row1 {
        border-radius: 5px;
        outline: none;
        -webkit-box-shadow: inset 0 1px 2px rgba(27, 31, 35, .075), 0 0 0 0.2em rgba(3, 102, 214, .3);
        box-shadow: inset 0 1px 2px rgba(27, 31, 35, .075), 0 0 0 0.2em rgba(3, 102, 214, .3);
    }

    input {
        outline: none;
        border: none;

        /*border: 1px solid #DCDFE6;*/
        padding: 0 10px;

        background-color: transparent;
        /*background-color: rgba(255, 255, 255, 0.7);*/

        font-size: 16px;

    }


    .box {
        background-color: unset;
    }


    @media screen and (max-width: 700px) {

        .module-searchBox {
            margin: 20% auto 0;
            grid-template-columns: 1fr;
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
