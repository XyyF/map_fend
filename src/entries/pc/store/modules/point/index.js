import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// initial state
const state = {
    points: [],
    pointDetail: {},
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
}
