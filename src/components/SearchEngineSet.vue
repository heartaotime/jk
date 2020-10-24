<template>
    <div class="module">

        <div class="animated fadeInUp" style="padding: 0 5px;">
            <div class="tips">
                <span>提示：</span>
                <span>1.点击图标可以更换</span>
                <span>2.搜索的关键字用%s代替</span>
                <span>3.按住 <i class="fas fa-arrows-alt-v" style="color: red;"
                              aria-hidden="true"></i> 1秒不放，可以拖动排序哦</span>
            </div>
        </div>

        <div class="search-engine">
            <draggable v-model="searchEngineList" :options="options">
                <transition-group enter-active-class="animated fadeInUp"
                                  leave-active-class="animated fadeOutLeft faster">
                    <div class="row" v-for="(item, index) in searchEngineList" :key="item.uuid">
                        <div @click="selectIcon(index)"><img class="enlargeAnimation" :src="item.icon"/></div>
                        <div>
                            <input spellcheck="false" placeholder="名称" v-model="item.name"/>
                        </div>
                        <div>
                            <input spellcheck="false" placeholder="地址(搜索的关键字用%s代替)" v-model="item.url" class="url"/>
                        </div>
                        <div>
                            <i class="fas fa-arrows-alt-v" aria-hidden="true"></i>
                        </div>
                        <div @click="delSearchEngine(index)">
                            <!--                        <i @click="delSearchEngine(index)" class="fa fa-minus" aria-hidden="true"></i>-->
                            <i class="fas fa-trash-alt" aria-hidden="true"></i>
                        </div>

                    </div>
                </transition-group>
            </draggable>

        </div>

        <input type="file" name="file" id="selectIcon" @change="upLoadFile()" hidden style="display: none">


        <div class="btn-group">
            <button @click="addSearchEngine()">新增一个</button>
            <button @click="saveSearchEngine()">保存</button>
            <button @click="resetSearchEngine()">恢复默认</button>
        </div>

        <!--            <div v-show="iconSelectShow" class="icon-select">-->
        <!--                11111111-->
        <!--            </div>-->


        <!--            <div class="row">-->
        <!--                <span>提示：</span>-->
        <!--                <span>1.没有账号可以先点击注册</span>-->
        <!--                <span>2.登陆账号后，可以同步你的自定义数据哦</span>-->
        <!--                <span>3.邮箱也可以用来登陆</span>-->
        <!--            </div>-->

    </div>

</template>

<script>
    import draggable from 'vuedraggable'

    export default {
        name: "Set",
        components: {
            draggable
        },
        data() {
            return {
                searchEngineList: [],
                iconSelectShow: false,
                index: -1,
                options: {
                    delayOnTouchOnly: true,  //开启触摸延时
                    direction: 'vertical',   //拖动方向
                    delay: 500,              //延时时长
                    touchStartThreshold: 3,  //防止某些手机过于敏感(3~5 效果最好)
                    dragClass: 'drag',    //格式为简单css选择器的字符串，目标拖动过程中添加
                    animation: 500    // ms, 动画速度运动项目排序时，' 0 ' -没有动画。
                }
            }
        },
        computed: {
            openUserInfo() {
                return JSON.parse(JSON.stringify(this.$store.getters.openUserInfo));
            }
        },
        watch: {
            openUserInfo: {
                handler() {
                    this.getSearchEngine();
                },
                deep: true
            },
        },
        mounted() {
            this.getSearchEngine();
        },
        methods: {
            resetSearchEngine() {
                this.Utils.getSearchEngine(list => {
                    this.searchEngineList = list;
                    this.saveSearchEngine();
                });
            },
            saveSearchEngine() {
                for (let i = 0; i < this.searchEngineList.length; i++) {
                    let item = this.searchEngineList[i];
                    if (!item.icon || item.icon === '') {
                        this.$toast('请上传icon');
                        return;
                    }
                    if (!item.name || item.name === '') {
                        this.$toast('请填写名称');
                        return;
                    }
                    if (!item.url || item.url === '') {
                        this.$toast('请填写地址');
                        return;
                    }
                    if (item.url.indexOf('%s') < 0) {
                        this.$toast('搜索地址中必须含有%s');
                        return;
                    }
                }
                this.openUserInfo.ext.searchEngineList = this.searchEngineList;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
                this.$toast('保存成功，即将刷新页面~~~');

                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            },
            selectIcon(index) {
                this.index = index;
                document.querySelector('#selectIcon').click();
            },
            upLoadFile() {
                this.Utils.upLoadFile('selectIcon', url => {
                    this.searchEngineList[this.index].icon = url;
                });
            },
            addSearchEngine() {
                // console.log('addSearchEngine1', this.searchEngineList);
                this.searchEngineList.push(
                    {
                        url: '',
                        name: '',
                        icon: require('@/assets/img/default-icon.png'),
                        uuid: this.Utils.generateUUID()
                    }
                );
                // console.log('addSearchEngine2', this.searchEngineList);
            },
            delSearchEngine(index) {
                if (this.searchEngineList.length == 1) {
                    this.$toast('请至少保留一个');
                    return;
                }
                this.searchEngineList.splice(index, 1)
            },
            getSearchEngine() {
                this.searchEngineList = [].concat(JSON.parse(JSON.stringify(this.openUserInfo.ext.searchEngineList)));
                console.log('getSearchEngine', this.searchEngineList)
                if (this.searchEngineList.length > 0) {
                    return;
                }
                this.Utils.getSearchEngine(list => {
                    this.searchEngineList = list;
                });

            },

        },
    }
</script>

<style scoped>

    .module {
        /*padding: 10px 10px 0;*/
        display: grid;
        grid-template-columns: 1fr;

        /*grid-row-gap: 20px;*/
        /*justify-content: center;*/
        /*justify-items: center;*/
    }

    h4 {
        padding: 0 5px;
    }

    .search-engine {
        height: 240px;
        overflow-y: auto;
        padding: 0 5px;

        /*display: grid;*/
        /*justify-content: stretch;*/
        /*align-content: center;*/


    }


    .row {
        height: 40px;
        border: 1px solid lightgrey;
        border-radius: 3px;

        display: grid;
        grid-template-columns: 30px 50px 1fr 30px 30px;

        margin-top: 10px;

        /*justify-content: stretch;*/
        /*align-content: stretch;*/


        /*align-content: start;*/

        /*grid-column-gap: 20px;*/
        /*justify-content: start;*/
    }


    .row img {
        width: 20px;
        height: 20px;
        place-self: center;
    }


    input {
        outline: none;
        border: none;
        font-size: 13px;
        width: 100%;
        background: transparent;
    }


    .row > div {
        cursor: pointer;

        border-left: 1px solid lightgray;
        height: 100%;
        width: 100%;


        place-self: center;

        display: grid;
        grid-template-columns: 1fr;
    }

    .row.drag {
        background-color: orange;
    }

    .row > div:first-child {
        border-left: none;
    }


    .row > div > i {
        place-self: center;
        color: red;
    }


    .btn-group {
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

    /*.tips {*/
    /*    padding: 0 5px;*/
    /*    background-color: cornsilk;*/
    /*    border: 1px solid lightgrey;*/
    /*    border-radius: 3px;*/

    /*    display: grid;*/
    /*    grid-row-gap: 3px;*/

    /*    line-height: 25px;*/
    /*    font-size: 13px;*/
    /*}*/

    /*.tips > span {*/
    /*    font-size: 15px;*/
    /*}*/

    /*.tips > span:first-child {*/
    /*    font-size: 18px;*/
    /*}*/


    @media screen and (max-width: 600px) {


    }

</style>