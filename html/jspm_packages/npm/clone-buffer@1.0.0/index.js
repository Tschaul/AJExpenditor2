/* */ 
(function(Buffer) {
  'use strict';
  var Buffer = require('buffer').Buffer;
  function hasFrom() {
    return (Buffer.hasOwnProperty('from') && typeof Buffer.from === 'function');
  }
  function cloneBuffer(buf) {
    if (!Buffer.isBuffer(buf)) {
      throw new Error('Can only clone Buffer.');
    }
    if (hasFrom()) {
      return Buffer.from(buf);
    }
    var copy = new Buffer(buf.length);
    buf.copy(copy);
    return copy;
  }
  cloneBuffer.hasFrom = hasFrom;
  module.exports = cloneBuffer;
})(require('buffer').Buffer);
