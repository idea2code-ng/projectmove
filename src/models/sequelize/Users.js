const {DataTypes} = require("sequelize");
const logger = require("../../config/logger");
const TABLENAME = "Users";

try {
       module.exports = {
              defineModel: async (sequelize) => {
                     const Users = await sequelize.define(
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
                                           allowNull: true,
                                    },
                                    password: {
                                           type: DataTypes.STRING,
                                           allowNull: true,
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
                                    userotp: {
                                           type: DataTypes.STRING,
                                           allowNull: true,
                                    },
                                    city: {
                                           type: DataTypes.STRING
                                    },
                                    latitude: {
                                           type: DataTypes.STRING,
                                           allowNull: true
                                    },
                                    longitude: {
                                           type: DataTypes.STRING,
                                           allowNull: true
                                    }
                             },
                             {
                                    tableName: TABLENAME,
                             }
                     );
                     Users.associate = async (models, sequelize) => {
                            await Users.hasMany(models.Orders, {
                                   foreignKey: 'Id'
                            })
                     };
                     return Users;
              },
              insertFixedData: async (sequelize) => {
                     //idempotent
              },
       };
} catch (e) {
       logger.error(e);
}
