/* */ 
"format cjs";
(function(process) {
  (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a)
            return a(o, !0);
          if (i)
            return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f;
        }
        var l = n[o] = {exports: {}};
        t[o][0].call(l.exports, function(e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }
      return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++)
      s(r[o]);
    return s;
  })({
    1: [function(_dereq_, module, exports) {
      'use strict';
      module.exports = argsArray;
      function argsArray(fun) {
        return function() {
          var len = arguments.length;
          if (len) {
            var args = [];
            var i = -1;
            while (++i < len) {
              args[i] = arguments[i];
            }
            return fun.call(this, args);
          } else {
            return fun.call(this, []);
          }
        };
      }
    }, {}],
    2: [function(_dereq_, module, exports) {
      function EventEmitter() {
        this._events = this._events || {};
        this._maxListeners = this._maxListeners || undefined;
      }
      module.exports = EventEmitter;
      EventEmitter.EventEmitter = EventEmitter;
      EventEmitter.prototype._events = undefined;
      EventEmitter.prototype._maxListeners = undefined;
      EventEmitter.defaultMaxListeners = 10;
      EventEmitter.prototype.setMaxListeners = function(n) {
        if (!isNumber(n) || n < 0 || isNaN(n))
          throw TypeError('n must be a positive number');
        this._maxListeners = n;
        return this;
      };
      EventEmitter.prototype.emit = function(type) {
        var er,
            handler,
            len,
            args,
            i,
            listeners;
        if (!this._events)
          this._events = {};
        if (type === 'error') {
          if (!this._events.error || (isObject(this._events.error) && !this._events.error.length)) {
            er = arguments[1];
            if (er instanceof Error) {
              throw er;
            } else {
              var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
              err.context = er;
              throw err;
            }
          }
        }
        handler = this._events[type];
        if (isUndefined(handler))
          return false;
        if (isFunction(handler)) {
          switch (arguments.length) {
            case 1:
              handler.call(this);
              break;
            case 2:
              handler.call(this, arguments[1]);
              break;
            case 3:
              handler.call(this, arguments[1], arguments[2]);
              break;
            default:
              args = Array.prototype.slice.call(arguments, 1);
              handler.apply(this, args);
          }
        } else if (isObject(handler)) {
          args = Array.prototype.slice.call(arguments, 1);
          listeners = handler.slice();
          len = listeners.length;
          for (i = 0; i < len; i++)
            listeners[i].apply(this, args);
        }
        return true;
      };
      EventEmitter.prototype.addListener = function(type, listener) {
        var m;
        if (!isFunction(listener))
          throw TypeError('listener must be a function');
        if (!this._events)
          this._events = {};
        if (this._events.newListener)
          this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);
        if (!this._events[type])
          this._events[type] = listener;
        else if (isObject(this._events[type]))
          this._events[type].push(listener);
        else
          this._events[type] = [this._events[type], listener];
        if (isObject(this._events[type]) && !this._events[type].warned) {
          if (!isUndefined(this._maxListeners)) {
            m = this._maxListeners;
          } else {
            m = EventEmitter.defaultMaxListeners;
          }
          if (m && m > 0 && this._events[type].length > m) {
            this._events[type].warned = true;
            console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
            if (typeof console.trace === 'function') {
              console.trace();
            }
          }
        }
        return this;
      };
      EventEmitter.prototype.on = EventEmitter.prototype.addListener;
      EventEmitter.prototype.once = function(type, listener) {
        if (!isFunction(listener))
          throw TypeError('listener must be a function');
        var fired = false;
        function g() {
          this.removeListener(type, g);
          if (!fired) {
            fired = true;
            listener.apply(this, arguments);
          }
        }
        g.listener = listener;
        this.on(type, g);
        return this;
      };
      EventEmitter.prototype.removeListener = function(type, listener) {
        var list,
            position,
            length,
            i;
        if (!isFunction(listener))
          throw TypeError('listener must be a function');
        if (!this._events || !this._events[type])
          return this;
        list = this._events[type];
        length = list.length;
        position = -1;
        if (list === listener || (isFunction(list.listener) && list.listener === listener)) {
          delete this._events[type];
          if (this._events.removeListener)
            this.emit('removeListener', type, listener);
        } else if (isObject(list)) {
          for (i = length; i-- > 0; ) {
            if (list[i] === listener || (list[i].listener && list[i].listener === listener)) {
              position = i;
              break;
            }
          }
          if (position < 0)
            return this;
          if (list.length === 1) {
            list.length = 0;
            delete this._events[type];
          } else {
            list.splice(position, 1);
          }
          if (this._events.removeListener)
            this.emit('removeListener', type, listener);
        }
        return this;
      };
      EventEmitter.prototype.removeAllListeners = function(type) {
        var key,
            listeners;
        if (!this._events)
          return this;
        if (!this._events.removeListener) {
          if (arguments.length === 0)
            this._events = {};
          else if (this._events[type])
            delete this._events[type];
          return this;
        }
        if (arguments.length === 0) {
          for (key in this._events) {
            if (key === 'removeListener')
              continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners('removeListener');
          this._events = {};
          return this;
        }
        listeners = this._events[type];
        if (isFunction(listeners)) {
          this.removeListener(type, listeners);
        } else if (listeners) {
          while (listeners.length)
            this.removeListener(type, listeners[listeners.length - 1]);
        }
        delete this._events[type];
        return this;
      };
      EventEmitter.prototype.listeners = function(type) {
        var ret;
        if (!this._events || !this._events[type])
          ret = [];
        else if (isFunction(this._events[type]))
          ret = [this._events[type]];
        else
          ret = this._events[type].slice();
        return ret;
      };
      EventEmitter.prototype.listenerCount = function(type) {
        if (this._events) {
          var evlistener = this._events[type];
          if (isFunction(evlistener))
            return 1;
          else if (evlistener)
            return evlistener.length;
        }
        return 0;
      };
      EventEmitter.listenerCount = function(emitter, type) {
        return emitter.listenerCount(type);
      };
      function isFunction(arg) {
        return typeof arg === 'function';
      }
      function isNumber(arg) {
        return typeof arg === 'number';
      }
      function isObject(arg) {
        return typeof arg === 'object' && arg !== null;
      }
      function isUndefined(arg) {
        return arg === void 0;
      }
    }, {}],
    3: [function(_dereq_, module, exports) {
      (function(global) {
        'use strict';
        var Mutation = global.MutationObserver || global.WebKitMutationObserver;
        var scheduleDrain;
        {
          if (Mutation) {
            var called = 0;
            var observer = new Mutation(nextTick);
            var element = global.document.createTextNode('');
            observer.observe(element, {characterData: true});
            scheduleDrain = function() {
              element.data = (called = ++called % 2);
            };
          } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
            var channel = new global.MessageChannel();
            channel.port1.onmessage = nextTick;
            scheduleDrain = function() {
              channel.port2.postMessage(0);
            };
          } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
            scheduleDrain = function() {
              var scriptEl = global.document.createElement('script');
              scriptEl.onreadystatechange = function() {
                nextTick();
                scriptEl.onreadystatechange = null;
                scriptEl.parentNode.removeChild(scriptEl);
                scriptEl = null;
              };
              global.document.documentElement.appendChild(scriptEl);
            };
          } else {
            scheduleDrain = function() {
              setTimeout(nextTick, 0);
            };
          }
        }
        var draining;
        var queue = [];
        function nextTick() {
          draining = true;
          var i,
              oldQueue;
          var len = queue.length;
          while (len) {
            oldQueue = queue;
            queue = [];
            i = -1;
            while (++i < len) {
              oldQueue[i]();
            }
            len = queue.length;
          }
          draining = false;
        }
        module.exports = immediate;
        function immediate(task) {
          if (queue.push(task) === 1 && !draining) {
            scheduleDrain();
          }
        }
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    4: [function(_dereq_, module, exports) {
      if (typeof Object.create === 'function') {
        module.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }});
        };
      } else {
        module.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {};
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        };
      }
    }, {}],
    5: [function(_dereq_, module, exports) {
      'use strict';
      var immediate = _dereq_(3);
      function INTERNAL() {}
      var handlers = {};
      var REJECTED = ['REJECTED'];
      var FULFILLED = ['FULFILLED'];
      var PENDING = ['PENDING'];
      module.exports = Promise;
      function Promise(resolver) {
        if (typeof resolver !== 'function') {
          throw new TypeError('resolver must be a function');
        }
        this.state = PENDING;
        this.queue = [];
        this.outcome = void 0;
        if (resolver !== INTERNAL) {
          safelyResolveThenable(this, resolver);
        }
      }
      Promise.prototype["catch"] = function(onRejected) {
        return this.then(null, onRejected);
      };
      Promise.prototype.then = function(onFulfilled, onRejected) {
        if (typeof onFulfilled !== 'function' && this.state === FULFILLED || typeof onRejected !== 'function' && this.state === REJECTED) {
          return this;
        }
        var promise = new this.constructor(INTERNAL);
        if (this.state !== PENDING) {
          var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
          unwrap(promise, resolver, this.outcome);
        } else {
          this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
        }
        return promise;
      };
      function QueueItem(promise, onFulfilled, onRejected) {
        this.promise = promise;
        if (typeof onFulfilled === 'function') {
          this.onFulfilled = onFulfilled;
          this.callFulfilled = this.otherCallFulfilled;
        }
        if (typeof onRejected === 'function') {
          this.onRejected = onRejected;
          this.callRejected = this.otherCallRejected;
        }
      }
      QueueItem.prototype.callFulfilled = function(value) {
        handlers.resolve(this.promise, value);
      };
      QueueItem.prototype.otherCallFulfilled = function(value) {
        unwrap(this.promise, this.onFulfilled, value);
      };
      QueueItem.prototype.callRejected = function(value) {
        handlers.reject(this.promise, value);
      };
      QueueItem.prototype.otherCallRejected = function(value) {
        unwrap(this.promise, this.onRejected, value);
      };
      function unwrap(promise, func, value) {
        immediate(function() {
          var returnValue;
          try {
            returnValue = func(value);
          } catch (e) {
            return handlers.reject(promise, e);
          }
          if (returnValue === promise) {
            handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
          } else {
            handlers.resolve(promise, returnValue);
          }
        });
      }
      handlers.resolve = function(self, value) {
        var result = tryCatch(getThen, value);
        if (result.status === 'error') {
          return handlers.reject(self, result.value);
        }
        var thenable = result.value;
        if (thenable) {
          safelyResolveThenable(self, thenable);
        } else {
          self.state = FULFILLED;
          self.outcome = value;
          var i = -1;
          var len = self.queue.length;
          while (++i < len) {
            self.queue[i].callFulfilled(value);
          }
        }
        return self;
      };
      handlers.reject = function(self, error) {
        self.state = REJECTED;
        self.outcome = error;
        var i = -1;
        var len = self.queue.length;
        while (++i < len) {
          self.queue[i].callRejected(error);
        }
        return self;
      };
      function getThen(obj) {
        var then = obj && obj.then;
        if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
          return function appyThen() {
            then.apply(obj, arguments);
          };
        }
      }
      function safelyResolveThenable(self, thenable) {
        var called = false;
        function onError(value) {
          if (called) {
            return;
          }
          called = true;
          handlers.reject(self, value);
        }
        function onSuccess(value) {
          if (called) {
            return;
          }
          called = true;
          handlers.resolve(self, value);
        }
        function tryToUnwrap() {
          thenable(onSuccess, onError);
        }
        var result = tryCatch(tryToUnwrap);
        if (result.status === 'error') {
          onError(result.value);
        }
      }
      function tryCatch(func, value) {
        var out = {};
        try {
          out.value = func(value);
          out.status = 'success';
        } catch (e) {
          out.status = 'error';
          out.value = e;
        }
        return out;
      }
      Promise.resolve = resolve;
      function resolve(value) {
        if (value instanceof this) {
          return value;
        }
        return handlers.resolve(new this(INTERNAL), value);
      }
      Promise.reject = reject;
      function reject(reason) {
        var promise = new this(INTERNAL);
        return handlers.reject(promise, reason);
      }
      Promise.all = all;
      function all(iterable) {
        var self = this;
        if (Object.prototype.toString.call(iterable) !== '[object Array]') {
          return this.reject(new TypeError('must be an array'));
        }
        var len = iterable.length;
        var called = false;
        if (!len) {
          return this.resolve([]);
        }
        var values = new Array(len);
        var resolved = 0;
        var i = -1;
        var promise = new this(INTERNAL);
        while (++i < len) {
          allResolver(iterable[i], i);
        }
        return promise;
        function allResolver(value, i) {
          self.resolve(value).then(resolveFromAll, function(error) {
            if (!called) {
              called = true;
              handlers.reject(promise, error);
            }
          });
          function resolveFromAll(outValue) {
            values[i] = outValue;
            if (++resolved === len && !called) {
              called = true;
              handlers.resolve(promise, values);
            }
          }
        }
      }
      Promise.race = race;
      function race(iterable) {
        var self = this;
        if (Object.prototype.toString.call(iterable) !== '[object Array]') {
          return this.reject(new TypeError('must be an array'));
        }
        var len = iterable.length;
        var called = false;
        if (!len) {
          return this.resolve([]);
        }
        var i = -1;
        var promise = new this(INTERNAL);
        while (++i < len) {
          resolver(iterable[i]);
        }
        return promise;
        function resolver(value) {
          self.resolve(value).then(function(response) {
            if (!called) {
              called = true;
              handlers.resolve(promise, response);
            }
          }, function(error) {
            if (!called) {
              called = true;
              handlers.reject(promise, error);
            }
          });
        }
      }
    }, {"3": 3}],
    6: [function(_dereq_, module, exports) {
      var process = module.exports = {};
      var cachedSetTimeout;
      var cachedClearTimeout;
      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
      }
      function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
      }
      (function() {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      }());
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          return setTimeout(fun, 0);
        }
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          return clearTimeout(marker);
        }
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
            return cachedClearTimeout.call(this, marker);
          }
        }
      }
      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;
      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }
      function drainQueue() {
        if (draining) {
          return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
        var len = queue.length;
        while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }
      process.nextTick = function(fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function() {
        this.fun.apply(null, this.array);
      };
      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = '';
      process.versions = {};
      function noop() {}
      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;
      process.listeners = function(name) {
        return [];
      };
      process.binding = function(name) {
        throw new Error('process.binding is not supported');
      };
      process.cwd = function() {
        return '/';
      };
      process.chdir = function(dir) {
        throw new Error('process.chdir is not supported');
      };
      process.umask = function() {
        return 0;
      };
    }, {}],
    7: [function(_dereq_, module, exports) {
      (function(factory) {
        if (typeof exports === 'object') {
          module.exports = factory();
        } else if (typeof define === 'function' && define.amd) {
          define(factory);
        } else {
          var glob;
          try {
            glob = window;
          } catch (e) {
            glob = self;
          }
          glob.SparkMD5 = factory();
        }
      }(function(undefined) {
        'use strict';
        var add32 = function(a, b) {
          return (a + b) & 0xFFFFFFFF;
        },
            hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        function cmn(q, a, b, x, s, t) {
          a = add32(add32(a, q), add32(x, t));
          return add32((a << s) | (a >>> (32 - s)), b);
        }
        function md5cycle(x, k) {
          var a = x[0],
              b = x[1],
              c = x[2],
              d = x[3];
          a += (b & c | ~b & d) + k[0] - 680876936 | 0;
          a = (a << 7 | a >>> 25) + b | 0;
          d += (a & b | ~a & c) + k[1] - 389564586 | 0;
          d = (d << 12 | d >>> 20) + a | 0;
          c += (d & a | ~d & b) + k[2] + 606105819 | 0;
          c = (c << 17 | c >>> 15) + d | 0;
          b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
          b = (b << 22 | b >>> 10) + c | 0;
          a += (b & c | ~b & d) + k[4] - 176418897 | 0;
          a = (a << 7 | a >>> 25) + b | 0;
          d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
          d = (d << 12 | d >>> 20) + a | 0;
          c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
          c = (c << 17 | c >>> 15) + d | 0;
          b += (c & d | ~c & a) + k[7] - 45705983 | 0;
          b = (b << 22 | b >>> 10) + c | 0;
          a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
          a = (a << 7 | a >>> 25) + b | 0;
          d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
          d = (d << 12 | d >>> 20) + a | 0;
          c += (d & a | ~d & b) + k[10] - 42063 | 0;
          c = (c << 17 | c >>> 15) + d | 0;
          b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
          b = (b << 22 | b >>> 10) + c | 0;
          a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
          a = (a << 7 | a >>> 25) + b | 0;
          d += (a & b | ~a & c) + k[13] - 40341101 | 0;
          d = (d << 12 | d >>> 20) + a | 0;
          c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
          c = (c << 17 | c >>> 15) + d | 0;
          b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
          b = (b << 22 | b >>> 10) + c | 0;
          a += (b & d | c & ~d) + k[1] - 165796510 | 0;
          a = (a << 5 | a >>> 27) + b | 0;
          d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
          d = (d << 9 | d >>> 23) + a | 0;
          c += (d & b | a & ~b) + k[11] + 643717713 | 0;
          c = (c << 14 | c >>> 18) + d | 0;
          b += (c & a | d & ~a) + k[0] - 373897302 | 0;
          b = (b << 20 | b >>> 12) + c | 0;
          a += (b & d | c & ~d) + k[5] - 701558691 | 0;
          a = (a << 5 | a >>> 27) + b | 0;
          d += (a & c | b & ~c) + k[10] + 38016083 | 0;
          d = (d << 9 | d >>> 23) + a | 0;
          c += (d & b | a & ~b) + k[15] - 660478335 | 0;
          c = (c << 14 | c >>> 18) + d | 0;
          b += (c & a | d & ~a) + k[4] - 405537848 | 0;
          b = (b << 20 | b >>> 12) + c | 0;
          a += (b & d | c & ~d) + k[9] + 568446438 | 0;
          a = (a << 5 | a >>> 27) + b | 0;
          d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
          d = (d << 9 | d >>> 23) + a | 0;
          c += (d & b | a & ~b) + k[3] - 187363961 | 0;
          c = (c << 14 | c >>> 18) + d | 0;
          b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
          b = (b << 20 | b >>> 12) + c | 0;
          a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
          a = (a << 5 | a >>> 27) + b | 0;
          d += (a & c | b & ~c) + k[2] - 51403784 | 0;
          d = (d << 9 | d >>> 23) + a | 0;
          c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
          c = (c << 14 | c >>> 18) + d | 0;
          b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
          b = (b << 20 | b >>> 12) + c | 0;
          a += (b ^ c ^ d) + k[5] - 378558 | 0;
          a = (a << 4 | a >>> 28) + b | 0;
          d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
          d = (d << 11 | d >>> 21) + a | 0;
          c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
          c = (c << 16 | c >>> 16) + d | 0;
          b += (c ^ d ^ a) + k[14] - 35309556 | 0;
          b = (b << 23 | b >>> 9) + c | 0;
          a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
          a = (a << 4 | a >>> 28) + b | 0;
          d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
          d = (d << 11 | d >>> 21) + a | 0;
          c += (d ^ a ^ b) + k[7] - 155497632 | 0;
          c = (c << 16 | c >>> 16) + d | 0;
          b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
          b = (b << 23 | b >>> 9) + c | 0;
          a += (b ^ c ^ d) + k[13] + 681279174 | 0;
          a = (a << 4 | a >>> 28) + b | 0;
          d += (a ^ b ^ c) + k[0] - 358537222 | 0;
          d = (d << 11 | d >>> 21) + a | 0;
          c += (d ^ a ^ b) + k[3] - 722521979 | 0;
          c = (c << 16 | c >>> 16) + d | 0;
          b += (c ^ d ^ a) + k[6] + 76029189 | 0;
          b = (b << 23 | b >>> 9) + c | 0;
          a += (b ^ c ^ d) + k[9] - 640364487 | 0;
          a = (a << 4 | a >>> 28) + b | 0;
          d += (a ^ b ^ c) + k[12] - 421815835 | 0;
          d = (d << 11 | d >>> 21) + a | 0;
          c += (d ^ a ^ b) + k[15] + 530742520 | 0;
          c = (c << 16 | c >>> 16) + d | 0;
          b += (c ^ d ^ a) + k[2] - 995338651 | 0;
          b = (b << 23 | b >>> 9) + c | 0;
          a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
          a = (a << 6 | a >>> 26) + b | 0;
          d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
          d = (d << 10 | d >>> 22) + a | 0;
          c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
          c = (c << 15 | c >>> 17) + d | 0;
          b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
          b = (b << 21 | b >>> 11) + c | 0;
          a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
          a = (a << 6 | a >>> 26) + b | 0;
          d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
          d = (d << 10 | d >>> 22) + a | 0;
          c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
          c = (c << 15 | c >>> 17) + d | 0;
          b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
          b = (b << 21 | b >>> 11) + c | 0;
          a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
          a = (a << 6 | a >>> 26) + b | 0;
          d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
          d = (d << 10 | d >>> 22) + a | 0;
          c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
          c = (c << 15 | c >>> 17) + d | 0;
          b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
          b = (b << 21 | b >>> 11) + c | 0;
          a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
          a = (a << 6 | a >>> 26) + b | 0;
          d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
          d = (d << 10 | d >>> 22) + a | 0;
          c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
          c = (c << 15 | c >>> 17) + d | 0;
          b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
          b = (b << 21 | b >>> 11) + c | 0;
          x[0] = a + x[0] | 0;
          x[1] = b + x[1] | 0;
          x[2] = c + x[2] | 0;
          x[3] = d + x[3] | 0;
        }
        function md5blk(s) {
          var md5blks = [],
              i;
          for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
          }
          return md5blks;
        }
        function md5blk_array(a) {
          var md5blks = [],
              i;
          for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
          }
          return md5blks;
        }
        function md51(s) {
          var n = s.length,
              state = [1732584193, -271733879, -1732584194, 271733878],
              i,
              length,
              tail,
              tmp,
              lo,
              hi;
          for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
          }
          s = s.substring(i - 64);
          length = s.length;
          tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
          }
          tail[i >> 2] |= 0x80 << ((i % 4) << 3);
          if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
              tail[i] = 0;
            }
          }
          tmp = n * 8;
          tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
          lo = parseInt(tmp[2], 16);
          hi = parseInt(tmp[1], 16) || 0;
          tail[14] = lo;
          tail[15] = hi;
          md5cycle(state, tail);
          return state;
        }
        function md51_array(a) {
          var n = a.length,
              state = [1732584193, -271733879, -1732584194, 271733878],
              i,
              length,
              tail,
              tmp,
              lo,
              hi;
          for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
          }
          a = (i - 64) < n ? a.subarray(i - 64) : new Uint8Array(0);
          length = a.length;
          tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= a[i] << ((i % 4) << 3);
          }
          tail[i >> 2] |= 0x80 << ((i % 4) << 3);
          if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
              tail[i] = 0;
            }
          }
          tmp = n * 8;
          tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
          lo = parseInt(tmp[2], 16);
          hi = parseInt(tmp[1], 16) || 0;
          tail[14] = lo;
          tail[15] = hi;
          md5cycle(state, tail);
          return state;
        }
        function rhex(n) {
          var s = '',
              j;
          for (j = 0; j < 4; j += 1) {
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
          }
          return s;
        }
        function hex(x) {
          var i;
          for (i = 0; i < x.length; i += 1) {
            x[i] = rhex(x[i]);
          }
          return x.join('');
        }
        if (hex(md51('hello')) !== '5d41402abc4b2a76b9719d911017c592') {
          add32 = function(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
          };
        }
        if (typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.prototype.slice) {
          (function() {
            function clamp(val, length) {
              val = (val | 0) || 0;
              if (val < 0) {
                return Math.max(val + length, 0);
              }
              return Math.min(val, length);
            }
            ArrayBuffer.prototype.slice = function(from, to) {
              var length = this.byteLength,
                  begin = clamp(from, length),
                  end = length,
                  num,
                  target,
                  targetArray,
                  sourceArray;
              if (to !== undefined) {
                end = clamp(to, length);
              }
              if (begin > end) {
                return new ArrayBuffer(0);
              }
              num = end - begin;
              target = new ArrayBuffer(num);
              targetArray = new Uint8Array(target);
              sourceArray = new Uint8Array(this, begin, num);
              targetArray.set(sourceArray);
              return target;
            };
          })();
        }
        function toUtf8(str) {
          if (/[\u0080-\uFFFF]/.test(str)) {
            str = unescape(encodeURIComponent(str));
          }
          return str;
        }
        function utf8Str2ArrayBuffer(str, returnUInt8Array) {
          var length = str.length,
              buff = new ArrayBuffer(length),
              arr = new Uint8Array(buff),
              i;
          for (i = 0; i < length; i += 1) {
            arr[i] = str.charCodeAt(i);
          }
          return returnUInt8Array ? arr : buff;
        }
        function arrayBuffer2Utf8Str(buff) {
          return String.fromCharCode.apply(null, new Uint8Array(buff));
        }
        function concatenateArrayBuffers(first, second, returnUInt8Array) {
          var result = new Uint8Array(first.byteLength + second.byteLength);
          result.set(new Uint8Array(first));
          result.set(new Uint8Array(second), first.byteLength);
          return returnUInt8Array ? result : result.buffer;
        }
        function hexToBinaryString(hex) {
          var bytes = [],
              length = hex.length,
              x;
          for (x = 0; x < length - 1; x += 2) {
            bytes.push(parseInt(hex.substr(x, 2), 16));
          }
          return String.fromCharCode.apply(String, bytes);
        }
        function SparkMD5() {
          this.reset();
        }
        SparkMD5.prototype.append = function(str) {
          this.appendBinary(toUtf8(str));
          return this;
        };
        SparkMD5.prototype.appendBinary = function(contents) {
          this._buff += contents;
          this._length += contents.length;
          var length = this._buff.length,
              i;
          for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
          }
          this._buff = this._buff.substring(i - 64);
          return this;
        };
        SparkMD5.prototype.end = function(raw) {
          var buff = this._buff,
              length = buff.length,
              i,
              tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              ret;
          for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3);
          }
          this._finish(tail, length);
          ret = hex(this._hash);
          if (raw) {
            ret = hexToBinaryString(ret);
          }
          this.reset();
          return ret;
        };
        SparkMD5.prototype.reset = function() {
          this._buff = '';
          this._length = 0;
          this._hash = [1732584193, -271733879, -1732584194, 271733878];
          return this;
        };
        SparkMD5.prototype.getState = function() {
          return {
            buff: this._buff,
            length: this._length,
            hash: this._hash
          };
        };
        SparkMD5.prototype.setState = function(state) {
          this._buff = state.buff;
          this._length = state.length;
          this._hash = state.hash;
          return this;
        };
        SparkMD5.prototype.destroy = function() {
          delete this._hash;
          delete this._buff;
          delete this._length;
        };
        SparkMD5.prototype._finish = function(tail, length) {
          var i = length,
              tmp,
              lo,
              hi;
          tail[i >> 2] |= 0x80 << ((i % 4) << 3);
          if (i > 55) {
            md5cycle(this._hash, tail);
            for (i = 0; i < 16; i += 1) {
              tail[i] = 0;
            }
          }
          tmp = this._length * 8;
          tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
          lo = parseInt(tmp[2], 16);
          hi = parseInt(tmp[1], 16) || 0;
          tail[14] = lo;
          tail[15] = hi;
          md5cycle(this._hash, tail);
        };
        SparkMD5.hash = function(str, raw) {
          return SparkMD5.hashBinary(toUtf8(str), raw);
        };
        SparkMD5.hashBinary = function(content, raw) {
          var hash = md51(content),
              ret = hex(hash);
          return raw ? hexToBinaryString(ret) : ret;
        };
        SparkMD5.ArrayBuffer = function() {
          this.reset();
        };
        SparkMD5.ArrayBuffer.prototype.append = function(arr) {
          var buff = concatenateArrayBuffers(this._buff.buffer, arr, true),
              length = buff.length,
              i;
          this._length += arr.byteLength;
          for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
          }
          this._buff = (i - 64) < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);
          return this;
        };
        SparkMD5.ArrayBuffer.prototype.end = function(raw) {
          var buff = this._buff,
              length = buff.length,
              tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              i,
              ret;
          for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff[i] << ((i % 4) << 3);
          }
          this._finish(tail, length);
          ret = hex(this._hash);
          if (raw) {
            ret = hexToBinaryString(ret);
          }
          this.reset();
          return ret;
        };
        SparkMD5.ArrayBuffer.prototype.reset = function() {
          this._buff = new Uint8Array(0);
          this._length = 0;
          this._hash = [1732584193, -271733879, -1732584194, 271733878];
          return this;
        };
        SparkMD5.ArrayBuffer.prototype.getState = function() {
          var state = SparkMD5.prototype.getState.call(this);
          state.buff = arrayBuffer2Utf8Str(state.buff);
          return state;
        };
        SparkMD5.ArrayBuffer.prototype.setState = function(state) {
          state.buff = utf8Str2ArrayBuffer(state.buff, true);
          return SparkMD5.prototype.setState.call(this, state);
        };
        SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
        SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;
        SparkMD5.ArrayBuffer.hash = function(arr, raw) {
          var hash = md51_array(new Uint8Array(arr)),
              ret = hex(hash);
          return raw ? hexToBinaryString(ret) : ret;
        };
        return SparkMD5;
      }));
    }, {}],
    8: [function(_dereq_, module, exports) {
      var byteToHex = [];
      for (var i = 0; i < 256; ++i) {
        byteToHex[i] = (i + 0x100).toString(16).substr(1);
      }
      function bytesToUuid(buf, offset) {
        var i = offset || 0;
        var bth = byteToHex;
        return bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]];
      }
      module.exports = bytesToUuid;
    }, {}],
    9: [function(_dereq_, module, exports) {
      (function(global) {
        var rng;
        var crypto = global.crypto || global.msCrypto;
        if (crypto && crypto.getRandomValues) {
          var rnds8 = new Uint8Array(16);
          rng = function whatwgRNG() {
            crypto.getRandomValues(rnds8);
            return rnds8;
          };
        }
        if (!rng) {
          var rnds = new Array(16);
          rng = function() {
            for (var i = 0,
                r; i < 16; i++) {
              if ((i & 0x03) === 0)
                r = Math.random() * 0x100000000;
              rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
            }
            return rnds;
          };
        }
        module.exports = rng;
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    10: [function(_dereq_, module, exports) {
      var rng = _dereq_(9);
      var bytesToUuid = _dereq_(8);
      function v4(options, buf, offset) {
        var i = buf && offset || 0;
        if (typeof(options) == 'string') {
          buf = options == 'binary' ? new Array(16) : null;
          options = null;
        }
        options = options || {};
        var rnds = options.random || (options.rng || rng)();
        rnds[6] = (rnds[6] & 0x0f) | 0x40;
        rnds[8] = (rnds[8] & 0x3f) | 0x80;
        if (buf) {
          for (var ii = 0; ii < 16; ++ii) {
            buf[i + ii] = rnds[ii];
          }
        }
        return buf || bytesToUuid(rnds);
      }
      module.exports = v4;
    }, {
      "8": 8,
      "9": 9
    }],
    11: [function(_dereq_, module, exports) {
      (function(process) {
        'use strict';
        function _interopDefault(ex) {
          return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex;
        }
        var lie = _interopDefault(_dereq_(5));
        var getArguments = _interopDefault(_dereq_(1));
        var events = _dereq_(2);
        var inherits = _interopDefault(_dereq_(4));
        var nextTick = _interopDefault(_dereq_(3));
        var v4 = _interopDefault(_dereq_(10));
        var Md5 = _interopDefault(_dereq_(7));
        var PouchPromise$1 = typeof Promise === 'function' ? Promise : lie;
        function isBinaryObject(object) {
          return (typeof ArrayBuffer !== 'undefined' && object instanceof ArrayBuffer) || (typeof Blob !== 'undefined' && object instanceof Blob);
        }
        function cloneArrayBuffer(buff) {
          if (typeof buff.slice === 'function') {
            return buff.slice(0);
          }
          var target = new ArrayBuffer(buff.byteLength);
          var targetArray = new Uint8Array(target);
          var sourceArray = new Uint8Array(buff);
          targetArray.set(sourceArray);
          return target;
        }
        function cloneBinaryObject(object) {
          if (object instanceof ArrayBuffer) {
            return cloneArrayBuffer(object);
          }
          var size = object.size;
          var type = object.type;
          if (typeof object.slice === 'function') {
            return object.slice(0, size, type);
          }
          return object.webkitSlice(0, size, type);
        }
        var funcToString = Function.prototype.toString;
        var objectCtorString = funcToString.call(Object);
        function isPlainObject(value) {
          var proto = Object.getPrototypeOf(value);
          if (proto === null) {
            return true;
          }
          var Ctor = proto.constructor;
          return (typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
        }
        function clone(object) {
          var newObject;
          var i;
          var len;
          if (!object || typeof object !== 'object') {
            return object;
          }
          if (Array.isArray(object)) {
            newObject = [];
            for (i = 0, len = object.length; i < len; i++) {
              newObject[i] = clone(object[i]);
            }
            return newObject;
          }
          if (object instanceof Date) {
            return object.toISOString();
          }
          if (isBinaryObject(object)) {
            return cloneBinaryObject(object);
          }
          if (!isPlainObject(object)) {
            return object;
          }
          newObject = {};
          for (i in object) {
            if (Object.prototype.hasOwnProperty.call(object, i)) {
              var value = clone(object[i]);
              if (typeof value !== 'undefined') {
                newObject[i] = value;
              }
            }
          }
          return newObject;
        }
        function once(fun) {
          var called = false;
          return getArguments(function(args) {
            if (called) {
              throw new Error('once called more than once');
            } else {
              called = true;
              fun.apply(this, args);
            }
          });
        }
        function toPromise(func) {
          return getArguments(function(args) {
            args = clone(args);
            var self = this;
            var usedCB = (typeof args[args.length - 1] === 'function') ? args.pop() : false;
            var promise = new PouchPromise$1(function(fulfill, reject) {
              var resp;
              try {
                var callback = once(function(err, mesg) {
                  if (err) {
                    reject(err);
                  } else {
                    fulfill(mesg);
                  }
                });
                args.push(callback);
                resp = func.apply(self, args);
                if (resp && typeof resp.then === 'function') {
                  fulfill(resp);
                }
              } catch (e) {
                reject(e);
              }
            });
            if (usedCB) {
              promise.then(function(result) {
                usedCB(null, result);
              }, usedCB);
            }
            return promise;
          });
        }
        function mangle(key) {
          return '$' + key;
        }
        function unmangle(key) {
          return key.substring(1);
        }
        function Map$1() {
          this._store = {};
        }
        Map$1.prototype.get = function(key) {
          var mangled = mangle(key);
          return this._store[mangled];
        };
        Map$1.prototype.set = function(key, value) {
          var mangled = mangle(key);
          this._store[mangled] = value;
          return true;
        };
        Map$1.prototype.has = function(key) {
          var mangled = mangle(key);
          return mangled in this._store;
        };
        Map$1.prototype["delete"] = function(key) {
          var mangled = mangle(key);
          var res = mangled in this._store;
          delete this._store[mangled];
          return res;
        };
        Map$1.prototype.forEach = function(cb) {
          var keys = Object.keys(this._store);
          for (var i = 0,
              len = keys.length; i < len; i++) {
            var key = keys[i];
            var value = this._store[key];
            key = unmangle(key);
            cb(value, key);
          }
        };
        Object.defineProperty(Map$1.prototype, 'size', {get: function() {
            return Object.keys(this._store).length;
          }});
        function Set$1(array) {
          this._store = new Map$1();
          if (array && Array.isArray(array)) {
            for (var i = 0,
                len = array.length; i < len; i++) {
              this.add(array[i]);
            }
          }
        }
        Set$1.prototype.add = function(key) {
          return this._store.set(key, true);
        };
        Set$1.prototype.has = function(key) {
          return this._store.has(key);
        };
        Set$1.prototype.forEach = function(cb) {
          this._store.forEach(function(value, key) {
            cb(key);
          });
        };
        Object.defineProperty(Set$1.prototype, 'size', {get: function() {
            return this._store.size;
          }});
        function supportsMapAndSet() {
          if (typeof Symbol === 'undefined' || typeof Map === 'undefined' || typeof Set === 'undefined') {
            return false;
          }
          var prop = Object.getOwnPropertyDescriptor(Map, Symbol.species);
          return prop && 'get' in prop && Map[Symbol.species] === Map;
        }
        var ExportedSet;
        var ExportedMap;
        {
          if (supportsMapAndSet()) {
            ExportedSet = Set;
            ExportedMap = Map;
          } else {
            ExportedSet = Set$1;
            ExportedMap = Map$1;
          }
        }
        function pick(obj, arr) {
          var res = {};
          for (var i = 0,
              len = arr.length; i < len; i++) {
            var prop = arr[i];
            if (prop in obj) {
              res[prop] = obj[prop];
            }
          }
          return res;
        }
        function isChromeApp() {
          return (typeof chrome !== "undefined" && typeof chrome.storage !== "undefined" && typeof chrome.storage.local !== "undefined");
        }
        var hasLocal;
        if (isChromeApp()) {
          hasLocal = false;
        } else {
          try {
            localStorage.setItem('_pouch_check_localstorage', 1);
            hasLocal = !!localStorage.getItem('_pouch_check_localstorage');
          } catch (e) {
            hasLocal = false;
          }
        }
        function hasLocalStorage() {
          return hasLocal;
        }
        inherits(Changes, events.EventEmitter);
        function attachBrowserEvents(self) {
          if (isChromeApp()) {
            chrome.storage.onChanged.addListener(function(e) {
              if (e.db_name != null) {
                self.emit(e.dbName.newValue);
              }
            });
          } else if (hasLocalStorage()) {
            if (typeof addEventListener !== 'undefined') {
              addEventListener("storage", function(e) {
                self.emit(e.key);
              });
            } else {
              window.attachEvent("storage", function(e) {
                self.emit(e.key);
              });
            }
          }
        }
        function Changes() {
          events.EventEmitter.call(this);
          this._listeners = {};
          attachBrowserEvents(this);
        }
        Changes.prototype.addListener = function(dbName, id, db, opts) {
          if (this._listeners[id]) {
            return;
          }
          var self = this;
          var inprogress = false;
          function eventFunction() {
            if (!self._listeners[id]) {
              return;
            }
            if (inprogress) {
              inprogress = 'waiting';
              return;
            }
            inprogress = true;
            var changesOpts = pick(opts, ['style', 'include_docs', 'attachments', 'conflicts', 'filter', 'doc_ids', 'view', 'since', 'query_params', 'binary']);
            function onError() {
              inprogress = false;
            }
            db.changes(changesOpts).on('change', function(c) {
              if (c.seq > opts.since && !opts.cancelled) {
                opts.since = c.seq;
                opts.onChange(c);
              }
            }).on('complete', function() {
              if (inprogress === 'waiting') {
                nextTick(eventFunction);
              }
              inprogress = false;
            }).on('error', onError);
          }
          this._listeners[id] = eventFunction;
          this.on(dbName, eventFunction);
        };
        Changes.prototype.removeListener = function(dbName, id) {
          if (!(id in this._listeners)) {
            return;
          }
          events.EventEmitter.prototype.removeListener.call(this, dbName, this._listeners[id]);
          delete this._listeners[id];
        };
        Changes.prototype.notifyLocalWindows = function(dbName) {
          if (isChromeApp()) {
            chrome.storage.local.set({dbName: dbName});
          } else if (hasLocalStorage()) {
            localStorage[dbName] = (localStorage[dbName] === "a") ? "b" : "a";
          }
        };
        Changes.prototype.notify = function(dbName) {
          this.emit(dbName);
          this.notifyLocalWindows(dbName);
        };
        function guardedConsole(method) {
          if (console !== 'undefined' && method in console) {
            var args = Array.prototype.slice.call(arguments, 1);
            console[method].apply(console, args);
          }
        }
        var assign;
        {
          if (typeof Object.assign === 'function') {
            assign = Object.assign;
          } else {
            assign = function(target) {
              var to = Object(target);
              for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];
                if (nextSource != null) {
                  for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                      to[nextKey] = nextSource[nextKey];
                    }
                  }
                }
              }
              return to;
            };
          }
        }
        var $inject_Object_assign = assign;
        inherits(PouchError, Error);
        function PouchError(status, error, reason) {
          Error.call(this, reason);
          this.status = status;
          this.name = error;
          this.message = reason;
          this.error = true;
        }
        PouchError.prototype.toString = function() {
          return JSON.stringify({
            status: this.status,
            name: this.name,
            message: this.message,
            reason: this.reason
          });
        };
        var UNAUTHORIZED = new PouchError(401, 'unauthorized', "Name or password is incorrect.");
        var MISSING_BULK_DOCS = new PouchError(400, 'bad_request', "Missing JSON list of 'docs'");
        var MISSING_DOC = new PouchError(404, 'not_found', 'missing');
        var REV_CONFLICT = new PouchError(409, 'conflict', 'Document update conflict');
        var INVALID_ID = new PouchError(400, 'bad_request', '_id field must contain a string');
        var MISSING_ID = new PouchError(412, 'missing_id', '_id is required for puts');
        var RESERVED_ID = new PouchError(400, 'bad_request', 'Only reserved document ids may start with underscore.');
        var NOT_OPEN = new PouchError(412, 'precondition_failed', 'Database not open');
        var UNKNOWN_ERROR = new PouchError(500, 'unknown_error', 'Database encountered an unknown error');
        var BAD_ARG = new PouchError(500, 'badarg', 'Some query argument is invalid');
        var INVALID_REQUEST = new PouchError(400, 'invalid_request', 'Request was invalid');
        var QUERY_PARSE_ERROR = new PouchError(400, 'query_parse_error', 'Some query parameter is invalid');
        var DOC_VALIDATION = new PouchError(500, 'doc_validation', 'Bad special document member');
        var BAD_REQUEST = new PouchError(400, 'bad_request', 'Something wrong with the request');
        var NOT_AN_OBJECT = new PouchError(400, 'bad_request', 'Document must be a JSON object');
        var DB_MISSING = new PouchError(404, 'not_found', 'Database not found');
        var IDB_ERROR = new PouchError(500, 'indexed_db_went_bad', 'unknown');
        var WSQ_ERROR = new PouchError(500, 'web_sql_went_bad', 'unknown');
        var LDB_ERROR = new PouchError(500, 'levelDB_went_went_bad', 'unknown');
        var FORBIDDEN = new PouchError(403, 'forbidden', 'Forbidden by design doc validate_doc_update function');
        var INVALID_REV = new PouchError(400, 'bad_request', 'Invalid rev format');
        var FILE_EXISTS = new PouchError(412, 'file_exists', 'The database could not be created, the file already exists.');
        var MISSING_STUB = new PouchError(412, 'missing_stub', 'A pre-existing attachment stub wasn\'t found');
        var INVALID_URL = new PouchError(413, 'invalid_url', 'Provided URL is invalid');
        function flatten(arrs) {
          var res = [];
          for (var i = 0,
              len = arrs.length; i < len; i++) {
            res = res.concat(arrs[i]);
          }
          return res;
        }
        function f() {}
        var hasName = f.name;
        var res;
        if (hasName) {
          res = function(fun) {
            return fun.name;
          };
        } else {
          res = function(fun) {
            return fun.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
          };
        }
        function isRemote(db) {
          if (typeof db._remote === 'boolean') {
            return db._remote;
          }
          if (typeof db.type === 'function') {
            guardedConsole('warn', 'db.type() is deprecated and will be removed in ' + 'a future version of PouchDB');
            return db.type() === 'http';
          }
          return false;
        }
        function upsert(db, docId, diffFun) {
          return new PouchPromise$1(function(fulfill, reject) {
            db.get(docId, function(err, doc) {
              if (err) {
                if (err.status !== 404) {
                  return reject(err);
                }
                doc = {};
              }
              var docRev = doc._rev;
              var newDoc = diffFun(doc);
              if (!newDoc) {
                return fulfill({
                  updated: false,
                  rev: docRev
                });
              }
              newDoc._id = docId;
              newDoc._rev = docRev;
              fulfill(tryAndPut(db, newDoc, diffFun));
            });
          });
        }
        function tryAndPut(db, doc, diffFun) {
          return db.put(doc).then(function(res) {
            return {
              updated: true,
              rev: res.rev
            };
          }, function(err) {
            if (err.status !== 409) {
              throw err;
            }
            return upsert(db, doc._id, diffFun);
          });
        }
        function massageCreateIndexRequest(requestDef) {
          requestDef = clone(requestDef);
          if (!requestDef.index) {
            requestDef.index = {};
          }
          ['type', 'name', 'ddoc'].forEach(function(key) {
            if (requestDef.index[key]) {
              requestDef[key] = requestDef.index[key];
              delete requestDef.index[key];
            }
          });
          if (requestDef.fields) {
            requestDef.index.fields = requestDef.fields;
            delete requestDef.fields;
          }
          if (!requestDef.type) {
            requestDef.type = 'json';
          }
          return requestDef;
        }
        function createIndex(db, requestDef, callback) {
          requestDef = massageCreateIndexRequest(requestDef);
          db.request({
            method: 'POST',
            url: '_index',
            body: requestDef
          }, callback);
        }
        function find(db, requestDef, callback) {
          db.request({
            method: 'POST',
            url: '_find',
            body: requestDef
          }, callback);
        }
        function explain(db, requestDef, callback) {
          db.request({
            method: 'POST',
            url: '_explain',
            body: requestDef
          }, callback);
        }
        function getIndexes(db, callback) {
          db.request({
            method: 'GET',
            url: '_index'
          }, callback);
        }
        function deleteIndex(db, indexDef, callback) {
          var ddoc = indexDef.ddoc;
          var type = indexDef.type || 'json';
          var name = indexDef.name;
          if (!ddoc) {
            return callback(new Error('you must provide an index\'s ddoc'));
          }
          if (!name) {
            return callback(new Error('you must provide an index\'s name'));
          }
          var url = '_index/' + [ddoc, type, name].map(encodeURIComponent).join('/');
          db.request({
            method: 'DELETE',
            url: url
          }, callback);
        }
        function getFieldFromDoc(doc, parsedField) {
          var value = doc;
          for (var i = 0,
              len = parsedField.length; i < len; i++) {
            var key = parsedField[i];
            value = value[key];
            if (!value) {
              break;
            }
          }
          return value;
        }
        function setFieldInDoc(doc, parsedField, value) {
          for (var i = 0,
              len = parsedField.length; i < len - 1; i++) {
            var elem = parsedField[i];
            doc = doc[elem] = {};
          }
          doc[parsedField[len - 1]] = value;
        }
        function compare(left, right) {
          return left < right ? -1 : left > right ? 1 : 0;
        }
        function parseField(fieldName) {
          var fields = [];
          var current = '';
          for (var i = 0,
              len = fieldName.length; i < len; i++) {
            var ch = fieldName[i];
            if (ch === '.') {
              if (i > 0 && fieldName[i - 1] === '\\') {
                current = current.substring(0, current.length - 1) + '.';
              } else {
                fields.push(current);
                current = '';
              }
            } else {
              current += ch;
            }
          }
          fields.push(current);
          return fields;
        }
        var combinationFields = ['$or', '$nor', '$not'];
        function isCombinationalField(field) {
          return combinationFields.indexOf(field) > -1;
        }
        function getKey(obj) {
          return Object.keys(obj)[0];
        }
        function getValue(obj) {
          return obj[getKey(obj)];
        }
        function mergeAndedSelectors(selectors) {
          var res = {};
          selectors.forEach(function(selector) {
            Object.keys(selector).forEach(function(field) {
              var matcher = selector[field];
              if (typeof matcher !== 'object') {
                matcher = {$eq: matcher};
              }
              if (isCombinationalField(field)) {
                if (matcher instanceof Array) {
                  res[field] = matcher.map(function(m) {
                    return mergeAndedSelectors([m]);
                  });
                } else {
                  res[field] = mergeAndedSelectors([matcher]);
                }
              } else {
                var fieldMatchers = res[field] = res[field] || {};
                Object.keys(matcher).forEach(function(operator) {
                  var value = matcher[operator];
                  if (operator === '$gt' || operator === '$gte') {
                    return mergeGtGte(operator, value, fieldMatchers);
                  } else if (operator === '$lt' || operator === '$lte') {
                    return mergeLtLte(operator, value, fieldMatchers);
                  } else if (operator === '$ne') {
                    return mergeNe(value, fieldMatchers);
                  } else if (operator === '$eq') {
                    return mergeEq(value, fieldMatchers);
                  }
                  fieldMatchers[operator] = value;
                });
              }
            });
          });
          return res;
        }
        function mergeGtGte(operator, value, fieldMatchers) {
          if (typeof fieldMatchers.$eq !== 'undefined') {
            return;
          }
          if (typeof fieldMatchers.$gte !== 'undefined') {
            if (operator === '$gte') {
              if (value > fieldMatchers.$gte) {
                fieldMatchers.$gte = value;
              }
            } else {
              if (value >= fieldMatchers.$gte) {
                delete fieldMatchers.$gte;
                fieldMatchers.$gt = value;
              }
            }
          } else if (typeof fieldMatchers.$gt !== 'undefined') {
            if (operator === '$gte') {
              if (value > fieldMatchers.$gt) {
                delete fieldMatchers.$gt;
                fieldMatchers.$gte = value;
              }
            } else {
              if (value > fieldMatchers.$gt) {
                fieldMatchers.$gt = value;
              }
            }
          } else {
            fieldMatchers[operator] = value;
          }
        }
        function mergeLtLte(operator, value, fieldMatchers) {
          if (typeof fieldMatchers.$eq !== 'undefined') {
            return;
          }
          if (typeof fieldMatchers.$lte !== 'undefined') {
            if (operator === '$lte') {
              if (value < fieldMatchers.$lte) {
                fieldMatchers.$lte = value;
              }
            } else {
              if (value <= fieldMatchers.$lte) {
                delete fieldMatchers.$lte;
                fieldMatchers.$lt = value;
              }
            }
          } else if (typeof fieldMatchers.$lt !== 'undefined') {
            if (operator === '$lte') {
              if (value < fieldMatchers.$lt) {
                delete fieldMatchers.$lt;
                fieldMatchers.$lte = value;
              }
            } else {
              if (value < fieldMatchers.$lt) {
                fieldMatchers.$lt = value;
              }
            }
          } else {
            fieldMatchers[operator] = value;
          }
        }
        function mergeNe(value, fieldMatchers) {
          if ('$ne' in fieldMatchers) {
            fieldMatchers.$ne.push(value);
          } else {
            fieldMatchers.$ne = [value];
          }
        }
        function mergeEq(value, fieldMatchers) {
          delete fieldMatchers.$gt;
          delete fieldMatchers.$gte;
          delete fieldMatchers.$lt;
          delete fieldMatchers.$lte;
          delete fieldMatchers.$ne;
          fieldMatchers.$eq = value;
        }
        function massageSelector(input) {
          var result = clone(input);
          var wasAnded = false;
          if ('$and' in result) {
            result = mergeAndedSelectors(result['$and']);
            wasAnded = true;
          }
          ['$or', '$nor'].forEach(function(orOrNor) {
            if (orOrNor in result) {
              result[orOrNor].forEach(function(subSelector) {
                var fields = Object.keys(subSelector);
                for (var i = 0; i < fields.length; i++) {
                  var field = fields[i];
                  var matcher = subSelector[field];
                  if (typeof matcher !== 'object' || matcher === null) {
                    subSelector[field] = {$eq: matcher};
                  }
                }
              });
            }
          });
          if ('$not' in result) {
            result['$not'] = mergeAndedSelectors([result['$not']]);
          }
          var fields = Object.keys(result);
          for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var matcher = result[field];
            if (typeof matcher !== 'object' || matcher === null) {
              matcher = {$eq: matcher};
            } else if ('$ne' in matcher && !wasAnded) {
              matcher.$ne = [matcher.$ne];
            }
            result[field] = matcher;
          }
          return result;
        }
        function pad(str, padWith, upToLength) {
          var padding = '';
          var targetLength = upToLength - str.length;
          while (padding.length < targetLength) {
            padding += padWith;
          }
          return padding;
        }
        function padLeft(str, padWith, upToLength) {
          var padding = pad(str, padWith, upToLength);
          return padding + str;
        }
        var MIN_MAGNITUDE = -324;
        var MAGNITUDE_DIGITS = 3;
        var SEP = '';
        function collate(a, b) {
          if (a === b) {
            return 0;
          }
          a = normalizeKey(a);
          b = normalizeKey(b);
          var ai = collationIndex(a);
          var bi = collationIndex(b);
          if ((ai - bi) !== 0) {
            return ai - bi;
          }
          switch (typeof a) {
            case 'number':
              return a - b;
            case 'boolean':
              return a < b ? -1 : 1;
            case 'string':
              return stringCollate(a, b);
          }
          return Array.isArray(a) ? arrayCollate(a, b) : objectCollate(a, b);
        }
        function normalizeKey(key) {
          switch (typeof key) {
            case 'undefined':
              return null;
            case 'number':
              if (key === Infinity || key === -Infinity || isNaN(key)) {
                return null;
              }
              return key;
            case 'object':
              var origKey = key;
              if (Array.isArray(key)) {
                var len = key.length;
                key = new Array(len);
                for (var i = 0; i < len; i++) {
                  key[i] = normalizeKey(origKey[i]);
                }
              } else if (key instanceof Date) {
                return key.toJSON();
              } else if (key !== null) {
                key = {};
                for (var k in origKey) {
                  if (origKey.hasOwnProperty(k)) {
                    var val = origKey[k];
                    if (typeof val !== 'undefined') {
                      key[k] = normalizeKey(val);
                    }
                  }
                }
              }
          }
          return key;
        }
        function indexify(key) {
          if (key !== null) {
            switch (typeof key) {
              case 'boolean':
                return key ? 1 : 0;
              case 'number':
                return numToIndexableString(key);
              case 'string':
                return key.replace(/\u0002/g, '\u0002\u0002').replace(/\u0001/g, '\u0001\u0002').replace(/\u0000/g, '\u0001\u0001');
              case 'object':
                var isArray = Array.isArray(key);
                var arr = isArray ? key : Object.keys(key);
                var i = -1;
                var len = arr.length;
                var result = '';
                if (isArray) {
                  while (++i < len) {
                    result += toIndexableString(arr[i]);
                  }
                } else {
                  while (++i < len) {
                    var objKey = arr[i];
                    result += toIndexableString(objKey) + toIndexableString(key[objKey]);
                  }
                }
                return result;
            }
          }
          return '';
        }
        function toIndexableString(key) {
          var zero = '\u0000';
          key = normalizeKey(key);
          return collationIndex(key) + SEP + indexify(key) + zero;
        }
        function parseNumber(str, i) {
          var originalIdx = i;
          var num;
          var zero = str[i] === '1';
          if (zero) {
            num = 0;
            i++;
          } else {
            var neg = str[i] === '0';
            i++;
            var numAsString = '';
            var magAsString = str.substring(i, i + MAGNITUDE_DIGITS);
            var magnitude = parseInt(magAsString, 10) + MIN_MAGNITUDE;
            if (neg) {
              magnitude = -magnitude;
            }
            i += MAGNITUDE_DIGITS;
            while (true) {
              var ch = str[i];
              if (ch === '\u0000') {
                break;
              } else {
                numAsString += ch;
              }
              i++;
            }
            numAsString = numAsString.split('.');
            if (numAsString.length === 1) {
              num = parseInt(numAsString, 10);
            } else {
              num = parseFloat(numAsString[0] + '.' + numAsString[1]);
            }
            if (neg) {
              num = num - 10;
            }
            if (magnitude !== 0) {
              num = parseFloat(num + 'e' + magnitude);
            }
          }
          return {
            num: num,
            length: i - originalIdx
          };
        }
        function pop(stack, metaStack) {
          var obj = stack.pop();
          if (metaStack.length) {
            var lastMetaElement = metaStack[metaStack.length - 1];
            if (obj === lastMetaElement.element) {
              metaStack.pop();
              lastMetaElement = metaStack[metaStack.length - 1];
            }
            var element = lastMetaElement.element;
            var lastElementIndex = lastMetaElement.index;
            if (Array.isArray(element)) {
              element.push(obj);
            } else if (lastElementIndex === stack.length - 2) {
              var key = stack.pop();
              element[key] = obj;
            } else {
              stack.push(obj);
            }
          }
        }
        function parseIndexableString(str) {
          var stack = [];
          var metaStack = [];
          var i = 0;
          while (true) {
            var collationIndex = str[i++];
            if (collationIndex === '\u0000') {
              if (stack.length === 1) {
                return stack.pop();
              } else {
                pop(stack, metaStack);
                continue;
              }
            }
            switch (collationIndex) {
              case '1':
                stack.push(null);
                break;
              case '2':
                stack.push(str[i] === '1');
                i++;
                break;
              case '3':
                var parsedNum = parseNumber(str, i);
                stack.push(parsedNum.num);
                i += parsedNum.length;
                break;
              case '4':
                var parsedStr = '';
                while (true) {
                  var ch = str[i];
                  if (ch === '\u0000') {
                    break;
                  }
                  parsedStr += ch;
                  i++;
                }
                parsedStr = parsedStr.replace(/\u0001\u0001/g, '\u0000').replace(/\u0001\u0002/g, '\u0001').replace(/\u0002\u0002/g, '\u0002');
                stack.push(parsedStr);
                break;
              case '5':
                var arrayElement = {
                  element: [],
                  index: stack.length
                };
                stack.push(arrayElement.element);
                metaStack.push(arrayElement);
                break;
              case '6':
                var objElement = {
                  element: {},
                  index: stack.length
                };
                stack.push(objElement.element);
                metaStack.push(objElement);
                break;
              default:
                throw new Error('bad collationIndex or unexpectedly reached end of input: ' + collationIndex);
            }
          }
        }
        function arrayCollate(a, b) {
          var len = Math.min(a.length, b.length);
          for (var i = 0; i < len; i++) {
            var sort = collate(a[i], b[i]);
            if (sort !== 0) {
              return sort;
            }
          }
          return (a.length === b.length) ? 0 : (a.length > b.length) ? 1 : -1;
        }
        function stringCollate(a, b) {
          return (a === b) ? 0 : ((a > b) ? 1 : -1);
        }
        function objectCollate(a, b) {
          var ak = Object.keys(a),
              bk = Object.keys(b);
          var len = Math.min(ak.length, bk.length);
          for (var i = 0; i < len; i++) {
            var sort = collate(ak[i], bk[i]);
            if (sort !== 0) {
              return sort;
            }
            sort = collate(a[ak[i]], b[bk[i]]);
            if (sort !== 0) {
              return sort;
            }
          }
          return (ak.length === bk.length) ? 0 : (ak.length > bk.length) ? 1 : -1;
        }
        function collationIndex(x) {
          var id = ['boolean', 'number', 'string', 'object'];
          var idx = id.indexOf(typeof x);
          if (~idx) {
            if (x === null) {
              return 1;
            }
            if (Array.isArray(x)) {
              return 5;
            }
            return idx < 3 ? (idx + 2) : (idx + 3);
          }
          if (Array.isArray(x)) {
            return 5;
          }
        }
        function numToIndexableString(num) {
          if (num === 0) {
            return '1';
          }
          var expFormat = num.toExponential().split(/e\+?/);
          var magnitude = parseInt(expFormat[1], 10);
          var neg = num < 0;
          var result = neg ? '0' : '2';
          var magForComparison = ((neg ? -magnitude : magnitude) - MIN_MAGNITUDE);
          var magString = padLeft((magForComparison).toString(), '0', MAGNITUDE_DIGITS);
          result += SEP + magString;
          var factor = Math.abs(parseFloat(expFormat[0]));
          if (neg) {
            factor = 10 - factor;
          }
          var factorStr = factor.toFixed(20);
          factorStr = factorStr.replace(/\.?0+$/, '');
          result += SEP + factorStr;
          return result;
        }
        function createFieldSorter(sort) {
          function getFieldValuesAsArray(doc) {
            return sort.map(function(sorting) {
              var fieldName = getKey(sorting);
              var parsedField = parseField(fieldName);
              var docFieldValue = getFieldFromDoc(doc, parsedField);
              return docFieldValue;
            });
          }
          return function(aRow, bRow) {
            var aFieldValues = getFieldValuesAsArray(aRow.doc);
            var bFieldValues = getFieldValuesAsArray(bRow.doc);
            var collation = collate(aFieldValues, bFieldValues);
            if (collation !== 0) {
              return collation;
            }
            return compare(aRow.doc._id, bRow.doc._id);
          };
        }
        function filterInMemoryFields(rows, requestDef, inMemoryFields) {
          rows = rows.filter(function(row) {
            return rowFilter(row.doc, requestDef.selector, inMemoryFields);
          });
          if (requestDef.sort) {
            var fieldSorter = createFieldSorter(requestDef.sort);
            rows = rows.sort(fieldSorter);
            if (typeof requestDef.sort[0] !== 'string' && getValue(requestDef.sort[0]) === 'desc') {
              rows = rows.reverse();
            }
          }
          if ('limit' in requestDef || 'skip' in requestDef) {
            var skip = requestDef.skip || 0;
            var limit = ('limit' in requestDef ? requestDef.limit : rows.length) + skip;
            rows = rows.slice(skip, limit);
          }
          return rows;
        }
        function rowFilter(doc, selector, inMemoryFields) {
          return inMemoryFields.every(function(field) {
            var matcher = selector[field];
            var parsedField = parseField(field);
            var docFieldValue = getFieldFromDoc(doc, parsedField);
            if (isCombinationalField(field)) {
              return matchCominationalSelector(field, matcher, doc);
            }
            return matchSelector(matcher, doc, parsedField, docFieldValue);
          });
        }
        function matchSelector(matcher, doc, parsedField, docFieldValue) {
          if (!matcher) {
            return true;
          }
          return Object.keys(matcher).every(function(userOperator) {
            var userValue = matcher[userOperator];
            return match(userOperator, doc, userValue, parsedField, docFieldValue);
          });
        }
        function matchCominationalSelector(field, matcher, doc) {
          if (field === '$or') {
            return matcher.some(function(orMatchers) {
              return rowFilter(doc, orMatchers, Object.keys(orMatchers));
            });
          }
          if (field === '$not') {
            return !rowFilter(doc, matcher, Object.keys(matcher));
          }
          return !matcher.find(function(orMatchers) {
            return rowFilter(doc, orMatchers, Object.keys(orMatchers));
          });
        }
        function match(userOperator, doc, userValue, parsedField, docFieldValue) {
          if (!matchers[userOperator]) {
            throw new Error('unknown operator "' + userOperator + '" - should be one of $eq, $lte, $lt, $gt, $gte, $exists, $ne, $in, ' + '$nin, $size, $mod, $regex, $elemMatch, $type, $allMatch or $all');
          }
          return matchers[userOperator](doc, userValue, parsedField, docFieldValue);
        }
        function fieldExists(docFieldValue) {
          return typeof docFieldValue !== 'undefined' && docFieldValue !== null;
        }
        function fieldIsNotUndefined(docFieldValue) {
          return typeof docFieldValue !== 'undefined';
        }
        function modField(docFieldValue, userValue) {
          var divisor = userValue[0];
          var mod = userValue[1];
          if (divisor === 0) {
            throw new Error('Bad divisor, cannot divide by zero');
          }
          if (parseInt(divisor, 10) !== divisor) {
            throw new Error('Divisor is not an integer');
          }
          if (parseInt(mod, 10) !== mod) {
            throw new Error('Modulus is not an integer');
          }
          if (parseInt(docFieldValue, 10) !== docFieldValue) {
            return false;
          }
          return docFieldValue % divisor === mod;
        }
        function arrayContainsValue(docFieldValue, userValue) {
          return userValue.some(function(val) {
            if (docFieldValue instanceof Array) {
              return docFieldValue.indexOf(val) > -1;
            }
            return docFieldValue === val;
          });
        }
        function arrayContainsAllValues(docFieldValue, userValue) {
          return userValue.every(function(val) {
            return docFieldValue.indexOf(val) > -1;
          });
        }
        function arraySize(docFieldValue, userValue) {
          return docFieldValue.length === userValue;
        }
        function regexMatch(docFieldValue, userValue) {
          var re = new RegExp(userValue);
          return re.test(docFieldValue);
        }
        function typeMatch(docFieldValue, userValue) {
          switch (userValue) {
            case 'null':
              return docFieldValue === null;
            case 'boolean':
              return typeof(docFieldValue) === 'boolean';
            case 'number':
              return typeof(docFieldValue) === 'number';
            case 'string':
              return typeof(docFieldValue) === 'string';
            case 'array':
              return docFieldValue instanceof Array;
            case 'object':
              return ({}).toString.call(docFieldValue) === '[object Object]';
          }
          throw new Error(userValue + ' not supported as a type.' + 'Please use one of object, string, array, number, boolean or null.');
        }
        var matchers = {
          '$elemMatch': function(doc, userValue, parsedField, docFieldValue) {
            if (!Array.isArray(docFieldValue)) {
              return false;
            }
            if (docFieldValue.length === 0) {
              return false;
            }
            if (typeof docFieldValue[0] === 'object') {
              return docFieldValue.some(function(val) {
                return rowFilter(val, userValue, Object.keys(userValue));
              });
            }
            return docFieldValue.some(function(val) {
              return matchSelector(userValue, doc, parsedField, val);
            });
          },
          '$allMatch': function(doc, userValue, parsedField, docFieldValue) {
            if (!Array.isArray(docFieldValue)) {
              return false;
            }
            if (docFieldValue.length === 0) {
              return false;
            }
            if (typeof docFieldValue[0] === 'object') {
              return docFieldValue.every(function(val) {
                return rowFilter(val, userValue, Object.keys(userValue));
              });
            }
            return docFieldValue.every(function(val) {
              return matchSelector(userValue, doc, parsedField, val);
            });
          },
          '$eq': function(doc, userValue, parsedField, docFieldValue) {
            return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) === 0;
          },
          '$gte': function(doc, userValue, parsedField, docFieldValue) {
            return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) >= 0;
          },
          '$gt': function(doc, userValue, parsedField, docFieldValue) {
            return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) > 0;
          },
          '$lte': function(doc, userValue, parsedField, docFieldValue) {
            return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) <= 0;
          },
          '$lt': function(doc, userValue, parsedField, docFieldValue) {
            return fieldIsNotUndefined(docFieldValue) && collate(docFieldValue, userValue) < 0;
          },
          '$exists': function(doc, userValue, parsedField, docFieldValue) {
            if (userValue) {
              return fieldIsNotUndefined(docFieldValue);
            }
            return !fieldIsNotUndefined(docFieldValue);
          },
          '$mod': function(doc, userValue, parsedField, docFieldValue) {
            return fieldExists(docFieldValue) && modField(docFieldValue, userValue);
          },
          '$ne': function(doc, userValue, parsedField, docFieldValue) {
            return userValue.every(function(neValue) {
              return collate(docFieldValue, neValue) !== 0;
            });
          },
          '$in': function(doc, userValue, parsedField, docFieldValue) {
            return fieldExists(docFieldValue) && arrayContainsValue(docFieldValue, userValue);
          },
          '$nin': function(doc, userValue, parsedField, docFieldValue) {
            return fieldExists(docFieldValue) && !arrayContainsValue(docFieldValue, userValue);
          },
          '$size': function(doc, userValue, parsedField, docFieldValue) {
            return fieldExists(docFieldValue) && arraySize(docFieldValue, userValue);
          },
          '$all': function(doc, userValue, parsedField, docFieldValue) {
            return Array.isArray(docFieldValue) && arrayContainsAllValues(docFieldValue, userValue);
          },
          '$regex': function(doc, userValue, parsedField, docFieldValue) {
            return fieldExists(docFieldValue) && regexMatch(docFieldValue, userValue);
          },
          '$type': function(doc, userValue, parsedField, docFieldValue) {
            return typeMatch(docFieldValue, userValue);
          }
        };
        function getArguments$1(fun) {
          return function() {
            var len = arguments.length;
            var args = new Array(len);
            var i = -1;
            while (++i < len) {
              args[i] = arguments[i];
            }
            return fun.call(this, args);
          };
        }
        function callbackify(fun) {
          return getArguments$1(function(args) {
            var cb = args.pop();
            var promise = fun.apply(this, args);
            promisedCallback(promise, cb);
            return promise;
          });
        }
        function promisedCallback(promise, callback) {
          promise.then(function(res) {
            process.nextTick(function() {
              callback(null, res);
            });
          }, function(reason) {
            process.nextTick(function() {
              callback(reason);
            });
          });
          return promise;
        }
        var flatten$2 = getArguments$1(function(args) {
          var res = [];
          for (var i = 0,
              len = args.length; i < len; i++) {
            var subArr = args[i];
            if (Array.isArray(subArr)) {
              res = res.concat(flatten$2.apply(null, subArr));
            } else {
              res.push(subArr);
            }
          }
          return res;
        });
        function mergeObjects(arr) {
          var res = {};
          for (var i = 0,
              len = arr.length; i < len; i++) {
            res = $inject_Object_assign(res, arr[i]);
          }
          return res;
        }
        function pick$2(obj, arr) {
          var res = {};
          for (var i = 0,
              len = arr.length; i < len; i++) {
            var parsedField = parseField(arr[i]);
            var value = getFieldFromDoc(obj, parsedField);
            if (typeof value !== 'undefined') {
              setFieldInDoc(res, parsedField, value);
            }
          }
          return res;
        }
        function oneArrayIsSubArrayOfOther(left, right) {
          for (var i = 0,
              len = Math.min(left.length, right.length); i < len; i++) {
            if (left[i] !== right[i]) {
              return false;
            }
          }
          return true;
        }
        function oneArrayIsStrictSubArrayOfOther(left, right) {
          if (left.length > right.length) {
            return false;
          }
          return oneArrayIsSubArrayOfOther(left, right);
        }
        function oneSetIsSubArrayOfOther(left, right) {
          left = left.slice();
          for (var i = 0,
              len = right.length; i < len; i++) {
            var field = right[i];
            if (!left.length) {
              break;
            }
            var leftIdx = left.indexOf(field);
            if (leftIdx === -1) {
              return false;
            } else {
              left.splice(leftIdx, 1);
            }
          }
          return true;
        }
        function arrayToObject(arr) {
          var res = {};
          for (var i = 0,
              len = arr.length; i < len; i++) {
            res[arr[i]] = true;
          }
          return res;
        }
        function max(arr, fun) {
          var max = null;
          var maxScore = -1;
          for (var i = 0,
              len = arr.length; i < len; i++) {
            var element = arr[i];
            var score = fun(element);
            if (score > maxScore) {
              maxScore = score;
              max = element;
            }
          }
          return max;
        }
        function arrayEquals(arr1, arr2) {
          if (arr1.length !== arr2.length) {
            return false;
          }
          for (var i = 0,
              len = arr1.length; i < len; i++) {
            if (arr1[i] !== arr2[i]) {
              return false;
            }
          }
          return true;
        }
        function uniq(arr) {
          var obj = {};
          for (var i = 0; i < arr.length; i++) {
            obj['$' + arr[i]] = true;
          }
          return Object.keys(obj).map(function(key) {
            return key.substring(1);
          });
        }
        var thisAtob = function(str) {
          return atob(str);
        };
        function createBlob(parts, properties) {
          parts = parts || [];
          properties = properties || {};
          try {
            return new Blob(parts, properties);
          } catch (e) {
            if (e.name !== "TypeError") {
              throw e;
            }
            var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
            var builder = new Builder();
            for (var i = 0; i < parts.length; i += 1) {
              builder.append(parts[i]);
            }
            return builder.getBlob(properties.type);
          }
        }
        function binaryStringToArrayBuffer(bin) {
          var length = bin.length;
          var buf = new ArrayBuffer(length);
          var arr = new Uint8Array(buf);
          for (var i = 0; i < length; i++) {
            arr[i] = bin.charCodeAt(i);
          }
          return buf;
        }
        function binStringToBluffer(binString, type) {
          return createBlob([binaryStringToArrayBuffer(binString)], {type: type});
        }
        function b64ToBluffer(b64, type) {
          return binStringToBluffer(thisAtob(b64), type);
        }
        function TaskQueue() {
          this.promise = new PouchPromise$1(function(fulfill) {
            fulfill();
          });
        }
        TaskQueue.prototype.add = function(promiseFactory) {
          this.promise = this.promise["catch"](function() {}).then(function() {
            return promiseFactory();
          });
          return this.promise;
        };
        TaskQueue.prototype.finish = function() {
          return this.promise;
        };
        function stringMd5(string) {
          return Md5.hash(string);
        }
        function stringify(input) {
          if (!input) {
            return 'undefined';
          }
          switch (typeof input) {
            case 'function':
              return input.toString();
            case 'string':
              return input.toString();
            default:
              return JSON.stringify(input);
          }
        }
        function createViewSignature(mapFun, reduceFun) {
          return stringify(mapFun) + stringify(reduceFun) + 'undefined';
        }
        function createView(sourceDB, viewName, mapFun, reduceFun, temporary, localDocName) {
          var viewSignature = createViewSignature(mapFun, reduceFun);
          var cachedViews;
          if (!temporary) {
            cachedViews = sourceDB._cachedViews = sourceDB._cachedViews || {};
            if (cachedViews[viewSignature]) {
              return cachedViews[viewSignature];
            }
          }
          var promiseForView = sourceDB.info().then(function(info) {
            var depDbName = info.db_name + '-mrview-' + (temporary ? 'temp' : stringMd5(viewSignature));
            function diffFunction(doc) {
              doc.views = doc.views || {};
              var fullViewName = viewName;
              if (fullViewName.indexOf('/') === -1) {
                fullViewName = viewName + '/' + viewName;
              }
              var depDbs = doc.views[fullViewName] = doc.views[fullViewName] || {};
              if (depDbs[depDbName]) {
                return;
              }
              depDbs[depDbName] = true;
              return doc;
            }
            return upsert(sourceDB, '_local/' + localDocName, diffFunction).then(function() {
              return sourceDB.registerDependentDatabase(depDbName).then(function(res) {
                var db = res.db;
                db.auto_compaction = true;
                var view = {
                  name: depDbName,
                  db: db,
                  sourceDB: sourceDB,
                  adapter: sourceDB.adapter,
                  mapFun: mapFun,
                  reduceFun: reduceFun
                };
                return view.db.get('_local/lastSeq')["catch"](function(err) {
                  if (err.status !== 404) {
                    throw err;
                  }
                }).then(function(lastSeqDoc) {
                  view.seq = lastSeqDoc ? lastSeqDoc.seq : 0;
                  if (cachedViews) {
                    view.db.once('destroyed', function() {
                      delete cachedViews[viewSignature];
                    });
                  }
                  return view;
                });
              });
            });
          });
          if (cachedViews) {
            cachedViews[viewSignature] = promiseForView;
          }
          return promiseForView;
        }
        function QueryParseError(message) {
          this.status = 400;
          this.name = 'query_parse_error';
          this.message = message;
          this.error = true;
          try {
            Error.captureStackTrace(this, QueryParseError);
          } catch (e) {}
        }
        inherits(QueryParseError, Error);
        function NotFoundError(message) {
          this.status = 404;
          this.name = 'not_found';
          this.message = message;
          this.error = true;
          try {
            Error.captureStackTrace(this, NotFoundError);
          } catch (e) {}
        }
        inherits(NotFoundError, Error);
        function BuiltInError(message) {
          this.status = 500;
          this.name = 'invalid_value';
          this.message = message;
          this.error = true;
          try {
            Error.captureStackTrace(this, BuiltInError);
          } catch (e) {}
        }
        inherits(BuiltInError, Error);
        function promisedCallback$1(promise, callback) {
          if (callback) {
            promise.then(function(res) {
              nextTick(function() {
                callback(null, res);
              });
            }, function(reason) {
              nextTick(function() {
                callback(reason);
              });
            });
          }
          return promise;
        }
        function callbackify$1(fun) {
          return getArguments(function(args) {
            var cb = args.pop();
            var promise = fun.apply(this, args);
            if (typeof cb === 'function') {
              promisedCallback$1(promise, cb);
            }
            return promise;
          });
        }
        function fin(promise, finalPromiseFactory) {
          return promise.then(function(res) {
            return finalPromiseFactory().then(function() {
              return res;
            });
          }, function(reason) {
            return finalPromiseFactory().then(function() {
              throw reason;
            });
          });
        }
        function sequentialize(queue, promiseFactory) {
          return function() {
            var args = arguments;
            var that = this;
            return queue.add(function() {
              return promiseFactory.apply(that, args);
            });
          };
        }
        function uniq$1(arr) {
          var theSet = new ExportedSet(arr);
          var result = new Array(theSet.size);
          var index = -1;
          theSet.forEach(function(value) {
            result[++index] = value;
          });
          return result;
        }
        function mapToKeysArray(map) {
          var result = new Array(map.size);
          var index = -1;
          map.forEach(function(value, key) {
            result[++index] = key;
          });
          return result;
        }
        var persistentQueues = {};
        var tempViewQueue = new TaskQueue();
        var CHANGES_BATCH_SIZE = 50;
        function parseViewName(name) {
          return name.indexOf('/') === -1 ? [name, name] : name.split('/');
        }
        function isGenOne(changes) {
          return changes.length === 1 && /^1-/.test(changes[0].rev);
        }
        function emitError(db, e) {
          try {
            db.emit('error', e);
          } catch (err) {
            guardedConsole('error', 'The user\'s map/reduce function threw an uncaught error.\n' + 'You can debug this error by doing:\n' + 'myDatabase.on(\'error\', function (err) { debugger; });\n' + 'Please double-check your map/reduce function.');
            guardedConsole('error', e);
          }
        }
        function createAbstractMapReduce$1(localDocName, mapper, reducer, ddocValidator) {
          function tryMap(db, fun, doc) {
            try {
              fun(doc);
            } catch (e) {
              emitError(db, e);
            }
          }
          function tryReduce(db, fun, keys, values, rereduce) {
            try {
              return {output: fun(keys, values, rereduce)};
            } catch (e) {
              emitError(db, e);
              return {error: e};
            }
          }
          function sortByKeyThenValue(x, y) {
            var keyCompare = collate(x.key, y.key);
            return keyCompare !== 0 ? keyCompare : collate(x.value, y.value);
          }
          function sliceResults(results, limit, skip) {
            skip = skip || 0;
            if (typeof limit === 'number') {
              return results.slice(skip, limit + skip);
            } else if (skip > 0) {
              return results.slice(skip);
            }
            return results;
          }
          function rowToDocId(row) {
            var val = row.value;
            var docId = (val && typeof val === 'object' && val._id) || row.id;
            return docId;
          }
          function readAttachmentsAsBlobOrBuffer(res) {
            res.rows.forEach(function(row) {
              var atts = row.doc && row.doc._attachments;
              if (!atts) {
                return;
              }
              Object.keys(atts).forEach(function(filename) {
                var att = atts[filename];
                atts[filename].data = b64ToBluffer(att.data, att.content_type);
              });
            });
          }
          function postprocessAttachments(opts) {
            return function(res) {
              if (opts.include_docs && opts.attachments && opts.binary) {
                readAttachmentsAsBlobOrBuffer(res);
              }
              return res;
            };
          }
          function addHttpParam(paramName, opts, params, asJson) {
            var val = opts[paramName];
            if (typeof val !== 'undefined') {
              if (asJson) {
                val = encodeURIComponent(JSON.stringify(val));
              }
              params.push(paramName + '=' + val);
            }
          }
          function coerceInteger(integerCandidate) {
            if (typeof integerCandidate !== 'undefined') {
              var asNumber = Number(integerCandidate);
              if (!isNaN(asNumber) && asNumber === parseInt(integerCandidate, 10)) {
                return asNumber;
              } else {
                return integerCandidate;
              }
            }
          }
          function coerceOptions(opts) {
            opts.group_level = coerceInteger(opts.group_level);
            opts.limit = coerceInteger(opts.limit);
            opts.skip = coerceInteger(opts.skip);
            return opts;
          }
          function checkPositiveInteger(number) {
            if (number) {
              if (typeof number !== 'number') {
                return new QueryParseError('Invalid value for integer: "' + number + '"');
              }
              if (number < 0) {
                return new QueryParseError('Invalid value for positive integer: ' + '"' + number + '"');
              }
            }
          }
          function checkQueryParseError(options, fun) {
            var startkeyName = options.descending ? 'endkey' : 'startkey';
            var endkeyName = options.descending ? 'startkey' : 'endkey';
            if (typeof options[startkeyName] !== 'undefined' && typeof options[endkeyName] !== 'undefined' && collate(options[startkeyName], options[endkeyName]) > 0) {
              throw new QueryParseError('No rows can match your key range, ' + 'reverse your start_key and end_key or set {descending : true}');
            } else if (fun.reduce && options.reduce !== false) {
              if (options.include_docs) {
                throw new QueryParseError('{include_docs:true} is invalid for reduce');
              } else if (options.keys && options.keys.length > 1 && !options.group && !options.group_level) {
                throw new QueryParseError('Multi-key fetches for reduce views must use ' + '{group: true}');
              }
            }
            ['group_level', 'limit', 'skip'].forEach(function(optionName) {
              var error = checkPositiveInteger(options[optionName]);
              if (error) {
                throw error;
              }
            });
          }
          function httpQuery(db, fun, opts) {
            var params = [];
            var body;
            var method = 'GET';
            addHttpParam('reduce', opts, params);
            addHttpParam('include_docs', opts, params);
            addHttpParam('attachments', opts, params);
            addHttpParam('limit', opts, params);
            addHttpParam('descending', opts, params);
            addHttpParam('group', opts, params);
            addHttpParam('group_level', opts, params);
            addHttpParam('skip', opts, params);
            addHttpParam('stale', opts, params);
            addHttpParam('conflicts', opts, params);
            addHttpParam('startkey', opts, params, true);
            addHttpParam('start_key', opts, params, true);
            addHttpParam('endkey', opts, params, true);
            addHttpParam('end_key', opts, params, true);
            addHttpParam('inclusive_end', opts, params);
            addHttpParam('key', opts, params, true);
            params = params.join('&');
            params = params === '' ? '' : '?' + params;
            if (typeof opts.keys !== 'undefined') {
              var MAX_URL_LENGTH = 2000;
              var keysAsString = 'keys=' + encodeURIComponent(JSON.stringify(opts.keys));
              if (keysAsString.length + params.length + 1 <= MAX_URL_LENGTH) {
                params += (params[0] === '?' ? '&' : '?') + keysAsString;
              } else {
                method = 'POST';
                if (typeof fun === 'string') {
                  body = {keys: opts.keys};
                } else {
                  fun.keys = opts.keys;
                }
              }
            }
            if (typeof fun === 'string') {
              var parts = parseViewName(fun);
              return db.request({
                method: method,
                url: '_design/' + parts[0] + '/_view/' + parts[1] + params,
                body: body
              }).then(function(result) {
                result.rows.forEach(function(row) {
                  if (row.value && row.value.error && row.value.error === "builtin_reduce_error") {
                    throw new Error(row.reason);
                  }
                });
                return result;
              }).then(postprocessAttachments(opts));
            }
            body = body || {};
            Object.keys(fun).forEach(function(key) {
              if (Array.isArray(fun[key])) {
                body[key] = fun[key];
              } else {
                body[key] = fun[key].toString();
              }
            });
            return db.request({
              method: 'POST',
              url: '_temp_view' + params,
              body: body
            }).then(postprocessAttachments(opts));
          }
          function customQuery(db, fun, opts) {
            return new PouchPromise$1(function(resolve, reject) {
              db._query(fun, opts, function(err, res) {
                if (err) {
                  return reject(err);
                }
                resolve(res);
              });
            });
          }
          function customViewCleanup(db) {
            return new PouchPromise$1(function(resolve, reject) {
              db._viewCleanup(function(err, res) {
                if (err) {
                  return reject(err);
                }
                resolve(res);
              });
            });
          }
          function defaultsTo(value) {
            return function(reason) {
              if (reason.status === 404) {
                return value;
              } else {
                throw reason;
              }
            };
          }
          function getDocsToPersist(docId, view, docIdsToChangesAndEmits) {
            var metaDocId = '_local/doc_' + docId;
            var defaultMetaDoc = {
              _id: metaDocId,
              keys: []
            };
            var docData = docIdsToChangesAndEmits.get(docId);
            var indexableKeysToKeyValues = docData[0];
            var changes = docData[1];
            function getMetaDoc() {
              if (isGenOne(changes)) {
                return PouchPromise$1.resolve(defaultMetaDoc);
              }
              return view.db.get(metaDocId)["catch"](defaultsTo(defaultMetaDoc));
            }
            function getKeyValueDocs(metaDoc) {
              if (!metaDoc.keys.length) {
                return PouchPromise$1.resolve({rows: []});
              }
              return view.db.allDocs({
                keys: metaDoc.keys,
                include_docs: true
              });
            }
            function processKeyValueDocs(metaDoc, kvDocsRes) {
              var kvDocs = [];
              var oldKeys = new ExportedSet();
              for (var i = 0,
                  len = kvDocsRes.rows.length; i < len; i++) {
                var row = kvDocsRes.rows[i];
                var doc = row.doc;
                if (!doc) {
                  continue;
                }
                kvDocs.push(doc);
                oldKeys.add(doc._id);
                doc._deleted = !indexableKeysToKeyValues.has(doc._id);
                if (!doc._deleted) {
                  var keyValue = indexableKeysToKeyValues.get(doc._id);
                  if ('value' in keyValue) {
                    doc.value = keyValue.value;
                  }
                }
              }
              var newKeys = mapToKeysArray(indexableKeysToKeyValues);
              newKeys.forEach(function(key) {
                if (!oldKeys.has(key)) {
                  var kvDoc = {_id: key};
                  var keyValue = indexableKeysToKeyValues.get(key);
                  if ('value' in keyValue) {
                    kvDoc.value = keyValue.value;
                  }
                  kvDocs.push(kvDoc);
                }
              });
              metaDoc.keys = uniq$1(newKeys.concat(metaDoc.keys));
              kvDocs.push(metaDoc);
              return kvDocs;
            }
            return getMetaDoc().then(function(metaDoc) {
              return getKeyValueDocs(metaDoc).then(function(kvDocsRes) {
                return processKeyValueDocs(metaDoc, kvDocsRes);
              });
            });
          }
          function saveKeyValues(view, docIdsToChangesAndEmits, seq) {
            var seqDocId = '_local/lastSeq';
            return view.db.get(seqDocId)["catch"](defaultsTo({
              _id: seqDocId,
              seq: 0
            })).then(function(lastSeqDoc) {
              var docIds = mapToKeysArray(docIdsToChangesAndEmits);
              return PouchPromise$1.all(docIds.map(function(docId) {
                return getDocsToPersist(docId, view, docIdsToChangesAndEmits);
              })).then(function(listOfDocsToPersist) {
                var docsToPersist = flatten(listOfDocsToPersist);
                lastSeqDoc.seq = seq;
                docsToPersist.push(lastSeqDoc);
                return view.db.bulkDocs({docs: docsToPersist});
              });
            });
          }
          function getQueue(view) {
            var viewName = typeof view === 'string' ? view : view.name;
            var queue = persistentQueues[viewName];
            if (!queue) {
              queue = persistentQueues[viewName] = new TaskQueue();
            }
            return queue;
          }
          function updateView(view) {
            return sequentialize(getQueue(view), function() {
              return updateViewInQueue(view);
            })();
          }
          function updateViewInQueue(view) {
            var mapResults;
            var doc;
            function emit(key, value) {
              var output = {
                id: doc._id,
                key: normalizeKey(key)
              };
              if (typeof value !== 'undefined' && value !== null) {
                output.value = normalizeKey(value);
              }
              mapResults.push(output);
            }
            var mapFun = mapper(view.mapFun, emit);
            var currentSeq = view.seq || 0;
            function processChange(docIdsToChangesAndEmits, seq) {
              return function() {
                return saveKeyValues(view, docIdsToChangesAndEmits, seq);
              };
            }
            var queue = new TaskQueue();
            function processNextBatch() {
              return view.sourceDB.changes({
                conflicts: true,
                include_docs: true,
                style: 'all_docs',
                since: currentSeq,
                limit: CHANGES_BATCH_SIZE
              }).then(processBatch);
            }
            function processBatch(response) {
              var results = response.results;
              if (!results.length) {
                return;
              }
              var docIdsToChangesAndEmits = createDocIdsToChangesAndEmits(results);
              queue.add(processChange(docIdsToChangesAndEmits, currentSeq));
              if (results.length < CHANGES_BATCH_SIZE) {
                return;
              }
              return processNextBatch();
            }
            function createDocIdsToChangesAndEmits(results) {
              var docIdsToChangesAndEmits = new ExportedMap();
              for (var i = 0,
                  len = results.length; i < len; i++) {
                var change = results[i];
                if (change.doc._id[0] !== '_') {
                  mapResults = [];
                  doc = change.doc;
                  if (!doc._deleted) {
                    tryMap(view.sourceDB, mapFun, doc);
                  }
                  mapResults.sort(sortByKeyThenValue);
                  var indexableKeysToKeyValues = createIndexableKeysToKeyValues(mapResults);
                  docIdsToChangesAndEmits.set(change.doc._id, [indexableKeysToKeyValues, change.changes]);
                }
                currentSeq = change.seq;
              }
              return docIdsToChangesAndEmits;
            }
            function createIndexableKeysToKeyValues(mapResults) {
              var indexableKeysToKeyValues = new ExportedMap();
              var lastKey;
              for (var i = 0,
                  len = mapResults.length; i < len; i++) {
                var emittedKeyValue = mapResults[i];
                var complexKey = [emittedKeyValue.key, emittedKeyValue.id];
                if (i > 0 && collate(emittedKeyValue.key, lastKey) === 0) {
                  complexKey.push(i);
                }
                indexableKeysToKeyValues.set(toIndexableString(complexKey), emittedKeyValue);
                lastKey = emittedKeyValue.key;
              }
              return indexableKeysToKeyValues;
            }
            return processNextBatch().then(function() {
              return queue.finish();
            }).then(function() {
              view.seq = currentSeq;
            });
          }
          function reduceView(view, results, options) {
            if (options.group_level === 0) {
              delete options.group_level;
            }
            var shouldGroup = options.group || options.group_level;
            var reduceFun = reducer(view.reduceFun);
            var groups = [];
            var lvl = isNaN(options.group_level) ? Number.POSITIVE_INFINITY : options.group_level;
            results.forEach(function(e) {
              var last = groups[groups.length - 1];
              var groupKey = shouldGroup ? e.key : null;
              if (shouldGroup && Array.isArray(groupKey)) {
                groupKey = groupKey.slice(0, lvl);
              }
              if (last && collate(last.groupKey, groupKey) === 0) {
                last.keys.push([e.key, e.id]);
                last.values.push(e.value);
                return;
              }
              groups.push({
                keys: [[e.key, e.id]],
                values: [e.value],
                groupKey: groupKey
              });
            });
            results = [];
            for (var i = 0,
                len = groups.length; i < len; i++) {
              var e = groups[i];
              var reduceTry = tryReduce(view.sourceDB, reduceFun, e.keys, e.values, false);
              if (reduceTry.error && reduceTry.error instanceof BuiltInError) {
                throw reduceTry.error;
              }
              results.push({
                value: reduceTry.error ? null : reduceTry.output,
                key: e.groupKey
              });
            }
            return {rows: sliceResults(results, options.limit, options.skip)};
          }
          function queryView(view, opts) {
            return sequentialize(getQueue(view), function() {
              return queryViewInQueue(view, opts);
            })();
          }
          function queryViewInQueue(view, opts) {
            var totalRows;
            var shouldReduce = view.reduceFun && opts.reduce !== false;
            var skip = opts.skip || 0;
            if (typeof opts.keys !== 'undefined' && !opts.keys.length) {
              opts.limit = 0;
              delete opts.keys;
            }
            function fetchFromView(viewOpts) {
              viewOpts.include_docs = true;
              return view.db.allDocs(viewOpts).then(function(res) {
                totalRows = res.total_rows;
                return res.rows.map(function(result) {
                  if ('value' in result.doc && typeof result.doc.value === 'object' && result.doc.value !== null) {
                    var keys = Object.keys(result.doc.value).sort();
                    var expectedKeys = ['id', 'key', 'value'];
                    if (!(keys < expectedKeys || keys > expectedKeys)) {
                      return result.doc.value;
                    }
                  }
                  var parsedKeyAndDocId = parseIndexableString(result.doc._id);
                  return {
                    key: parsedKeyAndDocId[0],
                    id: parsedKeyAndDocId[1],
                    value: ('value' in result.doc ? result.doc.value : null)
                  };
                });
              });
            }
            function onMapResultsReady(rows) {
              var finalResults;
              if (shouldReduce) {
                finalResults = reduceView(view, rows, opts);
              } else {
                finalResults = {
                  total_rows: totalRows,
                  offset: skip,
                  rows: rows
                };
              }
              if (opts.include_docs) {
                var docIds = uniq$1(rows.map(rowToDocId));
                return view.sourceDB.allDocs({
                  keys: docIds,
                  include_docs: true,
                  conflicts: opts.conflicts,
                  attachments: opts.attachments,
                  binary: opts.binary
                }).then(function(allDocsRes) {
                  var docIdsToDocs = new ExportedMap();
                  allDocsRes.rows.forEach(function(row) {
                    docIdsToDocs.set(row.id, row.doc);
                  });
                  rows.forEach(function(row) {
                    var docId = rowToDocId(row);
                    var doc = docIdsToDocs.get(docId);
                    if (doc) {
                      row.doc = doc;
                    }
                  });
                  return finalResults;
                });
              } else {
                return finalResults;
              }
            }
            if (typeof opts.keys !== 'undefined') {
              var keys = opts.keys;
              var fetchPromises = keys.map(function(key) {
                var viewOpts = {
                  startkey: toIndexableString([key]),
                  endkey: toIndexableString([key, {}])
                };
                return fetchFromView(viewOpts);
              });
              return PouchPromise$1.all(fetchPromises).then(flatten).then(onMapResultsReady);
            } else {
              var viewOpts = {descending: opts.descending};
              var startkey;
              var endkey;
              if ('start_key' in opts) {
                startkey = opts.start_key;
              }
              if ('startkey' in opts) {
                startkey = opts.startkey;
              }
              if ('end_key' in opts) {
                endkey = opts.end_key;
              }
              if ('endkey' in opts) {
                endkey = opts.endkey;
              }
              if (typeof startkey !== 'undefined') {
                viewOpts.startkey = opts.descending ? toIndexableString([startkey, {}]) : toIndexableString([startkey]);
              }
              if (typeof endkey !== 'undefined') {
                var inclusiveEnd = opts.inclusive_end !== false;
                if (opts.descending) {
                  inclusiveEnd = !inclusiveEnd;
                }
                viewOpts.endkey = toIndexableString(inclusiveEnd ? [endkey, {}] : [endkey]);
              }
              if (typeof opts.key !== 'undefined') {
                var keyStart = toIndexableString([opts.key]);
                var keyEnd = toIndexableString([opts.key, {}]);
                if (viewOpts.descending) {
                  viewOpts.endkey = keyStart;
                  viewOpts.startkey = keyEnd;
                } else {
                  viewOpts.startkey = keyStart;
                  viewOpts.endkey = keyEnd;
                }
              }
              if (!shouldReduce) {
                if (typeof opts.limit === 'number') {
                  viewOpts.limit = opts.limit;
                }
                viewOpts.skip = skip;
              }
              return fetchFromView(viewOpts).then(onMapResultsReady);
            }
          }
          function httpViewCleanup(db) {
            return db.request({
              method: 'POST',
              url: '_view_cleanup'
            });
          }
          function localViewCleanup(db) {
            return db.get('_local/' + localDocName).then(function(metaDoc) {
              var docsToViews = new ExportedMap();
              Object.keys(metaDoc.views).forEach(function(fullViewName) {
                var parts = parseViewName(fullViewName);
                var designDocName = '_design/' + parts[0];
                var viewName = parts[1];
                var views = docsToViews.get(designDocName);
                if (!views) {
                  views = new ExportedSet();
                  docsToViews.set(designDocName, views);
                }
                views.add(viewName);
              });
              var opts = {
                keys: mapToKeysArray(docsToViews),
                include_docs: true
              };
              return db.allDocs(opts).then(function(res) {
                var viewsToStatus = {};
                res.rows.forEach(function(row) {
                  var ddocName = row.key.substring(8);
                  docsToViews.get(row.key).forEach(function(viewName) {
                    var fullViewName = ddocName + '/' + viewName;
                    if (!metaDoc.views[fullViewName]) {
                      fullViewName = viewName;
                    }
                    var viewDBNames = Object.keys(metaDoc.views[fullViewName]);
                    var statusIsGood = row.doc && row.doc.views && row.doc.views[viewName];
                    viewDBNames.forEach(function(viewDBName) {
                      viewsToStatus[viewDBName] = viewsToStatus[viewDBName] || statusIsGood;
                    });
                  });
                });
                var dbsToDelete = Object.keys(viewsToStatus).filter(function(viewDBName) {
                  return !viewsToStatus[viewDBName];
                });
                var destroyPromises = dbsToDelete.map(function(viewDBName) {
                  return sequentialize(getQueue(viewDBName), function() {
                    return new db.constructor(viewDBName, db.__opts).destroy();
                  })();
                });
                return PouchPromise$1.all(destroyPromises).then(function() {
                  return {ok: true};
                });
              });
            }, defaultsTo({ok: true}));
          }
          function queryPromised(db, fun, opts) {
            if (typeof db._query === 'function') {
              return customQuery(db, fun, opts);
            }
            if (isRemote(db)) {
              return httpQuery(db, fun, opts);
            }
            if (typeof fun !== 'string') {
              checkQueryParseError(opts, fun);
              tempViewQueue.add(function() {
                var createViewPromise = createView(db, 'temp_view/temp_view', fun.map, fun.reduce, true, localDocName);
                return createViewPromise.then(function(view) {
                  return fin(updateView(view).then(function() {
                    return queryView(view, opts);
                  }), function() {
                    return view.db.destroy();
                  });
                });
              });
              return tempViewQueue.finish();
            } else {
              var fullViewName = fun;
              var parts = parseViewName(fullViewName);
              var designDocName = parts[0];
              var viewName = parts[1];
              return db.get('_design/' + designDocName).then(function(doc) {
                var fun = doc.views && doc.views[viewName];
                if (!fun) {
                  throw new NotFoundError('ddoc ' + doc._id + ' has no view named ' + viewName);
                }
                ddocValidator(doc, viewName);
                checkQueryParseError(opts, fun);
                var createViewPromise = createView(db, fullViewName, fun.map, fun.reduce, false, localDocName);
                return createViewPromise.then(function(view) {
                  if (opts.stale === 'ok' || opts.stale === 'update_after') {
                    if (opts.stale === 'update_after') {
                      nextTick(function() {
                        updateView(view);
                      });
                    }
                    return queryView(view, opts);
                  } else {
                    return updateView(view).then(function() {
                      return queryView(view, opts);
                    });
                  }
                });
              });
            }
          }
          function abstractQuery(fun, opts, callback) {
            var db = this;
            if (typeof opts === 'function') {
              callback = opts;
              opts = {};
            }
            opts = opts ? coerceOptions(opts) : {};
            if (typeof fun === 'function') {
              fun = {map: fun};
            }
            var promise = PouchPromise$1.resolve().then(function() {
              return queryPromised(db, fun, opts);
            });
            promisedCallback$1(promise, callback);
            return promise;
          }
          var abstractViewCleanup = callbackify$1(function() {
            var db = this;
            if (typeof db._viewCleanup === 'function') {
              return customViewCleanup(db);
            }
            if (isRemote(db)) {
              return httpViewCleanup(db);
            }
            return localViewCleanup(db);
          });
          return {
            query: abstractQuery,
            viewCleanup: abstractViewCleanup
          };
        }
        function createDeepMultiMapper(fields, emit) {
          return function(doc) {
            var toEmit = [];
            for (var i = 0,
                iLen = fields.length; i < iLen; i++) {
              var parsedField = parseField(fields[i]);
              var value = doc;
              for (var j = 0,
                  jLen = parsedField.length; j < jLen; j++) {
                var key = parsedField[j];
                value = value[key];
                if (!value) {
                  return;
                }
              }
              toEmit.push(value);
            }
            emit(toEmit);
          };
        }
        function createDeepSingleMapper(field, emit) {
          var parsedField = parseField(field);
          return function(doc) {
            var value = doc;
            for (var i = 0,
                len = parsedField.length; i < len; i++) {
              var key = parsedField[i];
              value = value[key];
              if (!value) {
                return;
              }
            }
            emit(value);
          };
        }
        function createShallowSingleMapper(field, emit) {
          return function(doc) {
            emit(doc[field]);
          };
        }
        function createShallowMultiMapper(fields, emit) {
          return function(doc) {
            var toEmit = [];
            for (var i = 0,
                len = fields.length; i < len; i++) {
              toEmit.push(doc[fields[i]]);
            }
            emit(toEmit);
          };
        }
        function checkShallow(fields) {
          for (var i = 0,
              len = fields.length; i < len; i++) {
            var field = fields[i];
            if (field.indexOf('.') !== -1) {
              return false;
            }
          }
          return true;
        }
        function createMapper(fields, emit) {
          var isShallow = checkShallow(fields);
          var isSingle = fields.length === 1;
          if (isShallow) {
            if (isSingle) {
              return createShallowSingleMapper(fields[0], emit);
            } else {
              return createShallowMultiMapper(fields, emit);
            }
          } else {
            if (isSingle) {
              return createDeepSingleMapper(fields[0], emit);
            } else {
              return createDeepMultiMapper(fields, emit);
            }
          }
        }
        function mapper(mapFunDef, emit) {
          var fields = Object.keys(mapFunDef.fields);
          return createMapper(fields, emit);
        }
        function reducer() {
          throw new Error('reduce not supported');
        }
        function ddocValidator(ddoc, viewName) {
          var view = ddoc.views[viewName];
          if (!view.map || !view.map.fields) {
            throw new Error('ddoc ' + ddoc._id + ' with view ' + viewName + ' doesn\'t have map.fields defined. ' + 'maybe it wasn\'t created by this plugin?');
          }
        }
        var abstractMapper = createAbstractMapReduce$1('indexes', mapper, reducer, ddocValidator);
        function massageSort(sort) {
          if (!Array.isArray(sort)) {
            throw new Error('invalid sort json - should be an array');
          }
          return sort.map(function(sorting) {
            if (typeof sorting === 'string') {
              var obj = {};
              obj[sorting] = 'asc';
              return obj;
            } else {
              return sorting;
            }
          });
        }
        function massageUseIndex(useIndex) {
          var cleanedUseIndex = [];
          if (typeof useIndex === 'string') {
            cleanedUseIndex.push(useIndex);
          } else {
            cleanedUseIndex = useIndex;
          }
          return cleanedUseIndex.map(function(name) {
            return name.replace('_design/', '');
          });
        }
        function massageIndexDef(indexDef) {
          indexDef.fields = indexDef.fields.map(function(field) {
            if (typeof field === 'string') {
              var obj = {};
              obj[field] = 'asc';
              return obj;
            }
            return field;
          });
          return indexDef;
        }
        function getKeyFromDoc(doc, index) {
          var res = [];
          for (var i = 0; i < index.def.fields.length; i++) {
            var field = getKey(index.def.fields[i]);
            res.push(doc[field]);
          }
          return res;
        }
        function filterInclusiveStart(rows, targetValue, index) {
          var indexFields = index.def.fields;
          for (var i = 0,
              len = rows.length; i < len; i++) {
            var row = rows[i];
            var docKey = getKeyFromDoc(row.doc, index);
            if (indexFields.length === 1) {
              docKey = docKey[0];
            } else {
              while (docKey.length > targetValue.length) {
                docKey.pop();
              }
            }
            if (Math.abs(collate(docKey, targetValue)) > 0) {
              break;
            }
          }
          return i > 0 ? rows.slice(i) : rows;
        }
        function reverseOptions(opts) {
          var newOpts = clone(opts);
          delete newOpts.startkey;
          delete newOpts.endkey;
          delete newOpts.inclusive_start;
          delete newOpts.inclusive_end;
          if ('endkey' in opts) {
            newOpts.startkey = opts.endkey;
          }
          if ('startkey' in opts) {
            newOpts.endkey = opts.startkey;
          }
          if ('inclusive_start' in opts) {
            newOpts.inclusive_end = opts.inclusive_start;
          }
          if ('inclusive_end' in opts) {
            newOpts.inclusive_start = opts.inclusive_end;
          }
          return newOpts;
        }
        function validateIndex(index) {
          var ascFields = index.fields.filter(function(field) {
            return getValue(field) === 'asc';
          });
          if (ascFields.length !== 0 && ascFields.length !== index.fields.length) {
            throw new Error('unsupported mixed sorting');
          }
        }
        function validateSort(requestDef, index) {
          if (index.defaultUsed && requestDef.sort) {
            var noneIdSorts = requestDef.sort.filter(function(sortItem) {
              return Object.keys(sortItem)[0] !== '_id';
            }).map(function(sortItem) {
              return Object.keys(sortItem)[0];
            });
            if (noneIdSorts.length > 0) {
              throw new Error('Cannot sort on field(s) "' + noneIdSorts.join(',') + '" when using the default index');
            }
          }
          if (index.defaultUsed) {
            return;
          }
        }
        function validateFindRequest(requestDef) {
          if (typeof requestDef.selector !== 'object') {
            throw new Error('you must provide a selector when you find()');
          }
        }
        function getUserFields(selector, sort) {
          var selectorFields = Object.keys(selector);
          var sortFields = sort ? sort.map(getKey) : [];
          var userFields;
          if (selectorFields.length >= sortFields.length) {
            userFields = selectorFields;
          } else {
            userFields = sortFields;
          }
          if (sortFields.length === 0) {
            return {fields: userFields};
          }
          userFields = userFields.sort(function(left, right) {
            var leftIdx = sortFields.indexOf(left);
            if (leftIdx === -1) {
              leftIdx = Number.MAX_VALUE;
            }
            var rightIdx = sortFields.indexOf(right);
            if (rightIdx === -1) {
              rightIdx = Number.MAX_VALUE;
            }
            return leftIdx < rightIdx ? -1 : leftIdx > rightIdx ? 1 : 0;
          });
          return {
            fields: userFields,
            sortOrder: sort.map(getKey)
          };
        }
        function createIndex$1(db, requestDef) {
          requestDef = massageCreateIndexRequest(requestDef);
          var originalIndexDef = clone(requestDef.index);
          requestDef.index = massageIndexDef(requestDef.index);
          validateIndex(requestDef.index);
          var md5;
          function getMd5() {
            return md5 || (md5 = stringMd5(JSON.stringify(requestDef)));
          }
          var viewName = requestDef.name || ('idx-' + getMd5());
          var ddocName = requestDef.ddoc || ('idx-' + getMd5());
          var ddocId = '_design/' + ddocName;
          var hasInvalidLanguage = false;
          var viewExists = false;
          function updateDdoc(doc) {
            if (doc._rev && doc.language !== 'query') {
              hasInvalidLanguage = true;
            }
            doc.language = 'query';
            doc.views = doc.views || {};
            viewExists = !!doc.views[viewName];
            if (viewExists) {
              return false;
            }
            doc.views[viewName] = {
              map: {fields: mergeObjects(requestDef.index.fields)},
              reduce: '_count',
              options: {def: originalIndexDef}
            };
            return doc;
          }
          db.constructor.emit('debug', ['find', 'creating index', ddocId]);
          return upsert(db, ddocId, updateDdoc).then(function() {
            if (hasInvalidLanguage) {
              throw new Error('invalid language for ddoc with id "' + ddocId + '" (should be "query")');
            }
          }).then(function() {
            var signature = ddocName + '/' + viewName;
            return abstractMapper.query.call(db, signature, {
              limit: 0,
              reduce: false
            }).then(function() {
              return {
                id: ddocId,
                name: viewName,
                result: viewExists ? 'exists' : 'created'
              };
            });
          });
        }
        function getIndexes$1(db) {
          return db.allDocs({
            startkey: '_design/',
            endkey: '_design/\uffff',
            include_docs: true
          }).then(function(allDocsRes) {
            var res = {indexes: [{
                ddoc: null,
                name: '_all_docs',
                type: 'special',
                def: {fields: [{_id: 'asc'}]}
              }]};
            res.indexes = flatten$2(res.indexes, allDocsRes.rows.filter(function(row) {
              return row.doc.language === 'query';
            }).map(function(row) {
              var viewNames = row.doc.views !== undefined ? Object.keys(row.doc.views) : [];
              return viewNames.map(function(viewName) {
                var view = row.doc.views[viewName];
                return {
                  ddoc: row.id,
                  name: viewName,
                  type: 'json',
                  def: massageIndexDef(view.options.def)
                };
              });
            }));
            res.indexes.sort(function(left, right) {
              return compare(left.name, right.name);
            });
            res.total_rows = res.indexes.length;
            return res;
          });
        }
        var COLLATE_LO = null;
        var COLLATE_HI = {"\uffff": {}};
        function checkFieldInIndex(index, field) {
          var indexFields = index.def.fields.map(getKey);
          for (var i = 0,
              len = indexFields.length; i < len; i++) {
            var indexField = indexFields[i];
            if (field === indexField) {
              return true;
            }
          }
          return false;
        }
        function userOperatorLosesPrecision(selector, field) {
          var matcher = selector[field];
          var userOperator = getKey(matcher);
          return userOperator !== '$eq';
        }
        function sortFieldsByIndex(userFields, index) {
          var indexFields = index.def.fields.map(getKey);
          return userFields.slice().sort(function(a, b) {
            var aIdx = indexFields.indexOf(a);
            var bIdx = indexFields.indexOf(b);
            if (aIdx === -1) {
              aIdx = Number.MAX_VALUE;
            }
            if (bIdx === -1) {
              bIdx = Number.MAX_VALUE;
            }
            return compare(aIdx, bIdx);
          });
        }
        function getBasicInMemoryFields(index, selector, userFields) {
          userFields = sortFieldsByIndex(userFields, index);
          var needToFilterInMemory = false;
          for (var i = 0,
              len = userFields.length; i < len; i++) {
            var field = userFields[i];
            if (needToFilterInMemory || !checkFieldInIndex(index, field)) {
              return userFields.slice(i);
            }
            if (i < len - 1 && userOperatorLosesPrecision(selector, field)) {
              needToFilterInMemory = true;
            }
          }
          return [];
        }
        function getInMemoryFieldsFromNe(selector) {
          var fields = [];
          Object.keys(selector).forEach(function(field) {
            var matcher = selector[field];
            Object.keys(matcher).forEach(function(operator) {
              if (operator === '$ne') {
                fields.push(field);
              }
            });
          });
          return fields;
        }
        function getInMemoryFields(coreInMemoryFields, index, selector, userFields) {
          var result = flatten$2(coreInMemoryFields, getBasicInMemoryFields(index, selector, userFields), getInMemoryFieldsFromNe(selector));
          return sortFieldsByIndex(uniq(result), index);
        }
        function checkIndexFieldsMatch(indexFields, sortOrder, fields) {
          if (sortOrder) {
            var sortMatches = oneArrayIsStrictSubArrayOfOther(sortOrder, indexFields);
            var selectorMatches = oneArrayIsSubArrayOfOther(fields, indexFields);
            return sortMatches && selectorMatches;
          }
          return oneSetIsSubArrayOfOther(fields, indexFields);
        }
        var logicalMatchers = ['$eq', '$gt', '$gte', '$lt', '$lte'];
        function isNonLogicalMatcher(matcher) {
          return logicalMatchers.indexOf(matcher) === -1;
        }
        function checkFieldsLogicallySound(indexFields, selector) {
          var firstField = indexFields[0];
          var matcher = selector[firstField];
          if (typeof matcher === 'undefined') {
            return true;
          }
          var hasLogicalOperator = Object.keys(matcher).some(function(matcherKey) {
            return !(isNonLogicalMatcher(matcherKey));
          });
          if (!hasLogicalOperator) {
            return false;
          }
          var isInvalidNe = Object.keys(matcher).length === 1 && getKey(matcher) === '$ne';
          return !isInvalidNe;
        }
        function checkIndexMatches(index, sortOrder, fields, selector) {
          var indexFields = index.def.fields.map(getKey);
          var fieldsMatch = checkIndexFieldsMatch(indexFields, sortOrder, fields);
          if (!fieldsMatch) {
            return false;
          }
          return checkFieldsLogicallySound(indexFields, selector);
        }
        function findMatchingIndexes(selector, userFields, sortOrder, indexes) {
          return indexes.reduce(function(res, index) {
            var indexMatches = checkIndexMatches(index, sortOrder, userFields, selector);
            if (indexMatches) {
              res.push(index);
            }
            return res;
          }, []);
        }
        function findBestMatchingIndex(selector, userFields, sortOrder, indexes, useIndex) {
          var matchingIndexes = findMatchingIndexes(selector, userFields, sortOrder, indexes);
          if (matchingIndexes.length === 0) {
            if (useIndex) {
              throw {
                error: "no_usable_index",
                message: "There is no index available for this selector."
              };
            }
            var defaultIndex = indexes[0];
            defaultIndex.defaultUsed = true;
            return defaultIndex;
          }
          if (matchingIndexes.length === 1 && !useIndex) {
            return matchingIndexes[0];
          }
          var userFieldsMap = arrayToObject(userFields);
          function scoreIndex(index) {
            var indexFields = index.def.fields.map(getKey);
            var score = 0;
            for (var i = 0,
                len = indexFields.length; i < len; i++) {
              var indexField = indexFields[i];
              if (userFieldsMap[indexField]) {
                score++;
              }
            }
            return score;
          }
          if (useIndex) {
            var useIndexDdoc = '_design/' + useIndex[0];
            var useIndexName = useIndex.length === 2 ? useIndex[1] : false;
            var index = matchingIndexes.find(function(index) {
              if (useIndexName && index.ddoc === useIndexDdoc && useIndexName === index.name) {
                return true;
              }
              if (index.ddoc === useIndexDdoc) {
                return true;
              }
              return false;
            });
            if (!index) {
              throw {
                error: "unknown_error",
                message: "Could not find that index or could not use that index for the query"
              };
            }
            return index;
          }
          return max(matchingIndexes, scoreIndex);
        }
        function getSingleFieldQueryOptsFor(userOperator, userValue) {
          switch (userOperator) {
            case '$eq':
              return {key: userValue};
            case '$lte':
              return {endkey: userValue};
            case '$gte':
              return {startkey: userValue};
            case '$lt':
              return {
                endkey: userValue,
                inclusive_end: false
              };
            case '$gt':
              return {
                startkey: userValue,
                inclusive_start: false
              };
          }
        }
        function getSingleFieldCoreQueryPlan(selector, index) {
          var field = getKey(index.def.fields[0]);
          var matcher = selector[field] || {};
          var inMemoryFields = [];
          var userOperators = Object.keys(matcher);
          var combinedOpts;
          userOperators.forEach(function(userOperator) {
            if (isNonLogicalMatcher(userOperator)) {
              inMemoryFields.push(field);
              return;
            }
            var userValue = matcher[userOperator];
            var newQueryOpts = getSingleFieldQueryOptsFor(userOperator, userValue);
            if (combinedOpts) {
              combinedOpts = mergeObjects([combinedOpts, newQueryOpts]);
            } else {
              combinedOpts = newQueryOpts;
            }
          });
          return {
            queryOpts: combinedOpts,
            inMemoryFields: inMemoryFields
          };
        }
        function getMultiFieldCoreQueryPlan(userOperator, userValue) {
          switch (userOperator) {
            case '$eq':
              return {
                startkey: userValue,
                endkey: userValue
              };
            case '$lte':
              return {endkey: userValue};
            case '$gte':
              return {startkey: userValue};
            case '$lt':
              return {
                endkey: userValue,
                inclusive_end: false
              };
            case '$gt':
              return {
                startkey: userValue,
                inclusive_start: false
              };
          }
        }
        function getMultiFieldQueryOpts(selector, index) {
          var indexFields = index.def.fields.map(getKey);
          var inMemoryFields = [];
          var startkey = [];
          var endkey = [];
          var inclusiveStart;
          var inclusiveEnd;
          function finish(i) {
            if (inclusiveStart !== false) {
              startkey.push(COLLATE_LO);
            }
            if (inclusiveEnd !== false) {
              endkey.push(COLLATE_HI);
            }
            inMemoryFields = indexFields.slice(i);
          }
          for (var i = 0,
              len = indexFields.length; i < len; i++) {
            var indexField = indexFields[i];
            var matcher = selector[indexField];
            if (!matcher || !Object.keys(matcher).length) {
              finish(i);
              break;
            } else if (i > 0) {
              if (Object.keys(matcher).some(isNonLogicalMatcher)) {
                finish(i);
                break;
              }
              var usingGtlt = ('$gt' in matcher || '$gte' in matcher || '$lt' in matcher || '$lte' in matcher);
              var previousKeys = Object.keys(selector[indexFields[i - 1]]);
              var previousWasEq = arrayEquals(previousKeys, ['$eq']);
              var previousWasSame = arrayEquals(previousKeys, Object.keys(matcher));
              var gtltLostSpecificity = usingGtlt && !previousWasEq && !previousWasSame;
              if (gtltLostSpecificity) {
                finish(i);
                break;
              }
            }
            var userOperators = Object.keys(matcher);
            var combinedOpts = null;
            for (var j = 0; j < userOperators.length; j++) {
              var userOperator = userOperators[j];
              var userValue = matcher[userOperator];
              var newOpts = getMultiFieldCoreQueryPlan(userOperator, userValue);
              if (combinedOpts) {
                combinedOpts = mergeObjects([combinedOpts, newOpts]);
              } else {
                combinedOpts = newOpts;
              }
            }
            startkey.push('startkey' in combinedOpts ? combinedOpts.startkey : COLLATE_LO);
            endkey.push('endkey' in combinedOpts ? combinedOpts.endkey : COLLATE_HI);
            if ('inclusive_start' in combinedOpts) {
              inclusiveStart = combinedOpts.inclusive_start;
            }
            if ('inclusive_end' in combinedOpts) {
              inclusiveEnd = combinedOpts.inclusive_end;
            }
          }
          var res = {
            startkey: startkey,
            endkey: endkey
          };
          if (typeof inclusiveStart !== 'undefined') {
            res.inclusive_start = inclusiveStart;
          }
          if (typeof inclusiveEnd !== 'undefined') {
            res.inclusive_end = inclusiveEnd;
          }
          return {
            queryOpts: res,
            inMemoryFields: inMemoryFields
          };
        }
        function getDefaultQueryPlan(selector) {
          return {
            queryOpts: {startkey: null},
            inMemoryFields: [Object.keys(selector)]
          };
        }
        function getCoreQueryPlan(selector, index) {
          if (index.defaultUsed) {
            return getDefaultQueryPlan(selector, index);
          }
          if (index.def.fields.length === 1) {
            return getSingleFieldCoreQueryPlan(selector, index);
          }
          return getMultiFieldQueryOpts(selector, index);
        }
        function planQuery(request, indexes) {
          var selector = request.selector;
          var sort = request.sort;
          var userFieldsRes = getUserFields(selector, sort);
          var userFields = userFieldsRes.fields;
          var sortOrder = userFieldsRes.sortOrder;
          var index = findBestMatchingIndex(selector, userFields, sortOrder, indexes, request.use_index);
          var coreQueryPlan = getCoreQueryPlan(selector, index);
          var queryOpts = coreQueryPlan.queryOpts;
          var coreInMemoryFields = coreQueryPlan.inMemoryFields;
          var inMemoryFields = getInMemoryFields(coreInMemoryFields, index, selector, userFields);
          var res = {
            queryOpts: queryOpts,
            index: index,
            inMemoryFields: inMemoryFields
          };
          return res;
        }
        function indexToSignature(index) {
          return index.ddoc.substring(8) + '/' + index.name;
        }
        function doAllDocs(db, originalOpts) {
          var opts = clone(originalOpts);
          if (opts.descending) {
            if ('endkey' in opts && typeof opts.endkey !== 'string') {
              opts.endkey = '';
            }
            if ('startkey' in opts && typeof opts.startkey !== 'string') {
              opts.limit = 0;
            }
          } else {
            if ('startkey' in opts && typeof opts.startkey !== 'string') {
              opts.startkey = '';
            }
            if ('endkey' in opts && typeof opts.endkey !== 'string') {
              opts.limit = 0;
            }
          }
          if ('key' in opts && typeof opts.key !== 'string') {
            opts.limit = 0;
          }
          return db.allDocs(opts).then(function(res) {
            res.rows = res.rows.filter(function(row) {
              return !/^_design\//.test(row.id);
            });
            return res;
          });
        }
        function find$1(db, requestDef, explain) {
          if (requestDef.selector) {
            requestDef.selector = massageSelector(requestDef.selector);
          }
          if (requestDef.sort) {
            requestDef.sort = massageSort(requestDef.sort);
          }
          if (requestDef.use_index) {
            requestDef.use_index = massageUseIndex(requestDef.use_index);
          }
          validateFindRequest(requestDef);
          return getIndexes$1(db).then(function(getIndexesRes) {
            db.constructor.emit('debug', ['find', 'planning query', requestDef]);
            var queryPlan = planQuery(requestDef, getIndexesRes.indexes);
            db.constructor.emit('debug', ['find', 'query plan', queryPlan]);
            var indexToUse = queryPlan.index;
            validateSort(requestDef, indexToUse);
            var opts = $inject_Object_assign({
              include_docs: true,
              reduce: false
            }, queryPlan.queryOpts);
            if ('startkey' in opts && 'endkey' in opts && collate(opts.startkey, opts.endkey) > 0) {
              return {docs: []};
            }
            var isDescending = requestDef.sort && typeof requestDef.sort[0] !== 'string' && getValue(requestDef.sort[0]) === 'desc';
            if (isDescending) {
              opts.descending = true;
              opts = reverseOptions(opts);
            }
            if (!queryPlan.inMemoryFields.length) {
              if ('limit' in requestDef) {
                opts.limit = requestDef.limit;
              }
              if ('skip' in requestDef) {
                opts.skip = requestDef.skip;
              }
            }
            if (explain) {
              return PouchPromise$1.resolve(queryPlan, opts);
            }
            return PouchPromise$1.resolve().then(function() {
              if (indexToUse.name === '_all_docs') {
                return doAllDocs(db, opts);
              } else {
                var signature = indexToSignature(indexToUse);
                return abstractMapper.query.call(db, signature, opts);
              }
            }).then(function(res) {
              if (opts.inclusive_start === false) {
                res.rows = filterInclusiveStart(res.rows, opts.startkey, indexToUse);
              }
              if (queryPlan.inMemoryFields.length) {
                res.rows = filterInMemoryFields(res.rows, requestDef, queryPlan.inMemoryFields);
              }
              var resp = {docs: res.rows.map(function(row) {
                  var doc = row.doc;
                  if (requestDef.fields) {
                    return pick$2(doc, requestDef.fields);
                  }
                  return doc;
                })};
              if (indexToUse.defaultUsed) {
                resp.warning = 'no matching index found, create an index to optimize query time';
              }
              return resp;
            });
          });
        }
        function explain$1(db, requestDef) {
          return find$1(db, requestDef, true).then(function(queryPlan) {
            return {
              dbname: db.name,
              index: queryPlan.index,
              selector: requestDef.selector,
              range: {
                start_key: queryPlan.queryOpts.startkey,
                end_key: queryPlan.queryOpts.endkey
              },
              opts: {
                use_index: requestDef.use_index || [],
                bookmark: "nil",
                limit: requestDef.limit,
                skip: requestDef.skip,
                sort: requestDef.sort || {},
                fields: requestDef.fields,
                conflicts: false,
                r: [49]
              },
              limit: requestDef.limit,
              skip: requestDef.skip || 0,
              fields: requestDef.fields
            };
          });
        }
        function deleteIndex$1(db, index) {
          if (!index.ddoc) {
            throw new Error('you must supply an index.ddoc when deleting');
          }
          if (!index.name) {
            throw new Error('you must supply an index.name when deleting');
          }
          var docId = index.ddoc;
          var viewName = index.name;
          function deltaFun(doc) {
            if (Object.keys(doc.views).length === 1 && doc.views[viewName]) {
              return {
                _id: docId,
                _deleted: true
              };
            }
            delete doc.views[viewName];
            return doc;
          }
          return upsert(db, docId, deltaFun).then(function() {
            return abstractMapper.viewCleanup.apply(db);
          }).then(function() {
            return {ok: true};
          });
        }
        var createIndexAsCallback = callbackify(createIndex$1);
        var findAsCallback = callbackify(find$1);
        var explainAsCallback = callbackify(explain$1);
        var getIndexesAsCallback = callbackify(getIndexes$1);
        var deleteIndexAsCallback = callbackify(deleteIndex$1);
        var plugin = {};
        plugin.createIndex = toPromise(function(requestDef, callback) {
          if (typeof requestDef !== 'object') {
            return callback(new Error('you must provide an index to create'));
          }
          var createIndex$$1 = isRemote(this) ? createIndex : createIndexAsCallback;
          createIndex$$1(this, requestDef, callback);
        });
        plugin.find = toPromise(function(requestDef, callback) {
          if (typeof callback === 'undefined') {
            callback = requestDef;
            requestDef = undefined;
          }
          if (typeof requestDef !== 'object') {
            return callback(new Error('you must provide search parameters to find()'));
          }
          var find$$1 = isRemote(this) ? find : findAsCallback;
          find$$1(this, requestDef, callback);
        });
        plugin.explain = toPromise(function(requestDef, callback) {
          if (typeof callback === 'undefined') {
            callback = requestDef;
            requestDef = undefined;
          }
          if (typeof requestDef !== 'object') {
            return callback(new Error('you must provide search parameters to explain()'));
          }
          var find$$1 = isRemote(this) ? explain : explainAsCallback;
          find$$1(this, requestDef, callback);
        });
        plugin.getIndexes = toPromise(function(callback) {
          var getIndexes$$1 = isRemote(this) ? getIndexes : getIndexesAsCallback;
          getIndexes$$1(this, callback);
        });
        plugin.deleteIndex = toPromise(function(indexDef, callback) {
          if (typeof indexDef !== 'object') {
            return callback(new Error('you must provide an index to delete'));
          }
          var deleteIndex$$1 = isRemote(this) ? deleteIndex : deleteIndexAsCallback;
          deleteIndex$$1(this, indexDef, callback);
        });
        if (typeof PouchDB === 'undefined') {
          guardedConsole('error', 'pouchdb-find plugin error: ' + 'Cannot find global "PouchDB" object! ' + 'Did you remember to include pouchdb.js?');
        } else {
          PouchDB.plugin(plugin);
        }
      }).call(this, _dereq_(6));
    }, {
      "1": 1,
      "10": 10,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7
    }]
  }, {}, [11]);
})(require('process'));
