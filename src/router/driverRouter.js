const router = require("express").Router();
const {
  storedriverLocationCtrl,
  driverloginctrl,
  driveremailsendCtrl,
  driverchangepasswordCtrl,
  driverresetpasswordCtrl,
  diverupdateprofileCtrl,
  driverSignupCtrl,
  addProfileInfoCtrl,
  driverSignupWithProviderCtrl,
  getallorderdriverCtrl,
  accpetorderDriverCtrl,
  rejectedorderDriverCtrl,
  adddriverdetailsCtrl,
} = require("../controller/DriverController");
const expressValidatorMw = require("../middlewares/validate");
const { driversignupv, signupWithProvidersdv } = require("../validators/registerv");
const { matchedData } = require("express-validator");
const { DataValidationError } = require("../errors/index");
const { validationResult } = require("express-validator");
const driverauth = require("../middlewares/driverauth");
const { updatediverV, signupWithProvidersv, addDriverProfileInfov } = require("../validators/registerv");
const { upload } = require("../utils/imageupload");
const { successResponce, createResponse } = require("../utils/sendResponse");
const { vehiclesv, licencev, InsuranceV, profilev } = require("../validators/workerv");

// signup api driver
router.post("/signup", driversignupv, expressValidatorMw, async (req, res, next) => {
  try {
    const ctrlData = matchedData(req, { locations: ["body"] });
    await driverSignupCtrl(ctrlData);
    createResponse(req, res, "Driver created Successfully");
  } catch (error) {
    return next(error);
  }
});

// personal info addition api
router.post("/addProfileInfo", upload, addDriverProfileInfov, expressValidatorMw, async (req, res, next) => {
  try {
    const ctrlData = matchedData(req, { locations: ["body"] });
    await addProfileInfoCtrl(ctrlData, req.filename);
    successResponce(req, res, "Profile data added successfully");
  } catch (error) {
    if (error) {
      console.log(error, "err");
    }
    return next(error);
  }
});

// driver oauth login
router.post("/signupWithProviders", signupWithProvidersdv, expressValidatorMw, async (req, res, next) => {
  try {
    const ctrlData = matchedData(req, { locations: ["body"] });
    const token = await driverSignupWithProviderCtrl(ctrlData);
    successResponce(req, res, token);
  } catch (error) {
    if (error) {
      console.log(error, "err");
    }
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token } = await driverloginctrl({ email, password });
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
    const password = await driveremailsendCtrl(req.body, next);
    successResponce(req, res, "check your mail");
  } catch (error) {
    return next(error);
  }
});

router.post("/changepassword", driverauth, driverchangepasswordCtrl);

router.post("/resetpassword", async (req, res, next) => {
  try {
    const ctrlData = req.body;
    const user = await driverresetpasswordCtrl(ctrlData);
    successResponce(req, res, "password reset successfull");
  } catch (error) {
    return next(error);
  }
});

router.put("/updateprofie", upload, driverauth, updatediverV, expressValidatorMw, async (req, res, next) => {
  try {
    const ctrlData = matchedData(req, { locations: ["body"] });
    const data = req.user.Id;
    const user = await diverupdateprofileCtrl(ctrlData, data, req.filename);
    successResponce(req, res, "update profile successfully");
  } catch (error) {
    return next(error);
  }
});

router.put("/driverplace", driverauth, async (req, res, next) => {
  try {
    const data = req.user.Id;
    const ctrlData = req.body;
    const result = await storedriverLocationCtrl(data, ctrlData);
    successResponce(req, res, "user add location");
  } catch (error) {
    return next(error);
  }
});

//add driver details (Licence_Details,insurance_details,vehicles)
router.post(
  "/addDriverDetails",
  upload,
  driverauth,
  vehiclesv,
  licencev,
  profilev,
  InsuranceV,
  expressValidatorMw,
  async (req, res, next) => {
    try {
      const ctrlData = matchedData(req, { locations: ["body"] });
      const user_id = req.user.Id;
      const { vehicles, Licence_Details, insurance_details, user } = await adddriverdetailsCtrl(
        ctrlData,
        user_id,
        req.files
      );
      successResponce(req, res, { vehicles, Licence_Details, insurance_details, user });
    } catch (error) {
      return next(error);
    }
  }
);

//all driver order
router.get("/allorder", driverauth, async (req, res, next) => {
  try {
    const ctrlData = req.user.Id;
    const orders = await getallorderdriverCtrl(ctrlData);
    successResponce(req, res, orders);
  } catch (error) {
    return next(error);
  }
});

router.put("/accpeptorder/:id", driverauth, async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const driverId = req.user.Id;
    await accpetorderDriverCtrl(orderId, driverId);
    successResponce(req, res, `Order ${orderId} accepted successfully`);
  } catch (error) {
    return next(error);
  }
});

router.post("/rejectorder/:id", driverauth, async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const driverId = req.user.Id;
    const order = await rejectedorderDriverCtrl(orderId, driverId);
    successResponce(req, res, `Order ${orderId} rejected`);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
