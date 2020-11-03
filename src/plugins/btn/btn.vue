<template>
    <div>
        <button ref="btn" @click="btnClick()">
            <span>
                <slot></slot>
            </span>
        </button>
    </div>

</template>

<script>
    export default {
        name: "btn",
        props: {
            height: {
                type: String,
                default: '100%',
                required: false
            },
            primary: {
                type: Boolean,
                default: true,
                required: false
            },
            secondary: {
                type: Boolean,
                default: false,
                required: false
            },
            success: {
                type: Boolean,
                default: false,
                required: false
            },
            info: {
                type: Boolean,
                default: false,
                required: false
            },
            warning: {
                type: Boolean,
                default: false,
                required: false
            },
            danger: {
                type: Boolean,
                default: false,
                required: false
            },
        },
        data() {
            return {}
        },
        computed: {
            watchData() {
                return {...this.$props};
            }
        },
        watch: {
            watchData() {
                this.init();
            }
        },
        created() {
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                let btn = this.$refs.btn;
                let color = '';
                if (this.primary) {
                    color = 'var(--primary)';
                }
                if (this.secondary) {
                    color = 'var(--secondary)';
                }
                if (this.success) {
                    color = 'var(--success)';
                }
                if (this.info) {
                    color = 'var(--info)';
                }
                if (this.warning) {
                    color = 'var(--warning)';
                }
                if (this.danger) {
                    color = 'var(--danger)';
                }
                btn.style.backgroundColor = color;
                btn.style.height = this.height;
            },
            btnClick() {
                // let btn = this.$refs.btn;
            }
        }
    }
</script>

<style scoped lang="scss">

    div {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    button {
        width: 100%;
        box-sizing: border-box;
        cursor: pointer;
        border-radius: 3px;
        border: none;
        text-transform: uppercase;
        padding: 5px 8px;
        outline: none;
        overflow: hidden;
        position: relative;


        &:after {
            border-radius: inherit;
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;

            opacity: 0;
            pointer-events: none;
            color: inherit;
            transition: opacity .2s cubic-bezier(.4, 0, .6, 1);
            background-color: currentColor; // currentColor是css3中扩展的关键字，具体意思就是使用该关键字的元素的（或其最近父元素）color属性的颜色值
        }

        &:hover:after {
            opacity: .08;
        }


        &:before {
            content: '';
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(circle, #FFF 10%, transparent 10%);

            transform: scale(10, 10);
            opacity: 0;
            transition: transform .5s, opacity 1s;
        }


        &:active:before {
            transform: scale(0, 0);
            opacity: .3;
            transition: 0s;
        }


        > span {
            color: var(--white);
        }
    }


</style>