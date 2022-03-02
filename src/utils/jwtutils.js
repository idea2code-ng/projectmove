const jwt =require("jsonwebtoken")

const signJWT = (payloadObj, expiry = '12h', secret = process.env.JWT_SECRET) => {
    return jwt.sign(payloadObj,
        secret, {
            expiresIn: expiry
        })
}

module.exports={signJWT}