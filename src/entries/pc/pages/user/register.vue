<template>
    <div class="user-wrap">
        <div class="return">
            <span @click="returnMap" class="return-button"><i class="el-icon-arrow-left"></i></span>
            <span>注册</span>
        </div>
        <div class="detail-wrap">
            <small-avatar></small-avatar>
            <mt-form ref="userForm" class="info-form" :labelWidth="'70px'" labelPosition="left"
                     :formFormatData="userFormat"
                     v-model="userInfo"
            ></mt-form>
            <div class="submit-button">
                <el-button size="samll" :disabled="loading" @click.native="signUp" type="primary">注册</el-button>
                <span class="unit">已有账号？</span><span class="unit register" @click="goToLogin">登录</span>
            </div>
        </div>
    </div>
</template>

<script>
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
                    name: '',
                    phone: '',
                    password: '',
                },
                userFormat: [{
                    prop: 'name',
                    label: '用户名',
                    type: FormItemType.INPUT,
                    validator: {type: 'string', required: true, message: '请输入手机号', trigger: 'change'},
                }, {
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
                vxSignUp: 'account/signUp'
            }),
            signUp() {
                this.loading = true;
                this.$refs.userForm.validate()
                    .then(() => {
                        // 组合数据
                        const signUp = {
                            name: this.userInfo.name,
                            phone: this.userInfo.phone,
                            password: this.userInfo.password
                        };
                        this.vxSignUp(signUp).then(() => {
                            this.toast('注册成功！');
                            this.$router.push({name: 'user'})
                        });
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            goToLogin() {
                this.$router.push({name: 'login'})
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
        .detail-wrap {
            display: flex;
            flex-flow: column nowrap;
            justify-content: flex-start;
            align-items: center;
            padding: 30px 20px;
            margin-top: 10px;
            background: #fff;
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
