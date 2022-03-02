const bcrypt = require("bcrypt");
const { DataValidationError, UserNotFoundError, DataNotFoundError } = require("../errors/index");
const { comparePasswords } = require("../utils/passwordutility");
const { signJWT } = require("../utils/jwtutils");
const { sendEmail } = require("../utils/sendmail");
const { findModelItemQ, createModelItemQ } = require("../queries/generic/index");
const sequelize = require("../models/sequelize/index");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const { getCityFromLatLong } = require("../utils/getCity");

const loaderrgisterCtrl = async (ctrlData) => {
  try {
    const hashed = await bcrypt.hash(ctrlData.password, 8);
    const user = await sequelize.models.Loaders.findOne({
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
      const register = await createModelItemQ("Loaders", {
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

const loaderloaderloginctrl = async ({ email, password }, next) => {
  try {
    const user = await findModelItemQ("Loaders", {
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

const loaderemailsendCtrl = async (userData) => {
  try {
    const user = await findModelItemQ("Loaders", {
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

const loaderchangepasswordCtrl = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const hashed = await bcrypt.hash(newPassword, 8);
    const user = await sequelize.models.Loaders.findByPk(req.user.Id);
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

const loaderresetpasswordCtrl = async (ctrlData) => {
  try {
    const user = await findModelItemQ("Loaders", {
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

const loaderupdateprofileCtrl = async (ctrlData, data, filepath) => {
  try {
    const user = await sequelize.models.Loaders.findByPk(data);
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

const addProfileInfoCtrl = async (ctrlData, filename) => {
  try {
    const updatedLoader = await sequelize.models.Loaders.update(
      {
        phone: ctrlData.phone,
        address: ctrlData.address,
        price: ctrlData.price,
        profilePic: `uploads/${filename}`,
      },
      {
        where: {
          email: ctrlData.email,
        },
      }
    );
    return updatedLoader;
  } catch (error) {
    throw new Error(error.message);
  }
};

const loaderSignupWithProviderCtrl = async (ctrlData) => {
  try {
    const user = await findModelItemQ("Loaders", {
      where: { email: ctrlData.email },
    });
    let loginjwt;
    if (user) {
      loginjwt = signJWT({ user: { Id: user.Id } });
      return loginjwt;
    } else {
      const user = await sequelize.models.Loaders.create({
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

const storeLoaderLocationCtrl = async (data, ctrlData) => {
  try {
    const loader = await findModelItemQ("Loaders", { where: { Id: data } });
    const { latitude, longitude } = ctrlData;
    if (!latitude || !longitude) {
      throw new Error("Please provide valid location info");
    }
    const driverCity = await getCityFromLatLong(latitude, longitude);
    loader.latitude = latitude;
    loader.longitude = longitude;
    loader.city = driverCity;
    const result = await loader.save();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getallorderloaderCtrl = async (loaderId) => {
  const currentloaderOrders = await sequelize.models.Eligible_loaders.findAll({
    where: {
      loader_id: loaderId,
      response: { [Op.ne]: "Reject" },
    },
  });


  let loaderOrders = [];
  return await Promise.all(
    currentloaderOrders.map(async (order) => {
      // with orderid we will make query in orders table
      const userOrder = await findModelItemQ("Orders", {
        where: {
          order_id: order.order_id,
        },
      });

      // with fetched order id we will fetch user from users table
      const user = await findModelItemQ("Users", {
        where: {
          Id: userOrder.user_id,
        },
      });

      loaderOrders = [
        ...loaderOrders,
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
      return loaderOrders;
    })
    .catch((err) => {
      console.log(err.message);
    });

};

const accpetloaderorderCtrl = async (orderId, loaderId, purpose) => {
  try {
    const order = await findModelItemQ("Orders", {
      where: {
        order_id: orderId,
      },
    });

    if (!order) {
      throw new DataNotFoundError("order id does not exit");
    }
    if (purpose == "Loading") {
      if (order.loaders_needed === order.foundloader + 1) {
        await createModelItemQ("Loader_orders", {
          loader_id: loaderId,
          order_id: orderId,
          status: "ongoing",
        });

        const eligibleLoaders = await sequelize.models.Eligible_loaders.findAll({
          where: {
            order_id: orderId,
            purpose: 1,
          },
        });

        await Promise.all(eligibleLoaders.map(async (loader) => await loader.destroy()));

        const order = await findModelItemQ("Orders", {
          where: {
            order_id: orderId,
          },
        });
        order.foundloader += 1;
        await order.save();
      } else {
        // do accept
        const Eligible_loaders = await findModelItemQ("Eligible_loaders", {
          where: {
            order_id: orderId,
            loader_id: loaderId,
            response: "Pending",
            purpose: 1,
          },
        });
        if (Eligible_loaders) {
          Eligible_loaders.response = "Accept";
          const result = await Eligible_loaders.save();
          // updating order count
          const order = await findModelItemQ("Orders", {
            where: {
              order_id: orderId,
            },
          });
          order.foundloader += 1;
          await order.save();
          // loader orders

          await createModelItemQ("Loader_orders", {
            loader_id: loaderId,
            order_id: orderId,
            status: "ongoing",
          });
        } else {
          throw new DataNotFoundError("order does not exit");
        }
      }
    }

    if (purpose == "Unloading") {
      if (order.unloaders_needed === order.foundunloader + 1) {
        await createModelItemQ("Loader_orders", {
          loader_id: loaderId,
        });

        const eligibleUnoaders = await sequelize.models.Eligible_loaders.findAll({
          where: {
            order_id: orderId,
            purpose: 2,
          },
        });

        await Promise.all(eligibleUnoaders.map(async (loader) => await loader.destroy()));

        const order = await findModelItemQ("Orders", {
          order_id: orderId,
        });
        order.foundunloader += 1;
        await order.save();
      } else {
        // do accept
        const Eligible_loaders = await findModelItemQ("Eligible_loaders", {
          where: {
            order_id: orderId,
            loader_id: loaderId,
            response: "Pending",
            purpose: 2,
          },
        });
        if (Eligible_loaders) {
          Eligible_loaders.response = "Accept";
          const result = await Eligible_loaders.save();
          // updating order count
          const order = await findModelItemQ("Orders", {
            where: {
              order_id: orderId,
            },
          });
          order.foundunloader += 1;
          await order.save();
          // loader orders

          await createModelItemQ("Loader_orders", {
            loader_id: loaderId,
            order_id: orderId,
            status: "ongoing",
          });
        } else {
          throw new DataNotFoundError("order does not exit");
        }
      }
    }
  } catch (error) {
    throw error;
  }
};

const rejectedorderloaderCtrl = async (orderId, loaderId, purpose) => {
  try {
    if (purpose === "Loading") {
      const Eligible_loaders = await sequelize.models.Eligible_loaders.findOne({
        where: {
          loader_id: loaderId,
          order_id: orderId,
          response: "Pending",
          purpose: 1,
        },
      });
      Eligible_loaders.response = "Reject";
      Eligible_loaders.save();
    }
    if (purpose === "Unloading") {
      const Eligibleloaders = await sequelize.models.Eligible_loaders.findOne({
        where: {
          loader_id: loaderId,
          order_id: orderId,
          response: "Pending",
          purpose: 2,
        },
      });
      console.log("Eligible_loaders", Eligibleloaders);
      Eligibleloaders.response = "Reject";
      await Eligibleloaders.save();
    }
  } catch (error) {
    throw error;
  }
};

const loaderongoingorderCtrl = async (loaderId) => {
  try {
    const loaderOrders = await sequelize.models.Loader_orders.findAll({
      where: {
        loader_id: loaderId,
      },
    });
    let loaderorder = [];
    return await Promise.all(
      loaderOrders.map(async (order) => {
        const userOrder = await findModelItemQ("Orders", {
          where: {
            order_id: order.order_id,
          },
        });
        const user = await findModelItemQ("Users", {
          where: {
            Id: userOrder.user_id,
          },
        });

        loaderorder = [
          ...loaderorder,
          {
            date: userOrder.date,
            time: userOrder.time,
            dropoffloaction: userOrder.dropoff,
            name: user.username,
            profilePic: user.profilePic,
            order_id: order.order_id,
          },
        ];
      })
    )
      .then((data) => {
        return loaderorder;
      })
      .catch((error) => {
        console.log(error, "error");
      })


  } catch (error) {
    throw error
  }

}

module.exports = {
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
  accpetloaderorderCtrl,
  rejectedorderloaderCtrl,
  loaderongoingorderCtrl,
};
