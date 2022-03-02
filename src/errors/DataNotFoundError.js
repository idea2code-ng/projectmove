const GeneralError = require('./GeneralError')

class DataNotFoundError extends GeneralError {

    constructor(message = "The requested resource does not exist!", moreInfo = []) {
        super();
        this.message = message;
        this.status = 404;
        this.moreInfo = moreInfo
        this.errorName = "DataNotFoundError"
    }

}


module.exports = DataNotFoundError