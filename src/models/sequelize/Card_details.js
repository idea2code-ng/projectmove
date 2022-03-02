const { DataTypes } = require('sequelize')
const logger = require('../../config/logger')
const TABLENAME = 'Card_details'

try {
    module.exports = {
        defineModel: async(sequelize) => {
            const Card_details = await sequelize.define(TABLENAME, {
                Id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                user_id:{
                    type:DataTypes.STRING,
                    required: true
                },
                card_number:{
                    type:DataTypes.STRING,
                    required: true
                },
                card_holder_name: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                expiry_date: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                cvv: {
                    type: DataTypes.STRING,
                    allowNull: false,
                }
            }, {
                tableName: TABLENAME
            })
            Card_details.associate = async(models, sequelize) => { }
            return Card_details
        },
        insertFixedData: async(sequelize) => { //idempotent
        }
    }
} catch (e) {
    logger.error(e)
}