const bcrypt = require("bcrypt");
const sequelize = require("../models/sequelize/index");
const { DataValidationError, UserNotFoundError, DataNotFoundError } = require("../errors/index");
const { comparePasswords } = require("../utils/passwordutility");
const { signJWT } = require("../utils/jwtutils");
const { sendEmail } = require("../utils/sendmail");
const { findModelItemQ, createModelItemQ } = require("../queries/generic/index");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const { getCityFromLatLong } = require("../utils/getCity");

const driverloginctrl = async ({ email, password }, next) => {
  try {
    const user = await findModelItemQ("Drivers", {
      where: { email: email },
    });
    if (user !== null) {
      if (user.provider == "NORMAL") {
        const result = await comparePasswords(password, user.password);
        if (result === true) {
          const loginjwt = signJWT({ user: { Id: user.Id } });
          return { token: loginjwt };
        } else {
          throw new DataValidationError("password not match");
        }
      } else {
        throw new Error(`you might have logged using ${user.provider} last time!`);
      }
    } else {
      throw new UserNotFoundError();
    }
  } catch (error) {
    throw error;
  }
};

const driveremailsendCtrl = async (userData) => {
  try {
    const user = await findModelItemQ("Drivers", {
      where: { email: userData.email },
    });
    if (user) {
      let otpcode = Math.floor(Math.random() * 1000000 + 1);
      user.userotp = otpcode;
      let response = await user.save();
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
    if (error) {
      console.log(error);
    }
    throw error;
  }
};

const driverchangepasswordCtrl = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const hashed = await bcrypt.hash(newPassword, 8);
    const user = await sequelize.models.Drivers.findByPk(req.user.Id);
    if (user) {
      const validPassword = await bcrypt.compare(oldPassword, user.password);
      if (validPassword) {
        if (newPassword == confirmPassword) {
          user.password = hashed;
          await user.save();
          return res.status(400).json({
            status: "success",
            message: "Password changed successfully!",
          });
        } else {
          return res.status(404).json("Password did not match.");
        }
      } else {
        return res.status(404).json("old password dose not match");
      }
    } else {
      return res.status(404).json("user not found");
    }
  } catch (error) {
    next(error);
  }
};

const driverresetpasswordCtrl = async (ctrlData) => {
  try {
    const user = await findModelItemQ("Drivers", {
      where: { userotp: ctrlData.otp },
    });
    if (user) {
      if (ctrlData.confirmPassword === ctrlData.newPassword) {
        const hashed = await bcrypt.hash(ctrlData.newPassword, 8);
        user.password = hashed;
        user.userotp = null;
        const result = await user.save();
        return result;
      } else {
        throw new DataValidationError("password and confirm password does not match.");
      }
    } else {
      throw new DataValidationError("wrong otp");
    }
  } catch (error) {
    throw error;
  }
};

const diverupdateprofileCtrl = async (ctrlData, data, filepath) => {
  try {
    const user = await sequelize.models.Drivers.findByPk(data);

    if (user.provider == "NORMAL" && user.profilePic !== null) {
      const removeImagePath = path.resolve(__dirname + "/../../" + `${user.profilePic}`);
      const res = fs.existsSync(removeImagePath);
      fs.unlinkSync(removeImagePath);

      await user.update({
        ...ctrlData,
        profilePic: `uploads/${filepath}`,
      });
      return user;
    } else {
      throw new UserNotFoundError();
    }
  } catch (error) {
    return error;
  }
};

const driverSignupCtrl = async (ctrlData) => {
  try {
    const hashed = await bcrypt.hash(ctrlData.password, 8);
    const user = await findModelItemQ("Drivers", {
      where: { email: ctrlData.email },
    });
    if (user) {
      throw new DataValidationError("Given Email Already Exists", [
        {
          msg: "Email Already Exists",
          location: "body",
          param: "email",
        },
      ]);
    } else {
      const register = await sequelize.models.Drivers.create({
        username: ctrlData.username,
        email: ctrlData.email,
        password: hashed,
      });
      const result = await register.save();
      return result;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const addProfileInfoCtrl = async (ctrlData, filename) => {
  try {
    const updatedDriver = await sequelize.models.Drivers.update(
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
    return updatedDriver;
  } catch (error) {
    throw new Error(error.message);
  }
};

const driverSignupWithProviderCtrl = async (ctrlData) => {
  try {
    const user = await findModelItemQ("Drivers", {
      where: { email: ctrlData.email },
    });
    let loginjwt;
    if (user) {
      loginjwt = signJWT({ user: { Id: user.Id } });
      return loginjwt;
    } else {
      const user = await sequelize.models.Drivers.create({
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

const storedriverLocationCtrl = async (data, ctrlData) => {
  try {
    const driver = await findModelItemQ("Drivers", { where: { Id: data } });
    const { latitude, longitude } = ctrlData;
    if (!latitude || !longitude) {
      throw new Error("Please provide valid location info");
    }
    const driverCity = await getCityFromLatLong(latitude, longitude);
    driver.latitude = latitude;
    driver.longitude = longitude;
    driver.city = driverCity;
    const result = await driver.save();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getallorderdriverCtrl = async (driverId) => {
  // date , time, (profilepic , name , mobileno) , pickup, dropOff
  // Driverid --> we will extract from token

  // we will make query in eligible_drivers ( driverid )
  const currentDriverOrders = await sequelize.models.Eligible_drivers.findAll({
    where: {
      driver_id: driverId,
      response: { [Op.ne]: "Reject" },
    },
  });

  let driverOrders = [];
  return await Promise.all(
    currentDriverOrders.map(async (order) => {
      // with orderid we will make query in orders table
      const userOrder = await sequelize.models.Orders.findOne({
        where: {
          order_id: order.order_id,
        },
      });

      // with fetched order id we will fetch user from users table
      const user = await sequelize.models.Users.findOne({
        where: {
          Id: userOrder.user_id,
        },
      });

      driverOrders = [
        ...driverOrders,
        {
          date: userOrder.date,
          time: userOrder.time,
          profilePic: user.profilePic, // check
          name: user.username, // check this
          mobileNo: userOrder.contact,
          pickup: userOrder.pickup,
          dropoff: userOrder.dropoff,
        },
      ];
    })
  )
    .then((data) => {
      return driverOrders;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const accpetorderDriverCtrl = async (orderId, driverId) => {
  try {
    const driver_order = await createModelItemQ("Diver_orders", {
      driver_id: driverId,
      order_id: orderId,
      status: "ongoing",
    });
    const order = await sequelize.models.Eligible_drivers.findAll({
      where: {
        order_id: orderId,
      },
    });
    if (order) {
      await Promise.all(order.map(async (order) => await order.destroy()));
    } else {
      throw new DataNotFoundError("The requested resource does not exist");
    }
  } catch (error) {
    throw error;
  }
};

const rejectedorderDriverCtrl = async (orderId, driverid) => {
  try {
    const order = await sequelize.models.Eligible_drivers.findOne({
      where: {
        order_id: orderId,
        driver_id: driverid,
      },
    });

    order.response = "Reject";
    const result = await order.save();
    return result;
  } catch (error) {
    throw error;
  }
};

const adddriverdetailsCtrl = async (ctrlData, id, files) => {
  try {
    const vehicles = await createModelItemQ("Vehicles", {
      ...ctrlData,
      user_id: id,
      vehicle_image: files.vehicle_image[0].originalname,
    });
    const LicenceDetails = await createModelItemQ("Licence_details", {
      ...ctrlData,
      user_id: id,
      licence_image: files.licence_image[0].originalname,
    });
    const insuranceDetails = await createModelItemQ("Insurance_details", {
      ...ctrlData,
      user_id: id,
      vehicle_id: vehicles.Id,
      insurance_image: files.vehicle_image[0].originalname,
    });

    const user = await sequelize.models.Drivers.findByPk(id);

    await user.update({
      ...ctrlData,
      profilePic: files.profile_image[0].originalname,
    });
    return { vehicles, LicenceDetails, insuranceDetails, user };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  driverloginctrl,
  driveremailsendCtrl,
  driverchangepasswordCtrl,
  driverresetpasswordCtrl,
  diverupdateprofileCtrl,
  driverSignupCtrl,
  addProfileInfoCtrl,
  driverSignupWithProviderCtrl,
  storedriverLocationCtrl,
  getallorderdriverCtrl,
  accpetorderDriverCtrl,
  rejectedorderDriverCtrl,
  adddriverdetailsCtrl,
};
