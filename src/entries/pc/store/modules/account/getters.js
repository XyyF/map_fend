export default {
    // 是否已登录
    isLoggedIn(state) {
        return !!(state.myAccount && state.myAccount.name)
    },
    // 自己的权限列表
    myAuthorities(state) {
        return state.myAccount && state.myAccount.authorityList || []
    },
}
