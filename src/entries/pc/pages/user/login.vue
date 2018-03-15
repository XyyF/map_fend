<template>
    <div class="user-wrap">
        <div class="return">
            <span @click="returnMap" class="return-button"><i class="el-icon-arrow-left"></i></span>
            <span>登录</span>
        </div>
        <div class="detail-wrap">
            <small-avatar></small-avatar>
            <mt-form ref="userForm" class="info-form" :labelWidth="'70px'" labelPosition="left"
                     :formFormatData="userFormat"
                     v-model="userInfo"
            ></mt-form>
            <div class="submit-button">
                <el-button size="samll" :disabled="loading" @click.native="signIn" type="primary">登录</el-button>
                <span class="unit">没有账号？</span><span class="unit register" @click="goToRegister">注册</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { Toast } from 'mint-ui';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import {Form, FormItemType} from 'meetin-components'
    import {Button} from 'meetin-sass-ui'
    import smallAvatar from 'components/common/small_avatar.vue'

    export default {
        name: 'user-wrap',
        data() {
            return {
                loading: false,
                userInfo: {
                    phone: '',
                    password: '',
                },
                userFormat: [{
                    prop: 'phone',
                    label: '账号',
                    type: FormItemType.INPUT,
                    validator: {type: 'string', required: true, message: '请输入手机号', trigger: 'change'},
                }, {
                    prop: 'password',
                    label: '密码',
                    type: FormItemType.PASSWORD,
                    validator: {type: 'string', required: true, message: '请输入密码', trigger: 'change'},
                }]
            };
        },
        components: {
            smallAvatar,
            [Toast.name]: Toast,
            [Form.name]: Form,
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
                vxSignIn: 'account/signIn'
            }),
            signIn() {
                this.loading = true;
                this.$refs.userForm.validate()
                    .then(() => {
                        // 组合数据
                        const signIn = {
                            phone: this.userInfo.phone,
                            password: this.userInfo.password
                        };
                        this.vxSignIn(signIn).then(() => {
                            Toast('登录成功！');
                            this.$router.push({name: 'user'})
                        });
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            goToRegister() {
                this.$router.push({name: 'register'})
            },
            returnMap() {
                this.$router.push({name: 'map'})
            },
        },
        mounted() {
            this.$nextTick(() => {
                if (this.vxIsLoggedIn) {
                    this.$router.push({name: 'user'})
                }
            })
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "../../../../components/pc/styles/basic_const";

    .user-wrap {
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
        .detail-wrap {
            display: flex;
            flex-flow: column nowrap;
            justify-content: flex-start;
            align-items: center;
            padding: 30px 20px;
            margin-top: 10px;
            background: #fff;
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
