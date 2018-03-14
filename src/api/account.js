/**
 * Created by rengar on 2018/3/14.
 */

import httpRequestor from '../utils/http_requestor'

const log = console.log.bind(console, 'receive');


/**
 * 管理员登录
 * @param {string} phone
 * @param {string} password
 */
export const signIn = (phone, password) => {
    return httpRequestor.post('/account/sign_in', {
        phone,
        password,
        accountType: 2,
    })
        .tap(log)
}

/**
 * 管理员注册
 * @param {string} phone
 * @param {string} password 用户密码，需要前端MD5加密
 * @param {string} name 姓名
 * @param {string} scert 创建账号具有管理员权限
 */
export const signUp = (phone, password, name, scert) => {
    return httpRequestor.post('/account/sign_up', {
        phone,
        password,
        name,
        scert
    })
        .tap(log)
}

/**
 * 管理员登出
 */
export const signOut = () => {
    return httpRequestor.post('/account/sign_out')
        .tap(log)
}
