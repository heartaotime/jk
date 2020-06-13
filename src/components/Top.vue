<template>
    <div class="card top">
        <div class="container-top">
            <div class="left">
            </div>
            <div class="center">
            </div>
            <div class="right">
                <i class="far fa-image" @click="uPopConfig(1)"></i>
                <i class="far fa-user" @click="uPopConfig(2)"></i>
<!--                <img src="../assets/img/skin.svg" @click="uPopConfig(1)" alt="">-->
                <!--                <img src="../assets/img/user.svg" @click="uPopConfig(2)" alt="">-->
            </div>
        </div>
    </div>
</template>

<script>
    // import SerachBox from "./SearchBox";

    export default {
        name: "AppTop",
        components: {
            // SerachBox
        },
        data() {
            return {
                searchBoxShow: false,
            }
        },
        computed: {
            popConfig() {
                return this.$store.state.popConfig;
            },
        },
        watch: {},
        mounted() {
            window.addEventListener("scroll", this.scroll);
        },
        methods: {
            uPopConfig(type) {
                let config = {};
                if (type === 1) {
                    config = {
                        show: !this.popConfig.show,
                        title: '主题设置',
                        componentName: 'Style'
                    };
                } else if (type === 2) {
                    config = {
                        show: !this.popConfig.show,
                        title: '用户设置',
                        componentName: 'User'
                    };
                }
                this.Utils.pop(config);
            },
            scroll() {
                let scrollTop = document.documentElement.scrollTop;
                // window.console.log(scrollTop);
                this.searchBoxShow = scrollTop > 80;
            }
        }

    }
</script>

<style scoped>

    .top {
        z-index: 1;
        position: fixed;
        top: 0;

        border-radius: 0;
        width: 100%;
        /*height: 60px;*/
        /*height: 80px;*/

        display: grid;
    }

    .container-top {
        width: 1200px;
        justify-self: center;
        align-self: center;

        padding: 10px;

        display: grid;
        grid-template-columns: 1fr 5fr 1fr;
        align-content: center;
        align-items: center;
        grid-column-gap: 20px;

    }

    .center >>> .row2 {
        display: none;
    }


    .right {
        /*grid-area: 2 / 3;*/

        height: 25px;

        justify-self: right;

        /*cursor: pointer;*/

        display: grid;
        grid-template-columns: repeat(2, auto);
        grid-column-gap: 15px;
        place-content: center;
        place-items: center;

        font-size: 20px;
    }

    .right i {
        cursor: pointer;
    }

    img {
        width: 25px;
    }

    /*.right img:last-child {*/
    /*    width: 25px;*/
    /*    height: 25px;*/
    /*}*/

    @media screen and (max-width: 700px) {
        .top {
            /*width: 98%;*/
        }

        .container-top {
            width: 100%;
            padding-right: 40px;
        }
    }
</style>