// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import debugNotify from 'utils/debug_notify';
import {Message} from 'meetin-sass-ui';
import moment from 'moment'
import 'moment/locale/zh-cn'
import httpRequestor from 'utils/http_requestor';
import errorCode from 'common/error_code';
import App from './App.vue'
import router from './router';
import store from './store'

Vue.config.productionTip = false

/** *****************全局变量****************** */
window.httpRequestor = httpRequestor;
// 默认请求错误处理
httpRequestor.defaultErrorHandler = (result) => {
    // 登录态失效的统一处理逻辑
    if (result.status.code === errorCode.NOT_SIGNIN || result.status.code === errorCode.NEED_RELOGIN) {
        console.error('登录态失效', result.status.message)

        // 清空登录态
        store.commit('account/setAccount', {})

        /** 一、后台自动重定向根据微信登录的模式。回首页，触发后台重定向获取微信登录态。加relogin判断是为防止重定向循环 */
        // const loginUrl = window.gEntryBaseUrl
        // if (window.gEntryBaseUrl && window.location.pathname !== loginUrl && window.location.pathname !== `${loginUrl}/`
        //     && !location.search.includes('relogin')) {
        //     window.location.href = `${loginUrl}?relogin`
        // }

        /** 二、跳转到登录页面手动输入账号密码登录的模式 */
        const loginUrl = router.resolve({name: 'sign_in'}).href
        if (window.location.pathname !== loginUrl && window.location.pathname !== `${loginUrl}/`) {
            router.replace(`${loginUrl}?callback=${encodeURIComponent(window.location.href)}`)
        }
        return
    }
    window.devEnv = true
    if (window.devEnv) {
        debugNotify.showRequestError(result);
    } else {
        console.error(result.status.message);
    }
    Message.error(result.status.message)
}
// 本地调试需要跨域
httpRequestor.withCredentials = window.devEnv

moment.locale('zh-cn')
/* eslint-disable no-new */
new Vue(App).$mount('#app');
