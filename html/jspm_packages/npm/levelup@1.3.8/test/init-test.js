/* */ 
var levelup = require('../lib/levelup'),
    errors = levelup.errors,
    fs = require('fs'),
    common = require('./common'),
    assert = require('referee').assert,
    refute = require('referee').refute,
    buster = require('bustermove'),
    MemDOWN = require('memdown');
buster.testCase('Init & open()', {
  'setUp': common.commonSetUp,
  'tearDown': common.commonTearDown,
  'levelup()': function() {
    assert.isFunction(levelup);
    assert.equals(levelup.length, 3);
    assert.exception(levelup, 'InitializationError');
  },
  'default options': function(done) {
    var location = common.nextLocation();
    levelup(location, {
      createIfMissing: true,
      errorIfExists: true
    }, function(err, db) {
      refute(err, 'no error');
      assert.isTrue(db.isOpen());
      this.closeableDatabases.push(db);
      this.cleanupDirs.push(location);
      db.close(function(err) {
        refute(err);
        assert.isFalse(db.isOpen());
        levelup(location, function(err, db) {
          refute(err);
          assert.isObject(db);
          assert.isTrue(db.options.createIfMissing);
          assert.isFalse(db.options.errorIfExists);
          assert.equals(db.options.keyEncoding, 'utf8');
          assert.equals(db.options.valueEncoding, 'utf8');
          assert.equals(db.location, location);
          db.location = 'foo';
          assert.equals(db.location, location);
          done();
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },
  'basic options': function(done) {
    var location = common.nextLocation();
    levelup(location, {
      createIfMissing: true,
      errorIfExists: true,
      valueEncoding: 'binary'
    }, function(err, db) {
      refute(err);
      this.closeableDatabases.push(db);
      this.cleanupDirs.push(location);
      assert.isObject(db);
      assert.isTrue(db.options.createIfMissing);
      assert.isTrue(db.options.errorIfExists);
      assert.equals(db.options.keyEncoding, 'utf8');
      assert.equals(db.options.valueEncoding, 'binary');
      assert.equals(db.location, location);
      db.location = 'bar';
      assert.equals(db.location, location);
      done();
    }.bind(this));
  },
  'options with encoding': function(done) {
    var location = common.nextLocation();
    levelup(location, {
      createIfMissing: true,
      errorIfExists: true,
      keyEncoding: 'ascii',
      valueEncoding: 'json'
    }, function(err, db) {
      refute(err);
      this.closeableDatabases.push(db);
      this.cleanupDirs.push(location);
      assert.isObject(db);
      assert.isTrue(db.options.createIfMissing);
      assert.isTrue(db.options.errorIfExists);
      assert.equals(db.options.keyEncoding, 'ascii');
      assert.equals(db.options.valueEncoding, 'json');
      assert.equals(db.location, location);
      db.location = 'bar';
      assert.equals(db.location, location);
      done();
    }.bind(this));
  },
  'without callback': function(done) {
    var location = common.nextLocation(),
        db = levelup(location, {
          createIfMissing: true,
          errorIfExists: true
        });
    this.closeableDatabases.push(db);
    this.cleanupDirs.push(location);
    assert.isObject(db);
    assert.isTrue(db.options.createIfMissing);
    assert.isTrue(db.options.errorIfExists);
    assert.equals(db.location, location);
    db.on("ready", function() {
      assert.isTrue(db.isOpen());
      done();
    });
  },
  'open() with !createIfMissing expects error': function(done) {
    levelup(this.cleanupDirs[0] = common.nextLocation(), {createIfMissing: false}, function(err, db) {
      assert(err);
      refute(db);
      assert.isInstanceOf(err, Error);
      assert.isInstanceOf(err, errors.LevelUPError);
      assert.isInstanceOf(err, errors.OpenError);
      assert(err.notFound === undefined, 'err.notFound is `undefined`, should only be on NotFoundError');
      done();
    }.bind(this));
  },
  'open() with createIfMissing expects directory to be created': function(done) {
    levelup(this.cleanupDirs[0] = common.nextLocation(), {createIfMissing: true}, function(err, db) {
      this.closeableDatabases.push(db);
      refute(err);
      assert.isTrue(db.isOpen());
      fs.stat(this.cleanupDirs[0], function(err, stat) {
        refute(err);
        assert(stat.isDirectory());
        done();
      });
    }.bind(this));
  },
  'open() with errorIfExists expects error if exists': function(done) {
    levelup(this.cleanupDirs[0] = common.nextLocation(), {createIfMissing: true}, function(err, db) {
      this.closeableDatabases.push(db);
      refute(err);
      levelup(this.cleanupDirs[0], {errorIfExists: true}, function(err) {
        assert(err);
        assert.isInstanceOf(err, Error);
        assert.isInstanceOf(err, errors.LevelUPError);
        assert.isInstanceOf(err, errors.OpenError);
        done();
      });
    }.bind(this));
  },
  'open() with !errorIfExists does not expect error if exists': function(done) {
    levelup(this.cleanupDirs[0] = common.nextLocation(), {createIfMissing: true}, function(err, db) {
      refute(err);
      this.closeableDatabases.push(db);
      assert.isTrue(db.isOpen());
      db.close(function() {
        assert.isFalse(db.isOpen());
        levelup(this.cleanupDirs[0], {errorIfExists: false}, function(err, db) {
          refute(err);
          this.closeableDatabases.push(db);
          assert.isTrue(db.isOpen());
          done();
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },
  'constructor with options argument uses factory': function(done) {
    var db = levelup({db: MemDOWN});
    assert.isNull(db.location, 'location property is null');
    db.on('open', function() {
      assert(db.db instanceof MemDOWN, 'using a memdown backend');
      assert.same(db.db.location, '', 'db location property is ""');
      db.put('foo', 'bar', function(err) {
        refute(err, 'no error');
        db.get('foo', function(err, value) {
          assert.equals(value, 'bar', 'correct value');
          done();
        });
      });
    });
  },
  'constructor with only function argument uses factory': function(done) {
    var db = levelup(MemDOWN);
    assert.isNull(db.location, 'location property is null');
    db.on('open', function() {
      assert(db.db instanceof MemDOWN, 'using a memdown backend');
      assert.same(db.db.location, '', 'db location property is ""');
      db.put('foo', 'bar', function(err) {
        refute(err, 'no error');
        db.get('foo', function(err, value) {
          assert.equals(value, 'bar', 'correct value');
          done();
        });
      });
    });
  }
});
