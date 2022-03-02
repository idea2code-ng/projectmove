const { DataTypes } = require("sequelize");
const logger = require("../../config/logger");
const TABLENAME = "Orders";

try {
  module.exports = {
    defineModel: async (sequelize) => {
      const Orders = await sequelize.define(
        TABLENAME,
        {
          Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
          },
          user_id: {
            type: DataTypes.INTEGER,
            required: false,
          },
          pickup: {
            type: DataTypes.STRING,
            required: true,
          },
          dropoff: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          date: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          time: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          weight: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          contact: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          fleet_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          pickup_city: {
            type: DataTypes.STRING,
          },
          dropoff_city: {
            type: DataTypes.STRING,
          },
          loaders_needed: {
            type: DataTypes.INTEGER,
          },
          unloaders_needed: {
            type: DataTypes.INTEGER,
          },
          foundloader: {
            type: DataTypes.INTEGER,
          },
          foundunloader: {
            type: DataTypes.INTEGER,
          },
          comment: {
            type: DataTypes.STRING,
            allowNull: true,
          },
        },
        {
          tableName: TABLENAME,
        }
      );
      Orders.references = async (models, sequelize) => {
        const queryInterface = sequelize.getQueryInterface();
        await queryInterface.changeColumn(TABLENAME, "user_id", {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            key: "Id",
          },
        });

        await queryInterface.changeColumn(TABLENAME, "fleet_id", {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Fleets",
            key: "Id",
          },
        });
      };

      Orders.associate = async (models, sequelize) => {
        await Orders.belongsTo(models.Users, {
          foreignKey: "user_id",
        });
        await Orders.belongsTo(models.Fleets, {
          foreignKey: "fleet_id",
        });
      };
      return Orders;
    },
    insertFixedData: async (sequelize) => {
      //idempotent
    },
  };
} catch (e) {
  logger.error(e);
}
