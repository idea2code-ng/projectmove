const {createModelItemQ}=require("../queries/generic/index")
const sequelize =require("../models/sequelize/index")

const fleetaddCtrl =async(ctrlData,file)=>{
    const Fleet= await createModelItemQ("Fleets", {
        ...ctrlData,
        image:file.filename
    });
    return Fleet
}

const getfleetCtrl =async()=>{
    const fleet =await sequelize.models.Fleets.findAll();
    return fleet
}
module.exports ={fleetaddCtrl,getfleetCtrl}