import commonUtils from 'utils/common_utils';
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// 老数据的学员和管理员的登录态存放在localStorage同一个字段里。10月可删去localStorage.ACCOUNT相关逻辑
let accountInStorage = commonUtils.localStorage.MANAGER_ACCOUNT
if (accountInStorage) {
    commonUtils.localStorage.ACCOUNT = undefined
} else if (commonUtils.localStorage.ACCOUNT && commonUtils.localStorage.ACCOUNT.groupIds) {
    accountInStorage = commonUtils.localStorage.ACCOUNT
}

const DEFAULT_ACCOUNT = {
    name: '',
    avatar: '',
    groupIds: [],
    authorityList: [],
}

// initial state
const state = {
    DEFAULT_ACCOUNT,
    myAccount: accountInStorage || Object.assign({}, DEFAULT_ACCOUNT),
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
}
