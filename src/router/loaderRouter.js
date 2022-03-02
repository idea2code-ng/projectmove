const router = require("express").Router();
const {
  loaderrgisterCtrl,
  loaderloaderloginctrl,
  loaderemailsendCtrl,
  loaderchangepasswordCtrl,
  loaderresetpasswordCtrl,
  loaderupdateprofileCtrl,
  addProfileInfoCtrl,
  loaderSignupWithProviderCtrl,
  storeLoaderLocationCtrl,
  getallorderloaderCtrl,
  rejectedorderloaderCtrl,
  accpetloaderorderCtrl,
  loaderongoingorderCtrl,
} = require("../controller/LoaderController");
const expressValidatorMw = require("../middlewares/validate");
const { loadersignupv, addLoaderProfileInfo } = require("../validators/registerv");
const { matchedData } = require("express-validator");
const { DataValidationError } = require("../errors/index");
const { validationResult } = require("express-validator");
const loaderauth = require("../middlewares/loaderauth");
const { upload } = require("../utils/imageupload");
const { updateloaderV, signupWithProviderslv } = require("../validators/registerv");
const { successResponce, createResponse } = require("../utils/sendResponse");

// signup api loader
router.post("/signup", loadersignupv, expressValidatorMw, async (req, res, next) => {
  try {
    const ctrlData = matchedData(req, { locations: ["body"] });
    await loaderrgisterCtrl(ctrlData);
    createResponse(req, res, "Loader created Successfully");
  } catch (error) {
    return next(error);
  }
});

// personal info addition api
router.post("/addProfileInfo", upload, addLoaderProfileInfo, expressValidatorMw, async (req, res, next) => {
  try {
    const ctrlData = matchedData(req, { locations: ["body"] });
    await addProfileInfoCtrl(ctrlData, req.filename);
    successResponce(req, res, "Profile data added successfully");
  } catch (error) {
    return next(error);
  }
});

// loader oauth login
router.post("/signupWithProviders", signupWithProviderslv, expressValidatorMw, async (req, res, next) => {
  try {
    const ctrlData = matchedData(req, { locations: ["body"] });
    const token = await loaderSignupWithProviderCtrl(ctrlData);
    successResponce(req, res, token);
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token } = await loaderloaderloginctrl({ email, password });
    successResponce(req, res, token);
  } catch (error) {
    return next(error);
  }
});

router.post("/emailsend", async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.array().length !== 0) {
      return next(new DataValidationError("Data Validation Error", errors.array()));
    }
    const password = await loaderemailsendCtrl(req.body, next);
    successResponce(req, res, "check your mail");
  } catch (error) {
    return next(error);
  }
});

router.post("/changepassword", loaderauth, loaderchangepasswordCtrl);

router.post("/resetpassword", async (req, res, next) => {
  try {
    const ctrlData = req.body;
    const user = await loaderresetpasswordCtrl(ctrlData);
    successResponce(req, res, "password reset successfull");
  } catch (error) {
    return next(error);
  }
});

router.put("/updateprofie", upload, loaderauth, updateloaderV, expressValidatorMw, async (req, res, next) => {
  try {
    const ctrlData = matchedData(req, { locations: ["body"] });
    const userId = req.user.Id;
    const user = await loaderupdateprofileCtrl(ctrlData, userId, req.filename);
    successResponce(req, res, "User update profile successfull");
  } catch (error) {
    return next(error);
  }
});

router.put("/loaderplace", loaderauth, async (req, res, next) => {
  try {
    const data = req.user.Id;
    const ctrlData = req.body;
    const result = await storeLoaderLocationCtrl(data, ctrlData);
    successResponce(req, res, "loader add place");
  } catch (error) {
    return next(error);
  }
});

router.get("/orderall", loaderauth, async (req, res, next) => {
  try {
    const loaderId = req.user.Id;
    const order = await getallorderloaderCtrl(loaderId);
    return res.send(order);
  } catch (error) {
    if (error) {
      console.log("error", error);
    }
    return next(error);
  }
});

router.put("/accpeptorder", loaderauth, async (req, res, next) => {
  try {
    const { orderId, purpose } = req.query;
    const loaderId = req.user.Id;
    const order = await accpetloaderorderCtrl(orderId, loaderId, purpose);
    res.send(order);
  } catch (error) {
    if (error) {
      console.log("error", error);
    }
    return next(error);
  }
});

router.put("/rejectorder", loaderauth, async (req, res, next) => {
  try {
    const orderId = req.query.id;
    const purpose = req.query.purpose;
    const loaderId = req.user.Id;
    const order = await rejectedorderloaderCtrl(orderId, loaderId, purpose);
    res.send(order);
  } catch (error) {
    if (error) {
      console.log("erro", error);
    }
    return next(error);
  }
});

router.get("/ongoingorder", loaderauth, async (req, res, next) => {
  try {
    const loaderId = req.user.Id;
    const order = await loaderongoingorderCtrl(loaderId);
    res.send(order);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
