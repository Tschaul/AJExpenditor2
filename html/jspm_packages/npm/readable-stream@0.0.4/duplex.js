/* */ 
(function(process) {
  module.exports = Duplex;
  var util = require('util');
  var Readable = require('./readable');
  var Writable = require('./writable');
  util.inherits(Duplex, Readable);
  Object.keys(Writable.prototype).forEach(function(method) {
    if (!Duplex.prototype[method])
      Duplex.prototype[method] = Writable.prototype[method];
  });
  function Duplex(options) {
    if (!(this instanceof Duplex))
      return new Duplex(options);
    Readable.call(this, options);
    Writable.call(this, options);
    this.allowHalfOpen = true;
    if (options && options.allowHalfOpen === false)
      this.allowHalfOpen = false;
    this.once('end', onend);
  }
  function onend() {
    if (this.allowHalfOpen || this._writableState.ended)
      return;
    process.nextTick(this.end.bind(this));
  }
})(require('process'));
