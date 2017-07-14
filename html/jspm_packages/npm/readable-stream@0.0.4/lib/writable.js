/* */ 
(function(Buffer, process) {
  module.exports = Writable;
  Writable.WritableState = WritableState;
  var util = require('util');
  var assert = require('assert');
  var Stream = require('stream');
  util.inherits(Writable, Stream);
  function WritableState(options, stream) {
    options = options || {};
    this.highWaterMark = options.hasOwnProperty('highWaterMark') ? options.highWaterMark : 16 * 1024;
    this.lowWaterMark = options.hasOwnProperty('lowWaterMark') ? options.lowWaterMark : 0;
    assert(typeof this.lowWaterMark === 'number');
    assert(typeof this.highWaterMark === 'number');
    this.lowWaterMark = ~~this.lowWaterMark;
    this.highWaterMark = ~~this.highWaterMark;
    assert(this.lowWaterMark >= 0);
    assert(this.highWaterMark >= this.lowWaterMark, this.highWaterMark + '>=' + this.lowWaterMark);
    this.needDrain = false;
    this.ending = false;
    this.ended = false;
    this.finished = false;
    this.finishing = false;
    this.decodeStrings = options.hasOwnProperty('decodeStrings') ? options.decodeStrings : true;
    this.length = 0;
    this.writing = false;
    this.sync = false;
    this.onwrite = function(er) {
      onwrite(stream, er);
    };
    this.writecb = null;
    this.writelen = 0;
    this.buffer = [];
  }
  function Writable(options) {
    if (!(this instanceof Writable) && !(this instanceof Stream.Duplex))
      return new Writable(options);
    this._writableState = new WritableState(options, this);
    this.writable = true;
    Stream.call(this);
  }
  Writable.prototype.write = function(chunk, encoding, cb) {
    var state = this._writableState;
    if (typeof encoding === 'function') {
      cb = encoding;
      encoding = null;
    }
    if (state.ended) {
      var er = new Error('write after end');
      if (typeof cb === 'function')
        cb(er);
      this.emit('error', er);
      return;
    }
    var l = chunk.length;
    if (false === state.decodeStrings)
      chunk = [chunk, encoding || 'utf8'];
    else if (typeof chunk === 'string' || encoding) {
      chunk = new Buffer(chunk + '', encoding);
      l = chunk.length;
    }
    state.length += l;
    var ret = state.length < state.highWaterMark;
    if (ret === false)
      state.needDrain = true;
    if (state.writing) {
      state.buffer.push([chunk, cb]);
      return ret;
    }
    state.writing = true;
    state.sync = true;
    state.writelen = l;
    state.writecb = cb;
    this._write(chunk, state.onwrite);
    state.sync = false;
    return ret;
  };
  function onwrite(stream, er) {
    var state = stream._writableState;
    var sync = state.sync;
    var cb = state.writecb;
    var l = state.writelen;
    state.writing = false;
    state.writelen = null;
    state.writecb = null;
    if (er) {
      if (cb) {
        if (sync)
          process.nextTick(function() {
            cb(er);
          });
        else
          cb(er);
      } else
        stream.emit('error', er);
      return;
    }
    state.length -= l;
    if (cb) {
      if (sync || state.buffer.length)
        process.nextTick(cb);
      else
        cb();
    }
    if (state.length === 0 && (state.ended || state.ending)) {
      state.finishing = true;
      stream.emit('finish');
      state.finished = true;
      return;
    }
    if (state.buffer.length) {
      var chunkCb = state.buffer.shift();
      var chunk = chunkCb[0];
      cb = chunkCb[1];
      if (false === state.decodeStrings)
        l = chunk[0].length;
      else
        l = chunk.length;
      state.writelen = l;
      state.writecb = cb;
      state.writechunk = chunk;
      state.writing = true;
      stream._write(chunk, state.onwrite);
    }
    if (state.length <= state.lowWaterMark && state.needDrain) {
      process.nextTick(function() {
        if (!state.needDrain)
          return;
        state.needDrain = false;
        stream.emit('drain');
      });
    }
  }
  Writable.prototype._write = function(chunk, cb) {
    process.nextTick(function() {
      cb(new Error('not implemented'));
    });
  };
  Writable.prototype.end = function(chunk, encoding) {
    var state = this._writableState;
    if (state.ending || state.ended || state.finished)
      return;
    state.ending = true;
    if (chunk)
      this.write(chunk, encoding);
    else if (state.length === 0) {
      state.finishing = true;
      this.emit('finish');
      state.finished = true;
    }
    state.ended = true;
  };
})(require('buffer').Buffer, require('process'));
