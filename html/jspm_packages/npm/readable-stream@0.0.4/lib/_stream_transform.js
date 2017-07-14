/* */ 
(function(process) {
  module.exports = Transform;
  var Duplex = require('_stream_duplex');
  var util = require('util');
  util.inherits(Transform, Duplex);
  function TransformState() {
    this.buffer = [];
    this.transforming = false;
    this.pendingReadCb = null;
  }
  function Transform(options) {
    if (!(this instanceof Transform))
      return new Transform(options);
    Duplex.call(this, options);
    this._output = this._output.bind(this);
    this._transformState = new TransformState();
    this.once('finish', function() {
      if ('function' === typeof this._flush)
        this._flush(this._output, done.bind(this));
      else
        done.call(this);
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
    var output = this._output;
    ts.transforming = true;
    this._transform(chunk, output, function(er, data) {
      ts.transforming = false;
      if (data)
        output(data);
      writecb(er);
    }.bind(this));
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
    var state = this._readableState;
    var len = state.length;
    state.buffer.push(chunk);
    state.length += chunk.length;
    if (state.needReadable) {
      state.needReadable = false;
      this.emit('readable');
    }
  };
  function done(er) {
    if (er)
      return this.emit('error', er);
    var ws = this._writableState;
    var rs = this._readableState;
    var ts = this._transformState;
    if (ws.length)
      throw new Error('calling transform done when ws.length != 0');
    if (ts.transforming)
      throw new Error('calling transform done when still transforming');
    var readcb = ts.pendingReadCb;
    if (readcb)
      return readcb();
    rs.ended = true;
    if (rs.length && rs.needReadable)
      this.emit('readable');
    else if (rs.length === 0)
      this.emit('end');
  }
})(require('process'));
