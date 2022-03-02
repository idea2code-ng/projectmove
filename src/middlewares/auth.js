const jwt = require("jsonwebtoken");
const sequelize = require('../models/sequelize/index')

module.exports = async function (req, res, next) {
       let token = req.header("Authorization");
       if (token) {
              token = req.header("Authorization").replace("Bearer ", "");
       }
       if (!token)
              return res.status(401).json({message: "Access Denied"});

       try {
              const verified = await jwt.verify(token, process.env.JWT_SECRET);
              const user = await sequelize.models.Users.findByPk(verified.user.Id);
              if (!user) {
                     return res.status(401).json({message: "Access Denied"});
              }
              req.user = user;
              next();
       } catch (error) {
              res.status(400).json({message: "Invalid Token"});
       }
};
