const GeneralError = require('./GeneralError')

class UnauthorizedError extends GeneralError {

    constructor(message = "User not authorized", moreInfo = []) {
        super();
        this.message = message;
        this.status = 401;
        this.moreInfo = moreInfo
        this.errorName = "UnauthorizedError"
    }

}


module.exports = UnauthorizedError