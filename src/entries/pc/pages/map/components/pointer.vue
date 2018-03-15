<template>
    <div class="pointer">
        <div class="return">
            <span @click="returnMap" class="return-button"><i class="el-icon-arrow-left"></i></span>
            <span>新建点标记</span>
        </div>
    </div>
</template>

<script>
    import { Cell } from 'mint-ui';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import {Button} from 'meetin-sass-ui'
    import commonUtils from 'utils/common_utils';

    export default {
        name: 'pointer',
        data() {
            return {
                pointer: commonUtils.sessionStorage.POINTER,
            };
        },
        components: {
            [Cell.name]: Cell,
            [Button.name]: Button,
        },
        computed: {
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
                    this.toast('退出登录成功！');
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
    }
</script>

<style lang="scss" rel="stylesheet/scss">

    .pointer {
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
    }
</style>
