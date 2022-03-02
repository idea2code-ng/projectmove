const sequelize = require("../models/sequelize/index");
const {findUserById}=require("../queries/users/index")

const cardcontroller=async(ctrlData,data)=>{
    const card =await sequelize.models.Card_details.create({
        ...ctrlData,user_id:data
    })
    const result=await card.save();
    return result
}

const getcardcontroller=async(data)=>{
    const result =await sequelize.models.Card_details.findAll({user_id:data});
    return result
}

module.exports={cardcontroller,getcardcontroller}