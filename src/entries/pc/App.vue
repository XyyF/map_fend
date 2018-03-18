<template>
    <div class="root-page">
        <router-view class="root"></router-view>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapGetters} from 'vuex'
    import { Toast } from 'mint-ui'
    import VueRouter from 'vue-router';
    import router from './router.js';
    import store from './store';

    Vue.use(VueRouter);
    Vue.component(Toast.name, Toast);

    export default {
        name: 'app',
        computed: {
            ...mapGetters({
                vxIsLoggedIn: 'account/isLoggedIn'
            })
        },
        // 通过 router 配置参数注入路由，从而让整个应用都有路由功能
        router,
        store,
        mounted() {
            Vue.prototype.toast = Toast
            this.$nextTick(() => {
                if (!this.vxIsLoggedIn) {
                    this.$router.push({name: 'login'})
                }
            })
        }
    }
</script>

<!-- 全局样式-->
<style lang="scss" src="./styles/basic.scss"></style>
<style src="./styles/iconfont.css"></style>
<style src="./styles/iconfont_all/iconfont.css"></style>

<style lang="scss" rel="stylesheet/scss">
    .root-page {
        width: 297px;
        height: 590px;
        background: url('./images/phone.svg');
        margin: 0 auto;
        position: relative;
    }
    .amap-sug-result {
        max-width: 267px;
        overflow-x: hidden;
    }
    .root {
        width: 267px;
        height: 462px;
        position: absolute;
        left: 15px;
        top: 61px;
        overflow-y: scroll;
        &::-webkit-scrollbar { /* 滚动条整体部分 */
            width: 2px;
        }
        &::-webkit-scrollbar-button { /* 滚动条两端的按钮 */
            width: 0;
            height: 0;
        }
        &::-webkit-scrollbar-track { /* 外层轨道 */
            border-right: 1px solid transparent;
            border-left: 1px solid transparent;
        }
        &::-webkit-scrollbar-track-piece { /*内层轨道，滚动条中间部分 */
            background-color: #FFF;
            border-radius: 10px;
        }
        &::-webkit-scrollbar-thumb { /* 滑块 */
            border-radius: 8px;
            background: #CBCBCB;
        }
        &::-webkit-scrollbar-corner { /* 边角 */
            display: block;
        }
        &::-webkit-scrollbar-thumb:hover { /* 鼠标移入滑块 */
            background: #909090;
        }
    }
</style>
