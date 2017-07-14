/* */ 
(function(process) {
  var levelup = require('../lib/levelup'),
      common = require('./common'),
      assert = require('referee').assert,
      refute = require('referee').refute,
      buster = require('bustermove');
  buster.testCase('Idempotent open & close', {
    'setUp': common.readStreamSetUp,
    'tearDown': common.commonTearDown,
    'call open twice, should emit "open" once': function(done) {
      var location = common.nextLocation(),
          n = 0,
          m = 0,
          db,
          close = function() {
            var closing = this.spy();
            db.on('closing', closing);
            db.on('closed', function() {
              assert.equals(closing.callCount, 1);
              assert.equals(closing.getCall(0).args, []);
              done();
            });
            db.close();
            process.nextTick(db.close.bind(db));
          }.bind(this);
      this.cleanupDirs.push(location);
      db = levelup(location, {createIfMissing: true}, function() {
        assert.equals(n++, 0, 'callback should fire only once');
        if (n && m)
          close();
      });
      db.on('open', function() {
        assert.equals(m++, 0, 'callback should fire only once');
        if (n && m)
          close();
      });
      db.open();
    }
  });
})(require('process'));
