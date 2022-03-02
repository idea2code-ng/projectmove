const { DataTypes } = require("sequelize");
const logger = require("../../config/logger");
const TABLENAME = "Drivers";

try {
  module.exports = {
    defineModel: async (sequelize) => {
      const Drivers = await sequelize.define(
        TABLENAME,
        {
          Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          username: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          phone: {
            type: DataTypes.STRING,
          },
          address: {
            type: DataTypes.STRING,
          },
          profilePic: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          password: {
            type: DataTypes.STRING,
          },
          provider: {
            type: DataTypes.ENUM(["FACEBOOK", "GOOGLE", "APPLE", "NORMAL"]),
            allowNull: false,
            defaultValue: "NORMAL",
          },
          userotp: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          city:{
            type:DataTypes.STRING,
            allowNull:true
          },
          rating:{
            type:DataTypes.INTEGER
          },
          latitude:{
            type: DataTypes.STRING,
            allowNull: true
          },
          longitude:{
            type: DataTypes.STRING,
            allowNull: true
          }
        },
        {
          tableName: TABLENAME,
        }
      );
      Drivers.associate = async (models, sequelize) => {};
      return Drivers;
    },
    insertFixedData: async (sequelize) => {
      //idempotent
    },
  };
} catch (e) {
  logger.error(e);
}
