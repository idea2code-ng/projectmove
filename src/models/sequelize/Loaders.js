const { DataTypes } = require("sequelize");
const logger = require("../../config/logger");
const TABLENAME = "Loaders";

try {
  module.exports = {
    defineModel: async (sequelize) => {
      const Loaders = await sequelize.define(
        TABLENAME,
        {
          Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          username: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING,
          },
          profilePic: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          phone: {
            type: DataTypes.STRING,
          },
          address: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          provider: {
            type: DataTypes.ENUM(["FACEBOOK", "GOOGLE", "APPLE", "NORMAL"]),
            allowNull: false,
            defaultValue: "NORMAL",
          },
          price: {
            type: DataTypes.STRING,
            allowNull: true,
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
            type:DataTypes.STRING
          },
          latitude:{
            type: DataTypes.STRING
          },
          longitude:{
            type: DataTypes.STRING
          }
        },
        {
          tableName: TABLENAME,
        }
      );
      Loaders.associate = async (models, sequelize) => {};
      return Loaders;
    },
    insertFixedData: async (sequelize) => {
      //idempotent
    },
  };
} catch (e) {
  logger.error(e);
}
