export default {
    points(state) {
        return state.points.map((e) => {
            return {
                position: [e.longitude, e.latitude],
                title: e.title,
                snippet: e.snippet,
                address: e.address,
                pointId: e.pointId,
            }
        })
    },
}
