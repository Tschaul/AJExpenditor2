/* */ 
"use strict";
var aFrom = require('../array/from/index'),
    assign = require('./assign/index'),
    value = require('./valid-value');
module.exports = function(obj) {
  var copy = Object(value(obj)),
      propertyNames = arguments[1],
      options = Object(arguments[2]);
  if (copy !== obj && !propertyNames)
    return copy;
  var result = {};
  if (propertyNames) {
    aFrom(propertyNames, function(propertyName) {
      if (options.ensure || propertyName in obj)
        result[propertyName] = obj[propertyName];
    });
  } else {
    assign(result, obj);
  }
  return result;
};
