/* */ 
var assert = require('assert');
var extend = require('./extend');
assert.deepEqual(extend({a: 1}), {a: 1});
assert.deepEqual(extend({a: 1}, []), {a: 1});
assert.deepEqual(extend({a: 1}, null), {a: 1});
assert.deepEqual(extend({a: 1}, true), {a: 1});
assert.deepEqual(extend({a: 1}, false), {a: 1});
assert.deepEqual(extend({a: 1}, {b: 2}), {
  a: 1,
  b: 2
});
assert.deepEqual(extend({
  a: 1,
  b: 2
}, {b: 3}), {
  a: 1,
  b: 3
});
console.log('ok');
