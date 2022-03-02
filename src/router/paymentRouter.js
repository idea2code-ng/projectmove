const router = require("express").Router();
const { orderv } = require("../validators/orderv");
const { matchedData } = require("express-validator");
const expressValidatorMw = require("../middlewares/validate");
const { orderController, getorderController } = require("../controller/orderController");
const userauth = require("../middlewares/auth");

// we need this when we create charges
// const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

// // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
// const charge = await stripe.charges.create({
//   amount: 2000,
//   currency: 'usd',
//   source: 'tok_amex',
//   description: 'My First Test Charge (created for API docs)',
// });

// visit this url for more info https://stripe.com/docs/api/charges

router.post(
  "/makePayment",
  orderv,
  expressValidatorMw,
  userauth,
  async (req, res, next) => {
    try {
      // token , orderid , amount from req.body
      const ctrlData = matchedData(req, { locations: ["body"] });
      const data = req.user.Id;
      const order = await orderController(ctrlData, data);
      return res.status(201).send(order);
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
