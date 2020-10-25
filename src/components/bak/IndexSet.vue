<template>
    <div class="module">

        <div class="animated fadeInUp" style="padding: 0 5px;">
            <div class="tips">
                <span>提示：</span>
                <span>1.点击图标可以更换</span>
                <span>2.导航链接必须含有http或者https</span>
                <span>3.按住 <i class="fas fa-arrows-alt-v" style="color: red;"
                              aria-hidden="true"></i> 1秒不放，可以拖动排序哦</span>
                <!--                <span>3.长按一会儿，可以拖动排序哦</span>-->
            </div>
        </div>

        <div class="row-list">
            <draggable v-model="indexList" :options="options">
                <transition-group enter-active-class="animated fadeInUp"
                                  leave-active-class="animated fadeOutLeft faster">
                    <div class="row" v-for="(item, index) in indexList" :key="item.uuid">
                        <div @click="selectIndexIcon(index)"><img class="enlargeAnimation" :src="item.icon"/></div>
                        <div>
                            <input spellcheck="false" placeholder="名称" v-model="item.name"/>
                        </div>
                        <div>
                            <input spellcheck="false" placeholder="链接" v-model="item.url" class="url"/>
                        </div>
                        <div>
                            <i class="fas fa-arrows-alt-v" aria-hidden="true"></i>
                        </div>

                        <div @click="delIndex(index)">
                            <i class="fas fa-trash-alt" aria-hidden="true"></i>
                        </div>

                    </div>
                </transition-group>
            </draggable>

        </div>

        <input type="file" name="file" id="selectIndexIcon" @change="upLoadFile()" hidden style="display: none">


        <div class="btn">
            <button @click="addIndex()">新增一个</button>
            <button @click="saveIndex()">保存</button>
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
    import draggable from 'vuedraggable';

    export default {
        name: "IndexSet",
        components: {
            draggable
        },
        data() {
            return {
                indexList: [],
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
                    this.getIndexList();
                },
                deep: true
            },
        },
        mounted() {
            this.getIndexList();
        },
        methods: {
            dragendHandler(e, index) {
                // window.console.log(e);
                let dx = e.x;
                let dy = e.y;

                // window.console.log(e.screenX + '-' + e.screenY);

                let items = document.querySelectorAll('.row-list  .row');
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let boundingClientRect = item.getBoundingClientRect();

                    let x = boundingClientRect.left + boundingClientRect.width / 2;
                    let y = boundingClientRect.top + boundingClientRect.height / 2;

                    if (dx - x <= boundingClientRect.width / 2 && dy - y <= boundingClientRect.height / 2) {
                        // window.console.log(this.itemList[i].guideName);
                        // let curI = this.activeIndex;
                        // 重新排序
                        this.indexList[index] = this.indexList.splice(i, 1, this.indexList[index])[0];

                        // this.$toast('排序保存成功');
                        return;
                    }
                }
            },
            resetSearchEngine() {
                this.Utils.getSearchEngine(list => {
                    this.indexList = list;
                    this.saveIndex();
                });
            },
            saveIndex() {
                for (let i = 0; i < this.indexList.length; i++) {
                    let item = this.indexList[i];
                    if (!item.icon || item.icon === '') {
                        this.$toast('请上传icon');
                        return;
                    }
                    if (!item.name || item.name === '') {
                        this.$toast('请填写名称');
                        return;
                    }
                    if (!item.url || item.url === '') {
                        this.$toast('请填写链接');
                        return;
                    }
                    if (item.url.indexOf('http') < 0) {
                        this.$toast('搜索地址中必须含有http或者https');
                        return;
                    }
                }
                this.openUserInfo.ext.index = this.indexList;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
                this.$toast('保存成功');
                //
                // setTimeout(() => {
                //     window.location.reload();
                // }, 1000);
            },
            selectIndexIcon(index) {
                this.index = index;
                document.querySelector('#selectIndexIcon').click();
            },
            upLoadFile() {
                this.Utils.upLoadFile('selectIndexIcon', url => {
                    this.indexList[this.index].icon = url;
                });
            },
            addIndex() {
                // console.log('addSearchEngine1', this.indexList);
                this.indexList.push(
                    {
                        url: '',
                        name: '',
                        icon: require('@/assets/img/default-icon.png'),
                        uuid: this.Utils.generateUUID()
                    }
                );
                // console.log('addSearchEngine2', this.indexList);
            },
            delIndex(index) {
                // if (this.indexList.length == 1) {
                //     this.$toast('请至少保留一个');
                //     return;
                // }
                this.indexList.splice(index, 1)
            },
            getIndexList() {
                this.indexList = [].concat(JSON.parse(JSON.stringify(this.openUserInfo.ext.index)));
                console.log('getIndexList', this.indexList)
                if (this.indexList.length > 0) {
                    return;
                }
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

    .row-list {
        height: 240px;
        overflow-y: auto;
        padding: 0 5px;

        /*防止长按系统默认弹窗*/
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;


    }


    .row {
        height: 40px;
        border: 1px solid lightgrey;
        border-radius: 3px;

        display: grid;
        grid-template-columns: 30px 50px 1fr 30px 30px;

        margin-top: 10px;


    }

    .row.drag {
        background-color: orange;
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

    .row > div:first-child {
        border-left: none;
    }

    .row > div > i {
        place-self: center;
        color: red;
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


    @media screen and (max-width: 600px) {


    }

</style>