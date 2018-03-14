import commonUtils from '../../../../../utils/common_utils';

export default {
    setAccount(state, account) {
        debugger
        commonUtils.localStorage.MANAGER_ACCOUNT = account;
        commonUtils.localStorage.ACCOUNT = undefined
        state.myAccount = account || Object.assign({}, state.DEFAULT_ACCOUNT)
        console.log('set account', state.myAccount)
    },
}
