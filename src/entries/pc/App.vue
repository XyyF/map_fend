<template>
    <div class="root-page">
        <router-view class="root"></router-view>
    </div>
</template>

<script>
    import Vue from 'vue';
    import VueRouter from 'vue-router';
    import router from './router.js';
    import store from './store';

    Vue.use(VueRouter);

    export default {
        name: 'app',
        // 通过 router 配置参数注入路由，从而让整个应用都有路由功能
        router,
        store,
    }
</script>

<!-- 全局样式-->
<style lang="scss" src="./styles/basic.scss"></style>
<style src="./styles/iconfont.css"></style>
<style src="./styles/iconfont_all/iconfont.css"></style>

<style>
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

    }
</style>
