/* */ 
(function(Buffer) {
  var test = require('tape');
  var Codec = require('../index');
  test('encode key', function(t) {
    var codec = new Codec({keyEncoding: 'hex'});
    var buf = codec.encodeKey('686579', {});
    t.equal(buf.toString(), 'hey');
    buf = codec.encodeKey('686579');
    t.equal(buf.toString(), 'hey');
    buf = codec.encodeKey('686579', {keyEncoding: 'binary'});
    t.equal(buf.toString(), '686579');
    t.end();
  });
  test('encode value', function(t) {
    var codec = new Codec({valueEncoding: 'hex'});
    var buf = codec.encodeValue('686579', {});
    t.equal(buf.toString(), 'hey');
    buf = codec.encodeValue('686579');
    t.equal(buf.toString(), 'hey');
    buf = codec.encodeValue('686579', {valueEncoding: 'binary'});
    t.equal(buf.toString(), '686579');
    t.end();
  });
  test('decode key', function(t) {
    var codec = new Codec({keyEncoding: 'hex'});
    var buf = codec.decodeKey(new Buffer('hey'), {});
    t.equal(buf, '686579');
    buf = codec.decodeKey(new Buffer('hey'));
    t.equal(buf, '686579');
    buf = codec.decodeKey(new Buffer('hey'), {keyEncoding: 'binary'});
    t.equal(buf.toString(), 'hey');
    t.end();
  });
  test('decode value', function(t) {
    var codec = new Codec({valueEncoding: 'hex'});
    var buf = codec.decodeValue(new Buffer('hey'), {});
    t.equal(buf, '686579');
    buf = codec.decodeValue(new Buffer('hey'));
    t.equal(buf, '686579');
    buf = codec.decodeValue(new Buffer('hey'), {valueEncoding: 'binary'});
    t.equal(buf.toString(), 'hey');
    t.end();
  });
  test('encode value - legacy', function(t) {
    var codec = new Codec({encoding: 'hex'});
    var buf = codec.encodeValue('686579', {});
    t.equal(buf.toString(), 'hey');
    buf = codec.encodeValue('686579');
    t.equal(buf.toString(), 'hey');
    buf = codec.encodeValue('686579', {encoding: 'binary'});
    t.equal(buf.toString(), '686579');
    t.end();
  });
  test('decode value - legacy', function(t) {
    var codec = new Codec({encoding: 'hex'});
    var buf = codec.decodeValue(new Buffer('hey'), {});
    t.equal(buf, '686579');
    buf = codec.decodeValue(new Buffer('hey'));
    t.equal(buf, '686579');
    buf = codec.decodeValue(new Buffer('hey'), {encoding: 'binary'});
    t.equal(buf.toString(), 'hey');
    t.end();
  });
})(require('buffer').Buffer);
