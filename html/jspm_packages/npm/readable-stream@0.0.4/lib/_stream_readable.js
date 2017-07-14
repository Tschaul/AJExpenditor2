/* */ 
(function(Buffer, process) {
  module.exports = Readable;
  Readable.ReadableState = ReadableState;
  var Stream = require('stream');
  var util = require('util');
  var assert = require('assert');
  var StringDecoder;
  util.inherits(Readable, Stream);
  function ReadableState(options, stream) {
    options = options || {};
    this.bufferSize = ~~this.bufferSize;
    this.bufferSize = options.hasOwnProperty('bufferSize') ? options.bufferSize : 16 * 1024;
    this.highWaterMark = options.hasOwnProperty('highWaterMark') ? options.highWaterMark : 16 * 1024;
    this.lowWaterMark = options.hasOwnProperty('lowWaterMark') ? options.lowWaterMark : 0;
    assert(typeof this.bufferSize === 'number');
    assert(typeof this.lowWaterMark === 'number');
    assert(typeof this.highWaterMark === 'number');
    this.bufferSize = ~~this.bufferSize;
    this.lowWaterMark = ~~this.lowWaterMark;
    this.highWaterMark = ~~this.highWaterMark;
    assert(this.bufferSize >= 0);
    assert(this.lowWaterMark >= 0);
    assert(this.highWaterMark >= this.lowWaterMark, this.highWaterMark + '>=' + this.lowWaterMark);
    this.buffer = [];
    this.length = 0;
    this.pipes = [];
    this.flowing = false;
    this.ended = false;
    this.endEmitted = false;
    this.reading = false;
    this.sync = false;
    this.onread = onread.bind(stream);
    this.needReadable = false;
    this.emittedReadable = false;
    this.decoder = null;
    if (options.encoding) {
      if (!StringDecoder)
        StringDecoder = require('string_decoder').StringDecoder;
      this.decoder = new StringDecoder(options.encoding);
    }
  }
  function Readable(options) {
    if (!(this instanceof Readable))
      return new Readable(options);
    this._readableState = new ReadableState(options, this);
    Stream.apply(this);
  }
  Readable.prototype.setEncoding = function(enc) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder').StringDecoder;
    this._readableState.decoder = new StringDecoder(enc);
  };
  function howMuchToRead(n, state) {
    if (state.length === 0 && state.ended)
      return 0;
    if (isNaN(n))
      return state.length;
    if (n <= 0)
      return 0;
    if (n > state.length) {
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      } else
        return state.length;
    }
    return n;
  }
  Readable.prototype.read = function(n) {
    var state = this._readableState;
    var nOrig = n;
    if (typeof n !== 'number' || n > 0)
      state.emittedReadable = false;
    n = howMuchToRead(n, state);
    if (n === 0 && state.ended) {
      endReadable(this);
      return null;
    }
    var doRead = state.needReadable;
    if (state.length - n <= state.highWaterMark)
      doRead = true;
    if (state.length === 0)
      doRead = true;
    if (state.ended || state.reading)
      doRead = false;
    if (doRead) {
      var sync = true;
      state.reading = true;
      state.sync = true;
      this._read(state.bufferSize, state.onread);
      state.sync = false;
    }
    if (doRead && !state.reading)
      n = howMuchToRead(nOrig, state);
    var ret;
    if (n > 0)
      ret = fromList(n, state.buffer, state.length, !!state.decoder);
    else
      ret = null;
    if (ret === null || ret.length === 0) {
      state.needReadable = true;
      n = 0;
    }
    state.length -= n;
    return ret;
  };
  function onread(er, chunk) {
    var state = this._readableState;
    var sync = state.sync;
    state.reading = false;
    if (er)
      return this.emit('error', er);
    if (!chunk || !chunk.length) {
      state.ended = true;
      if (state.decoder) {
        chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += chunk.length;
        }
      }
      if (!sync) {
        if (state.length > 0) {
          state.needReadable = false;
          if (!state.emittedReadable) {
            state.emittedReadable = true;
            this.emit('readable');
          }
        } else
          endReadable(this);
      }
      return;
    }
    if (state.decoder)
      chunk = state.decoder.write(chunk);
    if (chunk) {
      state.length += chunk.length;
      state.buffer.push(chunk);
    }
    if (state.length <= state.lowWaterMark) {
      state.reading = true;
      this._read(state.bufferSize, state.onread);
      return;
    }
    if (state.needReadable && !sync) {
      state.needReadable = false;
      if (!state.emittedReadable) {
        state.emittedReadable = true;
        this.emit('readable');
      }
    }
  }
  Readable.prototype._read = function(n, cb) {
    process.nextTick(cb.bind(this, new Error('not implemented')));
  };
  Readable.prototype.pipe = function(dest, pipeOpts) {
    var src = this;
    var state = this._readableState;
    if (!pipeOpts)
      pipeOpts = {};
    state.pipes.push(dest);
    if ((!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr) {
      src.once('end', onend);
      dest.on('unpipe', function(readable) {
        if (readable === src)
          src.removeListener('end', onend);
      });
    }
    function onend() {
      dest.end();
    }
    dest.emit('pipe', src);
    if (!state.flowing) {
      state.flowing = true;
      process.nextTick(flow.bind(null, src, pipeOpts));
    }
    return dest;
  };
  function flow(src, pipeOpts) {
    var state = src._readableState;
    var chunk;
    var needDrain = 0;
    function ondrain() {
      needDrain--;
      if (needDrain === 0)
        flow(src, pipeOpts);
    }
    while (state.pipes.length && null !== (chunk = src.read(pipeOpts.chunkSize))) {
      state.pipes.forEach(function(dest, i, list) {
        var written = dest.write(chunk);
        if (false === written) {
          needDrain++;
          dest.once('drain', ondrain);
        }
      });
      src.emit('data', chunk);
      if (needDrain > 0)
        return;
    }
    if (state.pipes.length === 0) {
      state.flowing = false;
      if (src.listeners('data').length)
        emitDataEvents(src);
      return;
    }
    src.once('readable', flow.bind(null, src, pipeOpts));
  }
  Readable.prototype.unpipe = function(dest) {
    var state = this._readableState;
    if (!dest) {
      state.pipes.forEach(function(dest, i, list) {
        dest.emit('unpipe', this);
      }, this);
      state.pipes.length = 0;
    } else {
      var i = state.pipes.indexOf(dest);
      if (i !== -1) {
        dest.emit('unpipe', this);
        state.pipes.splice(i, 1);
      }
    }
    return this;
  };
  Readable.prototype.on = function(ev, fn) {
    if (ev === 'data' && !this._readableState.flowing)
      emitDataEvents(this);
    return Stream.prototype.on.call(this, ev, fn);
  };
  Readable.prototype.addListener = Readable.prototype.on;
  Readable.prototype.resume = function() {
    emitDataEvents(this);
    return this.resume();
  };
  Readable.prototype.pause = function() {
    emitDataEvents(this);
    return this.pause();
  };
  function emitDataEvents(stream) {
    var state = stream._readableState;
    if (state.flowing) {
      throw new Error('Cannot switch to old mode now.');
    }
    var paused = false;
    var readable = false;
    stream.readable = true;
    stream.pipe = Stream.prototype.pipe;
    stream.on = stream.addEventListener = Stream.prototype.on;
    stream.on('readable', function() {
      readable = true;
      var c;
      while (!paused && (null !== (c = stream.read())))
        stream.emit('data', c);
      if (c === null) {
        readable = false;
        stream._readableState.needReadable = true;
      }
    });
    stream.pause = function() {
      paused = true;
    };
    stream.resume = function() {
      paused = false;
      if (readable)
        stream.emit('readable');
    };
    process.nextTick(function() {
      stream.emit('readable');
    });
  }
  Readable.prototype.wrap = function(stream) {
    var state = this._readableState;
    var paused = false;
    stream.on('end', function() {
      state.ended = true;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += chunk.length;
        }
      }
      if (state.length > 0)
        this.emit('readable');
      else
        endReadable(this);
    }.bind(this));
    stream.on('data', function(chunk) {
      if (state.decoder)
        chunk = state.decoder.write(chunk);
      if (!chunk || !chunk.length)
        return;
      state.buffer.push(chunk);
      state.length += chunk.length;
      this.emit('readable');
      if (state.length > state.lowWaterMark && !paused) {
        paused = true;
        stream.pause();
      }
    }.bind(this));
    for (var i in stream) {
      if (typeof stream[i] === 'function' && typeof this[i] === 'undefined') {
        this[i] = function(method) {
          return function() {
            return stream[method].apply(stream, arguments);
          };
        }(i);
      }
    }
    var events = ['error', 'close', 'destroy', 'pause', 'resume'];
    events.forEach(function(ev) {
      stream.on(ev, this.emit.bind(this, ev));
    }.bind(this));
    this.read = function(n) {
      if (state.length === 0) {
        state.needReadable = true;
        return null;
      }
      if (isNaN(n) || n <= 0)
        n = state.length;
      if (n > state.length) {
        if (!state.ended) {
          state.needReadable = true;
          return null;
        } else
          n = state.length;
      }
      var ret = fromList(n, state.buffer, state.length, !!state.decoder);
      state.length -= n;
      if (state.length <= state.lowWaterMark && paused) {
        stream.resume();
        paused = false;
      }
      if (state.length === 0 && state.ended)
        endReadable(this);
      return ret;
    };
  };
  Readable._fromList = fromList;
  function fromList(n, list, length, stringMode) {
    var ret;
    if (list.length === 0) {
      return null;
    }
    if (length === 0)
      ret = null;
    else if (!n || n >= length) {
      if (stringMode)
        ret = list.join('');
      else
        ret = Buffer.concat(list, length);
      list.length = 0;
    } else {
      if (n < list[0].length) {
        var buf = list[0];
        ret = buf.slice(0, n);
        list[0] = buf.slice(n);
      } else if (n === list[0].length) {
        ret = list.shift();
      } else {
        if (stringMode)
          ret = '';
        else
          ret = new Buffer(n);
        var c = 0;
        for (var i = 0,
            l = list.length; i < l && c < n; i++) {
          var buf = list[0];
          var cpy = Math.min(n - c, buf.length);
          if (stringMode)
            ret += buf.slice(0, cpy);
          else
            buf.copy(ret, c, 0, cpy);
          if (cpy < buf.length)
            list[0] = buf.slice(cpy);
          else
            list.shift();
          c += cpy;
        }
      }
    }
    return ret;
  }
  function endReadable(stream) {
    var state = stream._readableState;
    if (state.endEmitted)
      return;
    state.ended = true;
    state.endEmitted = true;
    process.nextTick(stream.emit.bind(stream, 'end'));
  }
})(require('buffer').Buffer, require('process'));
