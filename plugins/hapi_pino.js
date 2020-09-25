const hapiPino = require('hapi-pino')

module.exports = [
    {
        plugin: hapiPino,
        options: {
            prettyPrint: true,
            logEvents: ['response', 'onPostStart'],
        },
    },
]
