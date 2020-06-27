<template>
    <div class="module-box">

        <transition-group enter-active-class="animated fadeInUp"
                          leave-active-class="animated fadeOut" class="module-items">
            <div class="item enlargeAnimation" v-for="(item) in index" :key="item.uuid" @click="window.open(item.url)">
                <div><a :href="item.url"><img :src="item.icon"></a></div>
                <div class="card name"><span>{{item.name}}</span></div>
            </div>
        </transition-group>

    </div>
</template>

<script>
    export default {
        name: "Index",
        data() {
            return {
                index: []
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
                    this.index = [].concat(this.openUserInfo.ext.index);
                },
                deep: true
            },

        },
        created() {

        },
        mounted() {
            // for (let i = 0; i < 10; i++) {
            //     this.index.push({
            //         uuid: this.Utils.generateUUID(),
            //         icon: 'https://www.myindex.top/file/myfile/txy.png',
            //         url: 'https://www.myindex.top/file/myfile/txy.png',
            //         name: '测试' + (i + 1)
            //     });
            // }
        },
        methods: {}
    }
</script>

<style scoped>

    .module-box {
        max-width: 1200px;
        width: 95%;
        margin: 20px auto;
    }

    div {
        /*cursor: pointer;*/
    }

    .module-items {
        /*width: 100%;*/
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        justify-content: space-evenly;
        grid-row-gap: 30px;
        padding: 10px;
    }

    .item {
        width: 100%;
        height: 100%;
        cursor: pointer;

        display: grid;

        justify-content: stretch;
        place-items: center;
        grid-row-gap: 5px;

    }

    .item:hover {
        -webkit-animation: fadeInS 0.8s;
        animation: fadeInS 0.8s;
        margin-top: -5px;
    }

    .card {
        box-shadow: unset;
    }

    .name {

        line-height: 20px;
        font-size: 13px;
        max-width: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        /*background-color: rgba(255, 255, 255, 0.7);*/
        /*border-radius: 5px;*/
        padding: 2px 5px;
    }

    .name > span {
        /*line-height: 20px;*/
    }

    img {
        width: 40px;
        height: 40px;
    }

    @media screen and (max-width: 700px) {
        .module-items {
            grid-template-columns: repeat(5, 1fr);
        }
    }
</style>