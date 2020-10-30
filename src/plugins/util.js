// import axios from "axios";
// import Vue from 'vue'
// import Vue from "vue/types/vue";

// let Vue = '';

export default class Utils {

    static setVue(Vue) {
        this.Vue = Vue;
    }

    /**
     * 判断字符串是否为空
     * @param str
     * @returns {boolean}
     */
    static isNull(str) {
        return str == null || str.length === 0 || str === '';
    }

    /**
     *
     * @desc  判断是否为身份证号
     * @param  {String|Number} str
     * @return {Boolean}
     */
    static isIdCard(str) {
        return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str)
    }

    /**
     *
     * @desc   判断是否为手机号
     * @param  {String|Number} str
     * @return {Boolean}
     */
    static isPhoneNum(str) {
        return /^(0|86|17951)?(1[3-9][0-9])[0-9]{8}$/.test(str)
    }

    static postJson(url, data, config) {
        let defaultConfig = {
            headers: {
                'Cache-Control': 'no-cache'
            }
        };
        if (config) {
            defaultConfig = config;
        }

        // if (url.indexOf('setUserExtInfo') < 0) {
        //     this.showLoading();
        // }


        let loadingDom = this.Vue.$loading();

        return new Promise((resolve, reject) => {
            window.console.info('req url, ', url, '\nreq param, ', data);
            this.Vue.axios.post(url, data, defaultConfig).then(res => {
                loadingDom.remove();
                window.console.info('get resopnse sucess, ', res.data);
                resolve(res.data);
            }).catch(error => {
                loadingDom.remove();
                window.console.error('axios post error, ', error);
                reject(error);
            });
        });
    }


    static getStream(url, params) {
        return new Promise((resolve, reject) => {
            this.Vue.axios.get(url, {
                params: params,
                responseType: 'arraybuffer'
            }).then(response => {
                return 'data:image/png;base64,' + btoa(new Uint8Array(response.data)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
            }).then(data => {
                resolve(data);
            }).catch(error => {
                window.console.error('axios post error, ', error);
                reject(error);
            });

        });
    }

    // static postJson(url, data, callback) {
    //     window.console.log('req url, ', url, '\nreq param, ', data);
    //     axios.post(url, data).then(function (response) {
    //         window.console.log('get resopnse sucess, ', response.data);
    //         callback(response.data);
    //     }).catch(function (error) {
    //         window.console.error('axios post error, ', error);
    //     });
    // }

    static getJson(url, data) {
        let loadingDom = this.Vue.$loading();
        return new Promise((resolve, reject) => {
            // window.console.info('req url, ', url, '\nreq param, ', data);
            this.Vue.axios.get(url, {params: data}).then(res => {
                loadingDom.remove();
                // window.console.info('get resopnse sucess, ', res.data);
                resolve(res.data);
            }).catch(error => {
                loadingDom.remove();
                window.console.error('axios getJson error, ', error);
                reject(error);
            });
        })
    }

    // static getJson(url, data, callback) {
    //     window.console.log('req url, ', url, '\nreq param, ', data);
    //     this.Vue.axios.get(url, {params: data}).then(function (response) {
    //         window.console.log('get resopnse sucess, ', response.data);
    //         callback(response.data);
    //     }).catch(function (error) {
    //         window.console.error('axios getJson error, ', error);
    //     });
    // }

    static setUserInfo(openUserInfo) {
        if (localStorage) {
            localStorage.setItem("openUserInfo", JSON.stringify(openUserInfo));
        }
    }

    static getUserInfo() {
        // https://www.myindex.top?u=heartaotime&p=123
        // const userName = this.getReqParam('u');
        // const password = this.getReqParam('p');
        // if (userName != null && userName !== '' && password != null && password !== '') {
        //     const param = {
        //         username: userName,
        //         password: password
        //     };
        //     this.Util.postJson("/common-server/user/api/v1/login", param).then(response => {
        //         if (response.code !== 0) {
        //             // alert('账号/密码错误');
        //             return;
        //         }
        //         if (localStorage) {
        //             localStorage.clear();
        //         }
        //         this.Util.setUserInfo(response.userInfo);
        //     });
        // }

        if (localStorage && localStorage.getItem("openUserInfo")) {
            // console.log('get userinfo from localStorage is exist');
            return JSON.parse(localStorage.getItem("openUserInfo"));
        }
        return;
    }

    static removeUserInfo() {
        if (localStorage) {
            localStorage.removeItem("openUserInfo");

        }
        window.location.reload();
    }

    static clearLocalStorage() {
        if (localStorage) {
            localStorage.clear();
        }
        window.location.reload();
    }

    static getReqParam(name) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        const r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
        if (r != null) return unescape(r[2]);
        return null;
    }

    static getStaticData(codeType) {
        let request = {
            codeType
        };
        let url = '/common-server/user/api/v1/getStaticData';
        return new Promise((resolve, reject) => {
            Utils.postJson(url, request).then(response => {
                if (response && response.code === '0') {
                    resolve(response.result);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    static getGuide(guideParentCode) {
        let recursion = false;
        if (guideParentCode === 'GUIDE_PURE_COLORS') {
            recursion = true;
        }
        const request = {
            param: {
                guideParentCode
            },
            pageFlag: false,
            readRedis: true,
            recursion
        };
        const url = '/common-server/guide/api/v1/getGuide';
        return new Promise((resolve, reject) => {
            Utils.postJson(url, request).then(response => {
                // Utils.convertToJson(response.result);
                if (response && response.code === '0') {
                    resolve(response.data.list);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    static getGuidePage(guideParentCode, pageNum, pageSize) {
        const request = {
            param: {
                guideParentCode
            },
            pageFlag: true,
            pageNum,
            pageSize
        };
        const url = '/common-server/guide/api/v1/getGuide';
        return new Promise((resolve, reject) => {
            Utils.postJson(url, request).then(response => {
                // Utils.convertToJson(response.result);
                if (response && response.code === '0') {
                    resolve(response.data);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }


    static convertToJson(result) {
        for (let i = 0; i < result.length; i++) {
            const extInfo = result[i].extInfo;
            if (extInfo && extInfo !== '') {
                result[i].extInfo = JSON.parse(extInfo);
                // that.$set(result[i], 'extInfo', JSON.parse(extInfo));
                Utils.convertToJson(extInfo)
            }
        }
    }

    static getGuideByParentCode(guideParentCode, callback) {
        const param = {
            guideParentCode
        };
        Utils.postJson("/common-server/guide/api/v1/getGuide", param, function (response) {
            callback(response.result);
        });
    }

    static getYYYYMMDD() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth();
        const day = date.getDate();
        return year + '' + month + '' + day;
    }

    static generateUUID() {
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    static scrollToNav() {
        let scrollNav = document.getElementById("scrollNav");
        let endPoint = scrollNav.offsetTop - 80;
        window.scrollTo({
            top: endPoint,
            behavior: "smooth"
        });
    }

    static getActiveIndex(list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].active) {
                return i;
            }
        }
        return 0;
    }

    static getActiveGuideCode(list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].active) {
                return list[i].guideCode;
            }
        }
        return '';
    }


    static uCardStyle(cardTransparency) {
        let elements = document.querySelectorAll('.card');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = 'rgba(255, 255, 255, ' + (1 - cardTransparency / 10) + ')';
        }
    }

    static pop(config) {
        // history.pushState({page: 1}, config.title, "?page=" + config.componentName);
        // history.pushState(null, config.title, null);
        this.Vue.$store.commit('uPopConfig', config);
    }

    static closePop() {
        // 只更新 show 一个 字段为 false， 其他 字段 置空（componentName），可以保证每次点击显示时，总是能重新加载对应的子组件
        this.Vue.$store.commit('uPopConfig', {
            show: false
        });
    }

    static tips(title, content, msgType) {
        this.Vue.$store.commit('uTipsConfig', {
            show: true,
            title: title,
            content: content,
            msgType: msgType
        });
    }

    static successTips(content) {
        this.Vue.$store.commit('uTipsConfig', {
            show: true,
            title: '成功',
            content: content,
            msgType: 'success'
        });
    }

    static warnTips(content) {
        this.Vue.$store.commit('uTipsConfig', {
            show: true,
            title: '警告',
            content: content,
            msgType: 'warn'
        });
    }

    static errorTips(content) {
        this.Vue.$store.commit('uTipsConfig', {
            show: true,
            title: '失败',
            content: content,
            msgType: 'error'
        });
    }

    static showLoading() {
        this.Vue.$store.commit('uLoadingConfig', {
            show: true
        });
    }

    static hideLoading() {
        this.Vue.$store.commit('uLoadingConfig', {
            show: false
        });
    }

    static saveUserInfoExt() {
        // window.console.log(this.Vue.$store.getters.openUserInfo);

        // 保存数据到数据库
        let url = '/common-server/user/api/v1/saveUserInfoExt';
        // openUserInfo.user.id

        let data = {
            param: {
                userId: this.Vue.$store.getters.openUserInfo.user.id,
                saveData: this.Vue.$store.getters.openUserInfo
            }
        };
        this.Vue.axios.post(url, data).then(res => {
            let response = res.data;
            if (!response || response.code !== '0') {
                this.errorTips('同步失败');
                return;
            }
            this.successTips('同步成功');
            // window.console.log(response);
        }).catch(error => {
            this.errorTips(error);
            window.console.error('axios post error, ', error);
        });
    }

    static getCommonReq(param) {
        return {
            // appCode: 'b198c18f49354a51984581cc124d985b',
            appCode: 'f0fb4bed6b664cfebbb30a688a4c8e3f',
            param
        }
    }

    static host() {
        return 'https://www.myindex.top/';
    }

    static basicUrl() {
        return 'https://www.myindex.top/api';
        // return 'http://127.0.0.1:5555/api';
        // return 'http://139.186.66.121/api';
    }

    static isPhone() {
        let clientWidth = document.body.clientWidth; // 网页可见区域宽
        if (clientWidth > 700) {
            return false;
        }
        return true;
    }

    static getSearchEngine(callback) {
        let url = this.basicUrl() + '/common/v1/getOpenStaticData';
        let param = {
            "codeType": 'SEARCH_ENGINES'
        };
        param = this.getCommonReq(param);
        param.pageFlag = false;

        this.postJson(url, param).then(response => {
            if (!response || response.code !== '0') {
                this.errorTips(response.message);
                return;
            }

            let list = [];
            for (let i = 0; i < response.data.list.length; i++) {
                let item = response.data.list[i];
                let uuid = this.generateUUID();
                list.push({
                    url: item.codeValue,
                    name: item.codeName,
                    icon: item.bigData,
                    uuid: uuid
                });
            }
            callback(list);
        });
    }

    static upLoadFile(ele) {
        let appCode = this.getCommonReq({}).appCode;

        let param = new FormData();
        param.append("appCode", appCode);
        // 通过append向form对象添加数据
        param.append("file", ele.files[0]);
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

        return new Promise((resolve, reject) => {
            this.postJson('https://www.myindex.top/api/common/v1/upload', param, config).then(response => {
                if (!response || response.code !== '0') {
                    this.Vue.$toast(response.message);
                    return;
                }
                resolve(response.data);
            }).catch(error => {
                reject(error);
            });
        });
        // this.postJson('https://www.myindex.top/api/common/v1/upload', param, config).then(response => {
        //     if (!response || response.code !== '0') {
        //         this.Vue.$toast(response.message);
        //         return;
        //     }
        //     url(response.data);
        // });
    }

    static isType(obj) {
        var type = Object.prototype.toString.call(obj);
        if (type == '[object Array]') {
            return 'Array';
        } else if (type == '[object Object]') {
            return "Object"
        } else {
            return 'param is no object type';
        }
    }

    static isObject(obj) {
        var type = Object.prototype.toString.call(obj);
        if (type == '[object Object]') {
            return true;
        }
        return false;
    }

    static isArray(obj) {
        var type = Object.prototype.toString.call(obj);
        if (type == '[object Array]') {
            return true;
        }
        return false;
    }

    static go2Link(url, target) {
        let a = document.createElement('a');
        a.href = url;
        if (target) {
            a.target = target;
        }
        a.click();
        a.remove();
    }

    static scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    static go2Router(name) {
        this.Vue.$router.push({name});
    }

    static convert(json) {
        return JSON.parse(JSON.stringify(json));
    }


}