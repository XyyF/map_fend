<template>
    <div class="pointer" :class="{'is-login': vxIsLoggedIn}">
        <div class="return">
            <span @click="returnMap" class="return-button"><i class="el-icon-arrow-left"></i></span>
            <span>点标记详情</span>
        </div>
        <div class="pointer-wrap">
            <mt-cell title="地址" :value="address"></mt-cell>
        </div>
        <div class="pointer-new">
            <mt-cell title="标题" :value="title"></mt-cell>
            <mt-cell title="内容" :value="snippet"></mt-cell>
            <mt-cell title="创建者" :value="creator"></mt-cell>
        </div>
        <div class="message">
            <mt-cell title="留言"></mt-cell>
            <template v-if="!messages.length">
                <div class="message-none">暂无留言，赶快来留言吧</div>
            </template>
            <div v-for="msg in messages" class="user-message">
                <small-avatar></small-avatar>
                <div class="user-detail">
                    <p class="user-name">{{msg.manager.name}}</p>
                    <p class="user-content">{{msg.content}}</p>
                </div>
            </div>
        </div>
        <div class="leave-message" v-if="vxIsLoggedIn">
            <mt-field placeholder="说点什么吧" rows="2" type="textarea" v-model="content" disableClear>
                <i class="el-icon-arrow-right" @click="leaveMeaasge"></i>
            </mt-field>
        </div>
    </div>
</template>

<script>
    import {Cell, Field, Button} from 'mint-ui';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import commonUtils from 'utils/common_utils';
    import smallAvatar from 'components/common/small_avatar.vue'

    export default {
        name: 'pointer',
        data() {
            return {
                content: ''
            };
        },
        components: {
            [Field.name]: Field,
            [Cell.name]: Cell,
            [Button.name]: Button,
            smallAvatar,
        },
        computed: {
            ...mapState({
                vxPointDetail: state => state.point.pointDetail,
            }),
            ...mapGetters({
                vxIsLoggedIn: 'account/isLoggedIn',
            }),
            address() {
                return this.vxPointDetail.address || ''
            },
            title() {
                return this.vxPointDetail.title || ''
            },
            snippet() {
                return this.vxPointDetail.snippet || ''
            },
            messages() {
                return this.vxPointDetail.messages || []
            },
            creator() {
                const name = this.vxPointDetail.creator.name;
                return name ? `用户${name}` : ''
            },
            disabledButton() {
                return !this.title || !this.snippet
            }
        },
        methods: {
            ...mapActions({
                vxDetail: 'point/detail',
                vxLeaveMessage: 'point/leaveMessage'
            }),
            returnMap() {
                this.$router.push({name: 'map'})
            },
            leaveMeaasge() {
                this.vxLeaveMessage({
                    pointId: this.$route.query.pointId,
                    content: this.content
                }).then(() => {
                    this.toast('留言成功!');
                    this.content = ''
                })
            },
        },
        mounted() {
            this.vxDetail({
                pointId: this.$route.query.pointId
            })
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">

    .pointer {
        background-color: #f4f5f8;
        &.is-login {
            padding-bottom: 62px;
        }
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
        .pointer-new, .message {
            width: 100%;
            margin-top: 10px;
            background-color: #fff;
        }
        .message-none {
            font-size: .8em;
            padding: 0 10px;
        }
        .mint-cell-title {
            font-size: 15px;
            flex: 1;
        }
        .mint-cell-value {
            flex: 4;
        }
        .leave-message {
            width: 267px;
            position: fixed;
            bottom: 154px;
            border-top: 1px solid #888;
            .mint-field-core {
                border: 1px solid #888;
                border-radius: 20px;
                padding: 0 5px;
            }
            .el-icon-arrow-right {
                margin: 0 10px;
            }
            textarea {
                overflow: hidden;
                resize: none;
            }
        }
        .small-avatar {
            width: 30px;
            height: 30px;
        }
        .user-message {
            padding: 0 10px;
            font-size: .7em;
            display: flex;
            flex-flow: row nowrap;
            align-items: flex-start;
            min-height: 50px;
            .small-avatar {
                margin-right: 10px;
            }
            .user-detail {
                .user-name {
                    color: #888;
                    line-height: 20px;
                }
                .user-content {
                    white-space: pre-wrap;
                }
            }
        }
    }
</style>
