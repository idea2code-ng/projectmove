const {validationResult} = require("express-validator");
const {DataValidationError} = require("../errors/");
const fs = require("fs");
const path = require("path");

const validate = async (req, res, next) => {
       const errors = validationResult(req);
       if (errors.array().length !== 0) {
              try {
                     if (req.files) {
                            const filepath = path.resolve(
                                    __dirname + "/../../" + "uploads/" + `${req.filename}`
                                    );
                            const res = fs.existsSync(filepath);
                            fs.unlinkSync(filepath);
                     }
                     return next(
                             new DataValidationError("Data Validation Error", errors.array())
                             );
              } catch (error) {
                     console.log(error.message);
                     return next(new Error("Cannot delete file"));
              }
       }
       return next();
};

module.exports = validate;
