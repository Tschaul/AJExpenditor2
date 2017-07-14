/* */ 
"use strict";
var findKey = require('./find-key'),
    isValue = require('./is-value');
module.exports = function(obj, cb) {
  var key = findKey.apply(this, arguments);
  return isValue(key) ? obj[key] : key;
};
