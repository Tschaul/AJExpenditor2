/* */ 
var levelup = require('../lib/levelup'),
    async = require('async'),
    common = require('./common'),
    assert = require('referee').assert,
    refute = require('referee').refute,
    buster = require('bustermove');
buster.testCase('approximateSize()', {
  'setUp': common.commonSetUp,
  'tearDown': common.commonTearDown,
  'approximateSize() is deprecated': function(done) {
    this.openTestDatabase(function(db) {
      var error = console.error;
      console.error = function(str) {
        console.error = error;
        assert(/deprecated/.test(str));
        done();
      };
      db.approximateSize('a', 'z', function() {});
    });
  },
  'approximateSize() works on empty database': function(done) {
    this.openTestDatabase(function(db) {
      db.approximateSize('a', 'z', function(err, size) {
        refute(err);
        assert.equals(size, 0);
        done();
      });
    });
  },
  'approximateSize() work on none-empty database': function(done) {
    var location = common.nextLocation(),
        db;
    async.series([function(callback) {
      this.openTestDatabase(location, function(_db) {
        db = _db;
        callback();
      });
    }.bind(this), function(callback) {
      var batch = [],
          i = 0;
      for (; i < 10; ++i) {
        batch.push({
          type: 'put',
          key: String(i),
          value: 'afoovalue'
        });
      }
      db.batch(batch, {sync: true}, callback);
    }, function(callback) {
      db.close(callback);
    }, function(callback) {
      levelup(location, function(err, _db) {
        refute(err);
        db = _db;
        callback();
      });
    }, function(callback) {
      db.approximateSize('0', '99', function(err, size) {
        refute(err);
        refute.equals(size, 0);
        callback();
      });
    }], done);
  }
});
