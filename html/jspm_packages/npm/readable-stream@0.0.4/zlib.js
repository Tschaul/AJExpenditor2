/* */ 
(function(Buffer, process) {
  var Transform = require('./transform');
  var binding = process.binding('zlib');
  var util = require('util');
  var assert = require('assert').ok;
  binding.Z_MIN_WINDOWBITS = 8;
  binding.Z_MAX_WINDOWBITS = 15;
  binding.Z_DEFAULT_WINDOWBITS = 15;
  binding.Z_MIN_CHUNK = 64;
  binding.Z_MAX_CHUNK = Infinity;
  binding.Z_DEFAULT_CHUNK = (16 * 1024);
  binding.Z_MIN_MEMLEVEL = 1;
  binding.Z_MAX_MEMLEVEL = 9;
  binding.Z_DEFAULT_MEMLEVEL = 8;
  binding.Z_MIN_LEVEL = -1;
  binding.Z_MAX_LEVEL = 9;
  binding.Z_DEFAULT_LEVEL = binding.Z_DEFAULT_COMPRESSION;
  Object.keys(binding).forEach(function(k) {
    if (k.match(/^Z/))
      exports[k] = binding[k];
  });
  exports.codes = {
    Z_OK: binding.Z_OK,
    Z_STREAM_END: binding.Z_STREAM_END,
    Z_NEED_DICT: binding.Z_NEED_DICT,
    Z_ERRNO: binding.Z_ERRNO,
    Z_STREAM_ERROR: binding.Z_STREAM_ERROR,
    Z_DATA_ERROR: binding.Z_DATA_ERROR,
    Z_MEM_ERROR: binding.Z_MEM_ERROR,
    Z_BUF_ERROR: binding.Z_BUF_ERROR,
    Z_VERSION_ERROR: binding.Z_VERSION_ERROR
  };
  Object.keys(exports.codes).forEach(function(k) {
    exports.codes[exports.codes[k]] = k;
  });
  exports.Deflate = Deflate;
  exports.Inflate = Inflate;
  exports.Gzip = Gzip;
  exports.Gunzip = Gunzip;
  exports.DeflateRaw = DeflateRaw;
  exports.InflateRaw = InflateRaw;
  exports.Unzip = Unzip;
  exports.createDeflate = function(o) {
    return new Deflate(o);
  };
  exports.createInflate = function(o) {
    return new Inflate(o);
  };
  exports.createDeflateRaw = function(o) {
    return new DeflateRaw(o);
  };
  exports.createInflateRaw = function(o) {
    return new InflateRaw(o);
  };
  exports.createGzip = function(o) {
    return new Gzip(o);
  };
  exports.createGunzip = function(o) {
    return new Gunzip(o);
  };
  exports.createUnzip = function(o) {
    return new Unzip(o);
  };
  exports.deflate = function(buffer, callback) {
    zlibBuffer(new Deflate(), buffer, callback);
  };
  exports.gzip = function(buffer, callback) {
    zlibBuffer(new Gzip(), buffer, callback);
  };
  exports.deflateRaw = function(buffer, callback) {
    zlibBuffer(new DeflateRaw(), buffer, callback);
  };
  exports.unzip = function(buffer, callback) {
    zlibBuffer(new Unzip(), buffer, callback);
  };
  exports.inflate = function(buffer, callback) {
    zlibBuffer(new Inflate(), buffer, callback);
  };
  exports.gunzip = function(buffer, callback) {
    zlibBuffer(new Gunzip(), buffer, callback);
  };
  exports.inflateRaw = function(buffer, callback) {
    zlibBuffer(new InflateRaw(), buffer, callback);
  };
  function zlibBuffer(engine, buffer, callback) {
    var buffers = [];
    var nread = 0;
    engine.on('error', onError);
    engine.on('end', onEnd);
    engine.end(buffer);
    flow();
    function flow() {
      var chunk;
      while (null !== (chunk = engine.read())) {
        buffers.push(chunk);
        nread += chunk.length;
      }
      engine.once('readable', flow);
    }
    function onError(err) {
      engine.removeListener('end', onEnd);
      engine.removeListener('readable', flow);
      callback(err);
    }
    function onEnd() {
      callback(null, Buffer.concat(buffers, nread));
    }
  }
  function Deflate(opts) {
    if (!(this instanceof Deflate))
      return new Deflate(opts);
    Zlib.call(this, opts, binding.DEFLATE);
  }
  function Inflate(opts) {
    if (!(this instanceof Inflate))
      return new Inflate(opts);
    Zlib.call(this, opts, binding.INFLATE);
  }
  function Gzip(opts) {
    if (!(this instanceof Gzip))
      return new Gzip(opts);
    Zlib.call(this, opts, binding.GZIP);
  }
  function Gunzip(opts) {
    if (!(this instanceof Gunzip))
      return new Gunzip(opts);
    Zlib.call(this, opts, binding.GUNZIP);
  }
  function DeflateRaw(opts) {
    if (!(this instanceof DeflateRaw))
      return new DeflateRaw(opts);
    Zlib.call(this, opts, binding.DEFLATERAW);
  }
  function InflateRaw(opts) {
    if (!(this instanceof InflateRaw))
      return new InflateRaw(opts);
    Zlib.call(this, opts, binding.INFLATERAW);
  }
  function Unzip(opts) {
    if (!(this instanceof Unzip))
      return new Unzip(opts);
    Zlib.call(this, opts, binding.UNZIP);
  }
  function Zlib(opts, mode) {
    this._opts = opts = opts || {};
    this._chunkSize = opts.chunkSize || exports.Z_DEFAULT_CHUNK;
    Transform.call(this, opts);
    this._readableState.chunkSize = null;
    if (opts.chunkSize) {
      if (opts.chunkSize < exports.Z_MIN_CHUNK || opts.chunkSize > exports.Z_MAX_CHUNK) {
        throw new Error('Invalid chunk size: ' + opts.chunkSize);
      }
    }
    if (opts.windowBits) {
      if (opts.windowBits < exports.Z_MIN_WINDOWBITS || opts.windowBits > exports.Z_MAX_WINDOWBITS) {
        throw new Error('Invalid windowBits: ' + opts.windowBits);
      }
    }
    if (opts.level) {
      if (opts.level < exports.Z_MIN_LEVEL || opts.level > exports.Z_MAX_LEVEL) {
        throw new Error('Invalid compression level: ' + opts.level);
      }
    }
    if (opts.memLevel) {
      if (opts.memLevel < exports.Z_MIN_MEMLEVEL || opts.memLevel > exports.Z_MAX_MEMLEVEL) {
        throw new Error('Invalid memLevel: ' + opts.memLevel);
      }
    }
    if (opts.strategy) {
      if (opts.strategy != exports.Z_FILTERED && opts.strategy != exports.Z_HUFFMAN_ONLY && opts.strategy != exports.Z_RLE && opts.strategy != exports.Z_FIXED && opts.strategy != exports.Z_DEFAULT_STRATEGY) {
        throw new Error('Invalid strategy: ' + opts.strategy);
      }
    }
    if (opts.dictionary) {
      if (!Buffer.isBuffer(opts.dictionary)) {
        throw new Error('Invalid dictionary: it should be a Buffer instance');
      }
    }
    this._binding = new binding.Zlib(mode);
    var self = this;
    this._hadError = false;
    this._binding.onerror = function(message, errno) {
      self._binding = null;
      self._hadError = true;
      var error = new Error(message);
      error.errno = errno;
      error.code = exports.codes[errno];
      self.emit('error', error);
    };
    this._binding.init(opts.windowBits || exports.Z_DEFAULT_WINDOWBITS, opts.level || exports.Z_DEFAULT_COMPRESSION, opts.memLevel || exports.Z_DEFAULT_MEMLEVEL, opts.strategy || exports.Z_DEFAULT_STRATEGY, opts.dictionary);
    this._buffer = new Buffer(this._chunkSize);
    this._offset = 0;
  }
  util.inherits(Zlib, Transform);
  Zlib.prototype.reset = function reset() {
    return this._binding.reset();
  };
  Zlib.prototype._flush = function(output, callback) {
    this._transform(null, output, callback);
  };
  Zlib.prototype.flush = function(callback) {
    this._flush(this._output, callback || function() {});
  };
  Zlib.prototype._transform = function(chunk, output, cb) {
    var flushFlag;
    var ws = this._writableState;
    var ending = ws.ending || ws.ended;
    var last = ending && (!chunk || ws.length === chunk.length);
    if (last)
      flushFlag = binding.Z_FINISH;
    else if (chunk === null)
      flushFlag = binding.Z_FLUSH;
    else
      flushFlag = binding.Z_NO_FLUSH;
    var availInBefore = chunk && chunk.length;
    var availOutBefore = this._chunkSize - this._offset;
    var inOff = 0;
    var req = this._binding.write(flushFlag, chunk, inOff, availInBefore, this._buffer, this._offset, availOutBefore);
    req.buffer = chunk;
    req.callback = callback;
    var self = this;
    function callback(availInAfter, availOutAfter, buffer) {
      if (self._hadError)
        return;
      var have = availOutBefore - availOutAfter;
      assert(have >= 0, 'have should not go down');
      if (have > 0) {
        var out = self._buffer.slice(self._offset, self._offset + have);
        self._offset += have;
        output(out);
      }
      if (availOutAfter === 0 || self._offset >= self._chunkSize) {
        availOutBefore = self._chunkSize;
        self._offset = 0;
        self._buffer = new Buffer(self._chunkSize);
      }
      if (availOutAfter === 0) {
        inOff += (availInBefore - availInAfter);
        availInBefore = availInAfter;
        var newReq = self._binding.write(self._flush, chunk, inOff, availInBefore, self._buffer, self._offset, self._chunkSize);
        newReq.callback = callback;
        newReq.buffer = chunk;
        return;
      }
      cb();
    }
  };
  util.inherits(Deflate, Zlib);
  util.inherits(Inflate, Zlib);
  util.inherits(Gzip, Zlib);
  util.inherits(Gunzip, Zlib);
  util.inherits(DeflateRaw, Zlib);
  util.inherits(InflateRaw, Zlib);
  util.inherits(Unzip, Zlib);
})(require('buffer').Buffer, require('process'));
