/* */ 
module.exports = PassThrough;
var Transform = require('./transform');
var util = require('util');
util.inherits(PassThrough, Transform);
function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);
  Transform.call(this, options);
}
PassThrough.prototype._transform = function(chunk, output, cb) {
  cb(null, chunk);
};
