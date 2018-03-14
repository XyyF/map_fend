<template>
    <div class="user-wrap">
        <small-avatar></small-avatar>
        <mt-form ref="userForm" class="info-form" :labelWidth="'60px'" labelPosition="left"
                 :formFormatData="userFormat"
                 v-model="userInfo"
        ></mt-form>
        <div class="submit-button">
            <el-button size="samll" :disabled="loading" @click.native="signIn" type="primary">登录</el-button>
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
                        this.vxSignIn(signIn);
                    })
                    .catch(() => {
                        this.loading = false
                    })
            }
        },
        mounted() {
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "../../../../components/pc/styles/basic_const";

    .user-wrap {
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        align-items: center;
        padding: 30px 20px;
        .small-avatar {
            width: 100px;
            height: 100px;
        }
        .unit {

        }
        .el-form {
            margin-top: 30px;
        }
    }
</style>
