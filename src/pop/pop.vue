<template>
    <transition enter-active-class="animated fadeInUp faster" leave-active-class="animated fadeOutDown faster">
        <div class="dialog-module" v-show="show">
            <div class="popcommon-module" :style="styleSet">
                <div class="popcommon-content">
                    <header>
                        <slot name="header">弹窗标题</slot>
                        <span @click="close()" name="dialog-close"><i class="fas fa-times" aria-hidden="true"></i></span>
                    </header>
                    <section>
                        <slot name="main">弹窗内容</slot>
                    </section>



<!--                    <footer>-->

<!--                    </footer>-->
                </div>
            </div>
        </div>
    </transition>
</template>

<script>

    export default {
        name: "pop",
        components: {},
        props: {
            show: {
                type: Boolean,
                default: false,
                required: true
            },
            maxWidth: {
                type: String,
                default: '800px'
            },
            maxHeight: {
                type: String,
                default: 'auto'
            },
            styleSet: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        data() {
            return {}
        },
        computed: {},
        watch: {},
        mounted() {
        },
        methods: {
            close() {
                this.$emit("close");
            }
        }
    }
</script>

<style scoped lang="scss">

    .dialog-module {
        z-index: 2;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .popcommon-module {
        position: absolute;
        top: 30%;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 98vw;
        max-width: 800px;
        max-height: auto;
    }


    .popcommon-content {
        box-shadow: 0 0 18px rgba(70, 70, 40, .255);
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 1);

        /*padding: 20px;*/
        /*width: 800px;*/
        /*height: 600px;*/

        /*max-width: 800px;*/
        /*width: 98vw;*/

        margin: 0 auto;

        display: grid;
        grid-template-columns: 1fr;
        align-content: start;
        justify-content: stretch;
        align-items: center;
    }

    header {
        height: 30px;
        border-bottom: 1px solid #ededed;
        font-weight: bold;

        letter-spacing: 1px;

        display: grid;
        grid-template-columns: repeat(2, 1fr);
        justify-content: space-between;
        align-content: center;
        align-items: center;

        background-color: #e0e0e0;
        border-color: #e0e0e0;
        border-radius: 5px 5px 0 0;

        span:last-child {
            justify-self: right;
            cursor: pointer;
            padding-right: 5px;
        }

    }


    header, footer {
        padding: 10px;
    }

    section {
        display: grid;
        grid-template-columns: 1fr;
        padding: 1rem;
    }

    @media screen and (max-width: 769px) {
        .popcommon-module {
            top: 50px;
        }

        .dialog-module {
            position: fixed;
        }

        .popcommon-module {
            position: fixed;
        }

        /*.popcommon-content {*/
        /*    width: 98%;*/
        /*}*/
    }

</style>