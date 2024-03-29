/* */ 
'use strict';
var utils = require('./utils');
var formats = require('./formats');
var arrayPrefixGenerators = {
  brackets: function brackets(prefix) {
    return prefix + '[]';
  },
  indices: function indices(prefix, key) {
    return prefix + '[' + key + ']';
  },
  repeat: function repeat(prefix) {
    return prefix;
  }
};
var toISO = Date.prototype.toISOString;
var defaults = {
  delimiter: '&',
  encode: true,
  encoder: utils.encode,
  serializeDate: function serializeDate(date) {
    return toISO.call(date);
  },
  skipNulls: false,
  strictNullHandling: false
};
var stringify = function stringify(object, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter) {
  var obj = object;
  if (typeof filter === 'function') {
    obj = filter(prefix, obj);
  } else if (obj instanceof Date) {
    obj = serializeDate(obj);
  } else if (obj === null) {
    if (strictNullHandling) {
      return encoder ? encoder(prefix) : prefix;
    }
    obj = '';
  }
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
    if (encoder) {
      return [formatter(encoder(prefix)) + '=' + formatter(encoder(obj))];
    }
    return [formatter(prefix) + '=' + formatter(String(obj))];
  }
  var values = [];
  if (typeof obj === 'undefined') {
    return values;
  }
  var objKeys;
  if (Array.isArray(filter)) {
    objKeys = filter;
  } else {
    var keys = Object.keys(obj);
    objKeys = sort ? keys.sort(sort) : keys;
  }
  for (var i = 0; i < objKeys.length; ++i) {
    var key = objKeys[i];
    if (skipNulls && obj[key] === null) {
      continue;
    }
    if (Array.isArray(obj)) {
      values = values.concat(stringify(obj[key], generateArrayPrefix(prefix, key), generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter));
    } else {
      values = values.concat(stringify(obj[key], prefix + (allowDots ? '.' + key : '[' + key + ']'), generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter));
    }
  }
  return values;
};
module.exports = function(object, opts) {
  var obj = object;
  var options = opts || {};
  if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
    throw new TypeError('Encoder has to be a function.');
  }
  var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
  var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
  var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
  var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
  var encoder = encode ? (typeof options.encoder === 'function' ? options.encoder : defaults.encoder) : null;
  var sort = typeof options.sort === 'function' ? options.sort : null;
  var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
  var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
  if (typeof options.format === 'undefined') {
    options.format = formats.default;
  } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
    throw new TypeError('Unknown format option provided.');
  }
  var formatter = formats.formatters[options.format];
  var objKeys;
  var filter;
  if (typeof options.filter === 'function') {
    filter = options.filter;
    obj = filter('', obj);
  } else if (Array.isArray(options.filter)) {
    filter = options.filter;
    objKeys = filter;
  }
  var keys = [];
  if (typeof obj !== 'object' || obj === null) {
    return '';
  }
  var arrayFormat;
  if (options.arrayFormat in arrayPrefixGenerators) {
    arrayFormat = options.arrayFormat;
  } else if ('indices' in options) {
    arrayFormat = options.indices ? 'indices' : 'repeat';
  } else {
    arrayFormat = 'indices';
  }
  var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
  if (!objKeys) {
    objKeys = Object.keys(obj);
  }
  if (sort) {
    objKeys.sort(sort);
  }
  for (var i = 0; i < objKeys.length; ++i) {
    var key = objKeys[i];
    if (skipNulls && obj[key] === null) {
      continue;
    }
    keys = keys.concat(stringify(obj[key], key, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter));
  }
  return keys.join(delimiter);
};
