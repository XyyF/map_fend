<template>
    <div class="user-wrap">
        <div class="return">
            <span @click="returnMap"><</span>
        </div>
        <div class="detail-wrap">
            <small-avatar></small-avatar>
            <mt-form ref="userForm" class="info-form" :labelWidth="'70px'" labelPosition="left"
                     :formFormatData="userFormat"
                     v-model="userInfo"
            ></mt-form>
            <div class="submit-button">
                <el-button size="samll" :disabled="loading" @click.native="signIn" type="primary">注册</el-button>
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
            signIn() {
                this.loading = true;
                this.$refs.userForm.validate()
                    .then(() => {
                        // 组合数据
                        const signUp = {
                            name: this.userInfo.name,
                            phone: this.userInfo.phone,
                            password: this.userInfo.password
                        };
                        this.vxSignUp(signUp);
                    })
                    .catch(() => {
                        this.loading = false
                    })
            },
            goToLogin() {
                this.$router.push({name: 'login'})
            }
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
        .detail-wrap {
            display: flex;
            flex-flow: column nowrap;
            justify-content: flex-start;
            align-items: center;
            padding: 30px 20px;
        }
        .return {
            padding: 0 10px;
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
