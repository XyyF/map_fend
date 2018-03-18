import * as api from 'api/point'

export default {
    async newPoint({commit}, {longitude, latitude, address, title, snippet}) {
        const point = await api.newPoint(longitude, latitude, address, title, snippet);
        commit('newPoint', {point, longitude, latitude, address, title, snippet});
        return point
    },
    async deletePoint({commit}, {pointId}) {
        await api.deletePoint(pointId);
        commit('deletePoint', {pointId})
    },
    async detail({commit}, {pointId}) {
        const detail = await api.detail(pointId);
        commit('detail', detail)
    },
    leaveMessage({commit}, {pointId, content}) {
        return api.leaveMessage(pointId, content).then(() => {
            commit('leaveMessage', {pointId, content})
        })
    },
    async points({commit}) {
        const points = await api.points();
        commit('points', {points})
    },
}
