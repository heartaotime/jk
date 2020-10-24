<template>
    <div class="module-box">

        <div class="tips" v-show="editIndexShow">
            <div>
                <span>提示：点击可以编辑，按住不放拖到可以排序</span>
                <button class="btn" @click="$store.commit('uEditIndexShow', false)">退出编辑</button>
            </div>
        </div>

        <!--        <transition-group enter-active-class="animated fadeInUp"-->
        <!--                          leave-active-class="animated fadeOut" class="module-items">-->

        <!--        </transition-group>-->
        <div class="animated fadeInUp">
            <draggable v-model="indexList" :options="options" class="module-items" @end="merge">
                <div :class="editIndexShow ? 'item item-edit':'item'" v-for="(item, index) in indexList"
                     :key="item.uuid"
                     :index="index"
                     @click="indexClick(index)">
                    <div><img :src="item.icon"></div>
                    <div class="card name"><span>{{item.name}}</span></div>
                </div>
            </draggable>
            <div :class="editIndexShow ? 'item item-edit':'item'" id="n-draggable" @click="indexClick(-1)"
                 v-show="editIndexShow">
                <div style="align-self: center;"><i class="fas fa-plus" aria-hidden="true" style="font-size: 30px;"></i>
                </div>
                <div class="card name"><span>添加</span></div>
            </div>
        </div>


        <pop :show="popShow" :style-set="{top:'10%',maxWidth:'800px'}" @close="popShow = false">
            <div slot="header">编辑导航</div>
            <div slot="main">
                <div class="rows">
                    <div class="row1">
                        <label>导航名称</label>
                        <input v-model="editItemData.name" spellcheck="false"/>
                    </div>
                    <div class="row2">
                        <label>导航连接</label>
                        <input v-model="editItemData.url" spellcheck="false"/>
                        <button class="btn" @click="getIcon">获取图标</button>
                    </div>
                    <div class="row3">
                        <label>导航图标</label>
                        <div class="img" @click="selectIcon()">
                            <i class="fas fa-plus" aria-hidden="true" style="font-size: 20px;" v-show="!hasIcon"></i>
                            <img :src="editItemData.icon" v-show="hasIcon">
                        </div>
                        <div>
                            点击左侧图标可以更换
                        </div>
                    </div>
                </div>

                <div class="btn-group">
                    <button class="btn" @click="saveIndex()">保存</button>
                    <button class="btn btn-warn" @click="delIndex()">删除</button>
                </div>
            </div>
        </pop>


        <input type="file" name="file" id="selectIcon" @change="upLoadFile()" hidden style="display: none">

    </div>
</template>

<script>
    export default {
        name: "Index",
        data() {
            return {
                indexList: [],
                activeIndex: -1,
                popShow: false,
                iconUrl: '',
                editItemData: {},
                hasIcon: false,
                options: {
                    delayOnTouchOnly: true,  //开启触摸延时
                    direction: 'vertical',   //拖动方向
                    delay: 500,              //延时时长
                    touchStartThreshold: 3,  //防止某些手机过于敏感(3~5 效果最好)
                    dragClass: 'drag',    //格式为简单css选择器的字符串，目标拖动过程中添加
                    animation: 500,    // ms, 动画速度运动项目排序时，' 0 ' -没有动画。
                    // filter: '#n-draggable'
                }
                // https://juejin.im/post/6844904150350692366 拖动配置
            }
        },
        computed: {
            openUserInfo() {
                return JSON.parse(JSON.stringify(this.$store.getters.openUserInfo));
            },
            editIndexShow() {
                return this.$store.getters.editIndexShow;
            }
        },
        watch: {
            openUserInfo: {
                handler() {
                    this.indexList = [].concat(this.openUserInfo.ext.index);
                },
                deep: true
            },
        },
        created() {

        },
        mounted() {
        },
        methods: {
            merge() {
                this.openUserInfo.ext.index = this.indexList;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
            },
            saveIndex() {
                if (this.activeIndex === -1) {
                    this.indexList.push(this.editItemData);
                } else {
                    this.indexList[this.activeIndex] = this.editItemData;
                }
                this.merge();
                this.popShow = false;
                this.$toast('保存成功');
            },
            delIndex() {
                this.indexList.splice(this.activeIndex, 1);
                this.merge();
                this.popShow = false;
                this.$toast('删除成功');
            },
            getIcon() {
                let splitUrlTmp = this.editItemData.url.split('/');
                let iconUrl = splitUrlTmp[0] + "//" + splitUrlTmp[2].split(':')[0] + '/' + 'favicon.ico';
                this.editItemData.icon = iconUrl;
            },
            indexClick(index) {
                if (this.editIndexShow) {
                    this.popShow = true;
                    this.activeIndex = index;
                    if (index === -1) {
                        this.editItemData = {};
                    } else {
                        this.editItemData = this.Utils.convert(this.indexList)[index];
                    }
                    this.hasIcon = this.editItemData.icon && this.editItemData.icon !== '';
                } else {
                    this.Utils.go2Link(this.indexList[index].url, '_blank')
                }
            },
            selectIcon() {
                document.querySelector('#selectIcon').click();
            },
            upLoadFile() {
                this.Utils.upLoadFile('selectIcon', url => {
                    this.editItemData.icon = url;
                    this.hasIcon = this.editItemData.icon && this.editItemData.icon !== ''
                })
            },
        }
    }
</script>

<style scoped lang="scss">

    .module-box {
        max-width: 500px;
        width: 95%;
        margin: 20px auto;
    }

    div {
        /*cursor: pointer;*/
    }

    .module-items {
        /*width: 100%;*/
        display: grid;
        /*grid-template-columns: repeat(8, 1fr);*/
        grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
        justify-content: space-around;
        /*grid-gap: 30px;*/
        grid-row-gap: 30px;
        grid-column-gap: 10px;
        padding: 10px;
    }

    .item {
        width: 100%;
        height: 100%;
        cursor: pointer;

        display: grid;

        justify-content: stretch;
        justify-items: center;
        align-content: space-between;
        align-items: center;
        grid-row-gap: 5px;

    }

    .item-edit {
        border: 1px dashed orange;
    }

    .item:hover {
        /*-webkit-animation: fadeInS 0.8s;*/
        /*animation: fadeInS 0.8s;*/
        /*margin-top: -5px;*/

        transition: all .15s ease;
        transform: translateY(-5px);
    }

    .card {
        box-shadow: unset;
    }

    .name {
        max-width: 100%;
        text-align: center;

        line-height: 20px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        /*background-color: rgba(255, 255, 255, 0.7);*/
        /*border-radius: 5px;*/
        padding: 1px 3px;
    }

    .name > span {
        /*line-height: 20px;*/
    }

    img {
        width: 40px;
        height: 40px;
    }

    .rows {
        display: grid;
        grid-template-columns: 1fr;

        .row {
            display: grid;
            grid-template-columns: auto 1fr;
            grid-column-gap: 10px;
            margin-top: 10px;
            align-content: center;
            align-items: center;
            font-size: 15px;
            height: 40px;

            padding: 0 10px;
            border: 1px solid lightgrey;
            border-radius: 3px;
        }

        .row1, .row2, .row3 {
            @extend .row;
        }

        .row1, .row2, .row3 {

            label {
                line-height: 40px;
                height: 40px;
                border-right: 1px solid lightgrey;
                padding-right: 10px;
            }

            input {
                line-height: 40px;
                font-size: 15px;
                outline: none;
                border: none;
                width: 100%;
                background: transparent;
            }


        }

        .row2 {
            grid-template-columns: auto 1fr auto;

            padding-right: 0;

            button {
                letter-spacing: 1px;
                padding: 0 2px;
                border-radius: 3px;

            }
        }

        .row3 {
            grid-template-columns: auto 60px 1fr;

            height: 60px;

            .img {
                border-right: 1px solid lightgrey;
                height: 60px;
                padding-right: 10px;

                display: grid;
                grid-template-columns: 1fr;
                place-content: center;
                place-items: center;
            }


            label {
                line-height: 60px;
                height: 60px;
            }

            input {
                line-height: 60px;
            }

            > div {
                &:last-child {
                    color: gray;
                }
            }
        }
    }

    .btn-group {
        width: 100%;
        margin-top: 20px;

        display: grid;
        grid-row-gap: 10px;
        grid-template-rows: 40px 40px;
    }

    .tips {
        > div {
            font-size: 12px;
            display: grid;
            grid-template-columns: repeat(2, auto);
            justify-content: space-between;
            justify-items: center;
            align-content: center;
            align-items: center;

            button {
                font-size: 12px;
            }
        }
    }


    @media screen and (max-width: 700px) {
        .item:hover {
            transition: unset;
            transform: unset;
        }
    }
</style>