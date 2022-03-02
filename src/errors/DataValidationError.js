const GeneralError = require('./GeneralError')

class DataValidationError extends GeneralError {

       constructor(message = "Validation Error", moreInfo = []) {
              super();
              this.message = message == null ? 'Validation Error' : message;
//              this.isSuccess = isSuccess;
              this.status = 200;
              this.moreInfo = moreInfo
              this.errorName = "DataValidationError"
       }
}


module.exports = DataValidationError