const router=require("express").Router();
const {cardv}=require("../validators/cardv")
const expressValidatorMw = require("../middlewares/validate");
const {matchedData}=require("express-validator");
const {cardcontroller,getcardcontroller}=require("../controller/cardController")
const userauth = require("../middlewares/auth");

router.post("/card",cardv,userauth,expressValidatorMw,async(req,res,next)=>{
    try {
        const ctrlData=matchedData(req,{locations:["body"]})
        const data=req.user.Id
        const card =await cardcontroller(ctrlData,data)
        res.send(card)
    } catch (error) {
        return next(error)
    }
})

router.get("/card",userauth,async(req,res,next)=>{
    try {
        const data=req.user.Id
        const card =await getcardcontroller(data);
        res.send(card)
    } catch (error) {
        return next(error)
    }
})


module.exports=router