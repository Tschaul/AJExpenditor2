/* */ 
module.exports = FetchError;
function FetchError(message, type, systemError) {
  this.name = this.constructor.name;
  this.message = message;
  this.type = type;
  if (systemError) {
    this.code = this.errno = systemError.code;
  }
  Error.captureStackTrace(this, this.constructor);
}
require('util').inherits(FetchError, Error);
