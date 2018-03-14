<template>
    <div class="root-page-wrap">
        <div id="container"></div>
        <div class="shadow" v-if="showSearch"></div>
        <div id="searchBox" ref="searchBox" :class="{'show-search': showSearch}">
            <div v-if="showSearch" class="return" @click="returnMap"><</div>
            <input id="tipinput" ref="tipinput" type="input" placeholder="请输入关键字搜索"/>
            <div id="clearSearchBtn" ref="clearSearchBtn">
                <div class="del">&#10005;</div>
            </div>
        </div>
        <!-- 结果面板 -->
        <div id="panel" ref="panel" :class="{'empty': showEmpty, 'hidden': showHidden}">
            <!-- 隐藏按钮 -->
            <a id="showHideBtn" ref="showHideBtn"></a>
            <div id="emptyTip" ref="emptyTip">没有内容！</div>
            <!--搜索结果列表 -->
            <div id="poiList" ref="poiList"></div>
        </div>
        <!-- loading -->
        <div id="loader" ref="loader"></div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import Search from './components/search.vue'

    export default {
        name: 'map-page',
        data() {
            return {
                showSearch: false,
                showEmpty: false,
                showHidden: true,
                map: {},
                AMap: {},
            };
        },
        components: {
            Search,
        },
        methods: {
            ...mapActions({
                vxSetMap: 'setMap'
            }),
            returnMap() {
                this.showSearch = false
            },
            init() {
                const AMap = this.AMap = window.AMap;
                this.map = new AMap.Map('container', {
                    resizeEnable: true,
                    zoom: 11,
                });
                this.vxSetMap({AMap, map: this.map});
                this.initPlugins();
                this.initServices()
            },
            // 缩放、小地图预览、定位
            initPlugins() {
                const AMap = this.AMap;
                AMap.plugin(['AMap.Scale', 'AMap.OverView', 'AMap.Geolocation'], /* 'AMap.ToolBar', */
                    () => {
                        // this.map.addControl(new AMap.ToolBar());
                        // 缩放插件
                        this.map.addControl(new AMap.Scale());

                        // 定位插件
                        const geolocation = new AMap.Geolocation({
                            buttonOffset: new AMap.Pixel(10, 50),
                            zoomToAccuracy: true,
                            circleOptions: {
                                map: this.map,
                                cursor: 'cur',
                            }
                        });
                        this.map.addControl(geolocation);
                        // 获取当前定位
                        geolocation.getCurrentPosition();

                        // 右下角小地图预览插件
                        this.map.addControl(new AMap.OverView({isOpen: false}));
                    });
            },
            // 搜索、自动完成input
            initServices() {
                // 加载PlaceSearch和Autocomplete插件
                const that = this;
                const AMap = this.AMap;
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
                const AMap = this.AMap;
                const map = this.map;
                // 搜索框支持自动完成提示
                const auto = new AMap.Autocomplete({
                    input: 'tipinput'
                });
                // 构造地点查询类
                const placeSearch = new AMap.PlaceSearch({
                    pageSize: 5,
                    pageIndex: 1,
                    map,
                    panel: 'poiList'
                });
                // 监听搜索框的提示选中事件
                AMap.event.addListener(auto, 'select', (e) => {
                    this.showSearch = false;
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
                that.$refs.showHideBtn.onclick = () => {
                    that.showHidden = !that.showHidden;
                };
                that.$refs.clearSearchBtn.onclick = () => {
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
            this.init();
            this.$nextTick(() => {
                this.$refs.tipinput.onfocus = () => {
                    this.showSearch = true
                }
            })
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "../../../../components/pc/styles/basic_const";

    .root-page-wrap {
        width: 267px;
        height: 462px;
        position: absolute;
        left: 15px;
        top: 61px;

        .shadow {
            -webkit-flex: 1;
            width: 100%;
            height: 100%;
            background-color: #fff;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 950;
        }

        #container {
            -webkit-flex: 1;
            width: 100%;
            height: 100%;
        }

        #panel {
            height: 43%;
            -webkit-flex: 0 0 auto;
            overflow: visible;
            border-top: 1px solid #ccc;
            position: relative;
            z-index: 999;
            top: -199px;
            /*-webkit-transition: all 0.2s;*/
        }

        #showHideBtn {
            display: block;
            position: absolute;
            width: 63px;
            height: 32px;
            text-align: center;
            margin: 0 auto;
            left: 0;
            right: 0;
            top: -25px;
        }

        #showHideBtn:after,
        #showHideBtn:before {
            content: "";
            width: 0;
            height: 0;
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
            cursor: pointer;
        }

        #showHideBtn:before {
            width: 60px;
            height: 30px;
            background: rgba(255, 255, 255, 0.9);
            top: 0;
            border-radius: 30px 30px 0 0;
            border: 1px solid #ccc;
            border-bottom: 0;
        }

        #showHideBtn:after {
            content: "";
            top: 7px;
            border: 10px solid rgba(255, 0, 0, 0);
            z-index: 99999;
            border-top-color: #ccc;
            /* -webkit-transition: all 0.2s;*/
        }

        #poiList {
            -webkit-overflow-scrolling: touch;
            width: 100%;
            height: 100%;
            overflow: scroll;
            position: relative;
            background: #fff;
        }

        #poiList .amap_lib_placeSearch {
            border: none;
        }

        #panel.hidden {
            height: 0;
            top: 1px;
        }

        #panel.hidden #showHideBtn {
            /*  top: -200px;*/
        }

        #panel.hidden #showHideBtn:after {
            /*  -webkit-transform: rotate(180deg);
           -webkit-transform-origin: 50% 4px;*/
            top: -5px;
            border-bottom-color: #ccc;
            border-top-color: transparent;
        }

        #panel .amap_lib_placeSearch .pageLink {
            font-size: 120%;
            margin: 0 3px;
        }

        #searchBox {
            position: absolute;
            width: 90%;
            margin: 0 auto;
            left: 0;
            right: 0;
            z-index: 999;
            top: 15px;
            height: 30px;
            transition: all .3s;
        }

        #tipinput {
            width: 100%;
            height: 30px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
            line-height: 30px;
            padding: 0 7px;
            box-sizing: border-box;
        }

        #clearSearchBtn {
            position: absolute;
            right: 0;
            top: 0;
            margin: auto;
            width: 20px;
            height: 20px;
            padding: 5px;
            text-align: center;
            vertical-align: middle;
            font-size: 14px;
            color: #999;
        }

        #clearSearchBtn .del {
            background: #eee;
            border-radius: 12px;
            width: 100%;
            height: 100%;
        }

        #page.searching #clearSearchBtn {
            display: none;
        }

        #loader {
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 1;
            margin: -75px 0 0 -75px;
            border: 16px solid #eee;
            border-radius: 50%;
            border-top: 16px solid #0b83ea;
            width: 120px;
            height: 120px;
            -webkit-animation: spin 2s linear infinite;
            animation: spin 2s linear infinite;
            display: none;
        }

        @-webkit-keyframes spin {
            0% {
                -webkit-transform: rotate(0deg);
            }
            100% {
                -webkit-transform: rotate(360deg);
            }
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        .searching #loader {
            display: block;
        }

        .searching #page {
            filter: grayscale(1);
            opacity: 0.5;
        }

        #panel.empty #showHideBtn {
            opacity: 0.5;
        }

        #emptyTip {
            display: none;
        }

        #panel.empty #emptyTip {
            display: block;
            position: relative;
            background: #fff;
            width: 100%;
            text-align: center;
            padding: 30px 0;
            color: #666;
        }

        .poi-more {
            display: none !important;
        }

        .amap-toolbar {
            top: 64px !important;
        }
        .amap-logo {
            display: none;
        }
        .amap-geolocation-con {
            z-index: 900 !important;
        }

        .show-search {
            width: 100% !important;
            top: 0 !important;
            display: flex;
            .return {
                width: 30px;
                cursor: pointer;
                text-align: center;
            }
        }
    }
</style>
