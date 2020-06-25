<template>
    <div class="card set animated fadeInDown">
        <div class="items" @mouseover="show = true" @mouseout="show = false" @click="show = !show">
            <div v-show="show" class="animated fadeInUp">
                <span @click="uPopConfig('LogoSet', 'Logo设置')">Logo</span>
                <!--                <i class="far fa-bookmark" aria-hidden="true"-->
                <!--                   @click="uPopConfig('LogoSet', 'Logo设置')"></i>-->
            </div>
            <div v-show="show" class="animated fadeInUp">
                <i class="far fa-bookmark" aria-hidden="true"
                   @click="uPopConfig('IndexSet', '快捷导航设置')"></i>
            </div>
            <div v-show="show" class="animated fadeInUp">
                <i class="far fa-edit" aria-hidden="true"
                   @click="uPopConfig('SearchEngineSet', '搜索引擎设置')"></i>
            </div>
            <div v-show="show" class="animated fadeInUp">
                <i class="far fa-images" @click="uPopConfig('Style', '主题设置')"></i>
            </div>
            <div v-show="show" class="animated fadeInUp">
                <i class="far fa-user" @click="uPopConfig('User','用户设置')"></i>
            </div>
            <div class="animated fadeInUp">
                <i :class="iClass"></i>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Set",
        data() {
            return {
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
    .set {
        z-index: 2;
        position: fixed;
        bottom: 10px;
        right: 10px;
    }

    .items {
        display: grid;
        grid-template-columns: 1fr;

        place-content: center;
        place-items: center;
    }

    .items > div {
        width: 40px;
        height: 40px;

        display: grid;
        place-content: center;
        place-items: center;

        border-bottom: 1px dashed #DCDFE6;

        cursor: pointer;
    }

    .items > div:last-child {
        border-bottom: none;
    }

    i {
        font-size: 20px;
        padding: 8px;
        /*cursor: none;*/
    }
</style>