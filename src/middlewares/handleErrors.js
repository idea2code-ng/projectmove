const { TgCfApiError, SequelizeDbError } = require('../errors')
const GeneralError = require('../errors/GeneralError')
const logger = require('../config/logger')
const axios = require('axios')
const { UniqueConstraintError, BaseError } = require('sequelize/lib/errors')


const handleErrors = (err, req, res, next) => {
       try {
              if (err instanceof GeneralError) {
                     throw err
              }
              if (err instanceof BaseError) {
                     if (err instanceof UniqueConstraintError) {
                            throw new SequelizeDbError(err.parent.message)
                     }
                     throw new SequelizeDbError(err.message)
              }
              if (err instanceof Error) {
                     logger.error(err)
                     return res.status(200).send({
                            isSuccess: 'flase',
                            status:1,
                            message: err.message
                     });
              }
       } catch (err) {
              if (err.message) {
                     if (!err.moreInfo) {
                            err.moreInfo = []
                     }
                     if (err.moreInfo.length == 0) {
                            err.moreInfo.push({ msg: err.message })
                     }
              }
              res.status(err.status ? err.status : 500)
              return res.send({
                     status: 'error',
                     message: err.message,
                     moreInfo: err.moreInfo,
                     errorName: err.errorName ? err.errorName : "Error"
              })
       }


}


module.exports = handleErrors;