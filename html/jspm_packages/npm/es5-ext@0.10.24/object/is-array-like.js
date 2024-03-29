/* */ 
"use strict";
var isFunction = require('../function/is-function'),
    isObject = require('./is-object'),
    isValue = require('./is-value');
module.exports = function(value) {
  return ((isValue(value) && typeof value.length === "number" && ((isObject(value) && !isFunction(value)) || typeof value === "string")) || false);
};
