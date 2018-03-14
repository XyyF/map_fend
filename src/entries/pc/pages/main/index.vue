<template>
    <div class="page-index">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'index',
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../../../components/pc/styles/basic_const";

    .page-index {
        height: 100%;
        width: 100%;
        background: white;
        .content {
            margin-left: $sideMenuWidth;
            overflow: auto;
            position: relative;
        }
        &.hidden-scroll {
            overflow: hidden;
        }
    }
</style>
