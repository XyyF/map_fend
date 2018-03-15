import {property, pick, get} from 'lodash'
import moment from 'moment'

/**
 * 提供在所有页面都可以使用的通用的方法
 */
export default {
    getUrlParam,
    setUrlParam,
    isPhoneNum,
    isEmail,
    getNewId,
    hashCode,
    // 利用getter和setter访问sessionStorage，支持直接读写object。这里的取值表示是否在读取过一次后就删除
    sessionStorage: initStorage(window.sessionStorage, {
        // OO页面向XX页面传递的数据
        XX_DATA_FOMR_OO_PAGE: true,
        POINTER: false,
    }),
    // 利用getter和setter访问localStorage，支持直接读写object。这里的取值表示是否在读取过一次后就删除
    localStorage: initStorage(window.localStorage, {
        // 登录后获得的用户信息，遗留数据
        ACCOUNT: false,
        // 管理员登录后获得的用户信息
        MANAGER_ACCOUNT: false,
        // 权限列表
        SYNC_DATA_CACHE: false
    }),
    interval,
    cancelable,
    tryFunc,
    getEventBus,
    stringifyUrlParams,
    parseDate,
    formatDate,
    getHost,
    getDocumentScrollTop,
    getOffsetTop,
    getOffsetLeft,
    isSameArray,
    isSameDay,
    normalizeDay,
    isEmptyObject,
    formatYuan,
    formatFloat,
    numberValidator,
    twoDecimalValidator,
    fixedByOptions,
    convertToOptions,
    pickDifference,
    checkParams,
    validateForm,
    setUrlQuery,
    makeWatchForFormRules,
    addEllipsis,
    safeHtml,
    validInteger,
    validAge,
    validPhone,
    getRelativeFormatDate,
    convertToShorterNumber,
    calculateAge,
    floatNumFixed,
    oneDayMsec: 24 * 60 * 60 * 1000, // 一天的毫秒
    EMPTY_CELL_DATA: '--',
    numberCheck,    // 只有正确的数字格式才能通过检查
};
// export default 不能导出常量


export function numberCheck(num) {
    const re = /^\d*(\.\d)?$/
    return re.exec(num) !== null
}

export const EMPTY_CELL_DATA = '--';

export function floatNumFixed(value, decimal) {
    if (typeof value === 'string') {
        return parseFloat(parseFloat(value).toFixed(decimal))
    } else if (typeof value === 'number') {
        return parseFloat(value.toFixed(decimal))
    } else {
        return value
    }
}

export function calculateAge(birthday) {
    const birthMoment = moment(birthday)
    const totalMonth = moment().diff(birthMoment, 'month')
    const years = parseInt(totalMonth / 12, 10)
    const month = totalMonth % 12
    if (month) {
        return `${years}岁${month}个月`
    } else {
        return `${years}岁`
    }
}

export const oneDayMsec = 24 * 60 * 60 * 1000; // 一天的毫秒
export const date20180201 = 1517489369745; // 特殊逻辑需要的时间戳 2018-02-01

export function convertToShorterNumber(longNum) {
    let shorterNum = longNum.toString() || ''
    if (longNum > 1000) {
        const decimal = Math.round(longNum / 100) / 10
        shorterNum = `${decimal}k`
    }
    // divide and format
    return shorterNum
}

function getRelativeFormatDate(time, fullFormat = 'MM-DD ddd HH:mm') {
    const now = moment(time)
    const today = moment()
    const yesterday = moment().subtract(1, 'day')
    if (now.isSame(today)) {
        return `今天 ${now.format('HH:MM')}`
    } else if (now.isSame(yesterday)) {
        return `昨天 ${now.format('HH:MM')}`
    }
    return now.format(fullFormat)
}

/**
 * 初始化storage代理
 * @param {Storage} stub
 * @param {object} proxy
 */
function initStorage(stub, proxy) {
    const result = {}
    for (const key in proxy) {
        if (proxy.hasOwnProperty(key)) {
            // 必须放进函数调用，以利用闭包固化key
            redefineKey(key, proxy[key]);
        }
    }
    return result

    function redefineKey(key, isOneshot) {
        Object.defineProperty(result, key, {
            get() {
                const realKey = `MAP_${key}`;
                let value = stub.getItem(realKey);
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    if (e.name === 'SyntaxError') {
                        console.error(`can't parse [${realKey}]: ${value}`);
                        stub.removeItem(realKey);
                    } else {
                        console.error(e)
                    }
                    value = undefined;
                }
                if (isOneshot) {
                    stub.removeItem(realKey);
                }
                return value;
            },
            set(value) {
                const realKey = `MAP_${key}`;
                if (value === undefined) {
                    // 删除
                    try {
                        stub.removeItem(realKey)
                    } catch (e) {
                        console.error(e)
                    }
                } else {
                    try {
                        stub.setItem(realKey, JSON.stringify(value));
                    } catch (e) {
                        if (e.name === 'QuotaExceededError' && stub.length) {
                            // 空间不足
                            stub.clear();
                            stub.setItem(realKey, JSON.stringify(value));
                        } else {
                            console.error(e)
                        }
                    }
                }
            }
        });
    }
}

/**
 * 获取url中的指定参数
 * @param   {string} name url中的参数名字
 * @param   {string?} url 不填则使用当前地址
 * @returns {null | string} 若获取失败则返回null
 */
export function getUrlParam(name, url) {
    const matcher = (url || window.location.search).match(`${name}=([^&#]+)`);
    if (!matcher || matcher.length < 2) {
        console.log(`No "${name}" in url`);
        return null;
    }
    return matcher[1];
}

/**
 * 修改url中的指定参数
 * @param   {string} url
 * @param   {string} name url中的参数名字
 * @param   {string} value 要修改的参数值
 * @return  {string} 修改后的url
 */
export function setUrlParam(url, name, value) {
    const reg = new RegExp(`${name}=`)
    if (reg.test(url)) {
        return url.replace(reg, `${name}=${value}`)
    } else if (url.includes('?')) {
        return `${url}&${name}=${value}`
    } else {
        return `${url}?${name}=${value}`
    }
}

export function isPhoneNum(str) {
    if (window.devEnv) {
        return /^(\+?86)?[19]\d{10}$/.test(str);
    } else {
        return /^(\+?86)?1\d{10}$/.test(str);
    }
}

export function isEmail(str) {
    return /^([a-zA-Z0-9_-]+\.?)+@([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9]{2,4}$/.test(str);
}

let idMaker = 1;

/**
 * 生成一个新id
 *
 * @returns {number}
 */
export function getNewId() {
    return idMaker++;
}

/**
 * 根据字符串生成一个整型32位的哈希码
 * @param {string} str
 * @return {number}
 */
export function hashCode(str) {
    let hash = 0;
    if (!str) {
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash &= hash; // Convert to 32bit integer
    }
    return hash;
}

/**
 * generate a new function that can be run unlimited times
 * you can call [the returned func].cancel() to cancel it
 */
export function interval(fn, milliseconds) {
    let timer;
    const innerFunc = function innerFunc(...args) {
        const thisObj = this
        if (!timer) {
            timer = setInterval(() => {
                fn.apply(thisObj, args);
            }, milliseconds);
        }
        return undefined;
    };
    innerFunc.cancel = function cancel() {
        clearInterval(timer);
        timer = undefined;
    };
    return innerFunc;
}

/**
 * 将方法fn包装一层，返回值上可以调用cancel方法，让fn无法再调用
 * @param {Function} fn
 */
export function cancelable(fn) {
    const innerFunc = function innerFunc(...args) {
        if (fn) {
            return fn.apply(this, args);
        }
        return undefined;
    };
    innerFunc.cancel = function cancel() {
        // noinspection JSValidateTypes
        fn = undefined;
    };
    innerFunc.isCanceled = function isCanceled() {
        return fn === undefined;
    };
    return innerFunc;
}

/**
 * 重复执行指定函数，直到成功为止
 * @param {Function} fn 要重试的方法，需要返回一个promise
 * @param {number} intervalMs 失败后重试的时间间隔毫秒数
 * @param {number} maxTimes 最大执行次数，包括第一次
 * @return {Promise}
 */
export function tryFunc(fn, intervalMs, maxTimes) {
    return new Promise((resolve, reject) => {
        let currentTimes = 1;
        run();

        function run() {
            fn().then(resolve, retry);
        }

        function retry(e) {
            if (++currentTimes <= maxTimes) {
                setTimeout(run, intervalMs);
            } else {
                reject(e);
            }
        }
    })
}

let eventBus;

/**
 * 获取一个基于vue的事件总线，用来在组件之间发送事件
 * 用法：
 * <pre>
 * commonUtils.getEventBus().$emit('click-submit', { postData: this.postData });
 * </pre>
 *
 * <pre>
 * created: function () {
 *      commonUtils.getEventBus().$on('click-submit', this.submit)
 * },
 * // 最好在组件销毁前清除事件监听
 * beforeDestroy: function () {
 *      commonUtils.getEventBus().$off('click-submit', this.submit)
 * },
 * </pre>
 * @returns {Vue}
 */
export function getEventBus() {
    if (!eventBus) {
        // eslint-disable-next-line no-undef
        eventBus = new Vue();
    }
    return eventBus;
}

/**
 * 将查询参数转换为字符串，如果传了两个参数，可自动进行拼接
 * @param {string|object} paramsObj 对象形式的查询参数。其中的undefined属性会被过滤掉
 * @param {object,optional} url 待拼接的url。拼接时会检测其中是否已含有问号
 * @returns {string} 拼接好的url。若没填url参数则返回字符形式的查询参数
 */
export function stringifyUrlParams(url, paramsObj) {
    if (paramsObj === undefined) {
        // 只传了一个参数的情况
        paramsObj = url;
        url = undefined;
    }
    const pairs = [];
    for (const key in paramsObj) {
        if (paramsObj.hasOwnProperty(key) && paramsObj[key] !== undefined && paramsObj[key] !== null) {
            pairs.push(`${key}=${paramsObj[key]}`);
        }
    }
    const query = pairs.join('&');
    if (!url) {
        return query;
    }
    return url.includes('?') ? (`${url}&${query}`) : (`${url}?${query}`);
}

/**
 * 解析日期字符串
 * @param {string} text 支持 2010-04-20 这样的字符串，年月日中间可以用任意字符连接
 * @returns {Number}
 */
export function parseDate(text) {
    if (!text) {
        return 0;
    }
    const dateTexts = text.split(/\D+/);
    if (!dateTexts.length) {
        return 0;
    }
    const date = new Date();
    date.setFullYear(parseInt(dateTexts[0], 10));
    date.setMonth(dateTexts.length > 1 ? parseInt(dateTexts[1] - 1, 10) : 0);
    date.setDate(dateTexts.length > 2 ? parseInt(dateTexts[2], 10) : 1);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
}

/**
 * 格式化日期字符串
 * @param {number} stamp 时间戳
 * @param {boolean} [noDate] 只格式化年和月
 * @returns {string}
 */
export function formatDate(stamp, noDate) {
    if (!stamp) {
        return '';
    }
    const date = new Date(stamp);
    const year = date.getFullYear();
    const month = (date.getMonth() >= 9 ? '' : '0') + (date.getMonth() + 1);
    const day = (date.getDate() >= 10 ? '' : '0') + date.getDate();
    if (noDate) {
        return `${year}-${month}`;
    }
    return `${year}-${month}-${day}`;
}

/**
 * 获取当前网址里面的 host
 * 示例 http://www.baidu.com
 * @returns {string}
 */
export function getHost() {
    return window.location.origin;
}

/**
 * 获取当前网页的滚动距离
 * @returns {number}
 */
export function getDocumentScrollTop() {
    return document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
}

/**
 * 获取指定元素距离网页顶部的距离
 * @param elem
 * @returns {number}
 */
export function getOffsetTop(elem) {
    let top = 0;
    while (elem) {
        top += elem.offsetTop;
        elem = elem.offsetParent;
    }
    return top;
}

/**
 * 获取指定元素距离网页左边的距离
 * @param elem
 * @returns {number}
 */
export function getOffsetLeft(elem) {
    let left = 0;
    while (elem) {
        left += elem.offsetLeft;
        elem = elem.offsetParent;
    }
    return left;
}

/**
 * 比较两个数组是否相同
 * @param {Array} array1
 * @param {Array} array2
 * @param {Function} [comparator] 数组元素的比较器，传入参数为两个元素值，返回boolean
 */
export function isSameArray(array1, array2, comparator) {
    if (array1.length !== array2.length) {
        return false
    } else if (!array1.length) {
        return true
    }
    if (comparator) {
        return array1.every(item1 => array2.some(item2 => comparator(item1, item2)))
    } else {
        return array1.every(item => array2.includes(item))
    }
}

/**
 * 比较两个日期是否在同一天
 * @param {number | Date} date1
 * @param {number | Date} date2
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
    // 新建变量以免污染了传入的数据
    const tempDate1 = new Date(date1)
    const tempDate2 = new Date(date2)
    tempDate1.setHours(0, 0, 0, 0)
    tempDate2.setHours(0, 0, 0, 0)
    return tempDate1.getTime() === tempDate2.getTime()
}

/**
 * 将一个表示天的日期设置为标准时间，即当天8:00的时刻
 * @param {number | Date} date 支持传入时间戳或Date对象
 * @returns {number | Date} 标准化后的时间，数据格式与传入的一致
 */
export function normalizeDay(date) {
    const isDate = date instanceof Date
    // 新建变量以免污染了传入的数据
    const tempDate = new Date(date)
    tempDate.setHours(8, 0, 0, 0)
    return isDate ? tempDate : tempDate.getTime()
}

/**
 * 检测一个对象是否是空对象
 * @param {object} obj
 * @returns {boolean}
 */
export function isEmptyObject(obj) {
    for (const key in obj) {
        // 如果obj是Object.create(null)创建出来的，就没有prototype，也没有hasOwnProperty
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

/**
 * 把一个表示分的数字转化为表示元的字符串。不显示小数末尾的0
 * @param {number} cent
 * @returns {string}
 */
export function formatYuan(cent) {
    const yuan = (Math.abs(cent || 0) / 100).toFixed(2).replace(/\.0+$/, '')
    const unitIndex = yuan.indexOf('.') > 0 ? yuan.indexOf('.') - 1 : yuan.length;
    let loopCounter = 0;
    let newYuan = yuan.slice(unitIndex + 1);
    for (let i = unitIndex; i >= 0; i--) {
        const currentChar = yuan.charAt(i);
        if (loopCounter === 3) {
            loopCounter = 0;
            newYuan = `,${newYuan}`
        }
        if (currentChar >= '0' && currentChar <= '9') {
            newYuan = `${currentChar}${newYuan}`
            loopCounter++;
        }
    }
    return `¥${cent >= 0 ? newYuan : `-${newYuan}`}`
}

// 将数字转化为千位
export function toThousands(rawNumber) {
    const sign = rawNumber > 0 ? '' : '-'
    let num = (Math.abs(rawNumber) || 0).toString()
    let result = ''
    while (num.length > 3) {
        result = `,${num.slice(-3)}${result}`
        num = num.slice(0, num.length - 3)
    }
    if (num) {
        result = num + result
    }
    return `${sign}${result}`
}


export function formatFloat(cent, decimal = 2) {
    return (cent || 0).toFixed(decimal).replace(/\.0+$/, '')
}

/**
 * 饿了么表单组件 数字输入验证器
 * @param emptyTips
 * @param isDecimal
 * @returns {function(*, *=, *)}
 */
function numberValidator(emptyTips, isDecimal) {
    return (rule, value, callback) => {
        const parseIntValue = Number(value);
        if (!value && emptyTips) {
            callback(new Error(emptyTips));
        } else if (isDecimal ? !Number.isInteger(parseIntValue) : Number.isNaN(parseIntValue)) {
            if (isDecimal) {
                callback(new Error('请输入整数'));
            } else {
                callback(new Error('请输入数字'));
            }
        } else if (Number(value) < 0) {
            callback(new Error('请输入大于0的数'))
        } else {
            callback();
        }
    }
}

/**
 * 课时单价验证 两位小数，不能为空、为0
 * @param emptyTips 为空时的提示语句
 * @returns {function(*, *=, *)}
 */
function twoDecimalValidator(emptyTips) {
    return (rule, value, callback) => {
        if (!value) {
            callback(new Error(emptyTips));
        } else if (value < 0) {
            callback(new Error('请输入大于0的数字'));
        } else if (!/^([1-9]\d*|0)(\.\d{1,2})?$/.test(value)) {
            callback(new Error('最多输入两位小数的数字'));
        } else {
            callback();
        }
    }
}

/**
 * 利用课程、老师下拉框数据规范本地数据，可以更方便的使用下拉框选择的对象
 * @param options
 * @param baseInfo
 * @param prop
 * @param key
 * @param emptyValue
 */
export function fixedByOptions(options, baseInfo, prop, key, emptyValue) {
    const foundOption = options.find(item => item.type === baseInfo[prop][key]);
    if (!foundOption) {
        baseInfo[prop] = emptyValue;
    } else {
        baseInfo[prop] = foundOption;
    }
}

/**
 * 将一个数组转换为下拉列表选项数组
 * @param list
 * @param labelProp
 * @param typeProp
 * @returns {Array}
 */
export function convertToOptions(list, labelProp, ...typeProp) {
    if (!list) {
        return [];
    }
    const options = list.map((item) => {
        const obj = {
            label: item[labelProp],
            value: {
                [labelProp]: item[labelProp]
            }
        }
        typeProp.forEach((e) => {
            obj.value[e] = item[e]
        })
        return obj
    })
    return options || [];
}

/**
 * 获取对象中不同的部分
 * @param {object} src 要提取数据的对象
 * @param {object} reference 参照物对象
 * @param {string[]} [fields] 要比较的字段数组，数组中的元素可以是路径，如'a.b'。不填则比较src中的所有字段
 * @returns {object} 如果没有不同的部分，则返回null
 */
export function pickDifference(src, reference, fields) {
    if (!fields || !fields.length) {
        fields = Object.keys(src)
    }
    const differentFields = fields.filter((field) => {
        const propertyFunc = property(field)
        return propertyFunc(src) !== propertyFunc(reference)
    })
    return differentFields.length ? pick(src, differentFields) : null
}

/**
 * index: moment().day(), Sunday is 0
 * @export
 */
export function getWeekDay(index) {
    return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][index]
}

/** 日期转换
 * @param time
 * @param duration
 * @example 1492071708380, 86400000
 * @result 11:30 ~ 12:30
 */
export function getTimeByDuration(time, duration) {
    const mDate = moment(time)
    const startTime = mDate.format('HH:mm')
    const endTime = moment(time + duration).format('HH:mm')
    return `${startTime}~${endTime}`
}

/**
 * 检查obj对象的成员类型
 * @param {object} obj 待检查的对象
 * @param {object} paramMaps obj中要检查的成员名和成员类型字符串的映射表。
 *                          类型值为'undefined','number','array'等，末尾加问号表示该参数可选
 * @param {string?} objDisplayName 打印错误日志时用的obj名字
 * @returns {boolean} 是否全部合格
 *
 * @example
 * checkParams(obj, {title:'string', 'school.name':'string', books:'array', 'remark', 'string?'}
 */
export function checkParams(obj, paramMaps, objDisplayName = 'obj') {
    if (obj === undefined) {
        console.error(`${objDisplayName} is undefined`)
        return false
    }
    const allType = ['undefined', 'object', 'boolean', 'number', 'string', 'function', 'symbol', 'array']
    return Object.entries(paramMaps).every(([field, type]) => {
        // 检查type参数
        if (typeof type !== 'string') {
            console.error(`type is ${type}, expect one of ${JSON.stringify(allType)}`)
            return false
        }
        const optional = /\w+\?/.test(type)
        if (optional) {
            type = type.slice(0, -1)
        }
        if (!allType.includes(type.toLowerCase())) {
            console.error(`type is ${type}, expect one of ${JSON.stringify(allType)}`)
            return false
        }
        type = type.toLowerCase()

        // 检查obj中对应属性的取值
        const value = get(obj, field)
        if (optional && value === undefined) {
            return true
        }
        if (type === 'array') {
            if (!Array.isArray(value)) {
                console.error(`${objDisplayName}.${field} is ${value}, expect a ${type}`)
                return false
            }
        } else if (typeof value !== type) { // eslint-disable-line valid-typeof
            console.error(`${objDisplayName}.${field} is ${value}, expect a ${type}`)
            return false
        }
        return true
    })
}

/** 调用element组件的表单校验方法，并返回一个Promise
 * @param formComponent
 * @returns {Promise}
 */
export function validateForm(formComponent) {
    return new Promise((resolve, reject) => {
        formComponent.validate((valid) => {
            if (valid) {
                resolve()
            } else {
                const e = new Error('validate form fail')
                e.processed = true
                reject(e)
            }
        })
    })
}

/** 修改当前url的query参数
 * @param routerIns router实例
 * @param {object} newQuery 要修改的参数。若某项值为undefined，则表示删除该项
 * @param {boolean?} replaceMode 若为true，则替换历史记录，而不新增一条
 * @param {boolean?} removeOtherQuery 若为true，则删掉所有不在newQuery中的属性
 */
export function setUrlQuery(routerIns, newQuery = {}, replaceMode = true, removeOtherQuery = false) {
    const routeInfo = {
        name: routerIns.currentRoute.name,
        params: Object.assign({}, routerIns.currentRoute.params),
        query: Object.assign({}, routerIns.currentRoute.query, newQuery),
        hash: routerIns.currentRoute.hash,
    }
    // 去掉undefined属性
    Object.entries(routeInfo.query).forEach(([key, value]) => {
        if (value === undefined) {
            delete routeInfo.query[key]
        }
    })
    if (removeOtherQuery) {
        Object.keys(routeInfo.query).forEach(key => {
            if (newQuery[key] === undefined) {
                delete routeInfo.query[key]
            }
        })
    }
    if (isSameObj(routerIns.currentRoute.query, routeInfo.query)) {
        return
    }
    if (replaceMode) {
        routerIns.replace(routeInfo)
    } else {
        routerIns.push(routeInfo)
    }
}

/**
 * 判断两个对象是否相等。只判断一层属性
 * @param {object} obj1
 * @param {object} obj2
 * @return {boolean}
 */
function isSameObj(obj1, obj2) {
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return obj1 === obj2
    }
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) {
        return false
    }
    return keys1.every(key => obj1[key] === obj2[key])
}

/** 若为周四，则有上周四、本周四、下周四、周四四种状态
 *
 */
export function formatTimeToWeekDay(time) {
    const day = getWeekDay(moment(time).day())
    const today = () => moment().startOf('day')
    const prevMonday = today().weekday(-6)
    const prevSunday = today().weekday(-0)
    const currentMonday = today().weekday(1)
    const currentSunday = today().weekday(7)
    const nextMonday = today().weekday(8)
    const nextSunday = today().weekday(14)

    if (time > currentMonday && time < currentSunday) {
        return `本${day}`
    }

    if (time > prevMonday && time < prevSunday) {
        return `上${day}`
    }

    if (time > nextMonday && time < nextSunday) {
        return `下${day}`
    }

    return day
}

/**
 * element的form组件在使用动态(computed中)的rules时，会出现修改了数据不触发合法性检查的问题。这里通过watch手动触发合法性检查
 * @param {string} formRefName form组件在refs中的名字
 * @param {string} formDataName 绑定在form组件上的对象名字
 * @param {string[]} props 需要验证合法性的属性名字
 * @returns {object}
 */
export function makeWatchForFormRules(formRefName, formDataName, props) {
    const result = {}
    props.forEach((item) => {
        result[`${formDataName}.${item}`] = function watchForRule() {
            this.$refs[formRefName].validateField(item)
        }
    })
    return result
}

export function descOrder(arrs, key) {
    arrs.sort((a, b) => b[key] - a[key])
}

export function calculateRate(a, b) {
    if (!b || !a) return '0%'
    const rate = a / b * 100
    return `${Math.floor(rate)}%`
}

/**
 * 月份计算
 * @param {number} month 起始月份，取值范围[1, 12]
 * @param {number} offset 增加量
 */
export function calculateMonth(month, offset) {
    const result = (month + offset) % 12
    return result <= 0 ? result + 12 : result
}

/**
 * 测量中英文字符串宽度，单位为英文字符
 * @param {string} str
 */
export function measureTextWidth(str) {
    let sum = 0
    for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i) > 255 ? 2 : 1
    }
    return sum
}

/**
 * 在过长的字符串末尾加省略号
 * @param {string} str
 * @param {number} maxLength 不用加省略号的最大长度
 */
export function addEllipsis(str, maxLength) {
    let totalLength = 0
    const charLengthAt = i => (str.charCodeAt(i) < 256 ? 1 : 2)
    for (let i = 0; i < str.length; i++) {
        totalLength += charLengthAt(i)
        if (totalLength > maxLength) {
            // 需要截断，开始回退字符
            let keepLength = totalLength
            while (i >= 0) {
                keepLength -= charLengthAt(i)
                if (keepLength <= maxLength - 3) {
                    return `${str.slice(0, i)}...`
                }
                i--
            }
            return '...'
        }
    }
    return str
}

/**
 * 对用户输入的字符串进行转义，防止xss攻击。需要用v-html方式显示的用户内容一定要调用此方法
 * @param {string} str
 */
export function safeHtml(str) {
    if (!str) {
        return ''
    }
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/(\r\n|\n)/g, '<br>')
}


/**
 * element组件的form表单用的一位小数判断方法--现用于了年龄判断
 * @param {object} rule 规则，支持配置message错误提示、max最大值、min最小值
 * @param {string} value 传入的值
 * @param {Function} callback 抛出错误信息
 */
export function validAge(rule, value, callback) {
    if (!value) {
        callback()
    } else if (!/^([1-9]\d*|0)(\.\d)?$/.test(value)) {
        callback(new Error('请输入最多一位小数'))
    } else if (value <= rule.min || value >= rule.max) {
        // 错误提示
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

export function validPhone(rule, value, callback) {
    if (!value) {
        callback(new Error('请输入手机号'))
    } else if (!isPhoneNum(value)) {
        callback(new Error('请输入正确的手机号'))
    } else {
        callback()
    }
}

/**
 * element组件的form表单用的整数判断方法
 * @param {object} rule 规则，支持配置message错误提示、max最大值、min最小值
 * @param {string} value 传入的值
 * @param {Function} callback 抛出错误信息
 */
export function validInteger(rule, value, callback) {
    if (!value) {
        callback()
    }
    const number = Number(value)
    if (!Number.isInteger(number)) {
        callback(new Error('请输入数字值'))
        // 最大值和最小值
    } else if (number < rule.min || number > rule.max) {
        // 错误提示
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

/**
 * 统计相应键不同的对象的个数
 * @param {Array} arrs
 * @param {any} key
 * @returns
 */
export function countByKey(arrs, key) {
    let sum = 0
    const tmpObj = {}
    arrs.forEach(e => {
        if (!tmpObj[get(e, key, '')]) {
            sum++
            tmpObj[e[key]] = true
        }
    })
    return sum
}

/**
 * git Repo: https://github.com/scopsy/await-to-js
 * @param promise
 * @param errorExt
 */
export function awaitTo(promise, errorExt) {
    return promise
        .then(data => [null, data])
        .catch(err => {
            if (errorExt) {
                err = Object.assign(err, errorExt);
            }

            return [err];
        });
}
