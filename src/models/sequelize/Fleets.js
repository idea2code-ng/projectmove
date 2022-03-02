const { DataTypes } = require("sequelize");
const logger = require("../../config/logger");
const TABLENAME = "Fleets";

try {
    module.exports = {
        defineModel: async (sequelize) => {
            const Fleets = await sequelize.define(
                TABLENAME,
                {
                    Id: {
                        type: DataTypes.INTEGER,
                        primaryKey: true,
                        autoIncrement: true,
                    },
                    image: {
                        type: DataTypes.STRING,
                        allowNull: true,
                    },
                    capacity: {
                        type: DataTypes.STRING,
                        allowNull: true,
                    },
                    name: {
                        type: DataTypes.STRING,
                        allowNull: false,
                    },
                    price: {
                        type: DataTypes.STRING,
                        allowNull: false,
                    }
                },
                {
                    tableName: TABLENAME,
                }
            );
            Fleets.associate = async (models, sequelize) => {
                const queryInteface = sequelize.getQueryInterface()
                await queryInteface.changeColumn(TABLENAME, 'Id', {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'Fleets',
                        key: 'Id'
                    }
                })
            };
            Fleets.associate = async (models, sequelize) => {
                await Fleets.hasMany(models.Orders, {
                    foreignKey: 'Id'
                })
            }
            return Fleets;
        },
        insertFixedData: async (sequelize) => {
            //idempotent
        },
    };
} catch (e) {
    logger.error(e);
}
