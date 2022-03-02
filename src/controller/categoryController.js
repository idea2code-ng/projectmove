const { createModelItemQ } = require("../queries/generic");
const sequelize =require("../models/sequelize/index")
const categoryaddCtrl =async(ctrlData,file)=>{
    const category = await createModelItemQ("Categories", {
        ...ctrlData,
        image:file.filename
    });
    return category
}

const getcategoryCtrl= async()=>{
    const category =await sequelize.models.Categories.findAll();
    return category
}

module.exports={categoryaddCtrl,getcategoryCtrl}