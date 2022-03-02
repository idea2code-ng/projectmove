const { DataTypes } = require('sequelize')
const logger = require('../../config/logger')
const TABLENAME = 'Payments'

try {
    module.exports = {
        defineModel: async(sequelize) => {
            const Payments = await sequelize.define(TABLENAME, {
                Id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                date: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                time: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                amount:{
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                status:{
                    type: DataTypes.STRING,
                    allowNull: false,
                }
            }, {
                tableName: TABLENAME
            })
            Payments.associate = async(models, sequelize) => { }
            return Payments
        },
        insertFixedData: async(sequelize) => { //idempotent
        }
    }
} catch (e) {
    logger.error(e)
}