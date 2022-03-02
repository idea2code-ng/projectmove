const bcrypt = require("bcrypt");
const sequelize = require("../models/sequelize/index");
const { DataValidationError, UserNotFoundError, EmailError } = require("../errors/index");
const { findUserById, findUserByEmail } = require("../queries/users/index");
const { comparePasswords } = require("../utils/passwordutility");
const { signJWT } = require("../utils/jwtutils");
const { sendEmail } = require("../utils/sendmail");
const { findModelItemQ } = require("../queries/generic/index");
var fs = require('fs');

const userSignupCtrl = async (ctrlData) => {
       try {
              console.log(ctrlData, "device_type");
              const hashed = await bcrypt.hash(ctrlData.password, 8);
              const user = await findUserByEmail(ctrlData.email);
              if (user) {
                     throw new Error('Email already exists');
              } else {
                     const register = await sequelize.models.Users.create({
                            username: ctrlData.username,
                            email: ctrlData.email,
                            password: hashed,
                     });
                     const result = await register.save();
                     const checkdetail = await sequelize.models.Tokens.findOne({
                            user_id: result.Id,
                            device_id: ctrlData.device_id
                     })
                     if (!checkdetail) {
                            const deviceinfo = await sequelize.models.Tokens.create({
                                   user_id: result.Id,
                                   device_id: ctrlData.device_id,
                                   device_token: ctrlData.device_token,
                                   device_type: ctrlData.device_type
                            });
                            await deviceinfo.save();
                     } else {
                            checkdetail.device_token = ctrlData.device_token,
                                   checkdetail.device_type = ctrlData.device_type
                            await checkdetail.save();
                     }
                     return result;
              }
       } catch (error) {
              throw error
       }
};

const userloginctrl = async ({ email, password }, next) => {
       try {
              const user = await findUserByEmail(email);
              if (user !== null) {
                     if (user.provider == "NORMAL") {
                            const result = await comparePasswords(password, user.password);
                            if (result === true) {
                                   const loginjwt = signJWT({ user: { Id: user.Id } });
                                   return { token: loginjwt, res_data: user };
                            } else {
                                   throw new DataValidationError("invalid email or password");
                            }
                     } else {
                            throw new Error(`you might have logged using ${user.provider} last time!`);
                     }
              } else {
                     throw new DataValidationError("invalid email or password");
              }
       } catch (error) {
              throw error;
       }
};

const userchangepasswordCtrl = async (req, res, next) => {
       try {
              const { oldPassword, newPassword, confirmPassword } = req.body;
              const hashed = await bcrypt.hash(newPassword, 8);
              const user = await findUserById(req.user.Id);
              if (user) {
                     const validPassword = await bcrypt.compare(oldPassword, user.password);
                     if (validPassword) {
                            if (newPassword == confirmPassword) {
                                   user.password = hashed;
                                   await user.save();
                                   return res.status(200).json({
                                          status: 1,
                                          message: "Password changed successfully!",
                                   });
                            } else {
                                   return res.status(200).json({
                                          status: 0,
                                          message: "Password did not match.",
                                   });
                            }
                     } else {
                            return res.status(200).json({
                                   status: 2,
                                   message: "old password dose not match",
                            });
                     }
              } else {
                     return res.status(200).json({
                            status: 3,
                            message: "user not found",
                     });
              }
       } catch (error) {
              next(error);
       }
};

const useremailsendCtrl = async (userData) => {
       try {
              let data = await findUserByEmail(userData.email);
              if (data) {
                     let otpcode = Math.floor(Math.random() * 1000000 + 1);
                     data.userotp = otpcode;
                     let response = await data.save();
                     sendEmail({
                            to: userData.email,
                            subject: otpcode,
                            html: otpcode,
                            text: otpcode,
                     });
              } else {
                     throw new UserNotFoundError();
              }
       } catch (error) {
              throw error;
       }
};

const userlogoutsendCtrl = async (userData) => {
       try {
              let data = await findUserByEmail(userData.email);
              if (data) {
                     let otpcode = Math.floor(Math.random() * 1000000 + 1);
                     data.userotp = otpcode;
                     let response = await data.save();
                     sendEmail({
                            to: userData.email,
                            subject: otpcode,
                            html: otpcode,
                            text: otpcode,
                     });
              } else {
                     throw new UserNotFoundError();
              }
       } catch (error) {
              throw error;
       }
};

const userresetpasswordCtrl = async (ctrlData) => {
       try {
              const user = await findModelItemQ("Users", {
                     where: { email: ctrlData.email },
              });
              if (user) {
                     console.log('okay: ' + JSON.stringify(user))
                     var OldPassword = user.Password;
                     const Newpassv1 = await bcrypt.hash(ctrlData.newPassword, 8);
                     if (OldPassword == Newpassv1) {
                            throw new DataValidationError("You have Entered Currrent Password Please enter new password");
                     } else {

                            console.log(';;;;->  ' + ctrlData.otp)
                            console.log('user.userotp->  ' + user.userotp)
                            if (ctrlData.otp == user.userotp) {
                                   if (ctrlData.confirmPassword === ctrlData.newPassword) {
                                          const hashed = await bcrypt.hash(ctrlData.newPassword, 8);

                                          const result = await user.update({
                                                 ...ctrlData,
                                                 password: hashed,
                                                 userotp: null,
                                          });
                                          //                                          user.password = hashed;
                                          //                                          user.userotp = null;
                                          //                                          const result = await user.save();
                                          return result;
                                   } else {
                                          throw new DataValidationError("password and confirm password does not match.");
                                   }

                            } else {

                                   throw new DataValidationError("Wrong otp");
                            }

                     }
              } else {
                     throw new DataValidationError("Email id Does not match over records");
              }
       } catch (error) {
              throw error;
       }
};

const userupdateprofileCtrl = async (ctrlData, userData, files) => {
       try {
              //console.log(userData.Id,"userData",userData.email,"userData");
              const user = await findModelItemQ("Users", { where: { Id: userData.Id } });
              if (user) {
                     const checkemail = await findModelItemQ("Users", { where: { email: ctrlData.email } });
                     console.log(checkemail,"checkemail");
                     if (checkemail) {
                            await user.update({
                                   ...ctrlData,
                                   image: files.profile_image[0].originalname,
                            });
                            return user;
                     }
              } else {
                     throw new UserNotFoundError();
              }
       } catch (error) {
              return error;
       }
};

const addProfileInfoCtrl = async (ctrlData, filename) => {
       try {
              // console.log(filename, "filename");

              const updatedUser = await sequelize.models.Users.update(
                     {
                            phone: ctrlData.phone,
                            address: ctrlData.address,
                            profilePic: `uploads/${filename}`,
                     },
                     {
                            where: {
                                   email: ctrlData.email,
                            },
                     }
              );
              return updatedUser;
       } catch (error) {
              throw new Error(error.message);
       }
};

const userSignupWithProviderCtrl = async (ctrlData) => {
       try {
              const user = await findUserByEmail(ctrlData.email);
              let loginjwt;
              if (user) {
                     loginjwt = signJWT({ user: { Id: user.Id } });
                     return loginjwt;
              } else {
                     const user = await sequelize.models.Users.create({
                            username: ctrlData.username,
                            email: ctrlData.email,
                            profilePic: ctrlData.profile_url,
                            provider: ctrlData.provider,
                     });
                     loginjwt = signJWT({ user: { Id: user.Id } });
                     return loginjwt;
              }
       } catch (error) {
              throw new Error(error.message);
       }
};

const storeUserLocationCtrl = async (data, ctrlData) => {
       const user = await findModelItemQ("Users", { where: { Id: data } });
       user.latitude = ctrlData.latitude;
       user.longitude = ctrlData.longitude;
       const result = await user.save();
       return result;
};

module.exports = {
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
};
