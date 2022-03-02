const { DataTypes } = require("sequelize");
const logger = require("../../config/logger");
const TABLENAME = "Licence_details";

try {
  module.exports = {
    defineModel: async (sequelize) => {
      const Licence_details = await sequelize.define(
        TABLENAME,
        {
          Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          user_id: {
            type: DataTypes.INTEGER,
            required: true,
          },
          licence_image: {
            type: DataTypes.STRING,
            required: true,
          },
          licence_number: {
            type: DataTypes.STRING,
            required: true,
          },
          valid_vehicle_type: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          issued_on: {
            type: DataTypes.DATEONLY,
            allowNull: false,
          },
          expiry_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
          },
        },
        {
          tableName: TABLENAME,
        }
      );
      Licence_details.associate = async (models, sequelize) => {};
      return Licence_details;
    },
    insertFixedData: async (sequelize) => {
      //idempotent
    },
  };
} catch (e) {
  logger.error(e);
}
