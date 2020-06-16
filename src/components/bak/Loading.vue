<template>
    <div class="tips-module">
        <div class="tips-content">
            <!--            <img src="../assets/img/loading.gif">-->
            <i class="fa fa-spinner fa-spin fa-3x fa-fw" style="font-size: 30px;"></i>
            <span class="sr-only">Loading...</span>
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
            loadingConfig() {
                return this.$store.getters.loadingConfig;
            },
        },
        watch: {
            loadingConfig: {
                handler() {
                    // let msgType = this.tipsConfig.msgType;
                    // if (msgType === 'success') {
                    //     this.tipsConfig.img = require('@/assets/img/success.png');
                    // } else if (msgType === 'warn') {
                    //     this.tipsConfig.img = require('@/assets/img/warn.svg');
                    // } else if (msgType === 'error') {
                    //     this.tipsConfig.img = require('@/assets/img/error.svg');
                    // }
                    // this.config = this.tipsConfig;
                    // if (this.config.show) {
                    //     let that = this;
                    //     setTimeout(function () {
                    //         that.closeTips();
                    //     }, 2000);
                    // }
                    // alert('tipsConfig change');
                },
                deep: true
            }
        },
        mounted() {
        },
        methods: {
            closeLoading() {
                this.$store.commit('uLoadingConfig', {
                    show: false
                });
            }
        }
    }
</script>

<style scoped>

    .tips-module {
        width: 100%;
        height: 100%;
        padding-top: calc(50vh);

        z-index: 999;

        position: fixed;
        margin: 0 auto;
        /*right: 20px;*/
        /*margin: 20px auto;*/

        left: 0;
        right: 0;
        /*top: 40%;*/

        /*background-color: rgba(255, 255, 255, 0.6);*/

    }

    .tips-content {
        /*display: grid;*/
        /*grid-template-columns: 1fr;*/

        text-align: center;
    }

    img {
        width: 100px;
        height: 70px;
        margin: 0 auto;
    }


    .row:first-child > span {
        font-weight: bold;
    }
</style>