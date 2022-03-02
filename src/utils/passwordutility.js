const bcrypt=require("bcrypt")

const comparePasswords= async(plainTextPass,passHash)=>{
    const result =await bcrypt.compare(plainTextPass,passHash)
    return result
}

module.exports={comparePasswords}