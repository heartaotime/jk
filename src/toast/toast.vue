<template>

    <!--    <div id="toast" class="wrap">-->

    <!--        <transition enter-active-class="animated fadeInUp"-->
    <!--                    leave-active-class="animated fadeOut">-->
    <!--            <span v-show="show">{{text}}</span>-->
    <!--        </transition>-->

    <!--    </div>-->


    <div class="tips-module">

        <transition leave-active-class="animated fadeOut faster">
            <div class="tips-content animated fadeIn faster" v-show="show">
                <span>{{text}}</span>
            </div>
        </transition>

    </div>

</template>

<style scoped>
    .tips-module {
        z-index: 3;

        position: fixed;
        margin: 0 auto;

        margin-top: calc(50vh);

        left: 0;
        right: 0;

        text-align: center;

    }

    .tips-content {
        padding: 10px;
        box-shadow: 0 0 18px rgba(70, 70, 40, .255);
        border-radius: 5px;
        /*background-color: rgba(255, 255, 255, 0.9);*/
        background-color: rgba(0, 0, 0, .55);
        color: #fff;

        display: inline;
    }

    img {
        width: 20px;
        height: 20px;
    }


</style>

