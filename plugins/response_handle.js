const Boom = require('@hapi/boom')

const EnumList = {
    SUCC_CODE: 0,
    ERR_CODE: -1,
}

const internals = {}
/**
 * 判断数据是否为错误，并调用错误响应处理
 * @param data
 * @param meta
 * @param options
 * @returns {*}
 */
internals.calibrate = function (data, meta, options) {
    if (data instanceof Error) {
        return internals.error(data)
    }
    return internals.response(data, meta, options)
}
/**
 * 如果是错误，返回一个相同结构的对象
 */
internals.error = function (err) {
    console.log(`[错误]${err}`)
    return {
        code: EnumList.ERR_CODE,
        data: {},
        msg: err.output.payload.message,
    }
}

/**
 * 如果数据被定义并且非空
 */
internals.response = function (data, _options) {
    const options = _options || {}
    if (data) {
        return {
            code: EnumList.SUCC_CODE,
            data,
            msg: 'success',
        }
    }

    const context = options.context ? `${options.context} ` : ''
    const returnString = options.return_string || options.returnString || `ID：${context}的资源不存在或已被删除！`
    return {
        code: EnumList.ERR_CODE,
        data: {},
        msg: returnString,
    }
}

module.exports.error = internals.error
module.exports.response = internals.response
module.exports.calibrate = internals.calibrate

module.exports = [
    {
        name: 'handleResponse',
        version: '1.0.0',
        register: async function (server, { onResponse = true }) {
            // 处理返回数据
            if (onResponse) {
                const preResponse = function (request, h) {
                    const data = request.response.isBoom ? request.response : request.response.source
                    if (request.response.variety === 'plain' || request.response.isBoom) {
                        // 判断是否为swigger请求 是 则 直接返回response
                        if (request.path === '/swagger.json') {
                            return h.continue
                        } else {
                            return internals.calibrate(data)
                        }
                    }
                    return h.continue
                }
                server.ext('onPreResponse', preResponse)
                return
            }
            const calibrateDecorator = function (data, meta) {
                return internals.calibrate(data, meta)
            }
            server.decorate('toolkit', 'handleResponse', calibrateDecorator)
        },
        options: { onResponse: false },
    },
]
