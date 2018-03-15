import commonUtils from '../../../../../utils/common_utils';

export default {
    setAccount(state, account) {
        commonUtils.localStorage.MANAGER_ACCOUNT = account;
        commonUtils.localStorage.ACCOUNT = undefined
        state.myAccount = account || Object.assign({}, state.DEFAULT_ACCOUNT)
        console.log('set account', state.myAccount)
    },
    updateAccount(state, changedInfo) {
        const newAccount = Object.assign({}, state.myAccount, changedInfo)
        commonUtils.localStorage.MANAGER_ACCOUNT = newAccount;
        state.myAccount = newAccount;
        console.log('update account', state.myAccount)
    },
}
