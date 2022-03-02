const sequelize = require('../../models/sequelize')
const findModelItemQ = (modelName,queryOpts)=>{
    const result = sequelize.models[modelName].findOne(queryOpts)
    return result
}

const findModelItemsQ = (modelName,queryOpts,count=true,scope=null)=>{
    let result = null
    if(count){
         result = sequelize.models[modelName].findAndCountAll(queryOpts)
    }else{
        result = sequelize.models[modelName].findAll(queryOpts)
    } 
    return result 
}

const findModelItemsWithScopeQ = (modelName,queryOpts,count=true,scope=null)=>{
    let result = null
    if(count){
         result = sequelize.models[modelName].scope(scope).findAndCountAll(queryOpts)
    }else{
        result = sequelize.models[modelName].scope(scope).findAll(queryOpts)
    } 
    return result 
}

const createModelItemQ = async(modelName,queryData,queryOptions={})=>{
    const modelItem = await sequelize.models[modelName].create(queryData,queryOptions)
    return modelItem
}

const findOrCreateModelItemQ = async(modelName,queryData)=>{
    const modelItem = await sequelize.models[modelName].findOrCreate(queryData)
    return modelItem
}


const updateModelItemQ = async(modelName, valueData,queryData )=>{
    const updatedModelItem = await sequelize.models[modelName].update({...valueData},{...queryData})
    return updatedModelItem
}

module.exports = {
    findModelItemQ,
    findModelItemsQ,
    createModelItemQ,
    findOrCreateModelItemQ,
    updateModelItemQ,
    findModelItemsWithScopeQ,
}