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
}

/**
 * 管理员登出
 */
export const signOut = () => {
    return httpRequestor.get('/account/sign_out')
}

/**
 * 编辑账户
 * @param {string} changedInfo
 */
export const editOwn = ({changedInfo}) => {
    return httpRequestor.post('/account/edit_own', {
        changedInfo
    })
}

/**
 * 编辑密码
 * @param {string} originalPassword
 * @param {string} newPassword
 */
export const modifyPassword = (originalPassword, newPassword) => {
    return httpRequestor.post('/account/modify_password', {
        originalPassword,
        newPassword
    })
}
