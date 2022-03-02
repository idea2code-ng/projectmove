"use strict";

const fs = require("fs");
const path = require("path");
const sequelize = require("../../config/db/sequelize");
const logger = require("../../config/logger");
const basename = path.basename(__filename);

global.DB_PROCESSING = true;

//https://github.com/sequelize/express-example/blob/master/express-main-example/express/routes/instruments.js

const files = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  );
});

const dropAllTables = async () => {
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", null, { raw: true });
  await sequelize.dropAllSchemas();
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null, { raw: true });
};

const definedModels = [];
//Defining all Models
const defineAllModels = async () => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    var { defineModel } = require(path.join(__dirname, file));
    if (defineModel) {
      const model = await defineModel(sequelize);
      definedModels.push(model);
    }
  }
};

const defineAllAssociations = async () => {
  //Defining all Associations

  for (let i = 0; i < definedModels.length; i++) {
    const model = definedModels[i];

    if (model.associate) {
      await model.associate(sequelize.models, sequelize);
    }
  }
};

const addReferences = async () => {
  for (let i = 0; i < definedModels.length; i++) {
    const model = definedModels[i];

    if (model.references) {
      await model.references(sequelize.models, sequelize);
    }
  }
};

const populateFixedData = async () => {
  //inserting fixed data
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", null, { raw: true });
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    logger.info(`FIXED DATA: ${file} `);
    var { insertFixedData } = require(path.join(__dirname, file));
    if (insertFixedData !== undefined) {
      await insertFixedData(sequelize);
    }
  }
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null, { raw: true });
};

const syncModels = async (forceSync = false, alter = false) => {
  const modelsObject = sequelize.models;
  const modelsArray = Object.entries(modelsObject);
  let model;
  for (let i = 0; i < modelsArray.length; i++) {
    model = modelsArray[i];
    logger.info("syncing model");
    await modelsObject[model[0]].sync({ force: forceSync, alter });
  }
};

const drop_alter_seed = async () => {
  await defineAllModels();
  await dropAllTables();
  await syncModels();
  await defineAllAssociations();
  await addReferences();
  await populateFixedData();
  logger.info("drop_alter_seed complete");
};

const db_sync = async () => {
  await defineAllModels();
  if (process.env.ALTER_SYNC == "true") {
    await syncModels(false, true);
    await addReferences();
  } else {
    await syncModels(false, false);
  }
  await defineAllAssociations();

  logger.info("db_sync complete");
};

(async () => {
  try {
    if (process.env.DROP_ALTER_SEED == "true") {
      await drop_alter_seed();
    } else {
      await db_sync();
    }
    global.DB_PROCESSING = false;
  } catch (e) {
    logger.info(e);
  }
})();

module.exports = sequelize;
