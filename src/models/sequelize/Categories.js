const { DataTypes } = require('sequelize')
const logger = require('../../config/logger')
const TABLENAME = 'Categories'

try {
    module.exports = {
        defineModel: async(sequelize) => {
            const Categories = await sequelize.define(TABLENAME, {
                Id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name:{
                    type:DataTypes.STRING,
                    required: true
                },
                image: {
                    type: DataTypes.STRING,
                    allowNull: true
                }
            }, {
                tableName: TABLENAME
            })
            Categories.associate = async(models, sequelize) => { }
            return Categories
        },
        insertFixedData: async(sequelize) => { //idempotent
        }
    }
} catch (e) {
    logger.error(e)
}