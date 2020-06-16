<template>
    <div class="tips-module">
        <div class="tips-content">
            <div class="row">
                <!--                <img src="../assets/img/success.png">-->
                <img :src="config.img">
                <span>{{config.title}}</span>
            </div>

            <div class="row">
                <span></span>
                <!--                <span v-html="config.content"></span>-->
                <span>{{config.content}}</span>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "Tips",
        props: {
            // content: String
        },
        data() {
            return {
                config: {},
            }
        },
        computed: {
            tipsConfig() {
                return this.$store.getters.tipsConfig;
            },
        },
        watch: {
            tipsConfig: {
                handler() {
                    let msgType = this.tipsConfig.msgType;
                    if (msgType === 'success') {
                        this.tipsConfig.img = require('@/assets/img/success.png');
                    } else if (msgType === 'warn') {
                        this.tipsConfig.img = require('@/assets/img/warn.svg');
                    } else if (msgType === 'error') {
                        this.tipsConfig.img = require('@/assets/img/error.svg');
                    }
                    this.config = this.tipsConfig;
                    if (this.config.show) {
                        let that = this;
                        setTimeout(function () {
                            that.closeTips();
                        }, 2000);
                    }
                    // alert('tipsConfig change');
                },
                deep: true
            }
        },
        mounted() {
        },
        methods: {
            closeTips() {
                this.$store.commit('uTipsConfig', {
                    show: false
                });
            }
        }
    }
</script>

<style scoped>

    .tips-module {
        z-index: 3;

        position: fixed;
        margin: 0 auto;
        /*right: 20px;*/
        /*margin: 20px auto;*/

        left: 0;
        right: 0;
        bottom: 20px;

    }

    .tips-content {
        padding: 10px;
        box-shadow: 0 0 18px rgba(70, 70, 40, .255);
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.9);
        /*background-color: b;*/

        /*padding: 20px;*/
        width: 240px;
        /*height: 30px;*/
        /*height: 600px;*/
        margin: 0 auto;

        display: grid;
        grid-template-columns: 1fr;
        align-content: start;

        /*justify-content: stretch;*/
        /*align-items: center;*/

        grid-row-gap: 10px;
    }

    img {
        width: 20px;
        height: 20px;
    }


    .row {
        display: grid;
        grid-template-columns: 20px auto;
        justify-content: start;
        align-content: center;
        /*justify-items: start;*/

        grid-column-gap: 10px;

    }


    .row:first-child > span {
        font-weight: bold;
    }
</style>