<template>
    <div class="tips-module">

        <transition-group enter-active-class="animated fadeInDown faster"
                          leave-active-class="animated fadeOutUp faster">
            <div v-for="(item, index) in toasts" :key="item.uuid" :index="index" class="toast"
                 :isSetAutoDel="item.isSetAutoDel">
                <div class="tips-content" :style="item.tipsContentStyle">
                <span class="status">
                    <i :class="item.iClass" :style="item.iStyle"></i>
                </span>
                    <span class="txt">{{item.text}}</span>
                    <span class="close" @click="del(item.uuid)"><i class="fas fa-times"></i></span>
                </div>
            </div>
        </transition-group>

    </div>
</template>

<!--<script>-->
<!--    export default {-->
<!--        data() {-->

<!--        }-->
<!--    }-->
<!--</script>-->

<style scoped lang="scss">
    .tips-module {
        z-index: 999;

        position: fixed;
        margin: 0 auto;

        /*margin-top: calc(50vh);*/

        /*left: 0;*/
        /*right: 0;*/

        top: 10px;
        right: 10px;

        /*text-align: center;*/

        // transform: translateY(-400%);

        box-sizing: border-box;

        line-height: 40px;
    }


    .toast {
        margin-top: 10px;

        &:nth-child(1) {
            margin-top: 0;
        }
    }


    .tips-content {
        height: 30px;
        width: 230px;

        display: grid;
        grid-template-columns: auto 1fr auto;
        grid-column-gap: 10px;
        align-content: center;
        align-items: center;

        padding: 10px;
        border-radius: 5px;
        color: #fff;

        .toasts {
            margin-top: 10px;
        }

        .status {
            i {
                padding: 3px;
                border-radius: 50%;
                background-color: var(--white);
                width: 13px;
                height: 13px;
                text-align: center;
            }
        }

        .txt {
            color: var(--white);
        }

        .close {
            i {
                font-size: 13px;
                padding: 3px;
                border-radius: 50%;
                color: #f8f9fad9;
                text-align: center;
            }

            &:hover {
                i {
                    color: var(--white)
                }
            }
        }
    }

    img {
        width: 20px;
        height: 20px;
    }


</style>

