const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const sequelize = require('../../models/sequelize/')
const {UnauthorizedError} = require('../../errors/')

module.exports = function (passport) {

       passport.use(
               new JwtStrategy(
                       {
                              secretOrKey: process.env.JWT_SECRET,
                              jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
                       },
                       async function (Jwt_payload, cb) {
                              try {
                                     const user = await sequelize.models.Users.findByPk(Jwt_payload.user.Id)
                                     if (user) {
                                            cb(null, user);
                                     } else {
                                            cb(null, false);
                                     }
                              } catch (error) {
                                     throw new UnauthorizedError('The given user was not found in our system')
                              }
                       }
               )
               )
}

