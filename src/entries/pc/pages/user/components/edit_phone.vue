<template>
    <div class="edit-phone-wrap">
        <div class="return">
            <span @click="returnBack" class="return-button"><i class="el-icon-arrow-left"></i></span>
            <span>修改手机号</span>
        </div>
        <div class="detail-wrap">
            <mt-field label="原手机号" placeholder="请输入原手机号" v-model="originPhone" :state="state1"></mt-field>
            <mt-field label="新手机号" placeholder="请输入新手机号" v-model="newPhone" :state="state2"></mt-field>
        </div>
        <mt-button class="button" type="primary" :disabled="disabledButton" @click.native="editName">确定</mt-button>
    </div>
</template>

<script>
    import {Field, Button} from 'mint-ui';
    import {mapState, mapActions} from 'vuex'

    export default {
        name: 'edit-phone',
        data() {
            return {
                loading: false,
                originPhone: '',
                newPhone: '',
                state1: '',
                state2: ''
            };
        },
        components: {
            [Field.name]: Field,
            [Button.name]: Button,
        },
        computed: {
            ...mapState({
                vxMyAccount: state => state.account.myAccount
            }),
            disabledButton() {
                return !this.originPhone || !this.newPhone
            }
        },
        methods: {
            ...mapActions({
                vxChangePhone: 'account/changePhone'
            }),
            returnBack() {
                this.$router.back()
            },
            editName() {
                this.validCheck().then(() => {
                    this.vxChangePhone({phone: this.newPhone}).then(() => {
                        this.toast('修改成功！');
                        this.$router.push({name: 'user'})
                    }).catch((err) => {
                        console.log(err);
                    })
                })
            },
            validCheck() {
                return new Promise((resolve, reject) => {
                    if (this.originPhone !== this.vxMyAccount.phone) {
                        this.state1 = 'warning';
                        this.toast('原手机号码不匹配');
                        reject(new Error('原手机号码不匹配'))
                    }
                    const phoneRegExp = new RegExp('^(\\+?86)?[19]\\d{10}$', 'gi');
                    if (!phoneRegExp.test(this.newPhone)) {
                        this.state2 = 'warning';
                        this.toast('新手机号码格式错误');
                        reject(new Error('新手机号码格式错误'))
                    }
                    resolve()
                })
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">

    .edit-phone-wrap {
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
