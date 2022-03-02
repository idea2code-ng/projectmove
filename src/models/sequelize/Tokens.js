const {DataTypes} = require("sequelize");
const logger = require("../../config/logger");
const TABLENAME = "Tokens";

try {
       module.exports = {
              defineModel: async (sequelize) => {
                     const Tokens = await sequelize.define(
                             TABLENAME,
                             {
                                    token_id: {
                                           type: DataTypes.INTEGER,
                                           primaryKey: true,
                                           autoIncrement: true,
                                    },
                                    device_id: {
                                           type: DataTypes.STRING,
                                           allowNull: true,
                                    },
                                    device_token: {
                                           type: DataTypes.STRING,
                                           allowNull: true,
                                    },
                                    device_type: {
                                           type: DataTypes.STRING,
                                           allowNull: true,
                                    },
                                    user_id: {
                                           type: DataTypes.STRING,
                                           allowNull: true,
                                    },
                             },
                             {
                                    tableName: TABLENAME,
                             }
                     );
                     Tokens.associate = async (models, sequelize) => {
                            await Tokens.hasMany(models.Orders, {
                                   foreignKey: 'token_id'
                            });
                     };
                     return Tokens;
              },
              insertFixedData: async (sequelize) => {
                     //idempotent
              }
       };
} catch (e) {
       logger.error(e);
}
