<template>
    <div class="search-wrap">
        <!-- 搜索框-->
        <div id="searchBox" ref="searchBox">
            <input id="tipinput" ref="tipinput" type="input" placeholder="请输入关键字搜索"/>
            <div id="clearSearchBtn" ref="clearSearchBtn">
                <div class="del">&#10005;</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'search-page',
        data() {
            return {

            };
        },
        computed: {
            ...mapState({
                vxMap: state => state.map,
                vxAMap: state => state.AMap,
            }),
        },
        methods: {
            // 搜索、自动完成input
            initServices() {
                // 加载PlaceSearch和Autocomplete插件
                const that = this;
                const AMap = this.vxAMap;
                AMap.service(['AMap.PlaceSearch', 'AMap.Autocomplete'], () => {
                    try {
                        that.ready();
                    } catch (e) {
                        console.error(e);
                    }
                });
            },
            ready() {
                const that = this;
                const AMap = this.vxAMap;
                // 搜索框支持自动完成提示
                const auto = new AMap.Autocomplete({
                    input: 'tipinput'
                });
                // 构造地点查询类
                const placeSearch = new AMap.PlaceSearch({
                    pageSize: 5,
                    pageIndex: 1,
                    map: this.vxMap,
                    panel: 'poiList'
                });
                // 监听搜索框的提示选中事件
                AMap.event.addListener(auto, 'select', (e) => {
                    this.$parent.showSearch = false;
                    // 设置搜索的城市
                    placeSearch.setCity(e.poi.adcode);
                    // 开始搜索对应的poi名称
                    placeSearch.search(e.poi.name, (status, results) => {
                        if (status === 'complete' && results.poiList.pois && results.poiList.pois.length > 0) {
                            that.showEmpty = !that.showEmpty;
                        }
                        // 显示结果列表
                        that.showHidden = false;
                        // 隐藏loading状态
                        document.querySelector('body').classList.remove('searching');
                    });
                    // 显示loading状态
                    document.querySelector('body').classList.add('searching');
                });

                // 检查结果列表是否为空， 为空时显示必要的提示，即#emptyTip
                function checkPoiList() {
                    that.showEmpty = that.$refs.panel.innerHTML === '';
                }

                checkPoiList();
                // 监听搜索列表的渲染完成事件
                AMap.event.addListener(placeSearch, 'renderComplete', () => {
                    checkPoiList();
                });
                // 监听marker/列表的选中事件
                AMap.event.addListener(placeSearch, 'selectChanged', (results) => {
                    // 获取当前选中的结果数据
                    console.log(results.selected.data);
                });
                that.$parent.$refs.showHideBtn.onclick = () => {
                    that.showHidden = !that.showHidden;
                };
                that.$parent.$refs.clearSearchBtn.onclick = () => {
                    // 清除搜索框内容
                    that.$refs.tipinput.value = '';
                    // 清除结果列表
                    placeSearch.clear();
                    that.showHidden = true;
                    checkPoiList();
                };
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.initServices()
            })
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "../../../../../components/pc/styles/basic_const";

    .search-wrap {


    }
</style>
