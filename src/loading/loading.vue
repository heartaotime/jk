<template>


    <div class="tips-module">
        <div class="tips-content">
            <i class="fa fa-spinner fa-spin fa-3x fa-fw" style="font-size: 30px;"></i>
            <span class="sr-only">Loading...</span>
        </div>
    </div>

</template>

<style scoped>
    .tips-module {
        width: 100%;
        height: 100%;

        padding-top: calc(50vh);

        z-index: 999;

        position: fixed;
        margin: 0 auto;

        top: 0;
        bottom: 0;
        left: 0;
        right: 0;


    }

    .tips-content {
        text-align: center;
    }

    img {
        width: 100px;
        height: 70px;
        margin: 0 auto;
    }


</style>

