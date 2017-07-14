/* */ 
var test = require('tape');
var Codec = require('../index');
test('codec', function(t) {
  var codec = new Codec({keyEncoding: 'hex'});
  t.ok(codec.keyAsBuffer());
  var codec = new Codec();
  t.notOk(codec.keyAsBuffer());
  t.end();
});
