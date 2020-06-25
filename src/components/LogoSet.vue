<template>
    <div class="module">

        <div class="tab">
            <div class="item" v-for="(item, index) in logoShowTypes" :key="item.code">
                <input type="radio" :id="'radio' + index" name="logoShowType" :value="item.code"
                       v-model="logoShowType"/>
                <label :for="'radio' + index" :title="item.desc">{{item.name}}</label>
            </div>
        </div>

        <div class="row">

            <div class="img" v-show="logoShowType === 'url'" @click="selectLogo()">
                <i class="fas fa-plus" aria-hidden="true" v-show="!url || url == ''"></i>
                <img :src="url" v-show="url && url !== ''">
            </div>

            <div class="time" v-show="logoShowType === 'time'">
                <span>{{time}}</span>
            </div>

        </div>


        <input type="file" name="file" id="selectLogo" @change="upLoadFile()" hidden style="display: none">


        <div class="btn">
            <button @click="save()">保存</button>
        </div>


    </div>
</template>

<script>
    export default {
        name: "LogoSet",
        data() {
            return {
                url: '',
                logoShowType: '',
                logoShowTypes: [
                    {
                        code: 'none',
                        name: '无Logo',
                        desc: '不展示Logo'
                    },
                    {
                        code: 'url',
                        name: '图片',
                        desc: '自己上传一张图片，或者填入一个图片的链接'
                    },
                    {
                        code: 'time',
                        name: '时间',
                        desc: '每分钟更新'
                    },

                ],
                time: ''
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
                    this.init();
                },
                deep: true
            },
        },
        mounted() {
            this.init();
            setInterval(() => {
                let now = new Date();
                let hours = now.getHours() > 9 ? now.getHours() : '0' + now.getHours();
                let minutes = now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes();
                // let seconds = now.getSeconds() > 9 ? now.getSeconds() : '0' + now.getSeconds();
                this.time = hours + ':' + minutes;
            }, 1000);
        },
        methods: {
            init() {
                this.logoShowType = this.openUserInfo.ext.logo.logoShowType || 'none';
                this.url = this.openUserInfo.ext.logo.url;
            },
            save() {
                this.openUserInfo.ext.logo.logoShowType = this.logoShowType;
                if (this.logoShowType == 'url' && this.url == '') {
                    this.$toast('请选择一个图片上传');
                    return;
                }

                this.openUserInfo.ext.logo.url = this.url;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
                this.$toast('保存成功');
            },
            selectLogo() {
                document.querySelector('#selectLogo').click();
            },
            upLoadFile() {
                let appCode = this.Utils.getCommonReq({}).appCode;

                let param = new FormData();
                param.append("appCode", appCode);
                // 通过append向form对象添加数据
                param.append("file", document.querySelector('#selectLogo').files[0]);
                // FormData私有类对象，访问不到，可以通过get判断值是否传进去
                // console.log(param.get("file"));

                let config = {
                    //添加请求头
                    headers: {"Content-Type": "multipart/form-data"},
                    //添加上传进度监听事件
                    onUploadProgress: e => {
                        var completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
                        console.log(completeProgress);
                        // this.progress = completeProgress;
                    }
                };
                this.Utils.postJson('https://www.myindex.top/api/common/v1/upload', param, config).then(response => {
                    if (!response || response.code !== '0') {
                        this.$toast(response.message);
                        return;
                    }
                    this.url = response.data;
                });
            },
        }
    }
</script>

<style scoped>

    .module {
        padding: 10px 10px 0;
        display: grid;
        grid-template-columns: 1fr;
        grid-row-gap: 20px;
    }

    .tab {
        display: grid;
        grid-template-columns: repeat(3, auto);
        justify-content: left;
        grid-row-gap: 10px;
        grid-column-gap: 20px;
    }

    .item {
        display: grid;
        grid-template-columns: 20px 1fr;
        place-items: center;
        place-content: center;
        cursor: pointer;

    }


    .row {
        /*width: 200px;*/
        height: 300px;
        text-align: center;

        display: grid;
        grid-template-columns: 1fr;
        place-content: center;
        place-items: center;
    }

    .img {

        height: 200px;
        width: 200px;

        border: 1px dashed #DCDFE6;;

        display: grid;
        place-content: center;
        place-items: center;
        cursor: pointer;


    }

    .img > img {
        height: 200px;
        width: 200px;
    }

    .img > i {
        font-size: 40px;
    }

    .time {
        height: 100px;
        width: 200px;

        border: 1px dashed #DCDFE6;;

        display: grid;
        place-content: center;
        place-items: center;
    }

    .time > span {
        font-size: 40px;
        /*font-family: 'Share Tech Mono', monospace;*/
        /*color: #ffffff;*/
        /*text-align: center;*/
        /*position: absolute;*/
        /*left: 50%;*/
        /*top: 50%;*/
        /*-webkit-transform: translate(-50%, -50%);*/
        /*transform: translate(-50%, -50%);*/
        /*color: #daf6ff;*/
        /*text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);*/
    }

    input {
        outline: none;
        border: none;
        font-size: 15px;
        width: 100%;
        background: transparent;
    }


    input[type=radio] {
        -webkit-appearance: none;
        border: 1px orange solid;
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }


    input[type=radio]:focus, input[type=radio]:checked {
        -webkit-appearance: none;

        background-color: coral;
    }

    label {
        cursor: pointer;
    }


    .btn {
        width: 100%;
        margin-top: 10px;

        display: grid;
        grid-row-gap: 10px;
    }

    button {
        height: 40px;
        outline: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: white;
        background-color: #409EFF;
        /*text-shadow: 0 1px 0 #fff;*/

        /*word-spacing: 2px;*/

        letter-spacing: 5px;

        border-radius: 5px;
    }

    button:last-child {
        background-color: orange;
    }
</style>