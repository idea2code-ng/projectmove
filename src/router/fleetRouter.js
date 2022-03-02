const router = require("express").Router();
const expressValidatorMw = require("../middlewares/validate");
const {fleetv}=require("../validators/fleetv")
const {matchedData}=require("express-validator")
const {fleetaddCtrl,getfleetCtrl}=require("../controller/fleetController")
const {singleFileUpload}=require("../utils/oneimageupload")
const {queryErrorRelatedResponse}=require("../utils/sendResponse")

router.post("/add",singleFileUpload("uploads",["image/png","image/jpeg","image/jpg"],1024*1024,"image"),fleetv,expressValidatorMw,async(req,res,next)=>{
    try {
        if (!req.file)
        return queryErrorRelatedResponse(req, res, 404, "Please select file.");
        const ctrlData = matchedData(req, { locations: ["body"] });
        const category= await fleetaddCtrl(ctrlData,req.file);
        return res.status(201).send(category);    
    } catch (error) {
        if(error){
            console.log(error,"error");
        }
        return next(error)
    }
})

router.get("/all",async(req,res,next)=>{
    try {
        const category = await getfleetCtrl()
        res.send(category)
    } catch (error) {
        return next(error)
    }
})

module.exports = router;
