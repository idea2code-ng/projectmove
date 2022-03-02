const Sequelize = require('sequelize')
const logger = require('../logger')
require('dotenv').config()


const sequelize = new Sequelize.Sequelize({
       dialect: 'mysql',
       host: process.env.SQL_HOST,
       database: process.env.SQL_DATABASE,
       password: process.env.SQL_PASSWORD,
       username: process.env.SQL_USERNAME,
       logging: process.env.SEQUELIZE_LOGGING == "true" ? true : false,
       port: process.env.SQL_PORT || 3306
               // charset: 'utf8',
               // collate: 'utf8mb4_general_ci'
})


sequelize.authenticate().then(async() => {
       logger.info('Authentication Successful ')
}).catch((error) => {
       throw new Error(error)
       logger.log('Error: ', error)
})

module.exports = sequelize