<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {}
    },
    computed: {},
    watch: {},
    created() {
        // 把 this 传入 工具类
        this.Utils.setVue(this);
    },
    mounted() {
    },
    methods: {}
}
</script>

<style>
@import "assets/css/common.css";
</style>

<style scoped>

#app {
    /*margin: 0 auto;*/
    /*display: grid;*/

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top;
    overflow-y: auto;
    overflow-x: hidden;
}

</style>
