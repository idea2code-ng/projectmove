const GeneralError = require('./GeneralError')

class UserNotFoundError extends GeneralError {

    constructor(message = "User not found in the system !", moreInfo = []) {
        super();
        this.message = message;
        this.status = 404;
        this.moreInfo = moreInfo
        this.errorName = "UserNotFoundError"
    }

}


module.exports = UserNotFoundError