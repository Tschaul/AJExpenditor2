/* */ 
"use strict";
var numIsNaN = require('../number/is-nan/index');
module.exports = function(val1, val2) {
  return val1 === val2 || (numIsNaN(val1) && numIsNaN(val2));
};
