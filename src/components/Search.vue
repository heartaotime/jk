<template>
    <div class="module-search">
        <div class="search">
            <input autofocus placeholder="请输入关键字，回车搜索~~~"/>
            <button @click="close">取消</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Search",
        methods: {
            close() {
                this.$store.commit('uSearchFixShow', false);
            }
        }
    }
</script>

<style scoped>

    .module-search {

        z-index: 2;
        /*background-color: rgba(255, 255, 255, 1);*/
        background-color: white;


        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;


    }

    .search {
        width: 90%;
        height: 50px;
        position: fixed;
        bottom: 50px;
        left: 5px;
        right: 5px;

        margin: 0 auto;
        /*margin-top: calc(100vh - 120px);*/

        border-radius: 5px;
        outline: none;
        -webkit-box-shadow: inset 0 1px 2px rgba(27, 31, 35, .075), 0 0 0 0.2em rgba(3, 102, 214, .3);
        box-shadow: inset 0 1px 2px rgba(27, 31, 35, .075), 0 0 0 0.2em rgba(3, 102, 214, .3);


        display: grid;
        grid-template-columns: 1fr 50px;

    }


    input {
        outline: none;
        border: none;

        font-size: 15px;
        padding: 0 10px;

        background-color: transparent;
        /*background-color: rgba(255, 255, 255, 0.7);*/

        font-size: 20px;

    }

    input:focus {
        /*border: none;*/
    }


    button {
        /*width: 100px;*/
        /*height: 37px;*/
        background-color: #409EFF;
        /*border: none;*/
        outline: none;
        border: none;
        /* color: white; */
        font-size: 16px;
        cursor: pointer;
        /*color: #fff;*/
        font-weight: bold;

        /*color: #8590a6;*/

        color: white;

        /*background-color: #f2f2f2;*/
        /*text-shadow: 0 1px 0 #fff;*/
        /*border: 3px solid #ccd8e1;*/

        /*border-left: 1px solid #ccd8e1;*/

        border-radius: 0 5px 5px 0;

    }
</style>