const { body, query } = require("express-validator");
module.exports = {
  vehiclesv: [
    body("vehicle_number").exists().withMessage("vehicle number is required"),
    body("brand").exists().withMessage("brad number is required"),
    body("model").exists().withMessage("model number is required"),
    body("year").exists().withMessage("year number is required"),
    body("price").exists().withMessage("price number is required"),
    body("vehicle_type").exists().withMessage("vehicle type is required"),
    body("fleet_id").exists().withMessage("fleet is required")
  ],
  licencev: [
    body("licence_number").exists().withMessage("Licence Number is required"),
    body("issued_on").exists().withMessage("Issued on Number is required"),
    body("expiry_date").exists().withMessage("Expiry date Number is required"),
    body("valid_vehicle_type")
      .exists()
      .withMessage("Valid vehicle type date Number is required"),
  ],
  InsuranceV: [
    body("policy_holder_name")
      .exists()
      .withMessage("Policy holder Name is required"),
    body("policy_number")
      .exists()
      .withMessage("Policy number on Number is required"),
    body("phone_number").exists().withMessage("Phone Number is required"),
  ],

  profilev: [body("address").exists().withMessage("address is required")],
};
