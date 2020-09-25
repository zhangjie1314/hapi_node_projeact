const Joi = require('joi')
const Boom = require('@hapi/boom')
const Sequelize = require('sequelize')
let db = require('../models')

module.exports = [
    {
        method: 'GET',
        path: '/tests/test1/field',
        handler: async (request, h, err) => {
            var result = {
                a: 1,
            }
            return result
        },
        options: {
            description: '测试-测试',
            notes: '测试',
            tags: ['api', 'tests'],
            response: {
                schema: Joi.object().keys({
                    a: Joi.string(),
                }),
                failAction: async (request, h, err) => {
                    return Boom.serverUnavailable(`服务器错误：${err.message}`)
                },
            },
        },
    },
    {
        method: 'GET',
        path: '/tests/test2/field',
        handler: async (request, h, err) => {
            const result = {}
            return result
        },
        options: {
            description: '测试-测试',
            notes: '测试',
            tags: ['api', 'tests'],
        },
    },
]
