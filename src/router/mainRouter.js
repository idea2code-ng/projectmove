const { Router } = require("express");

const loaderRouter = require("./loaderRouter");
const userRouter = require("./userRouter");
const driverRouter = require("./driverRouter");
const orderRouter = require("./orderRouter");
const cardRouter = require("./cardRouter");
const paymentRouter = require("./paymentRouter");
const categoryRouter =require("./categoryRouter")
const fleetRouter =require("./fleetRouter")
const resetPasssword =require("./resetpasswordRouter")

module.exports = Router()
  .use("/loader", loaderRouter)
  .use("/user", userRouter)
  .use("/driver",driverRouter)
  .use("/order", orderRouter)
  .use("/card", cardRouter)
  .use("/payment", paymentRouter)
  .use("/category",categoryRouter)
  .use("/fleet",fleetRouter)
  .use("/resetpassword",resetPasssword)