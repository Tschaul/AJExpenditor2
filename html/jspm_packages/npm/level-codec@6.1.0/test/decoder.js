/* */ 
(function(Buffer) {
  var test = require('tape');
  var Codec = require('../index');
  test('createStreamDecoder', function(t) {
    var codec = new Codec({keyEncoding: 'hex'});
    t.test('keys and values', function(t) {
      var decoder = codec.createStreamDecoder({
        valueEncoding: 'json',
        keys: true,
        values: true
      });
      t.deepEqual(decoder(new Buffer('hey'), '"you"'), {
        key: '686579',
        value: 'you'
      });
      t.end();
    });
    t.test('keys', function(t) {
      var decoder = codec.createStreamDecoder({keys: true});
      t.equal(decoder(new Buffer('hey')), '686579');
      t.end();
    });
    t.test('values', function(t) {
      var decoder = codec.createStreamDecoder({
        valueEncoding: 'hex',
        values: true
      });
      t.equal(decoder(null, new Buffer('hey')), '686579');
      t.end();
    });
  });
  test('createStreamDecoder - legacy', function(t) {
    var codec = new Codec({keyEncoding: 'hex'});
    t.test('keys and values', function(t) {
      var decoder = codec.createStreamDecoder({
        encoding: 'json',
        keys: true,
        values: true
      });
      t.deepEqual(decoder(new Buffer('hey'), '"you"'), {
        key: '686579',
        value: 'you'
      });
      t.end();
    });
    t.test('keys', function(t) {
      var decoder = codec.createStreamDecoder({keys: true});
      t.equal(decoder(new Buffer('hey')), '686579');
      t.end();
    });
    t.test('values', function(t) {
      var decoder = codec.createStreamDecoder({
        encoding: 'hex',
        values: true
      });
      t.equal(decoder(null, new Buffer('hey')), '686579');
      t.end();
    });
  });
})(require('buffer').Buffer);
