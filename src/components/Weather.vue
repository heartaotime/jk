<template>
    <div>
        <div id="he-plugin-simple"></div>
    </div>
</template>

<script>
    export default {
        name: "Weather",
        created() {
            window.WIDGET = {
                CONFIG: {
                    "modules": "01234",
                    "background": 5, // 透明背景
                    // "background": 2, // 浅色背景
                    "tmpColor": "4A4A4A",
                    "tmpSize": "30",
                    "cityColor": "4A4A4A",
                    "citySize": "30",
                    "aqiSize": "30",
                    "weatherIconSize": "45",
                    "alertIconSize": "31",
                    "padding": "0px 0px 0px 0px",
                    "shadow": "0",
                    "language": "auto",
                    "borderRadius": 5,
                    "fixed": "false",
                    "vertical": "middle",
                    "horizontal": "center",
                    "key": "a57958f86f70480d988820933f1d0f87"
                }
            }

            var script = document.createElement('script')
            script.src = 'https://widget.heweather.net/simple/static/js/he-simple-common.js?v=1.1'
            var sn = document.getElementsByTagName('script')[0]
            sn.parentNode.insertBefore(script, sn)

            // (function (d) {
            //     var script = d.createElement('script')
            //     script.src = 'https://widget.heweather.net/simple/static/js/he-simple-common.js?v=1.1'
            //     var sn = d.getElementsByTagName('script')[0]
            //     sn.parentNode.insertBefore(script, sn)
            // })(document)
        }
    }
</script>

<style scoped>

</style>