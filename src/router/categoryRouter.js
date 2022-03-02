const router = require("express").Router();
const expressValidatorMw = require("../middlewares/validate");
const {categoryv}=require("../validators/categoryv")
const {matchedData}=require("express-validator")
const {categoryaddCtrl,getcategoryCtrl}=require("../controller/categoryController")
const {singleFileUpload}=require("../utils/oneimageupload")
const {queryErrorRelatedResponse}=require("../utils/sendResponse")

router.post("/add",singleFileUpload("uploads",["image/png","image/jpeg","image/jpg"],1024*1024,"image"),categoryv,expressValidatorMw,async(req,res,next)=>{
    try {
        if (!req.file)
        return queryErrorRelatedResponse(req, res, 404, "Please select file.");
        const ctrlData = matchedData(req, { locations: ["body"] });
        const category= await categoryaddCtrl(ctrlData,req.file);
        return res.status(201).send(category);    
    } catch (error) {
        return next(error)
    }
})

router.get("/all",async(req,res,next)=>{
    try {
        const category = await getcategoryCtrl()
        res.send(category)
    } catch (error) {
        return next(error)
    }
})

module.exports = router;
