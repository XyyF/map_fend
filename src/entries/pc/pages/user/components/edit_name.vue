<template>
    <div class="edit-name-wrap">
        <div class="return">
            <span @click="returnBack" class="return-button"><i class="el-icon-arrow-left"></i></span>
            <span>编辑昵称</span>
        </div>
        <div class="detail-wrap">
            <mt-field label="昵称" placeholder="请输入昵称" v-model="userName" :state="state"></mt-field>
        </div>
        <mt-button class="button" type="primary" :disabled="disabledButton" @click.native="editName">确定</mt-button>
    </div>
</template>

<script>
    import {Field, Button} from 'mint-ui';
    import {mapState, mapGetters, mapActions} from 'vuex'

    export default {
        name: 'edit-name',
        data() {
            return {
                loading: false,
                userName: '',
                state: ''
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
                return !this.userName
            }
        },
        methods: {
            ...mapActions({
                vxChangeName: 'account/changeName'
            }),
            returnBack() {
                this.$router.back()
            },
            editName() {
                this.validCheck().then(() => {
                    this.vxChangeName({name: this.userName}).then(() => {
                        this.toast('修改成功！');
                        this.$router.push({name: 'user'})
                    }).catch((err) => {
                        console.log(err);
                    })
                })
            },
            validCheck() {
                return new Promise((resolve, reject) => {
                    const pattern = new RegExp('[`~!@#\\$%\\^\\&\\*\\(\\)\\+<>\\?:"\\{\\},\\.\\\\\\/;\'\\[\\]]', 'im');
                    if (pattern.test(this.userName)) {
                        this.state2 = 'warning';
                        this.toast('昵称不能包含特殊字符');
                        reject(new Error('昵称不能包含特殊字符'))
                    }
                    if (this.userName.length > 15) {
                        this.state2 = 'warning';
                        this.toast('昵称名称过长');
                        reject(new Error('昵称名称过长'))
                    }
                    resolve()
                })
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.userName = this.vxMyAccount.name
            })
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">

    .edit-name-wrap {
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
