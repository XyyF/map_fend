<template>
    <div class="user-wrap">
        <div class="return">
            <span @click="returnMap" class="return-button"><i class="el-icon-arrow-left"></i></span>
            <span>个人资料</span>
        </div>
        <div class="detail-wrap">
            <small-avatar></small-avatar>
            <div class="detail">
                <mt-cell title="昵称" :value="vxMyAccount.name" is-link @click.native="goToEditName"></mt-cell>
            </div>
            <div class="detail">
                <mt-cell title="手机号" :value="filterPhone(vxMyAccount.phone)" is-link @click.native="goToEditPhone"></mt-cell>
            </div>
            <div class="detail">
                <mt-cell title="密码" value="设置" is-link @click.native="goToEditPassword"></mt-cell>
            </div>
        </div>
        <div class="sign-out" @click="signOut">退出登录</div>
    </div>
</template>

<script>
    import { Toast, Cell } from 'mint-ui';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import {Button} from 'meetin-sass-ui'
    import smallAvatar from 'components/common/small_avatar.vue'

    export default {
        name: 'user-wrap',
        data() {
            return {
                loading: false,
            };
        },
        components: {
            smallAvatar,
            [Toast.name]: Toast,
            [Cell.name]: Cell,
            [Button.name]: Button,
        },
        computed: {
            ...mapState({
                vxMyAccount: state => state.account.myAccount
            }),
            ...mapGetters({
                vxIsLoggedIn: 'account/isLoggedIn'
            })
        },
        methods: {
            ...mapActions({
                vxSignOut: 'account/signOut'
            }),
            returnMap() {
                this.$router.push({name: 'map'})
            },
            signOut() {
                this.vxSignOut().then(() => {
                    Toast('退出登录成功！');
                    this.$router.push({name: 'login'})
                })
            },
            filterPhone(val) {
                return String(val).replace(/^(\d{3})\d*(\d{4})$/, (mat, $1, $2) => {
                    return `${$1}****${$2}`
                })
            },
            goToEditName() {
                this.$router.push({name: 'editName'})
            },
            goToEditPhone() {
                this.$router.push({name: 'editPhone'})
            },
            goToEditPassword() {
                this.$router.push({name: 'editPassword'})
            }
        },
        mounted() {
            this.$nextTick(() => {
                if (!this.vxIsLoggedIn) {
                    this.$router.push({name: 'login'})
                }
            })
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "../../../../components/pc/styles/basic_const";

    .user-wrap {
        background-color: #f4f5f8;
        .detail-wrap {
            display: flex;
            flex-flow: column nowrap;
            justify-content: flex-start;
            align-items: center;
            padding: 30px 20px;
            margin-top: 10px;
            background: #fff;
            border-top: 1px solid transparent;
            .detail {
                width: 100%;
                border-bottom: 1px solid #f4f5f8;
                .mint-cell-title {
                    font-size: 15px;
                }
            }
            .unit {
                color: rgb(72, 186, 251);
            }
            .unit-wrap {
                cursor: pointer;
            }
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
        .sign-out {
            background-color: #fff;
            text-align: center;
            margin-top: 10px;
            padding: 10px;
            font-size: 15px;
            color: #ff5500;
            cursor: pointer;
        }
        .small-avatar {
            width: 100px;
            height: 100px;
        }
        .el-form {
            margin-top: 30px;
        }
        .submit-button {
            width: 100%;
            text-align: center;
            .unit {
                font-size: 12px;
            }
            .register {
                color: #0366d6;
                cursor: pointer;
            }
        }
    }
</style>
