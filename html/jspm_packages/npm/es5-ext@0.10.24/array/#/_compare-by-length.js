/* */ 
"use strict";
var toPosInt = require('../../number/to-pos-integer');
module.exports = function(arr1, arr2) {
  return toPosInt(arr1.length) - toPosInt(arr2.length);
};
