<template>
    <div>
        <button ref="btn">
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
                // this.watchData.height = this.height;
                // this.watchData.primary = this.primary;
                // this.watchData.secondary = this.secondary;
                // this.watchData.success = this.success;
                // this.watchData.info = this.info;
                // this.watchData.warning = this.warning;
                // this.watchData.danger = this.danger;
                return {
                    height: this.height,
                    primary: this.primary,
                    secondary: this.secondary,
                    success: this.success,
                    info: this.info,
                    warning: this.warning,
                    danger: this.danger,
                };
            }
        },
        watch: {
            watchData() {
                this.setBgColor();
            }
        },
        created() {
        },
        mounted() {
            this.setBgColor();
        },
        methods: {
            setBgColor() {
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
            }
        }
    }
</script>

<style scoped lang="scss">

    div {
        width: 100%;
        height: 100%;
    }

    button {
        width: 100%;
        box-sizing: border-box;
        cursor: pointer;
        border-radius: 5px;
        border: 2px solid white;
        text-transform: uppercase;
        color: white;
        padding: 5px 8px;
        outline: none;
        overflow: hidden;
        position: relative;

        &:after {
            content: '';
            display: block;
            position: absolute;
            top: -36px;
            left: -100px;
            background: white;
            width: 50px;
            height: 125px;
            opacity: 20%;
            transform: rotate(-45deg);
        }

        &:hover:after {
            left: 120%;
            transition: all 600ms cubic-bezier(0.3, 1, 0.2, 1);
            -webkit-transition: all 600ms cubic-bezier(0.3, 1, 0.2, 1);
        }

        > span {
            color: var(--white);
        }
    }


</style>