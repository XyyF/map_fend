import * as api from 'api/account'
import md5 from 'blueimp-md5'

export default {
    async signIn({commit}, {phone, password}) {
        const account = await api.signIn(phone, md5(password));
        commit('setAccount', account)
        return account
    },
    async signUp({commit}, {phone, password, name, scert}) {
        const account = await api.signUp(phone, md5(password), name, scert);
        commit('setAccount', account)
    },
    async logOut({commit}) {
        await api.signOut();
        commit('setAccount', undefined)
    },
}
