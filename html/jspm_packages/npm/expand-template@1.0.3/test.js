/* */ 
var test = require('tape');
var Expand = require('./index');
test('default expands {} placeholders', function(t) {
  var expand = Expand();
  t.equal(typeof expand, 'function', 'is a function');
  t.equal(expand('{foo}/{bar}', {
    foo: 'BAR',
    bar: 'FOO'
  }), 'BAR/FOO');
  t.equal(expand('{foo}{foo}{foo}', {foo: 'FOO'}), 'FOOFOOFOO', 'expands one placeholder many times');
  t.end();
});
test('support for custom separators', function(t) {
  var expand = Expand({sep: '[]'});
  t.equal(expand('[foo]/[bar]', {
    foo: 'BAR',
    bar: 'FOO'
  }), 'BAR/FOO');
  t.equal(expand('[foo][foo][foo]', {foo: 'FOO'}), 'FOOFOOFOO', 'expands one placeholder many times');
  t.end();
});
