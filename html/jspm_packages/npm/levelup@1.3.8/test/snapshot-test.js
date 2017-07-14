/* */ 
(function(process) {
  var delayed = require('delayed'),
      common = require('./common'),
      SlowStream = require('slow-stream'),
      assert = require('referee').assert,
      refute = require('referee').refute,
      buster = require('bustermove');
  buster.testCase('Snapshots', {
    'setUp': common.readStreamSetUp,
    'tearDown': common.commonTearDown,
    'test ReadStream implicit snapshot': function(done) {
      this.openTestDatabase(function(db) {
        db.batch(this.sourceData.slice(), function(err) {
          refute(err);
          var rs = db.readStream();
          rs = rs.pipe(new SlowStream({maxWriteInterval: 5}));
          rs.on('data', this.dataSpy);
          rs.once('end', this.endSpy);
          rs.once('close', delayed.delayed(this.verify.bind(this, rs, done), 0.05));
          process.nextTick(function() {
            var newData = [],
                i,
                k;
            for (i = 0; i < 100; i++) {
              k = (i < 10 ? '0' : '') + i;
              newData.push({
                type: 'put',
                key: k,
                value: Math.random()
              });
            }
            db.batch(newData.slice(), {sync: true}, function(err) {
              refute(err);
            });
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }
  });
})(require('process'));
