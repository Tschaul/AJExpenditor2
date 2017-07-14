/* */ 
"use strict";
var findIndex = require('../find-index/shim');
module.exports = function(predicate) {
  var index = findIndex.apply(this, arguments);
  return index === -1 ? undefined : this[index];
};
