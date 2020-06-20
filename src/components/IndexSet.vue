<template>
    <div class="module">

        <div class="animated fadeInRight faster" style="padding: 0 5px;">
            <div class="tips">
                <span>快捷导航设置：</span>
                <span>1.点击图标可以更换</span>
                <span>2.导航链接必须含有http或者https</span>
            </div>
        </div>

        <div class="search-engine">
            <transition-group enter-active-class="animated fadeInUp"
                              leave-active-class="animated fadeOutLeft faster">
                <div class="row" v-for="(item, index) in indexList" :key="item.uuid">
                    <img @click="selectIndexIcon(index)" :src="item.icon"/>
                    <div>
                        <input spellcheck="false" placeholder="名称" v-model="item.name"/>
                    </div>
                    <div>
                        <input spellcheck="false" placeholder="链接" v-model="item.url" class="url"/>
                    </div>
                    <div>
                        <i @click="delIndex(index)" class="fa fa-minus" aria-hidden="true"></i>
                    </div>

                </div>
            </transition-group>

        </div>

        <input type="file" name="file" id="selectIndexIcon" @change="upLoadFile()" hidden style="display: none">


        <div class="btn">
            <button @click="addIndex()">新增一个</button>
            <button @click="saveIndex()">保存</button>
        </div>

        <!--            <div v-show="iconSelectShow" class="icon-select">-->
        <!--                11111111-->
        <!--            </div>-->


        <!--            <div class="row">-->
        <!--                <span>提示：</span>-->
        <!--                <span>1.没有账号可以先点击注册</span>-->
        <!--                <span>2.登陆账号后，可以同步你的自定义数据哦</span>-->
        <!--                <span>3.邮箱也可以用来登陆</span>-->
        <!--            </div>-->

    </div>

</template>

<script>
    export default {
        name: "IndexSet",
        components: {},
        data() {
            return {
                indexList: [],
                iconSelectShow: false,
                index: -1
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
                    this.getIndexList();
                },
                deep: true
            },
        },
        mounted() {
            this.getIndexList();
        },
        methods: {
            resetSearchEngine() {
                this.Utils.getSearchEngine(list => {
                    this.indexList = list;
                    this.saveIndex();
                });
            },
            saveIndex() {
                for (let i = 0; i < this.indexList.length; i++) {
                    let item = this.indexList[i];
                    if (!item.icon || item.icon === '') {
                        this.$toast('请上传icon');
                        return;
                    }
                    if (!item.name || item.name === '') {
                        this.$toast('请填写名称');
                        return;
                    }
                    if (!item.url || item.url === '') {
                        this.$toast('请填写链接');
                        return;
                    }
                    if (item.url.indexOf('http') < 0) {
                        this.$toast('搜索地址中必须含有http或者https');
                        return;
                    }
                }
                this.openUserInfo.ext.index = this.indexList;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
                this.$toast('保存成功');
                //
                // setTimeout(() => {
                //     window.location.reload();
                // }, 1000);
            },
            selectIndexIcon(index) {
                this.index = index;
                document.querySelector('#selectIndexIcon').click();
            },
            upLoadFile() {
                let appCode = this.Utils.getCommonReq({}).appCode;

                let param = new FormData();
                param.append("appCode", appCode);
                // 通过append向form对象添加数据
                param.append("file", document.querySelector('#selectIndexIcon').files[0]);
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
                    this.indexList[this.index].icon = response.data;
                });
            },
            addIndex() {
                // console.log('addSearchEngine1', this.indexList);
                this.indexList.push(
                    {
                        url: '',
                        name: '',
                        icon: require('@/assets/img/default-icon.png'),
                        uuid: this.Utils.generateUUID()
                    }
                );
                // console.log('addSearchEngine2', this.indexList);
            },
            delIndex(index) {
                // if (this.indexList.length == 1) {
                //     this.$toast('请至少保留一个');
                //     return;
                // }
                this.indexList.splice(index, 1)
            },
            getIndexList() {
                this.indexList = [].concat(JSON.parse(JSON.stringify(this.openUserInfo.ext.index)));
                console.log('getIndexList', this.indexList)
                if (this.indexList.length > 0) {
                    return;
                }
            },

        },
    }
</script>

<style scoped>

    .module {
        padding: 10px 10px 0;
        display: grid;
        grid-template-columns: 1fr;

        /*grid-row-gap: 20px;*/
        /*justify-content: center;*/
        /*justify-items: center;*/
    }

    h4 {
        padding: 0 5px;
    }

    .search-engine {
        height: 240px;
        overflow-y: auto;
        padding: 0 5px;

        /*display: grid;*/
        /*justify-content: stretch;*/
        /*align-content: center;*/


    }


    .row {
        height: 35px;
        border: 1px solid lightgrey;
        border-radius: 3px;

        display: grid;
        grid-template-columns: 30px 50px 1fr 30px;

        margin-top: 5px;

        /*justify-content: stretch;*/
        /*align-content: stretch;*/


        /*align-content: start;*/

        /*grid-column-gap: 20px;*/
        /*justify-content: start;*/
    }

    .row > img {
        width: 20px;
        height: 20px;
        place-self: center;
    }


    /*.row span {*/
    /*    text-align: center;*/
    /*    line-height: 40px;*/
    /*    !*align-self: center;*!*/

    /*    border-right: 1px solid lightgrey;*/
    /*}*/


    input {
        outline: none;
        border: none;
        /*padding: 0 10px;*/
        font-size: 15px;

        /*border-left: 1px solid lightgray;*/

        /*width: 50px;*/

        width: 100%;

        /*padding-left: 5px;*/


    }

    .row > input:first-child {
        /*text-align: center;*/
    }


    /*.row > input:first-child {*/
    /*    border-right: none;*/
    /*}*/

    /*.url {*/
    /*    border-right: 1px solid lightgray;*/
    /*}*/

    .icon-select {

    }

    .row > div {
        border-left: 1px solid lightgray;
        height: 100%;
        width: 100%;


        place-self: center;

        display: grid;
        grid-template-columns: 1fr;
        /*place-content: center;*/
        /*place-items: center;*/
    }

    .row > div > i {
        /*height: 100%;*/
        /*line-height: 30px;*/
        place-self: center;
        /*border-left: 1px solid lightgray;*/
        color: red;
        /*margin-left: 5px;*/
    }


    /*.info {*/

    /*    display: grid;*/
    /*    grid-template-columns: 1fr;*/
    /*    !*grid-template-rows: repeat(auto-fit, auto);*!*/

    /*    grid-row-gap: 10px;*/

    /*    height: 200px;*/

    /*    align-content: start;*/

    /*}*/


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

    .tips {
        padding: 0 5px;
        background-color: cornsilk;
        border: 1px solid lightgrey;
        border-radius: 3px;

        display: grid;
        grid-row-gap: 3px;
    }

    .tips > span {
        font-size: 15px;
    }

    .tips > span:first-child {
        font-size: 18px;
    }


    @media screen and (max-width: 700px) {


    }

</style>