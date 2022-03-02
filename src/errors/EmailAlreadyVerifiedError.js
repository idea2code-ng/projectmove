const GeneralError = require('./GeneralError')

class EmailAlreadyVerifiedError extends GeneralError {

    constructor(message = "Email is already verified", moreInfo = []) {
        super();
        this.message = message
        this.status = 412;
        this.moreInfo = moreInfo
        this.errorName = "EmailAlreadyVerifiedError"
    }

}


module.exports = EmailAlreadyVerifiedError