/* */ 
'use strict';
var isFunction;
if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');
  if (typeof JSON === 'undefined') {
    JSON = {};
  }
  require('json3').runInContext(null, JSON);
  require('es6-shim');
  var es7 = require('es7-shim');
  Object.keys(es7).forEach(function(key) {
    var obj = es7[key];
    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  isFunction = require('../../index');
} else {
  isFunction = returnExports;
}
var hasFat;
try {
  eval('(x, y) => {return this;};');
  hasFat = true;
} catch (ignore) {}
var itHasFat = hasFat ? it : xit;
var hasGen;
try {
  eval('function* idMaker(x, y){};');
  hasGen = true;
} catch (ignore) {}
var itHasGen = hasGen ? it : xit;
var hasAsync;
try {
  eval('async function idAsync(x, y){};');
  hasAsync = true;
} catch (ignore) {}
var itHasAsync = hasAsync ? it : xit;
var hasClass;
try {
  eval('"use strict"; class My {};');
  hasClass = true;
} catch (ignore) {}
var itHasClass = hasClass ? it : xit;
describe('Basic tests', function() {
  it('should return `false` for everything', function() {
    var values = [true, 'abc', 1, null, undefined, new Date(), [], /r/];
    var expected = values.map(function() {
      return false;
    });
    var actual = values.map(isFunction);
    expect(actual).toEqual(expected);
  });
  it('should return `true` for everything', function() {
    var values = [Object, String, Boolean, Array, Function, function() {}, function test(a) {}, new Function(), function test1(a, b) {}, function test2(a) {}, function test3(a, b) {}, function test4(a, b) {}, function test5(a, b) {}, function test6(a, b) {}, function test7() {}, function test8(a) {}];
    var expected = values.map(function() {
      return true;
    });
    var actual = values.map(isFunction);
    expect(actual).toEqual(expected);
  });
  itHasFat('should return `true` for arrow functions', function() {
    var fat = new Function('return (x, y) => {return this;};')();
    expect(isFunction(fat)).toBe(true);
  });
  itHasGen('should return `true` for generator functions', function() {
    var gen = new Function('return function* idMaker(x, y){};')();
    expect(isFunction(gen)).toBe(true);
  });
  itHasAsync('should return `true` for async functions', function() {
    var asy = new Function('return async function idAsync(x, y){};')();
    expect(isFunction(asy)).toBe(true);
  });
  itHasClass('should return `false` for classes', function() {
    var classes = new Function('"use strict"; return class My {};')();
    expect(isFunction(classes)).toBe(false);
  });
});
