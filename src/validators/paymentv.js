const { body, query } = require("express-validator");

module.exports = {
  orderv: [
    body("amount")
      .exists()
      .withMessage("Amount is required")
      .isString("pickup should be a valid string"),
    body("orderId").exists().withMessage("OrderId is required"),
  ],
};
