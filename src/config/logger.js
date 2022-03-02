const {
    createLogger,
    transports,
    format,
} = require('winston')

const logger = createLogger({
    transports: [
            new transports.Console({
                format: format.simple()
            }),
        ]
})

module.exports = logger