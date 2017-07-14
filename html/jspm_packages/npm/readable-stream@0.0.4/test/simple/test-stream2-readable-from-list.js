/* */ 
(function(Buffer, process) {
  var assert = require('assert');
  var common = require('../common');
  var fromList = require('../../readable')._fromList;
  var tests = [];
  function test(name, fn) {
    tests.push([name, fn]);
  }
  function run() {
    var next = tests.shift();
    if (!next)
      return console.log('ok');
    var name = next[0];
    var fn = next[1];
    console.log('# %s', name);
    fn({
      same: assert.deepEqual,
      equal: assert.equal,
      end: run
    });
  }
  process.nextTick(run);
  test('buffers', function(t) {
    var len = 16;
    var list = [new Buffer('foog'), new Buffer('bark'), new Buffer('bazy'), new Buffer('kuel')];
    var ret = fromList(6, list, 16);
    t.equal(ret.toString(), 'foogba');
    ret = fromList(2, list, 10);
    t.equal(ret.toString(), 'rk');
    ret = fromList(2, list, 8);
    t.equal(ret.toString(), 'ba');
    ret = fromList(100, list, 6);
    t.equal(ret.toString(), 'zykuel');
    t.same(list, []);
    t.end();
  });
  test('strings', function(t) {
    var len = 16;
    var list = ['foog', 'bark', 'bazy', 'kuel'];
    var ret = fromList(6, list, 16, true);
    t.equal(ret, 'foogba');
    ret = fromList(2, list, 10, true);
    t.equal(ret, 'rk');
    ret = fromList(2, list, 8, true);
    t.equal(ret, 'ba');
    ret = fromList(100, list, 6, true);
    t.equal(ret, 'zykuel');
    t.same(list, []);
    t.end();
  });
})(require('buffer').Buffer, require('process'));
