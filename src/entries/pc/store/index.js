import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import account from './modules/account'
import point from './modules/point'

Vue.use(Vuex)

// initial state
const state = {
    topMenu: ['组件'],
    sideMenu: ['日历'],
    map: {},
    AMap: {},
}

const store = new Vuex.Store({
    strict: window.devEnv,
    state,
    getters,
    actions,
    mutations,
    modules: {
        account,
        point
    }
})

// 热更新
if (module.hot) {
    module.hot.accept([
        // state不支持热更新
        './getters',
        './actions',
        './mutations',
        './modules/account',
        './modules/point',
    ], () => {
        store.hotUpdate({
            // 获取更新后的模块。因为 babel 6 的模块编译格式问题，这里需要加上 .default
            getters: require('./getters').default,
            actions: require('./actions').default,
            mutations: require('./mutations').default,
            account: require('./modules/account').default,
            point: require('./modules/point').default,
        })
    })
}

export default store
