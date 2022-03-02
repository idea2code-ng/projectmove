const router = require("express").Router();
const { orderv, updateorderv } = require("../validators/orderv");
const { matchedData } = require("express-validator");
const expressValidatorMw = require("../middlewares/validate");
const {
  getorderController,
  addorderctrl
} = require("../controller/orderController");
const userauth = require("../middlewares/auth");
const passport = require("passport")
require("../config/passport/passport")(passport)

router.get("/", userauth, async (req, res, next) => {
  try {
    const userId = req.user.Id;
    const order = await getorderController(userId);
    res.status(200).json({ status: "success", result: order });
  } catch (error) {
    if(error){
      console.log(error,"error");
    }
    return next(error);
  }
});


router.post("/add", userauth, orderv, expressValidatorMw, async (req, res, next) => {
  try {
    const ctrlData = matchedData(req, { locations: ["body"] });
    const userdata = req.user.Id;
    const { order, orderdetails } = await addorderctrl(ctrlData, userdata)
    res.json({ order, orderdetails })
  } catch (error) {
    return next(error)
  }
})

module.exports = router;
