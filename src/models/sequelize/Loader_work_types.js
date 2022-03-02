const { DataTypes } = require('sequelize')
const logger = require('../../config/logger')
const defaults = require('../../seedings/Loader_work_types')

const TABLENAME = 'Loader_work_types'

try {
    module.exports = {
        defineModel: async(sequelize) => {
            const Loader_work_types = await sequelize.define(TABLENAME, {
                Id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                }
            }, {
                tableName: TABLENAME
            })
            return Loader_work_types
        },
        insertFixedData: async(sequelize) => { //idempotent
            const { Loader_work_types } = sequelize.models

            let type;
            for (let i = 0; i < defaults.length; i++) {
                type = defaults[i]
                const { Id, name} = type

                await Loader_work_types.findOrCreate({
                    where: { Id, name }
                })
            }

        }
    }
} catch (e) {
    if(e){
        console.log(e,"error");
    }
    logger.error(e)
}