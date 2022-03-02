const GeneralError = require('./GeneralError')

class EmailError extends GeneralError {

       constructor(message = "Validation Error", moreInfo = []) {
              console.log('fsdfsd');
              super();
              this.message = 'Validation Error';
//              this.isSuccess = isSuccess;
              this.status = 1;
              this.errorName = "EmailError"
       }
}


module.exports = EmailError