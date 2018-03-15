<template>
    <div class="edit-password-wrap">
        <div class="return">
            <span @click="returnBack" class="return-button"><i class="el-icon-arrow-left"></i></span>
            <span>修改密码</span>
        </div>
        <div class="detail-wrap">
            <mt-field label="原密码" placeholder="请输入原密码" v-model="originPassword" :state="state1"></mt-field>
            <mt-field label="新密码" placeholder="请输入新密码" v-model="newPassword" :state="state2"></mt-field>
        </div>
        <mt-button class="button" type="primary" :disabled="disabledButton" @click.native="editPassword">确定</mt-button>
    </div>
</template>

<script>
    import {Toast, Field, Button} from 'mint-ui';
    import {mapState, mapActions} from 'vuex'

    export default {
        name: 'edit-phone',
        data() {
            return {
                loading: false,
                originPassword: '',
                newPassword: '',
                state1: '',
                state2: ''
            };
        },
        components: {
            [Toast.name]: Toast,
            [Field.name]: Field,
            [Button.name]: Button,
        },
        computed: {
            ...mapState({
                vxMyAccount: state => state.account.myAccount
            }),
            disabledButton() {
                return !this.originPassword || !this.newPassword
            }
        },
        methods: {
            ...mapActions({
                vxModifyPassword: 'account/modifyPassword'
            }),
            returnBack() {
                this.$router.back()
            },
            editPassword() {
                this.vxModifyPassword({originalPassword: this.originPassword, newPassword: this.newPassword}).then(() => {
                    Toast('修改成功！');
                    this.$router.push({name: 'user'})
                }).catch((err) => {
                    console.log(err);
                })
            },
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">

    .edit-password-wrap {
        background-color: #f4f5f8;

        .detail-wrap {
            display: flex;
            flex-flow: column nowrap;
            justify-content: flex-start;
            align-items: center;
            margin-top: 10px;
            background: #fff;
            border-top: 1px solid transparent;
            .mint-cell-title {
                font-size: 15px;
                flex: 1;
            }
            .mint-cell-value {
                flex: 2;
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
        .button {
            display: block;
            width: 90%;
            margin: 10px auto 0;
        }
    }
</style>
