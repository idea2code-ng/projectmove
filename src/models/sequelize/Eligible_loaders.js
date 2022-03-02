const { DataTypes } = require("sequelize");
const logger = require("../../config/logger");
const TABLENAME = "Eligible_loaders";

try {
  module.exports = {
    defineModel: async (sequelize) => {
      const Eligible_loaders = await sequelize.define(
        TABLENAME,
        {
          Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          loader_id: {
            type: DataTypes.INTEGER,
            required: true,
          },
          order_id: {
            type: DataTypes.INTEGER,
            required: true,
          },
          response:{
            type: DataTypes.STRING,
            required: true,
          },
          purpose:{
            type:DataTypes.INTEGER,
            required:true
          },
          visibility:{
            type:DataTypes.STRING,
            required:true
          }
        },
        {
          tableName: TABLENAME,
        }
      );
      Eligible_loaders.associate = async (models, sequelize) => {};
      return Eligible_loaders;
    },
    insertFixedData: async (sequelize) => {
      //idempotent
    },
  };
} catch (e) {
  logger.error(e);
}
