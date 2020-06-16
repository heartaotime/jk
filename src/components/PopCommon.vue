<template>
    <div class="popcommon-module">
        <div class="popcommon-content">
            <header>
                <span>{{popConfig.title}}</span>
                <!--                <span @click="$emit('closePop')"><i class="fas fa-times" aria-hidden="true"></i></span>-->
                <span @click="closePop()"><i class="fas fa-times" aria-hidden="true"></i></span>
            </header>
            <section>
                <Style v-if="popConfig.componentName === 'Style'"></Style>
                <!--                <EditGuide v-show="popConfig.componentName === 'EditGuide'"></EditGuide>-->
                <User v-if="popConfig.componentName === 'User'"></User>
                <Set v-if="popConfig.componentName === 'Set'"></Set>
            </section>

            <footer>

            </footer>
        </div>

        <!--            <div class="item">-->
        <!--                <span>背景色：</span>-->
        <!--                <input type="range" min="0" max="10" v-model="trans">-->
        <!--                <span>{{trans}}</span>-->
        <!--            </div>-->

        <!--            <input type="text" list="language">-->
        <!--            <datalist id="language">-->
        <!--                <option>汉语</option>-->
        <!--                <option>英语</option>-->
        <!--                <option>法语</option>-->
        <!--                <option>西班牙语</option>-->
        <!--            </datalist>-->
    </div>
</template>

<script>

    import Style from "./Style";
    import User from "./User";
    import Set from "./Set";

    export default {
        name: "PopCommon",
        components: {
            Style,
            User,
            Set
        },
        props: {
            // popConfig: Object
        },
        data() {
            return {}
        },
        computed: {
            popConfig() {
                return this.$store.getters.popConfig;
            },
        },
        watch: {
            popConfig() {
                // alert('popConfig change');
                // this.config = this.popConfig;
                // window.console.log(this.popConfig);
                // alert(popConfig.componentName + popConfig.show);
                // this.config = this.popConfig;
            }
        },
        mounted() {
            // alert(this.popConfig.componentName);
        },
        methods: {
            closePop() {
                this.Utils.closePop();
            }
        }
    }
</script>

<style scoped>

    .popcommon-module {
        z-index: 2;

        position: fixed;
        width: 100%;

        top: 80px;
        /*top: 20px;*/
        margin: 0 auto;

    }


    .popcommon-content {
        box-shadow: 0 0 18px rgba(70, 70, 40, .255);
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 1);

        /*padding: 20px;*/
        width: 800px;
        /*height: 600px;*/
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

        display: grid;
        grid-template-columns: repeat(2, 1fr);
        justify-content: space-between;
        align-content: center;
        align-items: center;
    }

    header span:last-child {
        justify-self: right;
        cursor: pointer;
        padding-right: 5px;
    }

    header, footer {
        padding: 10px;
    }

    section {
        display: grid;
        grid-template-columns: 1fr;
    }

    @media screen and (max-width: 700px) {
        .popcommon-content {
            width: 98%;
        }
    }

</style>