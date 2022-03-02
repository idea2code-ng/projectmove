const { DataTypes } = require("sequelize");
const logger = require("../../config/logger");
const TABLENAME = "Eligible_drivers";

try {
  module.exports = {
    defineModel: async (sequelize) => {
      const Eligible_drivers = await sequelize.define(
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
          response: {
            type: DataTypes.STRING,
            required: true,
          },
          visibility: {
            type: DataTypes.STRING,
            required: true
          }
        },
        {
          tableName: TABLENAME,
        }
      );
      Eligible_drivers.associate = async (models, sequelize) => { };
      return Eligible_drivers;
    },
    insertFixedData: async (sequelize) => {
      //idempotent
    },
  };
} catch (e) {
  logger.error(e);
}
