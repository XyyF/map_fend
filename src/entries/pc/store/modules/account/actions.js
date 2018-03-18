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
    async signOut({commit}) {
        await api.signOut();
        commit('setAccount', undefined)
    },
    async changeName({commit}, {name}) {
        await api.editOwn({changedInfo: {name}});
        commit('updateAccount', {name})
    },
    async changePhone({commit}, {phone}) {
        await api.editOwn({changedInfo: {phone}});
        commit('updateAccount', {phone})
    },
    async modifyPassword(context, {originalPassword, newPassword}) {
        await api.modifyPassword(md5(originalPassword), md5(newPassword));
    },
}
