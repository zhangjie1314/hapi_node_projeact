'use strict'
const dotdev = require('dotenv')
const Hapi = require('@hapi/hapi')
const pluginHapiSwagger = require('./plugins/hapi_swagger')
const pluginHapiPino = require('./plugins/hapi_pino')
const pluginHandleResponse = require('./plugins/response_handle')
const hello = require('./routes/hello')
const models = require('./models')
const Joi = require('joi')

// .env 配置注册
dotdev.config('./.env')
// 链接数据库
var initDb = function () {
    var sequelize = models.sequelize
    // Determine if the database connection is successful
    sequelize
        .authenticate()
        .then(function () {
            console.log('链接数据库成功！')
        })
        .catch(function (err) {
            console.log('链接数据库错误: %s', err)
        })
}
initDb()
// 服务
const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
})
// 初始化
const init = async () => {
    // 注册插件
    await server.register([
        // 注册使用 hapi-swagger
        ...pluginHapiSwagger,
        // 注册日志插件 hapi-pino
        ...pluginHapiPino,
        // 处理返回数据
        ...pluginHandleResponse,
    ])
    // 监听返回前
    server.validator(Joi)
    // 注册路由
    server.route([...hello])
    // 启动服务
    await server.start()
    console.log(`[app]：服务已运行: ${server.info.uri}`)
}

process.on('unhandledRejection', err => {
    console.log(`[app]：${err}`)
    process.exit(1)
})
// 执行初始化
init()
