/* */ 
var levelup = require('../lib/levelup'),
    async = require('async'),
    common = require('./common'),
    assert = require('referee').assert,
    refute = require('referee').refute,
    buster = require('bustermove');
buster.testCase('Deferred open()', {
  'setUp': common.commonSetUp,
  'tearDown': common.commonTearDown,
  'put() and get() on pre-opened database': function(done) {
    var location = common.nextLocation(),
        db = levelup(location, {
          createIfMissing: true,
          errorIfExists: true,
          valueEncoding: 'utf8'
        });
    this.closeableDatabases.push(db);
    this.cleanupDirs.push(location);
    assert.isObject(db);
    assert.equals(db.location, location);
    async.parallel([db.put.bind(db, 'k1', 'v1'), db.put.bind(db, 'k2', 'v2'), db.put.bind(db, 'k3', 'v3')], function() {
      async.forEach([1, 2, 3], function(k, cb) {
        db.get('k' + k, function(err, v) {
          refute(err);
          assert.equals(v, 'v' + k);
          cb();
        });
      }, function() {
        db.get('k4', function(err) {
          assert(err);
          done();
        });
      });
    });
    refute(db.isOpen());
    refute(db.isClosed());
  },
  'batch() on pre-opened database': function(done) {
    var location = common.nextLocation(),
        db = levelup(location, {
          createIfMissing: true,
          errorIfExists: true,
          valueEncoding: 'utf8'
        });
    this.closeableDatabases.push(db);
    this.cleanupDirs.push(location);
    assert.isObject(db);
    assert.equals(db.location, location);
    db.batch([{
      type: 'put',
      key: 'k1',
      value: 'v1'
    }, {
      type: 'put',
      key: 'k2',
      value: 'v2'
    }, {
      type: 'put',
      key: 'k3',
      value: 'v3'
    }], function() {
      async.forEach([1, 2, 3], function(k, cb) {
        db.get('k' + k, function(err, v) {
          refute(err);
          assert.equals(v, 'v' + k);
          cb();
        });
      }, function() {
        db.get('k4', function(err) {
          assert(err);
          done();
        });
      });
    });
    refute(db.isOpen());
    refute(db.isClosed());
  },
  'chained batch() on pre-opened database': function(done) {
    var location = common.nextLocation(),
        db = levelup(location, {
          createIfMissing: true,
          errorIfExists: true,
          valueEncoding: 'utf8'
        });
    this.closeableDatabases.push(db);
    this.cleanupDirs.push(location);
    assert.isObject(db);
    assert.equals(db.location, location);
    db.batch().put('k1', 'v1').put('k2', 'v2').put('k3', 'v3').write(function() {
      async.forEach([1, 2, 3], function(k, cb) {
        db.get('k' + k, function(err, v) {
          refute(err);
          assert.equals(v, 'v' + k);
          cb();
        });
      }, function() {
        db.get('k4', function(err) {
          assert(err);
          done();
        });
      });
    });
    refute(db.isOpen());
    refute(db.isClosed());
  },
  'test deferred ReadStream': {
    'setUp': common.readStreamSetUp,
    'simple ReadStream': function(done) {
      this.openTestDatabase(function(db) {
        var location = db.location;
        db.batch(this.sourceData.slice(), function(err) {
          refute(err);
          db.close(function(err) {
            refute(err, 'no error');
            db = levelup(location, {
              createIfMissing: false,
              errorIfExists: false
            });
            var rs = db.createReadStream();
            rs.on('data', this.dataSpy);
            rs.on('end', this.endSpy);
            rs.on('close', this.verify.bind(this, rs, done));
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }
  },
  'maxListeners warning': function(done) {
    var location = common.nextLocation(),
        db = levelup(location, {
          createIfMissing: true,
          errorIfExists: true,
          valueEncoding: 'utf8'
        }),
        stderrMock = this.mock(console);
    this.closeableDatabases.push(db);
    this.cleanupDirs.push(location);
    stderrMock.expects('error').never();
    var toPut = 11;
    for (var i = 0; i < toPut; i++) {
      db.put('some', 'string', function(err) {
        refute(err);
        if (!--toPut) {
          done();
        }
      });
    }
  }
});
