/* */ 
(function(Buffer) {
  'use strict';
  var crypto = require('crypto');
  function sha1(bytes) {
    if (typeof Buffer.from === 'function') {
      if (Array.isArray(bytes))
        bytes = Buffer.from(bytes);
      else if (typeof bytes === 'string')
        bytes = Buffer.from(bytes, 'utf8');
    } else {
      if (Array.isArray(bytes))
        bytes = new Buffer(bytes);
      else if (typeof bytes === 'string')
        bytes = new Buffer(bytes, 'utf8');
    }
    return crypto.createHash('sha1').update(bytes).digest();
  }
  module.exports = sha1;
})(require('buffer').Buffer);
