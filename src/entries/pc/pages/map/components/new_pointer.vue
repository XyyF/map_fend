<template>
    <div class="new-pointer">
        <div class="return">
            <span @click="returnMap" class="return-button"><i class="el-icon-arrow-left"></i></span>
            <span>新建点标记</span>
        </div>
        <div class="pointer-wrap">
            <mt-cell title="地址" :value="pointName"></mt-cell>
        </div>
        <div class="pointer-new">
            <mt-field label="标题"
                      :attr="{ 'maxlength': 20 }"
                      placeholder="请输入点标记标题" v-model="title"></mt-field>
            <mt-field label="内容" type="textarea" rows="4" placeholder="请输入点标记内容" v-model="snippet"></mt-field>
        </div>
        <mt-button class="button" type="primary" :disabled="disabledButton" @click.native="newPoint">确定</mt-button>
    </div>
</template>

<script>
    import { Cell, Field, Button } from 'mint-ui';
    import {mapActions} from 'vuex'
    import commonUtils from 'utils/common_utils';

    export default {
        name: 'pointer',
        data() {
            return {
                pointer: commonUtils.sessionStorage.POINTER,
                title: '',
                snippet: ''
            };
        },
        components: {
            [Field.name]: Field,
            [Cell.name]: Cell,
            [Button.name]: Button,
        },
        computed: {
            pointName() {
                return this.pointer.regeocode.formattedAddress
            },
            disabledButton() {
                return !this.title || !this.snippet
            }
        },
        methods: {
            ...mapActions({
                vxNewPoint: 'point/newPoint'
            }),
            returnMap() {
                this.$router.push({name: 'map'})
            },
            newPoint() {
                this.vxNewPoint({
                    longitude: this.pointer.longitude,
                    latitude: this.pointer.latitude,
                    address: this.pointName,
                    title: this.title,
                    snippet: this.snippet,
                }).then(() => {
                    this.toast('创建点标记成功');
                    this.$router.push({name: 'map'})
                })
            },
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">

    .new-pointer {
        background-color: #f4f5f8;
        .return {
            padding: 0 10px;
            cursor: pointer;
            font-size: 16px;
            text-align: center;
            line-height: 35px;
            border-bottom: 1px solid #9fb9cc;
            background-color: #fff;
            .return-button {
                float: left;
            }
        }
        .pointer-wrap {
            width: 100%;
            margin-top: 10px;
            background-color: #fff;
            padding: 30px 0;
        }
        .mint-cell-title {
            margin-right: 10px;
        }
        .mint-cell-text {
            white-space: nowrap;
        }
        .pointer-new {
            width: 100%;
            margin-top: 10px;
            .mint-cell-title {
                font-size: 15px;
                flex: 1;
            }
            .mint-cell-value {
                flex: 2;
            }
        }
        .button {
            display: block;
            width: 90%;
            margin: 10px auto 0;
        }
    }
</style>
