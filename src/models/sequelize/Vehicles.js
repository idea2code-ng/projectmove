const { DataTypes, DatabaseError } = require("sequelize");
const logger = require("../../config/logger");
const TABLENAME = "Vehicles";

try {
  module.exports = {
    defineModel: async (sequelize) => {
      const Vehicles = await sequelize.define(
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
          fleet_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          vehicle_image: {
            type: DataTypes.STRING,
            required: true,
          },
          vehicle_number: {
            type: DataTypes.STRING,
            required: true,
          },
          brand: {
            type: DataTypes.STRING,
            required: true,
          },
          model: {
            type: DataTypes.STRING,
            required: true,
          },
          year: {
            type: DataTypes.STRING,
            required: true,
          },
          price: {
            type: DataTypes.REAL,
            required: true,
          },
          vehicle_type: {
            type: DataTypes.STRING,
            required: true,
          },
        },
        {
          tableName: TABLENAME,
        }
      );
      Vehicles.associate = async (models, sequelize) => {
        await Vehicles.hasMany(models.Fleets, {
          foreignKey: 'Id'
        })
      };
      return Vehicles;
    },
    insertFixedData: async (sequelize) => {
      //idempotent
    },
  };
} catch (e) {
  logger.error(e);
}
