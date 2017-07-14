/* */ 
"use strict";
var _undefined = require('../function/noop')();
module.exports = function(val) {
  return (val !== _undefined) && (val !== null);
};
