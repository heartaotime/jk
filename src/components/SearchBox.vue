<template>
    <div class="card module-searchBox">
        <div class="row row1" id="searchBox">
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
                yiyanStr: ''
            }
        },
        computed: {
            openUserInfo() {
                return JSON.parse(JSON.stringify(this.$store.getters.openUserInfo));
            },
        },
        watch: {
            // openUserInfo: {
            //     handler() {
            //         // this.getSearchEngine();
            //         this.searchEngineList = this.openUserInfo.ext.searchEngineList.concat();
            //         // alert('SearchBox getSearchEngine from openUserInfo, ' + this.searchEngineList.length);
            //         console.log('SearchBox getSearchEngine from openUserInfo, ', this.searchEngineList);
            //         for (let i = 0; i < this.searchEngineList.length; i++) {
            //             let isDefault = this.searchEngineList[i].isDefault;
            //             if (isDefault) {
            //                 this.searchEngineIndex = i;
            //                 break;
            //             }
            //         }
            //     },
            //     deep: true
            // },
        },
        created() {
        },
        mounted() {
            this.getYiyan();
        },
        methods: {
            inputFocus() {
                this.$store.commit('uSearchFixShow', true);
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


        margin: 15% auto 0;

        display: grid;
        grid-template-columns: 100%;
        grid-row-gap: 5px;
        place-content: center;
        place-items: center;
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
            margin: 45% auto 0;
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
