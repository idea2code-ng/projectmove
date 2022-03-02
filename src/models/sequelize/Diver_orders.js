const { DataTypes } = require("sequelize");
const logger = require("../../config/logger");
const { isJsonString } = require("../../utils/jsonUtils");
const TABLENAME = "Diver_orders";

try {
  module.exports = {
    defineModel: async (sequelize) => {
      const Diver_orders = await sequelize.define(
        TABLENAME,
        {
          Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          driver_id: {
            type: DataTypes.INTEGER,
            required: true,
          },
          order_id: {
            type: DataTypes.INTEGER,
            required: true,
          },
          status: {
            type: DataTypes.STRING,
            required: true,
          },
        },
        {
          tableName: TABLENAME,
        }
      );
      Diver_orders.associate = async (models, sequelize) => {};
      return Diver_orders;
    },
    insertFixedData: async (sequelize) => {
      //idempotent
    },
  };
} catch (e) {
  logger.error(e);
}
