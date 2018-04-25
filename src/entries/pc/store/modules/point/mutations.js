import accountState from '../account/index'

export default {
    newPoint(state, {point, longitude, latitude, address, title, snippet}) {
        state.points.push({
            longitude, latitude, address, title, snippet, pointId: point.pointId
        })
    },
    deletePoint(state, {pointId}) {
        const pointIndex = state.points.findIndex(point => point.pointId === pointId)
        state.points.splice(pointIndex, 1)
    },
    detail(state, detail) {
        state.pointDetail = detail
    },
    leaveMessage(state, {content}) {
        state.pointDetail.messages.push({
            content,
            manager: {
                accountId: accountState.state.myAccount.accountId,
                name: accountState.state.myAccount.name
            }
        })
    },
    points(state, {points}) {
        state.points = points
    },
}
