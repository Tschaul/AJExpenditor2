/* */ 
(function(process) {
  module.exports = Transform;
  var Duplex = require('./duplex');
  var util = require('util');
  util.inherits(Transform, Duplex);
  function TransformState(stream) {
    this.buffer = [];
    this.transforming = false;
    this.pendingReadCb = null;
    this.output = function(chunk) {
      stream._output(chunk);
    };
  }
  function Transform(options) {
    if (!(this instanceof Transform))
      return new Transform(options);
    Duplex.call(this, options);
    var stream = this;
    var ts = this._transformState = new TransformState(stream);
    this.once('finish', function() {
      if ('function' === typeof this._flush)
        this._flush(ts.output, function(er) {
          done(stream, er);
        });
      else
        done(stream);
    });
  }
  Transform.prototype._transform = function(chunk, output, cb) {
    throw new Error('not implemented');
  };
  Transform.prototype._write = function(chunk, cb) {
    var ts = this._transformState;
    var rs = this._readableState;
    ts.buffer.push([chunk, cb]);
    if (ts.transforming)
      return;
    if (ts.pendingReadCb) {
      var readcb = ts.pendingReadCb;
      ts.pendingReadCb = null;
      this._read(0, readcb);
    }
    var doRead = rs.needReadable || rs.length <= rs.highWaterMark;
    if (doRead && !rs.reading) {
      var ret = this.read(0);
      if (ret !== null)
        return cb(new Error('invalid stream transform state'));
    }
  };
  Transform.prototype._read = function(n, readcb) {
    var ws = this._writableState;
    var rs = this._readableState;
    var ts = this._transformState;
    if (ts.pendingReadCb)
      throw new Error('_read while _read already in progress');
    ts.pendingReadCb = readcb;
    if (ts.buffer.length === 0 || ts.transforming)
      return;
    var req = ts.buffer.shift();
    var chunk = req[0];
    var writecb = req[1];
    ts.transforming = true;
    this._transform(chunk, ts.output, function(er, data) {
      ts.transforming = false;
      if (data)
        ts.output(data);
      writecb(er);
    });
  };
  Transform.prototype._output = function(chunk) {
    if (!chunk || !chunk.length)
      return;
    var ts = this._transformState;
    var readcb = ts.pendingReadCb;
    if (readcb) {
      ts.pendingReadCb = null;
      readcb(null, chunk);
      return;
    }
    var rs = this._readableState;
    var len = rs.length;
    rs.buffer.push(chunk);
    rs.length += chunk.length;
    if (rs.needReadable) {
      rs.needReadable = false;
      this.emit('readable');
    }
  };
  function done(stream, er) {
    if (er)
      return stream.emit('error', er);
    var ws = stream._writableState;
    var rs = stream._readableState;
    var ts = stream._transformState;
    if (ws.length)
      throw new Error('calling transform done when ws.length != 0');
    if (ts.transforming)
      throw new Error('calling transform done when still transforming');
    var readcb = ts.pendingReadCb;
    if (readcb)
      return readcb();
    rs.ended = true;
    if (rs.length && rs.needReadable)
      stream.emit('readable');
    else if (rs.length === 0)
      stream.emit('end');
  }
})(require('process'));
