const router = require("express").Router();
const { successResponce } = require("../utils/sendResponse");
const sequelize = require("../models/sequelize/index")
const { findModelItemQ } = require("../queries/generic/index");
const bcrypt = require("bcrypt");
const { DataValidationError } = require("../errors/index");

router.post("/", async (req, res, next) => {
    try {
        const loader = await findModelItemQ("Loaders", {
            where: { userotp: req.body.otp },
        });
        if (loader) {
            if (loader.provider == "NORMAL") {
                if (req.body.confirmPassword === req.body.newPassword) {
                    const hashed = await bcrypt.hash(req.body.newPassword, 8);
                    loader.password = hashed;
                    loader.userotp = null;
                    const result = await loader.save();
                    successResponce(req, res, "password reset successfull")
                } else {
                    throw new DataValidationError("password and confirm password does not match.");
                }
            } else {
                throw new Error(`you might have logged using ${loader.provider} last time!`);
            }
        } else {
            const driver = await findModelItemQ("Drivers", {
                where: { userotp: req.body.otp },
            });
            if (driver) {
                if (driver.provider == "NORMAL") {
                    if (req.body.confirmPassword === req.body.newPassword) {
                        const hashed = await bcrypt.hash(req.body.newPassword, 8);
                        driver.password = hashed;
                        driver.userotp = null;
                        const result = await driver.save();
                        successResponce(req, res, "password reset successfull")
                    } else {
                        throw new DataValidationError("password and confirm password does not match.");
                    }
                } else {
                    throw new Error(`you might have logged using ${driver.provider} last time!`);
                }
            } else {
                throw new DataValidationError("wrong otp");
            }
        }
    } catch (error) {
        return next(error);
    }
});

module.exports = router