<template>
    <div class="module">
        <!--        <pre>{{JSON.stringify(model, null, 4)}}</pre>-->

        <div class="login" v-show="loginShow">

            <div class="row">
                <span>登陆账号</span>
                <input spellcheck="false" v-model="user.userName" placeholder="请输入登陆账号" @change="checkUserExist(1)"/>
            </div>
            <div class="row">
                <span>密码</span>
                <input spellcheck="false" v-model="user.passWord" type="password" placeholder="请输入密码"/>
            </div>

            <div class="row" v-show="showRegist">
                <span>确认密码</span>
                <input spellcheck="false" v-model="user.passWord2" type="password" placeholder="请再次输入密码"/>
            </div>

            <div class="row" v-show="showRegist">
                <span>邮箱</span>
                <input spellcheck="false" v-model="user.email" placeholder="请输入邮箱" @change="checkUserExist(2)"/>
            </div>

            <div class="row verifyCode" v-show="showRegist">
                <span>验证码</span>
                <input spellcheck="false" v-model="user.verifyCode" placeholder="请输入验证码"/>
                <button @click="sendEmail()">发送</button>
            </div>

            <div class="row" v-show="!showRegist">
                <button @click="login()">登 陆</button>
            </div>

            <div class="row">
                <button style="background-color: orange;" @click="registUser()">注 册</button>
            </div>

            <div class="row">
                <span>提示：</span>
                <span>1.没有账号可以先点击注册</span>
                <span>2.登陆账号后，可以同步你的自定义数据哦</span>
                <span>3.邮箱也可以用来登陆</span>
            </div>

        </div>

        <div v-show="!loginShow" class="info">
            <div class="user-info">
                <span>{{openUserInfo.user.userName}} 你好</span>
                <img src="../assets/img/logout.svg" title="退出登陆" @click="logout()"/>
                <span>tips: 如遇部分问题，尝试点击左侧登出按钮，并重新登陆</span>
            </div>
            <div>
                施工中...
            </div>
            <!--            <textarea v-model="showUserInfo" spellcheck="false"></textarea>-->
            <!--            <div class="operation">-->
            <!--                <button @click="save(1)">保存到本地</button>-->
            <!--                <button @click="save(2)">保存到本地,并同步到服务器</button>-->
            <!--                <button @click="save(3)">清空本地和服务器个性化设置</button>-->
            <!--            </div>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: "User",
        components: {},
        data() {
            return {
                loginShow: true,
                user: {
                    userName: '',
                    passWord: '',
                    passWord2: '',
                    email: '',
                    verifyCode: '',
                    birthday: '',
                    nickName: '',
                },
                showUserInfo: {},
                showRegist: false
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
                    this.init();
                },
                deep: true
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            registUser() {
                if (this.showRegist) {
                    if (this.user.userName == '' || this.user.passWord == '' || this.user.email == '' || this.user.verifyCode == '') {
                        this.Utils.warnTips('请先填写信息后在提交');
                        return;
                    }

                    if (this.user.passWord !== this.user.passWord2) {
                        this.Utils.warnTips('两次填写的密码不一致');
                        return;
                    }

                    let url = this.Utils.basicUrl() + '/user/v1/registUser';
                    let param = {
                        "userName": this.user.userName,
                        "passWord": this.user.passWord,
                        "email": this.user.email,
                        "verifyCode": this.user.verifyCode
                    };

                    this.Utils.postJson(url, this.Utils.getCommonReq(param)).then(response => {
                        if (!response || response.code !== '0') {
                            this.Utils.errorTips(response.message);
                            return;
                        }
                        this.Utils.successTips("注册成功，请登陆");
                        this.showRegist = false;
                    });
                } else {
                    this.showRegist = true;
                }
            },
            checkUserExist(type) {
                if (!this.showRegist) {
                    return;
                }
                let userName = '';
                if (type === 1) {
                    userName = this.user.userName;
                }
                if (type === 2) {
                    userName = this.user.email;
                }

                let url = this.Utils.basicUrl() + '/user/v1/checkUserExist';
                let param = {
                    userName: userName
                };

                this.Utils.postJson(url, this.Utils.getCommonReq(param)).then(response => {
                    if (!response || response.code !== '0') {
                        this.Utils.errorTips(response.message);
                        return;
                    }
                });
            },
            sendEmail() {
                let email = this.user.email;
                if (!email || email === '') {
                    this.Utils.warnTips('邮箱地址不能为空');
                    return;
                }

                let url = this.Utils.basicUrl() + '/user/v1/sendEMail';
                let param = {
                    email: email
                };

                this.Utils.postJson(url, this.Utils.getCommonReq(param)).then(response => {
                    if (!response || response.code !== '0') {
                        this.Utils.errorTips('邮件发送失败！');
                        return;
                    }

                    this.Utils.successTips('邮件发送成功，请查收邮件！');
                });

            },
            login() {

                if (this.user.userName === '' || this.user.passWord === '') {
                    this.Utils.warnTips('请输入账号和密码');
                    return;
                }

                let url = this.Utils.basicUrl() + '/user/v1/loginUser';
                let param = {
                    userName: this.user.userName,
                    passWord: this.user.passWord
                };

                this.Utils.postJson(url, this.Utils.getCommonReq(param)).then(response => {
                    if (!response || response.code !== '0') {
                        this.Utils.errorTips('登陆失败, 请核对账号密码');
                        return;
                    }
                    // this.Utils.successTips('登陆成功');

                    this.loginShow = false;

                    let user = response.data;


                    // 获取 服务器端配置
                    url = this.Utils.basicUrl() + '/user/v1/getUserExtInfo';
                    let param = {
                        userCode: user.userCode
                    };
                    this.Utils.postJson(url, this.Utils.getCommonReq(param)).then(response => {

                        let ext = this.openUserInfo.ext;
                        if (response.data != null && response.data.userSet != null && response.data.userSet != '' && response.data.userSet != {}
                            && JSON.parse(response.data.userSet).searchEngineList && JSON.parse(response.data.userSet).searchEngineList.length > 0) {
                            ext = JSON.parse(response.data.userSet);
                        }

                        this.openUserInfo.user = user;
                        this.openUserInfo.ext = ext;
                        this.$store.commit('uOpenUserInfo', this.openUserInfo);

                        if (!response || response.code !== '0') {
                            this.Utils.successTips('获取用户设置失败');
                            return;
                        }


                    });
                });
            },
            logout() {
                this.Utils.removeUserInfo();
            },
            save(type) {
                let tmp = JSON.parse(this.showUserInfo);
                tmp.user = this.openUserInfo.user;
                this.$store.commit('uOpenUserInfo', tmp);

                if (type === 1) {
                    this.Utils.successTips('保存到本地成功');
                } else if (type === 2) {
                    this.Utils.saveUserInfoExt();
                } else if (type === 3) {
                    let passwd = window.prompt('输入当前登陆用户的密码，清空本地和服务器个性化设置信息');
                    if (!passwd || passwd === '') {
                        this.Utils.warnTips('密码不能为空');
                        return;
                    }

                    // 删除 服务器端配置
                    let url = '/common-server/user/api/v1/delUserInfoExt';
                    let data = {
                        param: {
                            userId: this.openUserInfo.user.id,
                            passwd,
                        },
                    };
                    this.Utils.postJson(url, data).then(response => {
                        // window.console.log(response);
                        if (!response || response.code !== '0') {
                            this.Utils.errorTips(response.message);
                            return;
                        }
                        this.Utils.successTips('删除成功，即将刷新页面...');

                        let that = this;
                        setTimeout(function () {
                            that.logout();
                        }, 1000);

                    });

                    // let re = window.confirm('清空本地和服务器个性化设置信息');
                    // if (re) {
                    //     // 清空 todo..
                    //     alert('清空 待完成');
                    // }
                }

            },
            init() {
                let user = this.openUserInfo.user;
                if (user.userCode !== '-1') {
                    this.loginShow = false;
                }
                let tmp = JSON.parse(JSON.stringify(this.openUserInfo));
                delete tmp.user;
                this.showUserInfo = JSON.stringify(tmp, null, 4);
            },
            submit() {
                alert(JSON.stringify(this.model));
            },
            reset() {
                this.$refs.JsonEditor.reset();
            },
        },
    }
</script>

<style scoped>

    .module {
        padding: 10px 20px 0;
        display: grid;
        grid-template-columns: 1fr;

        grid-row-gap: 20px;
        /*justify-content: center;*/
        /*justify-items: center;*/
    }

    .login {
        /*height: 300px;*/

        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(auto-fit, 40px);

        grid-row-gap: 10px;
    }

    .row {
        display: grid;

        grid-template-columns: 80px 1fr;
        border: 1px solid lightgrey;
        border-radius: 3px;


        /*align-content: start;*/

        /*grid-column-gap: 20px;*/
        /*justify-content: start;*/
    }


    .row span {
        text-align: center;
        line-height: 40px;
        /*align-self: center;*/

        border-right: 1px solid lightgrey;
    }


    input {
        outline: none;
        border: none;

        padding: 0 10px;

        font-size: 15px;

        font-weight: bold;
    }

    .info {

        display: grid;
        grid-template-columns: 1fr;
        /*grid-template-rows: repeat(auto-fit, auto);*/

        grid-row-gap: 10px;

        height: 200px;

        align-content: start;

    }

    textarea {
        justify-self: center;
        height: 300px;
        width: 100%;
        font-weight: bold;

        /*去除选中状态边框*/
        outline: none;

        font-size: 15px;
        border: 2px dashed darkgray;
        /*width: calc(100% - 20px);*/
    }


    .operation {
        display: grid;
        grid-row-gap: 5px;
    }


    .user-info {
        display: grid;
        grid-template-columns: repeat(3, auto);
        justify-content: start;
        align-items: center;
        grid-column-gap: 10px;
    }

    .user-info img {
        width: 25px;
        height: 25px;
        cursor: pointer;
    }

    .user-info span:first-child {
        font-style: oblique;
        padding: 0 5px;
    }

    .user-info span:last-child {
        background-color: cornsilk;
        border-radius: 12px;
        padding: 0 5px;
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


    .operation > button:nth-child(2) {
        background-color: orange;
    }

    .operation > button:last-child {
        background-color: orangered;
    }


    button:hover {
        background: #0d79d1;
        border-color: #0f88eb;
    }

    .operation > button:nth-child(2):hover {
        background: darkorange;
        /*border-color: red;*/
    }

    .operation > button:last-child:hover {
        background: red;
        /*border-color: red;*/
    }

    .row > button {
        grid-column: 1/3;
    }

    .row:last-child {
        /*align-self: center;*/
        /*height: 150px;*/
        /*border-radius: 5px;*/

    }

    .row:last-child > span {
        grid-column: 1/3;
        padding: 0 10px;
        background-color: cornsilk;
        text-align: start;
        line-height: 25px;
    }

    /*.regist {*/
    /*    background-color: orange;*/
    /*}*/

    .verifyCode {
        display: grid;
        grid-template-columns: 80px 160px auto;
        /*grid-template-columns: repeat(3, auto);*/
    }


    .verifyCode > button {
        grid-column: unset;
    }

    @media screen and (max-width: 700px) {

        span, textarea {
            font-size: 13px;
        }

        .user-info {
            grid-template-columns: repeat(2, auto);
        }

        .user-info > span:last-child {
            grid-column: 1/3;
        }


    }

</style>