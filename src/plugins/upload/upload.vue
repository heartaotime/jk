<template>
    <div>
        <input type="file" name="file" ref="selectFile" @change="upLoadFile()">
    </div>
</template>

<script>
    export default {
        name: "upload",
        components: {},
        props: {},
        data() {
            return {}
        },
        computed: {},
        watch: {},
        mounted() {
        },
        methods: {
            click() {
                this.$refs.selectFile.click();
            },
            upLoadFile() {
                this.Utils.upLoadFile(this.$refs.selectFile).then(url => {
                    this.$emit("upLoadSuccess", url);
                });
            },
        }
    }
</script>

<style scoped lang="scss">

    * {
        display: none !important;
    }

</style>