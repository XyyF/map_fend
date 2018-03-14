<template>
    <div class="user-wrap">
        <div class="return">
            <span @click="returnMap"><</span>
        </div>
        <div class="detail-wrap">
            <small-avatar></small-avatar>
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
            returnMap() {
                this.$router.push({name: 'map'})
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
