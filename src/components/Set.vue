<template>
    <div class="set animated fadeInDown">
        <!--        @mouseover="show = true" @mouseout="show = false"-->

        <div class="card up animated fadeInUp" @click="show = true,Utils.closePop()" v-show="!show">
            <i class="fa fa-angle-up"></i>
        </div>


        <pop :show="popConfig.show" :style-set="{top:'10%',maxWidth:'800px'}" @close="Utils.closePop()">
            <template v-slot:header>{{popConfig.title}}</template>
            <template v-slot:main>
                <!--                    <div style="text-align: center;">-->
                <!--&lt;!&ndash;                        <router-view :name="popConfig.componentName"></router-view>&ndash;&gt;-->
                <!--                       -->
                <!--                    </div>-->
                <StyleSet v-if="popConfig.componentName === 'StyleSet'"></StyleSet>
                <User v-if="popConfig.componentName === 'User'"></User>
                <SearchEngineSet v-if="popConfig.componentName === 'SearchEngineSet'"></SearchEngineSet>
                <!--                <IndexSet v-if="popConfig.componentName === 'IndexSet'"></IndexSet>-->
                <LogoSet v-if="popConfig.componentName === 'LogoSet'"></LogoSet>
            </template>
        </pop>


        <transition enter-active-class="animated fadeInUp faster"
                    leave-active-class="animated fadeOutDown faster">
            <div class="card menu" v-show="show">
                <div class="items">
                    <div @click="uPopConfig('LogoSet', 'Logo设置')">
                        <i class="far fa-lightbulb animated tada" aria-hidden="true"></i>
                        <span>Logo</span>
                    </div>
                    <!--                    <div @click="uPopConfig('IndexSet', '快捷导航设置')">-->
                    <!--                        <i class="far fa-bookmark animated tada" aria-hidden="true"></i>-->
                    <!--                        <span>快捷导航</span>-->
                    <!--                    </div>-->
                    <div @click="editIndex">
                        <i class="far fa-bookmark animated tada" aria-hidden="true"></i>
                        <span>导航</span>
                    </div>
                    <div @click="uPopConfig('SearchEngineSet', '搜索引擎设置')">
                        <i class="far fa-edit animated tada" aria-hidden="true"></i>
                        <span>搜索</span>
                    </div>
                    <div @click="uPopConfig('StyleSet', '主题设置')">
                        <i class="far fa-images animated tada"></i>
                        <span>主题</span>
                    </div>
                    <div @click="uPopConfig('User','用户设置')">
                        <i class="far fa-user animated tada"></i>
                        <span>用户</span>
                    </div>
                    <div @click="show = false">
                        <i class="fa fa-angle-down animated tada"></i>
                    </div>
                </div>
            </div>
        </transition>

        <!--        <div class="card menu" v-show="show">-->
        <!--            <div class="items">-->
        <!--                <div class="animated fadeInUp" @click="uPopConfig('LogoSet', 'Logo设置')">-->
        <!--                    <i class="far fa-lightbulb" aria-hidden="true"></i>-->
        <!--                    <span>Logo</span>-->
        <!--                </div>-->
        <!--                <div class="animated fadeInUp" @click="uPopConfig('IndexSet', '快捷导航设置')">-->
        <!--                    <i class="far fa-bookmark" aria-hidden="true"></i>-->
        <!--                    <span>快捷导航</span>-->
        <!--                </div>-->
        <!--                <div class="animated fadeInUp" @click="uPopConfig('SearchEngineSet', '搜索引擎设置')">-->
        <!--                    <i class="far fa-edit" aria-hidden="true"></i>-->
        <!--                    <span>搜索引擎</span>-->
        <!--                </div>-->
        <!--                <div class="animated fadeInUp" @click="uPopConfig('Style', '主题设置')">-->
        <!--                    <i class="far fa-images"></i>-->
        <!--                    <span>主题</span>-->
        <!--                </div>-->
        <!--                <div class="animated fadeInUp" @click="uPopConfig('User','用户设置')">-->
        <!--                    <i class="far fa-user"></i>-->
        <!--                    <span>用户</span>-->
        <!--                </div>-->
        <!--                <div class="animated fadeInUp" @click="show = false">-->
        <!--                    <i class="fa fa-angle-down"></i>-->
        <!--                </div>-->
        <!--            </div>-->
        <!--        </div>-->

    </div>
</template>

<script>
    import StyleSet from "./StyleSet";
    import User from "./User";
    import SearchEngineSet from "./SearchEngineSet";
    // import IndexSet from './IndexSet';
    import LogoSet from "./LogoSet";

    export default {
        name: "Set",
        components: {
            StyleSet,
            User,
            SearchEngineSet,
            // IndexSet,
            LogoSet
        },
        data() {
            return {
                dialogShow: false,
                show: false,
                iClass: 'fa fa-angle-up'
            }
        },
        computed: {
            popConfig() {
                return this.$store.getters.popConfig;
            },
        },
        watch: {
            show() {
                if (this.show) {
                    this.iClass = 'fa fa-angle-down';
                } else {
                    this.iClass = 'fa fa-angle-up';
                }
            }
        },

        methods: {
            uPopConfig(type, title) {
                this.show = false;


                let show = false;
                if (this.popConfig.componentName === type) {
                    show = !this.popConfig.show;
                } else {
                    show = true;
                }
                this.Utils.pop({
                    show: show,
                    title: title,
                    componentName: type
                });
                this.dialogShow = show;
            },
            editIndex() {
                this.$store.commit('uEditIndexShow', true);
                this.show = false;
            },
            scroll() {
                let scrollTop = document.documentElement.scrollTop;
                // window.console.log(scrollTop);
                this.searchBoxShow = scrollTop > 80;
            }
        }
    }
</script>

<style scoped lang="scss">
    .set {
        z-index: 3;
        display: unset;
    }

    .up {
        position: fixed;
        bottom: 10px;
        right: 10px;

        width: 40px;
        height: 40px;
        display: grid;
        place-content: center;
        place-items: center;
    }

    .menu {
        z-index: 3;

        position: fixed;
        bottom: 10px;
        right: 10px;
    }

    .items {
        display: grid;
        grid-template-columns: 1fr;

        place-content: center;
        place-items: center;
        grid-column-gap: 10px;
        grid-row-gap: 10px;
        width: 40px;
    }

    .items > div {
        width: 100%;
        height: 40px;


        display: grid;
        grid-template-columns: 1fr;


        place-content: center;
        place-items: center;
        grid-row-gap: 5px;

        /*justify-content: left;*/
        /*align-content: center;*/
        /*align-items: center;*/

        /*border-bottom: 1px dashed #DCDFE6;*/
        /*border: 1px dashed #DCDFE6;*/

        cursor: pointer;
    }

    .items > div:hover {
        border-radius: 5px;
        background-color: #ecf5ff;
        color: #409EFF;
    }

    .items > div > span {
        font-size: 13px;
    }

    .items > div:last-child {
        border-bottom: none;
    }

    i {
        font-size: 15px;
        /*cursor: none;*/
    }
</style>