<template>
    <div class="module">


        <h4>搜索引擎设置</h4>

        <div class="search-engine">
            <transition-group enter-active-class="animated fadeInUp"
                              leave-active-class="animated fadeOut">
                <div class="row" v-for="(item, index) in searchEngineList" :key="item.url">
                    <img @click="selectIcon(index)" :src="item.icon"/>
                    <div>
                        <input spellcheck="false" placeholder="名称" v-model="item.name"/>
                    </div>
                    <div>
                        <input spellcheck="false" placeholder="地址(搜索的关键字用%s代替)" v-model="item.url" class="url"/>
                    </div>
                    <div>
                        <i @click="delSearchEngine(index)" class="fa fa-minus" aria-hidden="true"></i>
                    </div>

                </div>
            </transition-group>

        </div>

        <input type="file" name="file" id="selectIcon" @change="upLoadFile()" hidden style="display: none">


        <div class="btn">
            <button @click="addSearchEngine()">新增一个</button>
            <button @click="saveSearchEngine()">保存</button>
            <button @click="resetSearchEngine()">恢复默认</button>
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
        name: "Set",
        components: {},
        data() {
            return {
                searchEngineList: [],
                iconSelectShow: false,
                index: -1
            }
        },
        computed: {
            openUserInfo() {
                return this.$store.state.openUserInfo;
            }
        },
        watch: {
            openUserInfo: {
                handler() {
                    this.getSearchEngine();
                },
                deep: true
            },
        },
        mounted() {
            this.getSearchEngine();
        },
        methods: {
            resetSearchEngine() {
                this.Utils.getSearchEngine(list => {
                    this.searchEngineList = list;
                    this.saveSearchEngine();
                });
            },
            saveSearchEngine() {
                for (let i = 0; i < this.searchEngineList.length; i++) {
                    let item = this.searchEngineList[i];
                    if (!item.icon || item.icon === '') {
                        this.Utils.warnTips('请上传icon');
                        return;
                    }
                    if (!item.name || item.name === '') {
                        this.Utils.warnTips('请填写名称');
                        return;
                    }
                    if (!item.url || item.url === '') {
                        this.Utils.warnTips('请填写地址');
                        return;
                    }
                    if (item.url.indexOf('%s') < 0) {
                        this.Utils.warnTips('搜索地址中必须含有%s');
                        return;
                    }
                }
                this.openUserInfo.ext.searchEngineList = this.searchEngineList;
                this.$store.commit('uOpenUserInfo', this.openUserInfo);
                this.Utils.successTips('保存成功');
            },
            selectIcon(index) {
                this.index = index;
                document.querySelector('#selectIcon').click();
            },
            upLoadFile() {
                let appCode = this.Utils.getCommonReq({}).appCode;

                let param = new FormData();
                param.append("appCode", appCode);
                // 通过append向form对象添加数据
                param.append("file", document.querySelector('#selectIcon').files[0]);
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
                        this.Utils.errorTips(response.message);
                        return;
                    }
                    this.searchEngineList[this.index].icon = response.data;
                });
            },
            addSearchEngine() {
                // console.log('addSearchEngine1', this.searchEngineList);
                this.searchEngineList.push(
                    {
                        url: '',
                        name: '',
                        icon: ''
                    }
                );
                // console.log('addSearchEngine2', this.searchEngineList);
            },
            delSearchEngine(index) {
                if (this.searchEngineList.length == 1) {
                    this.Utils.warnTips('请至少保留一个');
                    return;
                }
                this.searchEngineList.splice(index, 1)
            },
            getSearchEngine() {
                this.searchEngineList = [].concat(JSON.parse(JSON.stringify(this.openUserInfo.ext.searchEngineList)));
                console.log('getSearchEngine', this.searchEngineList)
                if (this.searchEngineList.length > 0) {
                    return;
                }
                this.Utils.getSearchEngine(list => {
                    this.searchEngineList = list;
                });

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
        height: 300px;
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


    @media screen and (max-width: 700px) {


    }

</style>