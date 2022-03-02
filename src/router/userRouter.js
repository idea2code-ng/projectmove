const router = require("express").Router();
const expressValidatorMw = require("../middlewares/validate");
const {
       registerv,
       forgotPassword,
       updateuserV,
       addUserProfileInfov,
       signupWithProvidersv,
} = require("../validators/registerv");
const {validationResult, matchedData} = require("express-validator");
const {DataValidationError} = require("../errors/index");
const userauth = require("../middlewares/auth");
const {
       userSignupCtrl,
       userloginctrl,
       userchangepasswordCtrl,
       useremailsendCtrl,
       userresetpasswordCtrl,
       userupdateprofileCtrl,
       addProfileInfoCtrl,
       userSignupWithProviderCtrl,
       userlogoutsendCtrl,
       storeUserLocationCtrl,
} = require("../controller/UserController");

const {upload} = require("../utils/imageupload");
const sequelize = require("../models/sequelize/");
const {successResponce, SignupResponse, LoginResponse} = require("../utils/sendResponse");
const {signJWT} = require("../utils/jwtutils");
const {findModelItemQ} = require("../queries/generic/index");

// signup api
router.post("/signup", registerv, expressValidatorMw, async (req, res, next) => {
       try {
              const ctrlData = matchedData(req, {locations: ["body"]});
              var res_data = await userSignupCtrl(ctrlData);
              const loginjwt_signup = signJWT({user: {Id: res_data.Id}});
              SignupResponse(req, res, res_data, loginjwt_signup, "User created Successfully");
       } catch (error) {
              if (error) {
                     console.log(error, "err");
              }
              return next(error);
       }
});


// personal info addition api
router.post("/addProfileInfo", upload, addUserProfileInfov, expressValidatorMw, async (req, res, next) => {
       try {
              const ctrlData = matchedData(req, {locations: ["body"]});
              await addProfileInfoCtrl(ctrlData, req.filename);
              successResponce(req, res, "Profile data added successfully");
       } catch (error) {
              return next(error);
       }
});

// user oauth login
router.post("/signupWithProviders", signupWithProvidersv, expressValidatorMw, async (req, res, next) => {
       try {
              const ctrlData = matchedData(req, {locations: ["body"]});
              const token = await userSignupWithProviderCtrl(ctrlData);
              successResponce(req, res, token);
       } catch (error) {
              if (error) {
                     console.log(error, "err");
              }
              return next(error);
       }
});

//user login api
router.post("/login", async (req, res, next) => {
       try {
              const {email, password} = req.body;
              const {token} = await userloginctrl({email, password});
              const {res_data} = await userloginctrl({email, password});

              LoginResponse(req, res, res_data, token, "User Login Successfully");
//              successResponce(req, res, token);
       } catch (error) {
              return next(error);
       }
});

//user change password api
router.post("/changepassword", userauth, userchangepasswordCtrl);

//user mail send api
router.post("/emailsend", async (req, res, next) => {
       try {
              const errors = validationResult(req);
              if (errors.array().length !== 0) {
                     return next(new DataValidationError("Data Validation Error", errors.array()));
              }
              const password = await useremailsendCtrl(req.body, next);
              successResponce(req, res, "check your mail");
       } catch (error) {
              return next(error);
       }
});

//user logout api
router.post("/logout", async (req, res, next) => {
       try {
              const errors = validationResult(req);
              if (errors.array().length !== 0) {
                     return next(new DataValidationError("Data Validation Error", errors.array()));
              }
              const password = await userlogoutsendCtrl(req.body, next);
              successResponce(req, res, "Logout Suceess");
       } catch (error) {
              return next(error);
       }
});

//user reset password api
router.post("/resetpassword", async (req, res, next) => {
       try {
              const ctrlData = req.body;
              const user = await userresetpasswordCtrl(ctrlData);
              successResponce(req, res, "Reset password successfully");
       } catch (error) {
              return next(error);
       }
});

// user update profile
router.post("/updateprofie", upload, userauth, updateuserV, expressValidatorMw, async (req, res, next) => {
       try {
              const ctrlData = matchedData(req, {locations: ["body"]});
              const userData=req.user
              const user = await userupdateprofileCtrl(ctrlData, userData, req.files);
              res.status(200).json({status: 1, message: "update profile", user});
       } catch (error) {
              return next(error);
       }
});

//user location add
router.put("/userplace", userauth, async (req, res, next) => {
       try {
              const data = req.user.Id;
              const ctrlData = req.body;
              const result = await storeUserLocationCtrl(data, ctrlData);
              successResponce(req, res, result);
       } catch (error) {
              return next(error);
       }
});

module.exports = router;
