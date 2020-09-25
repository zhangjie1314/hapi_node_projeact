const inert = require('@hapi/inert')
const vision = require('@hapi/vision')
const package = require('../package')
const hapiSwagger = require('hapi-swagger')

const hapiSwaggerOptions = {
    info: {
        title: '接口文档',
        version: package.version,
    },
    // 定义接口以 tags 属性定义为分组
    grouping: 'tags',
    tags: [{ name: 'tests', description: '测试相关' }],
    // 路径
    documentationPath: '/docs',
}

module.exports = [
    inert,
    vision,
    {
        plugin: hapiSwagger,
        options: hapiSwaggerOptions,
    },
]
