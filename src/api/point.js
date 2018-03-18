/**
 * Created by rengar on 2018/3/14.
 */

import httpRequestor from '../utils/http_requestor'

const log = console.log.bind(console, 'receive');


/**
 * 新建点标记
 * @param {Number} longitude
 * @param {Number} latitude
 * @param {string} address
 * @param {string} title
 * @param {string} snippet
 */
export const newPoint = (longitude, latitude, address, title, snippet) => {
    return httpRequestor.post('/point/new', {
        longitude,
        latitude,
        address,
        title,
        snippet,
    })
}

/**
 * 删除点标记
 * @param {string} pointId
 */
export const deletePoint = (pointId) => {
    return httpRequestor.post('/point/delete', {
        pointId,
    })
}

/**
 * 点标记详情
 * @param {string} pointId
 */
export const detail = (pointId) => {
    return httpRequestor.get('/point/detail', {
        pointId,
    })
}

/**
 * 编辑密码
 * @param {string} pointId
 * @param {string} content
 */
export const leaveMessage = (pointId, content) => {
    return httpRequestor.post('/point/leave_message', {
        pointId,
        content
    })
}

/**
 * 所有相关的points
 */
export const points = () => {
    return httpRequestor.get('/point/points')
}
