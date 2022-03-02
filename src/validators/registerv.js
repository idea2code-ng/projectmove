const {body, query} = require("express-validator");
const {findUserByEmail} = require("../queries/users");
const {UserNotFoundError, DataValidationError, EmailError} = require("../errors/index");
const sequelize = require("../models/sequelize/index");
const {successResponce, createResponse} = require("../utils/sendResponse");

module.exports = {
       registerv: [
              body("username").exists().isString("username should be a valid string"),
              body("email")
                      .exists()
                      .trim()
                      .withMessage("email should be a valid string"),
                     //  .custom(async (email) => {
                     //         const checkExistance = await sequelize.models.Users.findOne({
                     //                where: {
                     //                       email,
                     //                }
                     //         });
                     //         if (checkExistance) {
                     //                throw new DataValidationError("email already exits");
                     //         }
                     //  }),
              body("password")
                      .exists()
                      .trim()
                      .withMessage("Password is required and should be atleast 5 character long")
                      .isLength({min: 5}),
             body("device_token").exists().optional(),
             body("device_id").exists().optional(),
             body("device_type").exists().optional(),
       ],
       addUserProfileInfov: [
              body("phone")
                      .exists()
                      .trim()
                      .withMessage("Please enter valid mobile number")
                      .custom(async (phone) => {
                             // currently we are checking for indian mobile numbers only
                             const mobileRegx = /^[6-9]\d{9}$/gi;
                             if (!mobileRegx.test(phone)) {
                                    throw new Error(`Enter valid mobile number`);
                             }
                      }),
              body("username").exists().trim().withMessage("Please enter valid username"),
              body("email")
                      .exists()
                      .trim()
                      .normalizeEmail()
                      .withMessage("email should be a valid string")
                      .custom(async (email) => {
                             const checkExistance = await sequelize.models.Users.findOne({
                                    where: {
                                           email,
                                    },
                             });
                             if (!checkExistance) {
                                    throw new Error(`Driver with email ${email} does not exist!`);
                             }
                      }),
              body("address").exists().trim().withMessage("Please provide valid address"),
       ],
       signupWithProvidersv: [
              body("username").exists().trim().withMessage("Please enter valid username"),
              body("email").exists().trim().normalizeEmail().withMessage("email should be a valid string"),
              body("provider")
                      .exists()
                      .custom(async (provider) => {
                             const providers = ["FACEBOOK", "GOOGLE", "APPLE"];
                             if (!providers.includes(provider.toUpperCase())) {
                                    throw new Error("Provide valid provider");
                             }
                      })
                      .withMessage("Please provide valid provider"),
              body("profile_url").exists().withMessage("Please provide valid profile url"),
       ],
       loadersignupv: [
              body("username").exists().isString("username should be a valid string"),
              body("email")
                      .exists()
                      .trim()
                      .withMessage("email should be a valid string")
                      .custom(async (email) => {
                             const checkExistance = await sequelize.models.Loaders.findOne({
                                    where: {
                                           email,
                                    },
                             });
                             if (checkExistance) {
                                    throw new Error(`Loader with email ${email} already exist!`);
                             }
                      }),
              body("password")
                      .exists()
                      .trim()
                      .withMessage("Password is required and should be atleast 5 character long")
                      .isLength({min: 5}),
       ],
       addLoaderProfileInfo: [
              body("phone")
                      .exists()
                      .trim()
                      .withMessage("Please enter valid mobile number")
                      .custom(async (phone) => {
                             // currently we are checking for indian mobile numbers only
                             const mobileRegx = /^[6-9]\d{9}$/gi;
                             if (!mobileRegx.test(phone)) {
                                    throw new Error(`Enter valid mobile number`);
                             }
                      }),
              body("username").exists().trim().withMessage("Please enter valid username"),
              body("email")
                      .exists()
                      .trim()
                      .normalizeEmail()
                      .withMessage("email should be a valid string")
                      .custom(async (email) => {
                             const checkExistance = await sequelize.models.Loaders.findOne({
                                    where: {
                                           email,
                                    },
                             });
                             if (!checkExistance) {
                                    throw new Error(`Driver with email ${email} does not exist!`);
                             }
                      }),
              body("address").exists().trim().withMessage("Please provide valid address"),
              body("price"),
       ],
       signupWithProviderslv: [
              body("username").exists().trim().withMessage("Please enter valid username"),
              body("email").exists().trim().normalizeEmail().withMessage("email should be a valid string"),
              body("provider")
                      .exists()
                      .custom(async (provider) => {
                             const providers = ["FACEBOOK", "GOOGLE", "APPLE"];
                             if (!providers.includes(provider.toUpperCase())) {
                                    throw new Error("Provide valid provider");
                             }
                      })
                      .withMessage("Please provide valid provider"),
              body("profile_url").exists().withMessage("Please provide valid profile url"),
       ],
       forgotPassword: [
              body("email")
                      .exists()
                      .isEmail()
                      .custom((email) => {
                             return findUserByEmail(email).then((res) => {
                                    if (res) {
                                           return res;
                                    }
                                    throw new UserNotFoundError("We don't find your email in our system.");
                             });
                      }),
       ],
       forgotPassword: [
              body("email")
                      .exists()
                      .isEmail()
                      .custom((email) => {
                             return findUserByEmail(email).then((res) => {
                                    if (res) {
                                           return res;
                                    }
                                    throw new UserNotFoundError("We don't find your email in our system.");
                             });
                      }),
       ],
       updateuserV: [body("address").optional().isString("address should be a valid string"),
              body("price").optional(),
              body("city").optional(),
              body("phone").optional(),
              body("username").optional(),
//              body("email")
////                      .exists()
//                      .trim()
////                      .normalizeEmail()
////                      .withMessage("email should be a valid string")
//                      .custom((email) => {
//                             return findUserByEmail(email).then((res) => {
//                                    if (res) {
//                                    } else {
//                                           return res;
//
//                                    }
////                                    throw new UserNotFoundError("We don't find your email in our system.");
//                             });
//                      }),
       ],
       updatediverV: [body("address").optional().isString("address should be a valid string"), body("price").optional()],
       updateloaderV: [body("address").optional().isString("address should be a valid string"), body("price").optional()],
       driversignupv: [
              body("username").exists().isString("username should be a valid string"),
              body("email").exists().trim().normalizeEmail().withMessage("email should be a valid string"),
              body("password")
                      .exists()
                      .trim()
                      .withMessage("Password is required")
                      .isLength({min: 5})
                      .withMessage("Password should be atleast 5 character long"),
       ],
       addDriverProfileInfov: [
              body("phone")
                      .exists()
                      .trim()
                      .withMessage("Please enter valid mobile number")
                      .custom(async (phone) => {
                             // currently we are checking for indian mobile numbers only
                             const mobileRegx = /^[6-9]\d{9}$/gi;
                             if (!mobileRegx.test(phone)) {
                                    throw new Error(`Enter valid mobile number`);
                             }
                      }),
              body("username").exists().trim().withMessage("Please enter valid username"),
              body("email")
                      .exists()
                      .trim()
                      .normalizeEmail()
                      .withMessage("email should be a valid string")
                      .custom(async (email) => {
                             const checkExistance = await sequelize.models.Drivers.findOne({
                                    where: {
                                           email,
                                    },
                             });
                             if (!checkExistance) {
                                    throw new Error(`Driver with email ${email} does not exist!`);
                             }
                      }),
              body("address").exists().trim().withMessage("Please provide valid address"),
       ],
       signupWithProvidersdv: [
              body("username").exists().trim().withMessage("Please enter valid username"),
              body("email").exists().trim().normalizeEmail().withMessage("email should be a valid string"),
              body("provider")
                      .exists()
                      .custom(async (provider) => {
                             const providers = ["FACEBOOK", "GOOGLE", "APPLE"];
                             if (!providers.includes(provider.toUpperCase())) {
                                    throw new Error("Provide valid provider");
                             }
                      })
                      .withMessage("Please provide valid provider"),
              body("profile_url").exists().withMessage("Please provide valid profile url"),
       ],
};
