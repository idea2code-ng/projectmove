const { DataTypes } = require('sequelize')
const logger = require('../../config/logger')
const TABLENAME = 'Insurance_details'

try {
    module.exports = {
        defineModel: async(sequelize) => {
            const Insurance_details = await sequelize.define(TABLENAME, {
                Id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                user_id:{
                    type:DataTypes.INTEGER,
                    required: true
                },
                insurance_image:{
                    type:DataTypes.STRING,
                    required: true
                },
                vehicle_id:{
                    type:DataTypes.STRING,
                    required: true
                },
                policy_holder_name:{
                    type:DataTypes.STRING,
                    require:true
                },
                policy_number: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                phone_number: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
            }, {
                tableName: TABLENAME
            })
            Insurance_details.associate = async(models, sequelize) => { }
            return Insurance_details
        },
        insertFixedData: async(sequelize) => { //idempotent
        }
    }
} catch (e) {
    logger.error(e)
}