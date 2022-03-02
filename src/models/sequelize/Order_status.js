const { DataTypes } = require('sequelize')
const logger = require('../../config/logger')
const defaults = require('../../seedings/Order_status')

const TABLENAME = 'Order_status'

try {
    module.exports = {
        defineModel: async(sequelize) => {
            const Order_status = await sequelize.define(TABLENAME, {
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
            return Order_status
        },
        insertFixedData: async(sequelize) => { //idempotent
            const { Order_status } = sequelize.models

            let type;
            for (let i = 0; i < defaults.length; i++) {
                type = defaults[i]
                const { Id, name} = type

                await Order_status.findOrCreate({
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