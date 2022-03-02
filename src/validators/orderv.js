const { body, query } = require("express-validator");

module.exports = {
  orderv: [
    body("pickup").exists().withMessage("Pickup is required").isString("pickup should be a valid string"),
    body("dropoff").exists().withMessage("dropoff is required").isString("dropoff should be a valid string"),
    body("date").exists().withMessage("Order Date is required").isString("Date should be a valid string"),
    body("time").exists().withMessage("Order Time is required").isString("Time should be a valid string"),
    body("weight").exists().withMessage("Please enter order weight"),
    body("contact").exists().withMessage("contact is required").isString("contact should be a valid string"),
    body("category_id")
      .exists()
      .withMessage("category id is required")
      .isString("category id should be a valid number"),
    body("fleet_id").exists().withMessage("fleet id is required").isString("fleet id should be a valid number"),
    body("loaders_needed").exists().withMessage("Please enter how many loaders you need"),
    body("unloaders_needed").exists().withMessage("Please enter how many unloaders you need"),
    body("comment").exists().withMessage("comment is required").isString("comment should be a valid string"),
    body("pickuplat")
      .exists()
      .withMessage("Pickup latitude  is required")
      .isString("pickup latitude should be a valid string"),
    body("pickuplong")
      .exists()
      .withMessage("Pickup longitude is required")
      .isString("Pickup longitude should be a valid string"),
    body("dropofflat")
      .exists()
      .withMessage("dropoff latitude is required")
      .isString("dropoff latitude should be a valid string"),
    body("dropofflong")
      .exists()
      .withMessage("dropoff longitude is required")
      .isString("dropoff longitude should be a valid string"),
  ],
  updateorderv: [
    body("acceptance_status")
      .exists()
      .withMessage("Acceptance status is required")
      .isString("Acceptance status should be a valid string"),
  ],
};
