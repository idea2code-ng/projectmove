const { DataTypes } = require("sequelize");
const logger = require("../../config/logger");
const TABLENAME = "Order_details";

try {
  module.exports = {
    defineModel: async (sequelize) => {
      const Order_details = await sequelize.define(
        TABLENAME,
        {
          Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          order_id:{
            type:DataTypes.INTEGER,
            require:true
          },
          order_status: {
            type: DataTypes.ENUM(["Pending", "Cancle", "Success"]),
            allowNull: true,
            defaultValue: "Pending",
          },
          pickuplat: {
            type: DataTypes.STRING,
          },
          pickuplong: {
            type: DataTypes.STRING,
          },
          dropofflat: {
            type: DataTypes.STRING,
          },
          dropofflong: {
            type: DataTypes.STRING,
          },
          loader_price:{
            type:DataTypes.INTEGER,
            require:true
          },
          distance: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          transportation_time: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          transport_price: {
            type: DataTypes.REAL,
            allowNull: false,
          },
          total_price: {
            type: DataTypes.REAL,
            allowNull: true,
          },
          acceptedBy: {
            type: DataTypes.STRING,
            allowNull: true,
          },
        },
        {
          tableName: TABLENAME,
        }
      );
      Order_details.associate = async (models, sequelize) => {
      };
      return Order_details;
    },
    insertFixedData: async (sequelize) => {
      //idempotent
    },
  };
} catch (e) {
  logger.error(e);
}