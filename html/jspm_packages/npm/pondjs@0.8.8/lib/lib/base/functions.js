/* */ 
(function(process) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.filter = undefined;
  exports.keep = keep;
  exports.sum = sum;
  exports.avg = avg;
  exports.max = max;
  exports.min = min;
  exports.count = count;
  exports.first = first;
  exports.last = last;
  exports.difference = difference;
  exports.median = median;
  exports.stdev = stdev;
  exports.percentile = percentile;
  var _underscore = require('underscore');
  var _underscore2 = _interopRequireDefault(_underscore);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function isValid(v) {
    return !(_underscore2.default.isUndefined(v) || _underscore2.default.isNaN(v) || _underscore2.default.isNull(v));
  }
  var keepMissing = function keepMissing(values) {
    return values;
  };
  var ignoreMissing = function ignoreMissing(values) {
    return values.filter(isValid);
  };
  var zeroMissing = function zeroMissing(values) {
    return values.map(function(v) {
      return isValid(v) ? v : 0;
    });
  };
  var propagateMissing = function propagateMissing(values) {
    return ignoreMissing(values).length === values.length ? values : null;
  };
  var noneIfEmpty = function noneIfEmpty(values) {
    return values.length === 0 ? null : values;
  };
  var filter = exports.filter = {
    keepMissing: keepMissing,
    ignoreMissing: ignoreMissing,
    zeroMissing: zeroMissing,
    propagateMissing: propagateMissing,
    noneIfEmpty: noneIfEmpty
  };
  function keep() {
    var clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : filter.ignoreMissing;
    return function(values) {
      var cleanValues = clean(values);
      if (!cleanValues)
        return null;
      var result = first()(cleanValues);
      cleanValues.forEach(function(v) {
        if (v !== result) {
          return null;
        }
      });
      return result;
    };
  }
  function sum() {
    var clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : filter.ignoreMissing;
    return function(values) {
      var cleanValues = clean(values);
      if (!cleanValues)
        return null;
      return _underscore2.default.reduce(cleanValues, function(a, b) {
        return a + b;
      }, 0);
    };
  }
  function avg() {
    var clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : filter.ignoreMissing;
    return function(values) {
      var cleanValues = clean(values);
      if (!cleanValues)
        return null;
      var sum = _underscore2.default.reduce(cleanValues, function(a, b) {
        return a + b;
      }, 0);
      return sum / cleanValues.length;
    };
  }
  function max() {
    var clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : filter.ignoreMissing;
    return function(values) {
      var cleanValues = clean(values);
      if (!cleanValues)
        return null;
      var max = _underscore2.default.max(cleanValues);
      if (_underscore2.default.isFinite(max)) {
        return max;
      }
    };
  }
  function min() {
    var clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : filter.ignoreMissing;
    return function(values) {
      var cleanValues = clean(values);
      if (!cleanValues)
        return null;
      var min = _underscore2.default.min(cleanValues);
      if (_underscore2.default.isFinite(min)) {
        return min;
      }
    };
  }
  function count() {
    var clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : filter.ignoreMissing;
    return function(values) {
      var cleanValues = clean(values);
      if (!cleanValues)
        return null;
      return cleanValues.length;
    };
  }
  function first() {
    var clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : filter.ignoreMissing;
    return function(values) {
      var cleanValues = clean(values);
      if (!cleanValues)
        return null;
      return cleanValues.length ? cleanValues[0] : undefined;
    };
  }
  function last() {
    var clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : filter.ignoreMissing;
    return function(values) {
      var cleanValues = clean(values);
      if (!cleanValues)
        return null;
      return cleanValues.length ? cleanValues[cleanValues.length - 1] : undefined;
    };
  }
  function difference() {
    var clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : filter.ignoreMissing;
    return function(values) {
      var cleanValues = clean(values);
      if (!cleanValues)
        return null;
      return _underscore2.default.max(cleanValues) - _underscore2.default.min(cleanValues);
    };
  }
  function median() {
    var clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : filter.ignoreMissing;
    return function(values) {
      var cleanValues = clean(values);
      if (!cleanValues)
        return null;
      var sorted = cleanValues.sort();
      var i = Math.floor(sorted.length / 2);
      if (sorted.length % 2 === 0) {
        var a = sorted[i];
        var b = sorted[i - 1];
        return (a + b) / 2;
      } else {
        return sorted[i];
      }
    };
  }
  function stdev() {
    var clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : filter.ignoreMissing;
    return function(values) {
      var cleanValues = clean(values);
      if (!cleanValues)
        return null;
      var sums = 0;
      var mean = avg(clean)(cleanValues);
      cleanValues.forEach(function(v) {
        return sums += Math.pow(v - mean, 2);
      });
      return Math.sqrt(sums / values.length);
    };
  }
  function percentile(q) {
    var interp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "linear";
    var clean = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : filter.ignoreMissing;
    return function(values) {
      var cleanValues = clean(values);
      if (!cleanValues)
        return null;
      var v = void 0;
      var sorted = cleanValues.slice().sort(function(a, b) {
        return a - b;
      });
      var size = sorted.length;
      if (q < 0 || q > 100) {
        throw new Error("Percentile q must be between 0 and 100");
      }
      var i = q / 100;
      var index = Math.floor((sorted.length - 1) * i);
      if (size === 1 || q === 0) {
        return sorted[0];
      }
      if (q === 100) {
        return sorted[size - 1];
      }
      if (index < size - 1) {
        var fraction = (size - 1) * i - index;
        var v0 = sorted[index];
        var v1 = sorted[index + 1];
        if (interp === "lower" || fraction === 0) {
          v = v0;
        } else if (interp === "linear") {
          v = v0 + (v1 - v0) * fraction;
        } else if (interp === "higher") {
          v = v1;
        } else if (interp === "nearest") {
          v = fraction < 0.5 ? v0 : v1;
        } else if (interp === "midpoint") {
          v = (v0 + v1) / 2;
        }
      }
      return v;
    };
  }
})(require('process'));
