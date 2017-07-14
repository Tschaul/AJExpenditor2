/* */ 
"format cjs";
(function(process) {
  (function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = f();
    } else if (typeof define === "function" && define.amd) {
      define([], f);
    } else {
      var g;
      if (typeof window !== "undefined") {
        g = window;
      } else if (typeof global !== "undefined") {
        g = global;
      } else if (typeof self !== "undefined") {
        g = self;
      } else {
        g = this;
      }
      g.PouchDB = f();
    }
  })(function() {
    var define,
        module,
        exports;
    return (function e(t, n, r) {
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
        (function(process) {
          exports = module.exports = _dereq_(3);
          exports.log = log;
          exports.formatArgs = formatArgs;
          exports.save = save;
          exports.load = load;
          exports.useColors = useColors;
          exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();
          exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];
          function useColors() {
            if (typeof window !== 'undefined' && window && typeof window.process !== 'undefined' && window.process.type === 'renderer') {
              return true;
            }
            return (typeof document !== 'undefined' && document && 'WebkitAppearance' in document.documentElement.style) || (typeof window !== 'undefined' && window && window.console && (console.firebug || (console.exception && console.table))) || (typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) || (typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
          }
          exports.formatters.j = function(v) {
            try {
              return JSON.stringify(v);
            } catch (err) {
              return '[UnexpectedJSONParseError]: ' + err.message;
            }
          };
          function formatArgs(args) {
            var useColors = this.useColors;
            args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);
            if (!useColors)
              return;
            var c = 'color: ' + this.color;
            args.splice(1, 0, c, 'color: inherit');
            var index = 0;
            var lastC = 0;
            args[0].replace(/%[a-zA-Z%]/g, function(match) {
              if ('%%' === match)
                return;
              index++;
              if ('%c' === match) {
                lastC = index;
              }
            });
            args.splice(lastC, 0, c);
          }
          function log() {
            return 'object' === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
          }
          function save(namespaces) {
            try {
              if (null == namespaces) {
                exports.storage.removeItem('debug');
              } else {
                exports.storage.debug = namespaces;
              }
            } catch (e) {}
          }
          function load() {
            var r;
            try {
              r = exports.storage.debug;
            } catch (e) {}
            if (!r && typeof process !== 'undefined' && 'env' in process) {
              r = process.env.DEBUG;
            }
            return r;
          }
          exports.enable(load());
          function localstorage() {
            try {
              return window.localStorage;
            } catch (e) {}
          }
        }).call(this, _dereq_(9));
      }, {
        "3": 3,
        "9": 9
      }],
      3: [function(_dereq_, module, exports) {
        exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
        exports.coerce = coerce;
        exports.disable = disable;
        exports.enable = enable;
        exports.enabled = enabled;
        exports.humanize = _dereq_(8);
        exports.names = [];
        exports.skips = [];
        exports.formatters = {};
        var prevTime;
        function selectColor(namespace) {
          var hash = 0,
              i;
          for (i in namespace) {
            hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
            hash |= 0;
          }
          return exports.colors[Math.abs(hash) % exports.colors.length];
        }
        function createDebug(namespace) {
          function debug() {
            if (!debug.enabled)
              return;
            var self = debug;
            var curr = +new Date();
            var ms = curr - (prevTime || curr);
            self.diff = ms;
            self.prev = prevTime;
            self.curr = curr;
            prevTime = curr;
            var args = new Array(arguments.length);
            for (var i = 0; i < args.length; i++) {
              args[i] = arguments[i];
            }
            args[0] = exports.coerce(args[0]);
            if ('string' !== typeof args[0]) {
              args.unshift('%O');
            }
            var index = 0;
            args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
              if (match === '%%')
                return match;
              index++;
              var formatter = exports.formatters[format];
              if ('function' === typeof formatter) {
                var val = args[index];
                match = formatter.call(self, val);
                args.splice(index, 1);
                index--;
              }
              return match;
            });
            exports.formatArgs.call(self, args);
            var logFn = debug.log || exports.log || console.log.bind(console);
            logFn.apply(self, args);
          }
          debug.namespace = namespace;
          debug.enabled = exports.enabled(namespace);
          debug.useColors = exports.useColors();
          debug.color = selectColor(namespace);
          if ('function' === typeof exports.init) {
            exports.init(debug);
          }
          return debug;
        }
        function enable(namespaces) {
          exports.save(namespaces);
          exports.names = [];
          exports.skips = [];
          var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
          var len = split.length;
          for (var i = 0; i < len; i++) {
            if (!split[i])
              continue;
            namespaces = split[i].replace(/\*/g, '.*?');
            if (namespaces[0] === '-') {
              exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
            } else {
              exports.names.push(new RegExp('^' + namespaces + '$'));
            }
          }
        }
        function disable() {
          exports.enable('');
        }
        function enabled(name) {
          var i,
              len;
          for (i = 0, len = exports.skips.length; i < len; i++) {
            if (exports.skips[i].test(name)) {
              return false;
            }
          }
          for (i = 0, len = exports.names.length; i < len; i++) {
            if (exports.names[i].test(name)) {
              return true;
            }
          }
          return false;
        }
        function coerce(val) {
          if (val instanceof Error)
            return val.stack || val.message;
          return val;
        }
      }, {"8": 8}],
      4: [function(_dereq_, module, exports) {
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
      5: [function(_dereq_, module, exports) {
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
      6: [function(_dereq_, module, exports) {
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
      7: [function(_dereq_, module, exports) {
        'use strict';
        var immediate = _dereq_(5);
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
      }, {"5": 5}],
      8: [function(_dereq_, module, exports) {
        var s = 1000;
        var m = s * 60;
        var h = m * 60;
        var d = h * 24;
        var y = d * 365.25;
        module.exports = function(val, options) {
          options = options || {};
          var type = typeof val;
          if (type === 'string' && val.length > 0) {
            return parse(val);
          } else if (type === 'number' && isNaN(val) === false) {
            return options.long ? fmtLong(val) : fmtShort(val);
          }
          throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
        };
        function parse(str) {
          str = String(str);
          if (str.length > 10000) {
            return;
          }
          var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
          if (!match) {
            return;
          }
          var n = parseFloat(match[1]);
          var type = (match[2] || 'ms').toLowerCase();
          switch (type) {
            case 'years':
            case 'year':
            case 'yrs':
            case 'yr':
            case 'y':
              return n * y;
            case 'days':
            case 'day':
            case 'd':
              return n * d;
            case 'hours':
            case 'hour':
            case 'hrs':
            case 'hr':
            case 'h':
              return n * h;
            case 'minutes':
            case 'minute':
            case 'mins':
            case 'min':
            case 'm':
              return n * m;
            case 'seconds':
            case 'second':
            case 'secs':
            case 'sec':
            case 's':
              return n * s;
            case 'milliseconds':
            case 'millisecond':
            case 'msecs':
            case 'msec':
            case 'ms':
              return n;
            default:
              return undefined;
          }
        }
        function fmtShort(ms) {
          if (ms >= d) {
            return Math.round(ms / d) + 'd';
          }
          if (ms >= h) {
            return Math.round(ms / h) + 'h';
          }
          if (ms >= m) {
            return Math.round(ms / m) + 'm';
          }
          if (ms >= s) {
            return Math.round(ms / s) + 's';
          }
          return ms + 'ms';
        }
        function fmtLong(ms) {
          return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
        }
        function plural(ms, n, name) {
          if (ms < n) {
            return;
          }
          if (ms < n * 1.5) {
            return Math.floor(ms / n) + ' ' + name;
          }
          return Math.ceil(ms / n) + ' ' + name + 's';
        }
      }, {}],
      9: [function(_dereq_, module, exports) {
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
      10: [function(_dereq_, module, exports) {
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
      11: [function(_dereq_, module, exports) {
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
      12: [function(_dereq_, module, exports) {
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
      13: [function(_dereq_, module, exports) {
        var rng = _dereq_(12);
        var bytesToUuid = _dereq_(11);
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
        "11": 11,
        "12": 12
      }],
      14: [function(_dereq_, module, exports) {
        'use strict';
        exports.stringify = function stringify(input) {
          var queue = [];
          queue.push({obj: input});
          var res = '';
          var next,
              obj,
              prefix,
              val,
              i,
              arrayPrefix,
              keys,
              k,
              key,
              value,
              objPrefix;
          while ((next = queue.pop())) {
            obj = next.obj;
            prefix = next.prefix || '';
            val = next.val || '';
            res += prefix;
            if (val) {
              res += val;
            } else if (typeof obj !== 'object') {
              res += typeof obj === 'undefined' ? null : JSON.stringify(obj);
            } else if (obj === null) {
              res += 'null';
            } else if (Array.isArray(obj)) {
              queue.push({val: ']'});
              for (i = obj.length - 1; i >= 0; i--) {
                arrayPrefix = i === 0 ? '' : ',';
                queue.push({
                  obj: obj[i],
                  prefix: arrayPrefix
                });
              }
              queue.push({val: '['});
            } else {
              keys = [];
              for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                  keys.push(k);
                }
              }
              queue.push({val: '}'});
              for (i = keys.length - 1; i >= 0; i--) {
                key = keys[i];
                value = obj[key];
                objPrefix = (i > 0 ? ',' : '');
                objPrefix += JSON.stringify(key) + ':';
                queue.push({
                  obj: value,
                  prefix: objPrefix
                });
              }
              queue.push({val: '{'});
            }
          }
          return res;
        };
        function pop(obj, stack, metaStack) {
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
        exports.parse = function(str) {
          var stack = [];
          var metaStack = [];
          var i = 0;
          var collationIndex,
              parsedNum,
              numChar;
          var parsedString,
              lastCh,
              numConsecutiveSlashes,
              ch;
          var arrayElement,
              objElement;
          while (true) {
            collationIndex = str[i++];
            if (collationIndex === '}' || collationIndex === ']' || typeof collationIndex === 'undefined') {
              if (stack.length === 1) {
                return stack.pop();
              } else {
                pop(stack.pop(), stack, metaStack);
                continue;
              }
            }
            switch (collationIndex) {
              case ' ':
              case '\t':
              case '\n':
              case ':':
              case ',':
                break;
              case 'n':
                i += 3;
                pop(null, stack, metaStack);
                break;
              case 't':
                i += 3;
                pop(true, stack, metaStack);
                break;
              case 'f':
                i += 4;
                pop(false, stack, metaStack);
                break;
              case '0':
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
              case '-':
                parsedNum = '';
                i--;
                while (true) {
                  numChar = str[i++];
                  if (/[\d\.\-e\+]/.test(numChar)) {
                    parsedNum += numChar;
                  } else {
                    i--;
                    break;
                  }
                }
                pop(parseFloat(parsedNum), stack, metaStack);
                break;
              case '"':
                parsedString = '';
                lastCh = void 0;
                numConsecutiveSlashes = 0;
                while (true) {
                  ch = str[i++];
                  if (ch !== '"' || (lastCh === '\\' && numConsecutiveSlashes % 2 === 1)) {
                    parsedString += ch;
                    lastCh = ch;
                    if (lastCh === '\\') {
                      numConsecutiveSlashes++;
                    } else {
                      numConsecutiveSlashes = 0;
                    }
                  } else {
                    break;
                  }
                }
                pop(JSON.parse('"' + parsedString + '"'), stack, metaStack);
                break;
              case '[':
                arrayElement = {
                  element: [],
                  index: stack.length
                };
                stack.push(arrayElement.element);
                metaStack.push(arrayElement);
                break;
              case '{':
                objElement = {
                  element: {},
                  index: stack.length
                };
                stack.push(objElement.element);
                metaStack.push(objElement);
                break;
              default:
                throw new Error('unexpectedly reached end of input: ' + collationIndex);
            }
          }
        };
      }, {}],
      15: [function(_dereq_, module, exports) {
        (function(global) {
          'use strict';
          function _interopDefault(ex) {
            return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex;
          }
          var lie = _interopDefault(_dereq_(7));
          var getArguments = _interopDefault(_dereq_(1));
          var events = _dereq_(4);
          var inherits = _interopDefault(_dereq_(6));
          var nextTick = _interopDefault(_dereq_(5));
          var v4 = _interopDefault(_dereq_(13));
          var debug = _interopDefault(_dereq_(2));
          var Md5 = _interopDefault(_dereq_(10));
          var vuvuzela = _interopDefault(_dereq_(14));
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
          function logApiCall(self, name, args) {
            if (self.constructor.listeners('debug').length) {
              var logArgs = ['api', self.name, name];
              for (var i = 0; i < args.length - 1; i++) {
                logArgs.push(args[i]);
              }
              self.constructor.emit('debug', logArgs);
              var origCallback = args[args.length - 1];
              args[args.length - 1] = function(err, res) {
                var responseArgs = ['api', self.name, name];
                responseArgs = responseArgs.concat(err ? ['error', err] : ['success', res]);
                self.constructor.emit('debug', responseArgs);
                origCallback(err, res);
              };
            }
          }
          function adapterFun(name, callback) {
            return toPromise(getArguments(function(args) {
              if (this._closed) {
                return PouchPromise$1.reject(new Error('database is closed'));
              }
              if (this._destroyed) {
                return PouchPromise$1.reject(new Error('database is destroyed'));
              }
              var self = this;
              logApiCall(self, name, args);
              if (!this.taskqueue.isReady) {
                return new PouchPromise$1(function(fulfill, reject) {
                  self.taskqueue.addTask(function(failed) {
                    if (failed) {
                      reject(failed);
                    } else {
                      fulfill(self[name].apply(self, args));
                    }
                  });
                });
              }
              return callback.apply(this, args);
            }));
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
          var MAX_NUM_CONCURRENT_REQUESTS = 6;
          function identityFunction(x) {
            return x;
          }
          function formatResultForOpenRevsGet(result) {
            return [{ok: result}];
          }
          function bulkGet(db, opts, callback) {
            var requests = opts.docs;
            var requestsById = new ExportedMap();
            requests.forEach(function(request) {
              if (requestsById.has(request.id)) {
                requestsById.get(request.id).push(request);
              } else {
                requestsById.set(request.id, [request]);
              }
            });
            var numDocs = requestsById.size;
            var numDone = 0;
            var perDocResults = new Array(numDocs);
            function collapseResultsAndFinish() {
              var results = [];
              perDocResults.forEach(function(res) {
                res.docs.forEach(function(info) {
                  results.push({
                    id: res.id,
                    docs: [info]
                  });
                });
              });
              callback(null, {results: results});
            }
            function checkDone() {
              if (++numDone === numDocs) {
                collapseResultsAndFinish();
              }
            }
            function gotResult(docIndex, id, docs) {
              perDocResults[docIndex] = {
                id: id,
                docs: docs
              };
              checkDone();
            }
            var allRequests = [];
            requestsById.forEach(function(value, key) {
              allRequests.push(key);
            });
            var i = 0;
            function nextBatch() {
              if (i >= allRequests.length) {
                return;
              }
              var upTo = Math.min(i + MAX_NUM_CONCURRENT_REQUESTS, allRequests.length);
              var batch = allRequests.slice(i, upTo);
              processBatch(batch, i);
              i += batch.length;
            }
            function processBatch(batch, offset) {
              batch.forEach(function(docId, j) {
                var docIdx = offset + j;
                var docRequests = requestsById.get(docId);
                var docOpts = pick(docRequests[0], ['atts_since', 'attachments']);
                docOpts.open_revs = docRequests.map(function(request) {
                  return request.rev;
                });
                docOpts.open_revs = docOpts.open_revs.filter(identityFunction);
                var formatResult = identityFunction;
                if (docOpts.open_revs.length === 0) {
                  delete docOpts.open_revs;
                  formatResult = formatResultForOpenRevsGet;
                }
                ['revs', 'attachments', 'binary', 'ajax', 'latest'].forEach(function(param) {
                  if (param in opts) {
                    docOpts[param] = opts[param];
                  }
                });
                db.get(docId, docOpts, function(err, res) {
                  var result;
                  if (err) {
                    result = [{error: err}];
                  } else {
                    result = formatResult(res);
                  }
                  gotResult(docIdx, docId, result);
                  nextBatch();
                });
              });
            }
            nextBatch();
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
          function randomNumber(min, max) {
            var maxTimeout = 600000;
            min = parseInt(min, 10) || 0;
            max = parseInt(max, 10);
            if (max !== max || max <= min) {
              max = (min || 1) << 1;
            } else {
              max = max + 1;
            }
            if (max > maxTimeout) {
              min = maxTimeout >> 1;
              max = maxTimeout;
            }
            var ratio = Math.random();
            var range = max - min;
            return ~~(range * ratio + min);
          }
          function defaultBackOff(min) {
            var max = 0;
            if (!min) {
              max = 2000;
            }
            return randomNumber(min, max);
          }
          function explainError(status, str) {
            guardedConsole('info', 'The above ' + status + ' is totally normal. ' + str);
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
          function createError(error, reason) {
            function CustomPouchError(reason) {
              for (var p in error) {
                if (typeof error[p] !== 'function') {
                  this[p] = error[p];
                }
              }
              if (reason !== undefined) {
                this.reason = reason;
              }
            }
            CustomPouchError.prototype = PouchError.prototype;
            return new CustomPouchError(reason);
          }
          function generateErrorFromResponse(err) {
            if (typeof err !== 'object') {
              var data = err;
              err = UNKNOWN_ERROR;
              err.data = data;
            }
            if ('error' in err && err.error === 'conflict') {
              err.name = 'conflict';
              err.status = 409;
            }
            if (!('name' in err)) {
              err.name = err.error || 'unknown';
            }
            if (!('status' in err)) {
              err.status = 500;
            }
            if (!('message' in err)) {
              err.message = err.message || err.reason;
            }
            return err;
          }
          function tryFilter(filter, doc, req) {
            try {
              return !filter(doc, req);
            } catch (err) {
              var msg = 'Filter function threw: ' + err.toString();
              return createError(BAD_REQUEST, msg);
            }
          }
          function filterChange(opts) {
            var req = {};
            var hasFilter = opts.filter && typeof opts.filter === 'function';
            req.query = opts.query_params;
            return function filter(change) {
              if (!change.doc) {
                change.doc = {};
              }
              var filterReturn = hasFilter && tryFilter(opts.filter, change.doc, req);
              if (typeof filterReturn === 'object') {
                return filterReturn;
              }
              if (filterReturn) {
                return false;
              }
              if (!opts.include_docs) {
                delete change.doc;
              } else if (!opts.attachments) {
                for (var att in change.doc._attachments) {
                  if (change.doc._attachments.hasOwnProperty(att)) {
                    change.doc._attachments[att].stub = true;
                  }
                }
              }
              return true;
            };
          }
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
          function invalidIdError(id) {
            var err;
            if (!id) {
              err = createError(MISSING_ID);
            } else if (typeof id !== 'string') {
              err = createError(INVALID_ID);
            } else if (/^_/.test(id) && !(/^_(design|local)/).test(id)) {
              err = createError(RESERVED_ID);
            }
            if (err) {
              throw err;
            }
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
          function listenerCount(ee, type) {
            return 'listenerCount' in ee ? ee.listenerCount(type) : events.EventEmitter.listenerCount(ee, type);
          }
          function parseDesignDocFunctionName(s) {
            if (!s) {
              return null;
            }
            var parts = s.split('/');
            if (parts.length === 2) {
              return parts;
            }
            if (parts.length === 1) {
              return [s, s];
            }
            return null;
          }
          function normalizeDesignDocFunctionName(s) {
            var normalized = parseDesignDocFunctionName(s);
            return normalized ? normalized.join('/') : null;
          }
          var keys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
          var qName = "queryKey";
          var qParser = /(?:^|&)([^&=]*)=?([^&]*)/g;
          var parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
          function parseUri(str) {
            var m = parser.exec(str);
            var uri = {};
            var i = 14;
            while (i--) {
              var key = keys[i];
              var value = m[i] || "";
              var encoded = ['user', 'password'].indexOf(key) !== -1;
              uri[key] = encoded ? decodeURIComponent(value) : value;
            }
            uri[qName] = {};
            uri[keys[12]].replace(qParser, function($0, $1, $2) {
              if ($1) {
                uri[qName][$1] = $2;
              }
            });
            return uri;
          }
          function scopeEval(source, scope) {
            var keys = [];
            var values = [];
            for (var key in scope) {
              if (scope.hasOwnProperty(key)) {
                keys.push(key);
                values.push(scope[key]);
              }
            }
            keys.push(source);
            return Function.apply(null, keys).apply(null, values);
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
          function rev() {
            return v4().replace(/-/g, '').toLowerCase();
          }
          var uuid = v4;
          function winningRev(metadata) {
            var winningId;
            var winningPos;
            var winningDeleted;
            var toVisit = metadata.rev_tree.slice();
            var node;
            while ((node = toVisit.pop())) {
              var tree = node.ids;
              var branches = tree[2];
              var pos = node.pos;
              if (branches.length) {
                for (var i = 0,
                    len = branches.length; i < len; i++) {
                  toVisit.push({
                    pos: pos + 1,
                    ids: branches[i]
                  });
                }
                continue;
              }
              var deleted = !!tree[1].deleted;
              var id = tree[0];
              if (!winningId || (winningDeleted !== deleted ? winningDeleted : winningPos !== pos ? winningPos < pos : winningId < id)) {
                winningId = id;
                winningPos = pos;
                winningDeleted = deleted;
              }
            }
            return winningPos + '-' + winningId;
          }
          function traverseRevTree(revs, callback) {
            var toVisit = revs.slice();
            var node;
            while ((node = toVisit.pop())) {
              var pos = node.pos;
              var tree = node.ids;
              var branches = tree[2];
              var newCtx = callback(branches.length === 0, pos, tree[0], node.ctx, tree[1]);
              for (var i = 0,
                  len = branches.length; i < len; i++) {
                toVisit.push({
                  pos: pos + 1,
                  ids: branches[i],
                  ctx: newCtx
                });
              }
            }
          }
          function sortByPos(a, b) {
            return a.pos - b.pos;
          }
          function collectLeaves(revs) {
            var leaves = [];
            traverseRevTree(revs, function(isLeaf, pos, id, acc, opts) {
              if (isLeaf) {
                leaves.push({
                  rev: pos + "-" + id,
                  pos: pos,
                  opts: opts
                });
              }
            });
            leaves.sort(sortByPos).reverse();
            for (var i = 0,
                len = leaves.length; i < len; i++) {
              delete leaves[i].pos;
            }
            return leaves;
          }
          function collectConflicts(metadata) {
            var win = winningRev(metadata);
            var leaves = collectLeaves(metadata.rev_tree);
            var conflicts = [];
            for (var i = 0,
                len = leaves.length; i < len; i++) {
              var leaf = leaves[i];
              if (leaf.rev !== win && !leaf.opts.deleted) {
                conflicts.push(leaf.rev);
              }
            }
            return conflicts;
          }
          function compactTree(metadata) {
            var revs = [];
            traverseRevTree(metadata.rev_tree, function(isLeaf, pos, revHash, ctx, opts) {
              if (opts.status === 'available' && !isLeaf) {
                revs.push(pos + '-' + revHash);
                opts.status = 'missing';
              }
            });
            return revs;
          }
          function rootToLeaf(revs) {
            var paths = [];
            var toVisit = revs.slice();
            var node;
            while ((node = toVisit.pop())) {
              var pos = node.pos;
              var tree = node.ids;
              var id = tree[0];
              var opts = tree[1];
              var branches = tree[2];
              var isLeaf = branches.length === 0;
              var history = node.history ? node.history.slice() : [];
              history.push({
                id: id,
                opts: opts
              });
              if (isLeaf) {
                paths.push({
                  pos: (pos + 1 - history.length),
                  ids: history
                });
              }
              for (var i = 0,
                  len = branches.length; i < len; i++) {
                toVisit.push({
                  pos: pos + 1,
                  ids: branches[i],
                  history: history
                });
              }
            }
            return paths.reverse();
          }
          function sortByPos$1(a, b) {
            return a.pos - b.pos;
          }
          function binarySearch(arr, item, comparator) {
            var low = 0;
            var high = arr.length;
            var mid;
            while (low < high) {
              mid = (low + high) >>> 1;
              if (comparator(arr[mid], item) < 0) {
                low = mid + 1;
              } else {
                high = mid;
              }
            }
            return low;
          }
          function insertSorted(arr, item, comparator) {
            var idx = binarySearch(arr, item, comparator);
            arr.splice(idx, 0, item);
          }
          function pathToTree(path, numStemmed) {
            var root;
            var leaf;
            for (var i = numStemmed,
                len = path.length; i < len; i++) {
              var node = path[i];
              var currentLeaf = [node.id, node.opts, []];
              if (leaf) {
                leaf[2].push(currentLeaf);
                leaf = currentLeaf;
              } else {
                root = leaf = currentLeaf;
              }
            }
            return root;
          }
          function compareTree(a, b) {
            return a[0] < b[0] ? -1 : 1;
          }
          function mergeTree(in_tree1, in_tree2) {
            var queue = [{
              tree1: in_tree1,
              tree2: in_tree2
            }];
            var conflicts = false;
            while (queue.length > 0) {
              var item = queue.pop();
              var tree1 = item.tree1;
              var tree2 = item.tree2;
              if (tree1[1].status || tree2[1].status) {
                tree1[1].status = (tree1[1].status === 'available' || tree2[1].status === 'available') ? 'available' : 'missing';
              }
              for (var i = 0; i < tree2[2].length; i++) {
                if (!tree1[2][0]) {
                  conflicts = 'new_leaf';
                  tree1[2][0] = tree2[2][i];
                  continue;
                }
                var merged = false;
                for (var j = 0; j < tree1[2].length; j++) {
                  if (tree1[2][j][0] === tree2[2][i][0]) {
                    queue.push({
                      tree1: tree1[2][j],
                      tree2: tree2[2][i]
                    });
                    merged = true;
                  }
                }
                if (!merged) {
                  conflicts = 'new_branch';
                  insertSorted(tree1[2], tree2[2][i], compareTree);
                }
              }
            }
            return {
              conflicts: conflicts,
              tree: in_tree1
            };
          }
          function doMerge(tree, path, dontExpand) {
            var restree = [];
            var conflicts = false;
            var merged = false;
            var res;
            if (!tree.length) {
              return {
                tree: [path],
                conflicts: 'new_leaf'
              };
            }
            for (var i = 0,
                len = tree.length; i < len; i++) {
              var branch = tree[i];
              if (branch.pos === path.pos && branch.ids[0] === path.ids[0]) {
                res = mergeTree(branch.ids, path.ids);
                restree.push({
                  pos: branch.pos,
                  ids: res.tree
                });
                conflicts = conflicts || res.conflicts;
                merged = true;
              } else if (dontExpand !== true) {
                var t1 = branch.pos < path.pos ? branch : path;
                var t2 = branch.pos < path.pos ? path : branch;
                var diff = t2.pos - t1.pos;
                var candidateParents = [];
                var trees = [];
                trees.push({
                  ids: t1.ids,
                  diff: diff,
                  parent: null,
                  parentIdx: null
                });
                while (trees.length > 0) {
                  var item = trees.pop();
                  if (item.diff === 0) {
                    if (item.ids[0] === t2.ids[0]) {
                      candidateParents.push(item);
                    }
                    continue;
                  }
                  var elements = item.ids[2];
                  for (var j = 0,
                      elementsLen = elements.length; j < elementsLen; j++) {
                    trees.push({
                      ids: elements[j],
                      diff: item.diff - 1,
                      parent: item.ids,
                      parentIdx: j
                    });
                  }
                }
                var el = candidateParents[0];
                if (!el) {
                  restree.push(branch);
                } else {
                  res = mergeTree(el.ids, t2.ids);
                  el.parent[2][el.parentIdx] = res.tree;
                  restree.push({
                    pos: t1.pos,
                    ids: t1.ids
                  });
                  conflicts = conflicts || res.conflicts;
                  merged = true;
                }
              } else {
                restree.push(branch);
              }
            }
            if (!merged) {
              restree.push(path);
            }
            restree.sort(sortByPos$1);
            return {
              tree: restree,
              conflicts: conflicts || 'internal_node'
            };
          }
          function stem(tree, depth) {
            var paths = rootToLeaf(tree);
            var stemmedRevs;
            var result;
            for (var i = 0,
                len = paths.length; i < len; i++) {
              var path = paths[i];
              var stemmed = path.ids;
              var node;
              if (stemmed.length > depth) {
                if (!stemmedRevs) {
                  stemmedRevs = {};
                }
                var numStemmed = stemmed.length - depth;
                node = {
                  pos: path.pos + numStemmed,
                  ids: pathToTree(stemmed, numStemmed)
                };
                for (var s = 0; s < numStemmed; s++) {
                  var rev = (path.pos + s) + '-' + stemmed[s].id;
                  stemmedRevs[rev] = true;
                }
              } else {
                node = {
                  pos: path.pos,
                  ids: pathToTree(stemmed, 0)
                };
              }
              if (result) {
                result = doMerge(result, node, true).tree;
              } else {
                result = [node];
              }
            }
            if (stemmedRevs) {
              traverseRevTree(result, function(isLeaf, pos, revHash) {
                delete stemmedRevs[pos + '-' + revHash];
              });
            }
            return {
              tree: result,
              revs: stemmedRevs ? Object.keys(stemmedRevs) : []
            };
          }
          function merge(tree, path, depth) {
            var newTree = doMerge(tree, path);
            var stemmed = stem(newTree.tree, depth);
            return {
              tree: stemmed.tree,
              stemmedRevs: stemmed.revs,
              conflicts: newTree.conflicts
            };
          }
          function revExists(revs, rev) {
            var toVisit = revs.slice();
            var splitRev = rev.split('-');
            var targetPos = parseInt(splitRev[0], 10);
            var targetId = splitRev[1];
            var node;
            while ((node = toVisit.pop())) {
              if (node.pos === targetPos && node.ids[0] === targetId) {
                return true;
              }
              var branches = node.ids[2];
              for (var i = 0,
                  len = branches.length; i < len; i++) {
                toVisit.push({
                  pos: node.pos + 1,
                  ids: branches[i]
                });
              }
            }
            return false;
          }
          function getTrees(node) {
            return node.ids;
          }
          function isDeleted(metadata, rev) {
            if (!rev) {
              rev = winningRev(metadata);
            }
            var id = rev.substring(rev.indexOf('-') + 1);
            var toVisit = metadata.rev_tree.map(getTrees);
            var tree;
            while ((tree = toVisit.pop())) {
              if (tree[0] === id) {
                return !!tree[1].deleted;
              }
              toVisit = toVisit.concat(tree[2]);
            }
          }
          function isLocalId(id) {
            return (/^_local/).test(id);
          }
          function latest(rev, metadata) {
            var toVisit = metadata.rev_tree.slice();
            var node;
            while ((node = toVisit.pop())) {
              var pos = node.pos;
              var tree = node.ids;
              var id = tree[0];
              var opts = tree[1];
              var branches = tree[2];
              var isLeaf = branches.length === 0;
              var history = node.history ? node.history.slice() : [];
              history.push({
                id: id,
                pos: pos,
                opts: opts
              });
              if (isLeaf) {
                for (var i = 0,
                    len = history.length; i < len; i++) {
                  var historyNode = history[i];
                  var historyRev = historyNode.pos + '-' + historyNode.id;
                  if (historyRev === rev) {
                    return pos + '-' + id;
                  }
                }
              }
              for (var j = 0,
                  l = branches.length; j < l; j++) {
                toVisit.push({
                  pos: pos + 1,
                  ids: branches[j],
                  history: history
                });
              }
            }
            throw new Error('Unable to resolve latest revision for id ' + metadata.id + ', rev ' + rev);
          }
          inherits(Changes$2, events.EventEmitter);
          function tryCatchInChangeListener(self, change) {
            try {
              self.emit('change', change);
            } catch (e) {
              guardedConsole('error', 'Error in .on("change", function):', e);
            }
          }
          function Changes$2(db, opts, callback) {
            events.EventEmitter.call(this);
            var self = this;
            this.db = db;
            opts = opts ? clone(opts) : {};
            var complete = opts.complete = once(function(err, resp) {
              if (err) {
                if (listenerCount(self, 'error') > 0) {
                  self.emit('error', err);
                }
              } else {
                self.emit('complete', resp);
              }
              self.removeAllListeners();
              db.removeListener('destroyed', onDestroy);
            });
            if (callback) {
              self.on('complete', function(resp) {
                callback(null, resp);
              });
              self.on('error', callback);
            }
            function onDestroy() {
              self.cancel();
            }
            db.once('destroyed', onDestroy);
            opts.onChange = function(change) {
              if (self.isCancelled) {
                return;
              }
              tryCatchInChangeListener(self, change);
            };
            var promise = new PouchPromise$1(function(fulfill, reject) {
              opts.complete = function(err, res) {
                if (err) {
                  reject(err);
                } else {
                  fulfill(res);
                }
              };
            });
            self.once('cancel', function() {
              db.removeListener('destroyed', onDestroy);
              opts.complete(null, {status: 'cancelled'});
            });
            this.then = promise.then.bind(promise);
            this['catch'] = promise['catch'].bind(promise);
            this.then(function(result) {
              complete(null, result);
            }, complete);
            if (!db.taskqueue.isReady) {
              db.taskqueue.addTask(function(failed) {
                if (failed) {
                  opts.complete(failed);
                } else if (self.isCancelled) {
                  self.emit('cancel');
                } else {
                  self.validateChanges(opts);
                }
              });
            } else {
              self.validateChanges(opts);
            }
          }
          Changes$2.prototype.cancel = function() {
            this.isCancelled = true;
            if (this.db.taskqueue.isReady) {
              this.emit('cancel');
            }
          };
          function processChange(doc, metadata, opts) {
            var changeList = [{rev: doc._rev}];
            if (opts.style === 'all_docs') {
              changeList = collectLeaves(metadata.rev_tree).map(function(x) {
                return {rev: x.rev};
              });
            }
            var change = {
              id: metadata.id,
              changes: changeList,
              doc: doc
            };
            if (isDeleted(metadata, doc._rev)) {
              change.deleted = true;
            }
            if (opts.conflicts) {
              change.doc._conflicts = collectConflicts(metadata);
              if (!change.doc._conflicts.length) {
                delete change.doc._conflicts;
              }
            }
            return change;
          }
          Changes$2.prototype.validateChanges = function(opts) {
            var callback = opts.complete;
            var self = this;
            if (PouchDB$5._changesFilterPlugin) {
              PouchDB$5._changesFilterPlugin.validate(opts, function(err) {
                if (err) {
                  return callback(err);
                }
                self.doChanges(opts);
              });
            } else {
              self.doChanges(opts);
            }
          };
          Changes$2.prototype.doChanges = function(opts) {
            var self = this;
            var callback = opts.complete;
            opts = clone(opts);
            if ('live' in opts && !('continuous' in opts)) {
              opts.continuous = opts.live;
            }
            opts.processChange = processChange;
            if (opts.since === 'latest') {
              opts.since = 'now';
            }
            if (!opts.since) {
              opts.since = 0;
            }
            if (opts.since === 'now') {
              this.db.info().then(function(info) {
                if (self.isCancelled) {
                  callback(null, {status: 'cancelled'});
                  return;
                }
                opts.since = info.update_seq;
                self.doChanges(opts);
              }, callback);
              return;
            }
            if (PouchDB$5._changesFilterPlugin) {
              PouchDB$5._changesFilterPlugin.normalize(opts);
              if (PouchDB$5._changesFilterPlugin.shouldFilter(this, opts)) {
                return PouchDB$5._changesFilterPlugin.filter(this, opts);
              }
            } else {
              ['doc_ids', 'filter', 'selector', 'view'].forEach(function(key) {
                if (key in opts) {
                  guardedConsole('warn', 'The "' + key + '" option was passed in to changes/replicate, ' + 'but pouchdb-changes-filter plugin is not installed, so it ' + 'was ignored. Please install the plugin to enable filtering.');
                }
              });
            }
            if (!('descending' in opts)) {
              opts.descending = false;
            }
            opts.limit = opts.limit === 0 ? 1 : opts.limit;
            opts.complete = callback;
            var newPromise = this.db._changes(opts);
            if (newPromise && typeof newPromise.cancel === 'function') {
              var cancel = self.cancel;
              self.cancel = getArguments(function(args) {
                newPromise.cancel();
                cancel.apply(this, args);
              });
            }
          };
          function compare(left, right) {
            return left < right ? -1 : left > right ? 1 : 0;
          }
          function yankError(callback, docId) {
            return function(err, results) {
              if (err || (results[0] && results[0].error)) {
                err = err || results[0];
                err.docId = docId;
                callback(err);
              } else {
                callback(null, results.length ? results[0] : results);
              }
            };
          }
          function cleanDocs(docs) {
            for (var i = 0; i < docs.length; i++) {
              var doc = docs[i];
              if (doc._deleted) {
                delete doc._attachments;
              } else if (doc._attachments) {
                var atts = Object.keys(doc._attachments);
                for (var j = 0; j < atts.length; j++) {
                  var att = atts[j];
                  doc._attachments[att] = pick(doc._attachments[att], ['data', 'digest', 'content_type', 'length', 'revpos', 'stub']);
                }
              }
            }
          }
          function compareByIdThenRev(a, b) {
            var idCompare = compare(a._id, b._id);
            if (idCompare !== 0) {
              return idCompare;
            }
            var aStart = a._revisions ? a._revisions.start : 0;
            var bStart = b._revisions ? b._revisions.start : 0;
            return compare(aStart, bStart);
          }
          function computeHeight(revs) {
            var height = {};
            var edges = [];
            traverseRevTree(revs, function(isLeaf, pos, id, prnt) {
              var rev$$1 = pos + "-" + id;
              if (isLeaf) {
                height[rev$$1] = 0;
              }
              if (prnt !== undefined) {
                edges.push({
                  from: prnt,
                  to: rev$$1
                });
              }
              return rev$$1;
            });
            edges.reverse();
            edges.forEach(function(edge) {
              if (height[edge.from] === undefined) {
                height[edge.from] = 1 + height[edge.to];
              } else {
                height[edge.from] = Math.min(height[edge.from], 1 + height[edge.to]);
              }
            });
            return height;
          }
          function allDocsKeysQuery(api, opts, callback) {
            var keys = ('limit' in opts) ? opts.keys.slice(opts.skip, opts.limit + opts.skip) : (opts.skip > 0) ? opts.keys.slice(opts.skip) : opts.keys;
            if (opts.descending) {
              keys.reverse();
            }
            if (!keys.length) {
              return api._allDocs({limit: 0}, callback);
            }
            var finalResults = {offset: opts.skip};
            return PouchPromise$1.all(keys.map(function(key) {
              var subOpts = $inject_Object_assign({
                key: key,
                deleted: 'ok'
              }, opts);
              ['limit', 'skip', 'keys'].forEach(function(optKey) {
                delete subOpts[optKey];
              });
              return new PouchPromise$1(function(resolve, reject) {
                api._allDocs(subOpts, function(err, res) {
                  if (err) {
                    return reject(err);
                  }
                  finalResults.total_rows = res.total_rows;
                  resolve(res.rows[0] || {
                    key: key,
                    error: 'not_found'
                  });
                });
              });
            })).then(function(results) {
              finalResults.rows = results;
              return finalResults;
            });
          }
          function doNextCompaction(self) {
            var task = self._compactionQueue[0];
            var opts = task.opts;
            var callback = task.callback;
            self.get('_local/compaction')["catch"](function() {
              return false;
            }).then(function(doc) {
              if (doc && doc.last_seq) {
                opts.last_seq = doc.last_seq;
              }
              self._compact(opts, function(err, res) {
                if (err) {
                  callback(err);
                } else {
                  callback(null, res);
                }
                nextTick(function() {
                  self._compactionQueue.shift();
                  if (self._compactionQueue.length) {
                    doNextCompaction(self);
                  }
                });
              });
            });
          }
          function attachmentNameError(name) {
            if (name.charAt(0) === '_') {
              return name + ' is not a valid attachment name, attachment ' + 'names cannot start with \'_\'';
            }
            return false;
          }
          inherits(AbstractPouchDB, events.EventEmitter);
          function AbstractPouchDB() {
            events.EventEmitter.call(this);
          }
          AbstractPouchDB.prototype.post = adapterFun('post', function(doc, opts, callback) {
            if (typeof opts === 'function') {
              callback = opts;
              opts = {};
            }
            if (typeof doc !== 'object' || Array.isArray(doc)) {
              return callback(createError(NOT_AN_OBJECT));
            }
            this.bulkDocs({docs: [doc]}, opts, yankError(callback, doc._id));
          });
          AbstractPouchDB.prototype.put = adapterFun('put', function(doc, opts, cb) {
            if (typeof opts === 'function') {
              cb = opts;
              opts = {};
            }
            if (typeof doc !== 'object' || Array.isArray(doc)) {
              return cb(createError(NOT_AN_OBJECT));
            }
            invalidIdError(doc._id);
            if (isLocalId(doc._id) && typeof this._putLocal === 'function') {
              if (doc._deleted) {
                return this._removeLocal(doc, cb);
              } else {
                return this._putLocal(doc, cb);
              }
            }
            var self = this;
            if (opts.force && doc._rev) {
              transformForceOptionToNewEditsOption();
              putDoc(function(err) {
                var result = err ? null : {
                  ok: true,
                  id: doc._id,
                  rev: doc._rev
                };
                cb(err, result);
              });
            } else {
              putDoc(cb);
            }
            function transformForceOptionToNewEditsOption() {
              var parts = doc._rev.split('-');
              var oldRevId = parts[1];
              var oldRevNum = parseInt(parts[0], 10);
              var newRevNum = oldRevNum + 1;
              var newRevId = rev();
              doc._revisions = {
                start: newRevNum,
                ids: [newRevId, oldRevId]
              };
              doc._rev = newRevNum + '-' + newRevId;
              opts.new_edits = false;
            }
            function putDoc(next) {
              if (typeof self._put === 'function' && opts.new_edits !== false) {
                self._put(doc, opts, next);
              } else {
                self.bulkDocs({docs: [doc]}, opts, yankError(next, doc._id));
              }
            }
          });
          AbstractPouchDB.prototype.putAttachment = adapterFun('putAttachment', function(docId, attachmentId, rev$$1, blob, type) {
            var api = this;
            if (typeof type === 'function') {
              type = blob;
              blob = rev$$1;
              rev$$1 = null;
            }
            if (typeof type === 'undefined') {
              type = blob;
              blob = rev$$1;
              rev$$1 = null;
            }
            if (!type) {
              guardedConsole('warn', 'Attachment', attachmentId, 'on document', docId, 'is missing content_type');
            }
            function createAttachment(doc) {
              var prevrevpos = '_rev' in doc ? parseInt(doc._rev, 10) : 0;
              doc._attachments = doc._attachments || {};
              doc._attachments[attachmentId] = {
                content_type: type,
                data: blob,
                revpos: ++prevrevpos
              };
              return api.put(doc);
            }
            return api.get(docId).then(function(doc) {
              if (doc._rev !== rev$$1) {
                throw createError(REV_CONFLICT);
              }
              return createAttachment(doc);
            }, function(err) {
              if (err.reason === MISSING_DOC.message) {
                return createAttachment({_id: docId});
              } else {
                throw err;
              }
            });
          });
          AbstractPouchDB.prototype.removeAttachment = adapterFun('removeAttachment', function(docId, attachmentId, rev$$1, callback) {
            var self = this;
            self.get(docId, function(err, obj) {
              if (err) {
                callback(err);
                return;
              }
              if (obj._rev !== rev$$1) {
                callback(createError(REV_CONFLICT));
                return;
              }
              if (!obj._attachments) {
                return callback();
              }
              delete obj._attachments[attachmentId];
              if (Object.keys(obj._attachments).length === 0) {
                delete obj._attachments;
              }
              self.put(obj, callback);
            });
          });
          AbstractPouchDB.prototype.remove = adapterFun('remove', function(docOrId, optsOrRev, opts, callback) {
            var doc;
            if (typeof optsOrRev === 'string') {
              doc = {
                _id: docOrId,
                _rev: optsOrRev
              };
              if (typeof opts === 'function') {
                callback = opts;
                opts = {};
              }
            } else {
              doc = docOrId;
              if (typeof optsOrRev === 'function') {
                callback = optsOrRev;
                opts = {};
              } else {
                callback = opts;
                opts = optsOrRev;
              }
            }
            opts = opts || {};
            opts.was_delete = true;
            var newDoc = {
              _id: doc._id,
              _rev: (doc._rev || opts.rev)
            };
            newDoc._deleted = true;
            if (isLocalId(newDoc._id) && typeof this._removeLocal === 'function') {
              return this._removeLocal(doc, callback);
            }
            this.bulkDocs({docs: [newDoc]}, opts, yankError(callback, newDoc._id));
          });
          AbstractPouchDB.prototype.revsDiff = adapterFun('revsDiff', function(req, opts, callback) {
            if (typeof opts === 'function') {
              callback = opts;
              opts = {};
            }
            var ids = Object.keys(req);
            if (!ids.length) {
              return callback(null, {});
            }
            var count = 0;
            var missing = new ExportedMap();
            function addToMissing(id, revId) {
              if (!missing.has(id)) {
                missing.set(id, {missing: []});
              }
              missing.get(id).missing.push(revId);
            }
            function processDoc(id, rev_tree) {
              var missingForId = req[id].slice(0);
              traverseRevTree(rev_tree, function(isLeaf, pos, revHash, ctx, opts) {
                var rev$$1 = pos + '-' + revHash;
                var idx = missingForId.indexOf(rev$$1);
                if (idx === -1) {
                  return;
                }
                missingForId.splice(idx, 1);
                if (opts.status !== 'available') {
                  addToMissing(id, rev$$1);
                }
              });
              missingForId.forEach(function(rev$$1) {
                addToMissing(id, rev$$1);
              });
            }
            ids.map(function(id) {
              this._getRevisionTree(id, function(err, rev_tree) {
                if (err && err.status === 404 && err.message === 'missing') {
                  missing.set(id, {missing: req[id]});
                } else if (err) {
                  return callback(err);
                } else {
                  processDoc(id, rev_tree);
                }
                if (++count === ids.length) {
                  var missingObj = {};
                  missing.forEach(function(value, key) {
                    missingObj[key] = value;
                  });
                  return callback(null, missingObj);
                }
              });
            }, this);
          });
          AbstractPouchDB.prototype.bulkGet = adapterFun('bulkGet', function(opts, callback) {
            bulkGet(this, opts, callback);
          });
          AbstractPouchDB.prototype.compactDocument = adapterFun('compactDocument', function(docId, maxHeight, callback) {
            var self = this;
            this._getRevisionTree(docId, function(err, revTree) {
              if (err) {
                return callback(err);
              }
              var height = computeHeight(revTree);
              var candidates = [];
              var revs = [];
              Object.keys(height).forEach(function(rev$$1) {
                if (height[rev$$1] > maxHeight) {
                  candidates.push(rev$$1);
                }
              });
              traverseRevTree(revTree, function(isLeaf, pos, revHash, ctx, opts) {
                var rev$$1 = pos + '-' + revHash;
                if (opts.status === 'available' && candidates.indexOf(rev$$1) !== -1) {
                  revs.push(rev$$1);
                }
              });
              self._doCompaction(docId, revs, callback);
            });
          });
          AbstractPouchDB.prototype.compact = adapterFun('compact', function(opts, callback) {
            if (typeof opts === 'function') {
              callback = opts;
              opts = {};
            }
            var self = this;
            opts = opts || {};
            self._compactionQueue = self._compactionQueue || [];
            self._compactionQueue.push({
              opts: opts,
              callback: callback
            });
            if (self._compactionQueue.length === 1) {
              doNextCompaction(self);
            }
          });
          AbstractPouchDB.prototype._compact = function(opts, callback) {
            var self = this;
            var changesOpts = {
              return_docs: false,
              last_seq: opts.last_seq || 0
            };
            var promises = [];
            function onChange(row) {
              promises.push(self.compactDocument(row.id, 0));
            }
            function onComplete(resp) {
              var lastSeq = resp.last_seq;
              PouchPromise$1.all(promises).then(function() {
                return upsert(self, '_local/compaction', function deltaFunc(doc) {
                  if (!doc.last_seq || doc.last_seq < lastSeq) {
                    doc.last_seq = lastSeq;
                    return doc;
                  }
                  return false;
                });
              }).then(function() {
                callback(null, {ok: true});
              })["catch"](callback);
            }
            self.changes(changesOpts).on('change', onChange).on('complete', onComplete).on('error', callback);
          };
          AbstractPouchDB.prototype.get = adapterFun('get', function(id, opts, cb) {
            if (typeof opts === 'function') {
              cb = opts;
              opts = {};
            }
            if (typeof id !== 'string') {
              return cb(createError(INVALID_ID));
            }
            if (isLocalId(id) && typeof this._getLocal === 'function') {
              return this._getLocal(id, cb);
            }
            var leaves = [],
                self = this;
            function finishOpenRevs() {
              var result = [];
              var count = leaves.length;
              if (!count) {
                return cb(null, result);
              }
              leaves.forEach(function(leaf) {
                self.get(id, {
                  rev: leaf,
                  revs: opts.revs,
                  latest: opts.latest,
                  attachments: opts.attachments
                }, function(err, doc) {
                  if (!err) {
                    var existing;
                    for (var i = 0,
                        l = result.length; i < l; i++) {
                      if (result[i].ok && result[i].ok._rev === doc._rev) {
                        existing = true;
                        break;
                      }
                    }
                    if (!existing) {
                      result.push({ok: doc});
                    }
                  } else {
                    result.push({missing: leaf});
                  }
                  count--;
                  if (!count) {
                    cb(null, result);
                  }
                });
              });
            }
            if (opts.open_revs) {
              if (opts.open_revs === "all") {
                this._getRevisionTree(id, function(err, rev_tree) {
                  if (err) {
                    return cb(err);
                  }
                  leaves = collectLeaves(rev_tree).map(function(leaf) {
                    return leaf.rev;
                  });
                  finishOpenRevs();
                });
              } else {
                if (Array.isArray(opts.open_revs)) {
                  leaves = opts.open_revs;
                  for (var i = 0; i < leaves.length; i++) {
                    var l = leaves[i];
                    if (!(typeof(l) === "string" && /^\d+-/.test(l))) {
                      return cb(createError(INVALID_REV));
                    }
                  }
                  finishOpenRevs();
                } else {
                  return cb(createError(UNKNOWN_ERROR, 'function_clause'));
                }
              }
              return;
            }
            return this._get(id, opts, function(err, result) {
              if (err) {
                err.docId = id;
                return cb(err);
              }
              var doc = result.doc;
              var metadata = result.metadata;
              var ctx = result.ctx;
              if (opts.conflicts) {
                var conflicts = collectConflicts(metadata);
                if (conflicts.length) {
                  doc._conflicts = conflicts;
                }
              }
              if (isDeleted(metadata, doc._rev)) {
                doc._deleted = true;
              }
              if (opts.revs || opts.revs_info) {
                var splittedRev = doc._rev.split('-');
                var revNo = parseInt(splittedRev[0], 10);
                var revHash = splittedRev[1];
                var paths = rootToLeaf(metadata.rev_tree);
                var path = null;
                for (var i = 0; i < paths.length; i++) {
                  var currentPath = paths[i];
                  var hashIndex = currentPath.ids.map(function(x) {
                    return x.id;
                  }).indexOf(revHash);
                  var hashFoundAtRevPos = hashIndex === (revNo - 1);
                  if (hashFoundAtRevPos || (!path && hashIndex !== -1)) {
                    path = currentPath;
                  }
                }
                var indexOfRev = path.ids.map(function(x) {
                  return x.id;
                }).indexOf(doc._rev.split('-')[1]) + 1;
                var howMany = path.ids.length - indexOfRev;
                path.ids.splice(indexOfRev, howMany);
                path.ids.reverse();
                if (opts.revs) {
                  doc._revisions = {
                    start: (path.pos + path.ids.length) - 1,
                    ids: path.ids.map(function(rev$$1) {
                      return rev$$1.id;
                    })
                  };
                }
                if (opts.revs_info) {
                  var pos = path.pos + path.ids.length;
                  doc._revs_info = path.ids.map(function(rev$$1) {
                    pos--;
                    return {
                      rev: pos + '-' + rev$$1.id,
                      status: rev$$1.opts.status
                    };
                  });
                }
              }
              if (opts.attachments && doc._attachments) {
                var attachments = doc._attachments;
                var count = Object.keys(attachments).length;
                if (count === 0) {
                  return cb(null, doc);
                }
                Object.keys(attachments).forEach(function(key) {
                  this._getAttachment(doc._id, key, attachments[key], {
                    rev: doc._rev,
                    binary: opts.binary,
                    ctx: ctx
                  }, function(err, data) {
                    var att = doc._attachments[key];
                    att.data = data;
                    delete att.stub;
                    delete att.length;
                    if (!--count) {
                      cb(null, doc);
                    }
                  });
                }, self);
              } else {
                if (doc._attachments) {
                  for (var key in doc._attachments) {
                    if (doc._attachments.hasOwnProperty(key)) {
                      doc._attachments[key].stub = true;
                    }
                  }
                }
                cb(null, doc);
              }
            });
          });
          AbstractPouchDB.prototype.getAttachment = adapterFun('getAttachment', function(docId, attachmentId, opts, callback) {
            var self = this;
            if (opts instanceof Function) {
              callback = opts;
              opts = {};
            }
            this._get(docId, opts, function(err, res) {
              if (err) {
                return callback(err);
              }
              if (res.doc._attachments && res.doc._attachments[attachmentId]) {
                opts.ctx = res.ctx;
                opts.binary = true;
                self._getAttachment(docId, attachmentId, res.doc._attachments[attachmentId], opts, callback);
              } else {
                return callback(createError(MISSING_DOC));
              }
            });
          });
          AbstractPouchDB.prototype.allDocs = adapterFun('allDocs', function(opts, callback) {
            if (typeof opts === 'function') {
              callback = opts;
              opts = {};
            }
            opts.skip = typeof opts.skip !== 'undefined' ? opts.skip : 0;
            if (opts.start_key) {
              opts.startkey = opts.start_key;
            }
            if (opts.end_key) {
              opts.endkey = opts.end_key;
            }
            if ('keys' in opts) {
              if (!Array.isArray(opts.keys)) {
                return callback(new TypeError('options.keys must be an array'));
              }
              var incompatibleOpt = ['startkey', 'endkey', 'key'].filter(function(incompatibleOpt) {
                return incompatibleOpt in opts;
              })[0];
              if (incompatibleOpt) {
                callback(createError(QUERY_PARSE_ERROR, 'Query parameter `' + incompatibleOpt + '` is not compatible with multi-get'));
                return;
              }
              if (!isRemote(this)) {
                return allDocsKeysQuery(this, opts, callback);
              }
            }
            return this._allDocs(opts, callback);
          });
          AbstractPouchDB.prototype.changes = function(opts, callback) {
            if (typeof opts === 'function') {
              callback = opts;
              opts = {};
            }
            return new Changes$2(this, opts, callback);
          };
          AbstractPouchDB.prototype.close = adapterFun('close', function(callback) {
            this._closed = true;
            this.emit('closed');
            return this._close(callback);
          });
          AbstractPouchDB.prototype.info = adapterFun('info', function(callback) {
            var self = this;
            this._info(function(err, info) {
              if (err) {
                return callback(err);
              }
              info.db_name = info.db_name || self.name;
              info.auto_compaction = !!(self.auto_compaction && !isRemote(self));
              info.adapter = self.adapter;
              callback(null, info);
            });
          });
          AbstractPouchDB.prototype.id = adapterFun('id', function(callback) {
            return this._id(callback);
          });
          AbstractPouchDB.prototype.type = function() {
            return (typeof this._type === 'function') ? this._type() : this.adapter;
          };
          AbstractPouchDB.prototype.bulkDocs = adapterFun('bulkDocs', function(req, opts, callback) {
            if (typeof opts === 'function') {
              callback = opts;
              opts = {};
            }
            opts = opts || {};
            if (Array.isArray(req)) {
              req = {docs: req};
            }
            if (!req || !req.docs || !Array.isArray(req.docs)) {
              return callback(createError(MISSING_BULK_DOCS));
            }
            for (var i = 0; i < req.docs.length; ++i) {
              if (typeof req.docs[i] !== 'object' || Array.isArray(req.docs[i])) {
                return callback(createError(NOT_AN_OBJECT));
              }
            }
            var attachmentError;
            req.docs.forEach(function(doc) {
              if (doc._attachments) {
                Object.keys(doc._attachments).forEach(function(name) {
                  attachmentError = attachmentError || attachmentNameError(name);
                  if (!doc._attachments[name].content_type) {
                    guardedConsole('warn', 'Attachment', name, 'on document', doc._id, 'is missing content_type');
                  }
                });
              }
            });
            if (attachmentError) {
              return callback(createError(BAD_REQUEST, attachmentError));
            }
            if (!('new_edits' in opts)) {
              if ('new_edits' in req) {
                opts.new_edits = req.new_edits;
              } else {
                opts.new_edits = true;
              }
            }
            var adapter = this;
            if (!opts.new_edits && !isRemote(adapter)) {
              req.docs.sort(compareByIdThenRev);
            }
            cleanDocs(req.docs);
            var ids = req.docs.map(function(doc) {
              return doc._id;
            });
            return this._bulkDocs(req, opts, function(err, res) {
              if (err) {
                return callback(err);
              }
              if (!opts.new_edits) {
                res = res.filter(function(x) {
                  return x.error;
                });
              }
              if (!isRemote(adapter)) {
                for (var i = 0,
                    l = res.length; i < l; i++) {
                  res[i].id = res[i].id || ids[i];
                }
              }
              callback(null, res);
            });
          });
          AbstractPouchDB.prototype.registerDependentDatabase = adapterFun('registerDependentDatabase', function(dependentDb, callback) {
            var depDB = new this.constructor(dependentDb, this.__opts);
            function diffFun(doc) {
              doc.dependentDbs = doc.dependentDbs || {};
              if (doc.dependentDbs[dependentDb]) {
                return false;
              }
              doc.dependentDbs[dependentDb] = true;
              return doc;
            }
            upsert(this, '_local/_pouch_dependentDbs', diffFun).then(function() {
              callback(null, {db: depDB});
            })["catch"](callback);
          });
          AbstractPouchDB.prototype.destroy = adapterFun('destroy', function(opts, callback) {
            if (typeof opts === 'function') {
              callback = opts;
              opts = {};
            }
            var self = this;
            var usePrefix = 'use_prefix' in self ? self.use_prefix : true;
            function destroyDb() {
              self._destroy(opts, function(err, resp) {
                if (err) {
                  return callback(err);
                }
                self._destroyed = true;
                self.emit('destroyed');
                callback(null, resp || {'ok': true});
              });
            }
            if (isRemote(self)) {
              return destroyDb();
            }
            self.get('_local/_pouch_dependentDbs', function(err, localDoc) {
              if (err) {
                if (err.status !== 404) {
                  return callback(err);
                } else {
                  return destroyDb();
                }
              }
              var dependentDbs = localDoc.dependentDbs;
              var PouchDB = self.constructor;
              var deletedMap = Object.keys(dependentDbs).map(function(name) {
                var trueName = usePrefix ? name.replace(new RegExp('^' + PouchDB.prefix), '') : name;
                return new PouchDB(trueName, self.__opts).destroy();
              });
              PouchPromise$1.all(deletedMap).then(destroyDb, callback);
            });
          });
          function TaskQueue$1() {
            this.isReady = false;
            this.failed = false;
            this.queue = [];
          }
          TaskQueue$1.prototype.execute = function() {
            var fun;
            if (this.failed) {
              while ((fun = this.queue.shift())) {
                fun(this.failed);
              }
            } else {
              while ((fun = this.queue.shift())) {
                fun();
              }
            }
          };
          TaskQueue$1.prototype.fail = function(err) {
            this.failed = err;
            this.execute();
          };
          TaskQueue$1.prototype.ready = function(db) {
            this.isReady = true;
            this.db = db;
            this.execute();
          };
          TaskQueue$1.prototype.addTask = function(fun) {
            this.queue.push(fun);
            if (this.failed) {
              this.execute();
            }
          };
          function parseAdapter(name, opts) {
            var match = name.match(/([a-z-]*):\/\/(.*)/);
            if (match) {
              return {
                name: /https?/.test(match[1]) ? match[1] + '://' + match[2] : match[2],
                adapter: match[1]
              };
            }
            var adapters = PouchDB$5.adapters;
            var preferredAdapters = PouchDB$5.preferredAdapters;
            var prefix = PouchDB$5.prefix;
            var adapterName = opts.adapter;
            if (!adapterName) {
              for (var i = 0; i < preferredAdapters.length; ++i) {
                adapterName = preferredAdapters[i];
                if (adapterName === 'idb' && 'websql' in adapters && hasLocalStorage() && localStorage['_pouch__websqldb_' + prefix + name]) {
                  guardedConsole('log', 'PouchDB is downgrading "' + name + '" to WebSQL to' + ' avoid data loss, because it was already opened with WebSQL.');
                  continue;
                }
                break;
              }
            }
            var adapter = adapters[adapterName];
            var usePrefix = (adapter && 'use_prefix' in adapter) ? adapter.use_prefix : true;
            return {
              name: usePrefix ? (prefix + name) : name,
              adapter: adapterName
            };
          }
          function prepareForDestruction(self) {
            function onDestroyed(from_constructor) {
              self.removeListener('closed', onClosed);
              if (!from_constructor) {
                self.constructor.emit('destroyed', self.name);
              }
            }
            function onClosed() {
              self.removeListener('destroyed', onDestroyed);
              self.constructor.emit('unref', self);
            }
            self.once('destroyed', onDestroyed);
            self.once('closed', onClosed);
            self.constructor.emit('ref', self);
          }
          inherits(PouchDB$5, AbstractPouchDB);
          function PouchDB$5(name, opts) {
            if (!(this instanceof PouchDB$5)) {
              return new PouchDB$5(name, opts);
            }
            var self = this;
            opts = opts || {};
            if (name && typeof name === 'object') {
              opts = name;
              name = opts.name;
              delete opts.name;
            }
            this.__opts = opts = clone(opts);
            self.auto_compaction = opts.auto_compaction;
            self.prefix = PouchDB$5.prefix;
            if (typeof name !== 'string') {
              throw new Error('Missing/invalid DB name');
            }
            var prefixedName = (opts.prefix || '') + name;
            var backend = parseAdapter(prefixedName, opts);
            opts.name = backend.name;
            opts.adapter = opts.adapter || backend.adapter;
            self.name = name;
            self._adapter = opts.adapter;
            PouchDB$5.emit('debug', ['adapter', 'Picked adapter: ', opts.adapter]);
            if (!PouchDB$5.adapters[opts.adapter] || !PouchDB$5.adapters[opts.adapter].valid()) {
              throw new Error('Invalid Adapter: ' + opts.adapter);
            }
            AbstractPouchDB.call(self);
            self.taskqueue = new TaskQueue$1();
            self.adapter = opts.adapter;
            PouchDB$5.adapters[opts.adapter].call(self, opts, function(err) {
              if (err) {
                return self.taskqueue.fail(err);
              }
              prepareForDestruction(self);
              self.emit('created', self);
              PouchDB$5.emit('created', self.name);
              self.taskqueue.ready(self);
            });
          }
          PouchDB$5.adapters = {};
          PouchDB$5.preferredAdapters = [];
          PouchDB$5.prefix = '_pouch_';
          var eventEmitter = new events.EventEmitter();
          function setUpEventEmitter(Pouch) {
            Object.keys(events.EventEmitter.prototype).forEach(function(key) {
              if (typeof events.EventEmitter.prototype[key] === 'function') {
                Pouch[key] = eventEmitter[key].bind(eventEmitter);
              }
            });
            var destructListeners = Pouch._destructionListeners = new ExportedMap();
            Pouch.on('ref', function onConstructorRef(db) {
              if (!destructListeners.has(db.name)) {
                destructListeners.set(db.name, []);
              }
              destructListeners.get(db.name).push(db);
            });
            Pouch.on('unref', function onConstructorUnref(db) {
              if (!destructListeners.has(db.name)) {
                return;
              }
              var dbList = destructListeners.get(db.name);
              var pos = dbList.indexOf(db);
              if (pos < 0) {
                return;
              }
              dbList.splice(pos, 1);
              if (dbList.length > 1) {
                destructListeners.set(db.name, dbList);
              } else {
                destructListeners["delete"](db.name);
              }
            });
            Pouch.on('destroyed', function onConstructorDestroyed(name) {
              if (!destructListeners.has(name)) {
                return;
              }
              var dbList = destructListeners.get(name);
              destructListeners["delete"](name);
              dbList.forEach(function(db) {
                db.emit('destroyed', true);
              });
            });
          }
          setUpEventEmitter(PouchDB$5);
          PouchDB$5.adapter = function(id, obj, addToPreferredAdapters) {
            if (obj.valid()) {
              PouchDB$5.adapters[id] = obj;
              if (addToPreferredAdapters) {
                PouchDB$5.preferredAdapters.push(id);
              }
            }
          };
          PouchDB$5.plugin = function(obj) {
            if (typeof obj === 'function') {
              obj(PouchDB$5);
            } else if (typeof obj !== 'object' || Object.keys(obj).length === 0) {
              throw new Error('Invalid plugin: got "' + obj + '", expected an object or a function');
            } else {
              Object.keys(obj).forEach(function(id) {
                PouchDB$5.prototype[id] = obj[id];
              });
            }
            if (this.__defaults) {
              PouchDB$5.__defaults = $inject_Object_assign({}, this.__defaults);
            }
            return PouchDB$5;
          };
          PouchDB$5.defaults = function(defaultOpts) {
            function PouchAlt(name, opts) {
              if (!(this instanceof PouchAlt)) {
                return new PouchAlt(name, opts);
              }
              opts = opts || {};
              if (name && typeof name === 'object') {
                opts = name;
                name = opts.name;
                delete opts.name;
              }
              opts = $inject_Object_assign({}, PouchAlt.__defaults, opts);
              PouchDB$5.call(this, name, opts);
            }
            inherits(PouchAlt, PouchDB$5);
            PouchAlt.preferredAdapters = PouchDB$5.preferredAdapters.slice();
            Object.keys(PouchDB$5).forEach(function(key) {
              if (!(key in PouchAlt)) {
                PouchAlt[key] = PouchDB$5[key];
              }
            });
            PouchAlt.__defaults = $inject_Object_assign({}, this.__defaults, defaultOpts);
            return PouchAlt;
          };
          var version = "6.3.2";
          function debugPouch(PouchDB) {
            PouchDB.debug = debug;
            var logs = {};
            PouchDB.on('debug', function(args) {
              var logId = args[0];
              var logArgs = args.slice(1);
              if (!logs[logId]) {
                logs[logId] = debug('pouchdb:' + logId);
              }
              logs[logId].apply(null, logArgs);
            });
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
          function compare$1(left, right) {
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
              return compare$1(aRow.doc._id, bRow.doc._id);
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
          function matchesSelector(doc, selector) {
            if (typeof selector !== 'object') {
              throw new Error('Selector error: expected a JSON object');
            }
            selector = massageSelector(selector);
            var row = {'doc': doc};
            var rowsMatched = filterInMemoryFields([row], {'selector': selector}, Object.keys(selector));
            return rowsMatched && rowsMatched.length === 1;
          }
          function evalFilter(input) {
            return scopeEval('"use strict";\nreturn ' + input + ';', {});
          }
          function evalView(input) {
            var code = ['return function(doc) {', '  "use strict";', '  var emitted = false;', '  var emit = function (a, b) {', '    emitted = true;', '  };', '  var view = ' + input + ';', '  view(doc);', '  if (emitted) {', '    return true;', '  }', '};'].join('\n');
            return scopeEval(code, {});
          }
          function validate(opts, callback) {
            if (opts.selector) {
              if (opts.filter && opts.filter !== '_selector') {
                var filterName = typeof opts.filter === 'string' ? opts.filter : 'function';
                return callback(new Error('selector invalid for filter "' + filterName + '"'));
              }
            }
            callback();
          }
          function normalize(opts) {
            if (opts.view && !opts.filter) {
              opts.filter = '_view';
            }
            if (opts.selector && !opts.filter) {
              opts.filter = '_selector';
            }
            if (opts.filter && typeof opts.filter === 'string') {
              if (opts.filter === '_view') {
                opts.view = normalizeDesignDocFunctionName(opts.view);
              } else {
                opts.filter = normalizeDesignDocFunctionName(opts.filter);
              }
            }
          }
          function shouldFilter(changesHandler, opts) {
            return opts.filter && typeof opts.filter === 'string' && !opts.doc_ids && !isRemote(changesHandler.db);
          }
          function filter(changesHandler, opts) {
            var callback = opts.complete;
            if (opts.filter === '_view') {
              if (!opts.view || typeof opts.view !== 'string') {
                var err = createError(BAD_REQUEST, '`view` filter parameter not found or invalid.');
                return callback(err);
              }
              var viewName = parseDesignDocFunctionName(opts.view);
              changesHandler.db.get('_design/' + viewName[0], function(err, ddoc) {
                if (changesHandler.isCancelled) {
                  return callback(null, {status: 'cancelled'});
                }
                if (err) {
                  return callback(generateErrorFromResponse(err));
                }
                var mapFun = ddoc && ddoc.views && ddoc.views[viewName[1]] && ddoc.views[viewName[1]].map;
                if (!mapFun) {
                  return callback(createError(MISSING_DOC, (ddoc.views ? 'missing json key: ' + viewName[1] : 'missing json key: views')));
                }
                opts.filter = evalView(mapFun);
                changesHandler.doChanges(opts);
              });
            } else if (opts.selector) {
              opts.filter = function(doc) {
                return matchesSelector(doc, opts.selector);
              };
              changesHandler.doChanges(opts);
            } else {
              var filterName = parseDesignDocFunctionName(opts.filter);
              changesHandler.db.get('_design/' + filterName[0], function(err, ddoc) {
                if (changesHandler.isCancelled) {
                  return callback(null, {status: 'cancelled'});
                }
                if (err) {
                  return callback(generateErrorFromResponse(err));
                }
                var filterFun = ddoc && ddoc.filters && ddoc.filters[filterName[1]];
                if (!filterFun) {
                  return callback(createError(MISSING_DOC, ((ddoc && ddoc.filters) ? 'missing json key: ' + filterName[1] : 'missing json key: filters')));
                }
                opts.filter = evalFilter(filterFun);
                changesHandler.doChanges(opts);
              });
            }
          }
          function applyChangesFilterPlugin(PouchDB) {
            PouchDB._changesFilterPlugin = {
              validate: validate,
              normalize: normalize,
              shouldFilter: shouldFilter,
              filter: filter
            };
          }
          PouchDB$5.plugin(debugPouch);
          PouchDB$5.plugin(applyChangesFilterPlugin);
          PouchDB$5.version = version;
          function toObject(array) {
            return array.reduce(function(obj, item) {
              obj[item] = true;
              return obj;
            }, {});
          }
          var reservedWords = toObject(['_id', '_rev', '_attachments', '_deleted', '_revisions', '_revs_info', '_conflicts', '_deleted_conflicts', '_local_seq', '_rev_tree', '_replication_id', '_replication_state', '_replication_state_time', '_replication_state_reason', '_replication_stats', '_removed']);
          var dataWords = toObject(['_attachments', '_replication_id', '_replication_state', '_replication_state_time', '_replication_state_reason', '_replication_stats']);
          function parseRevisionInfo(rev$$1) {
            if (!/^\d+-./.test(rev$$1)) {
              return createError(INVALID_REV);
            }
            var idx = rev$$1.indexOf('-');
            var left = rev$$1.substring(0, idx);
            var right = rev$$1.substring(idx + 1);
            return {
              prefix: parseInt(left, 10),
              id: right
            };
          }
          function makeRevTreeFromRevisions(revisions, opts) {
            var pos = revisions.start - revisions.ids.length + 1;
            var revisionIds = revisions.ids;
            var ids = [revisionIds[0], opts, []];
            for (var i = 1,
                len = revisionIds.length; i < len; i++) {
              ids = [revisionIds[i], {status: 'missing'}, [ids]];
            }
            return [{
              pos: pos,
              ids: ids
            }];
          }
          function parseDoc(doc, newEdits) {
            var nRevNum;
            var newRevId;
            var revInfo;
            var opts = {status: 'available'};
            if (doc._deleted) {
              opts.deleted = true;
            }
            if (newEdits) {
              if (!doc._id) {
                doc._id = uuid();
              }
              newRevId = rev();
              if (doc._rev) {
                revInfo = parseRevisionInfo(doc._rev);
                if (revInfo.error) {
                  return revInfo;
                }
                doc._rev_tree = [{
                  pos: revInfo.prefix,
                  ids: [revInfo.id, {status: 'missing'}, [[newRevId, opts, []]]]
                }];
                nRevNum = revInfo.prefix + 1;
              } else {
                doc._rev_tree = [{
                  pos: 1,
                  ids: [newRevId, opts, []]
                }];
                nRevNum = 1;
              }
            } else {
              if (doc._revisions) {
                doc._rev_tree = makeRevTreeFromRevisions(doc._revisions, opts);
                nRevNum = doc._revisions.start;
                newRevId = doc._revisions.ids[0];
              }
              if (!doc._rev_tree) {
                revInfo = parseRevisionInfo(doc._rev);
                if (revInfo.error) {
                  return revInfo;
                }
                nRevNum = revInfo.prefix;
                newRevId = revInfo.id;
                doc._rev_tree = [{
                  pos: nRevNum,
                  ids: [newRevId, opts, []]
                }];
              }
            }
            invalidIdError(doc._id);
            doc._rev = nRevNum + '-' + newRevId;
            var result = {
              metadata: {},
              data: {}
            };
            for (var key in doc) {
              if (Object.prototype.hasOwnProperty.call(doc, key)) {
                var specialKey = key[0] === '_';
                if (specialKey && !reservedWords[key]) {
                  var error = createError(DOC_VALIDATION, key);
                  error.message = DOC_VALIDATION.message + ': ' + key;
                  throw error;
                } else if (specialKey && !dataWords[key]) {
                  result.metadata[key.slice(1)] = doc[key];
                } else {
                  result.data[key] = doc[key];
                }
              }
            }
            return result;
          }
          var thisAtob = function(str) {
            return atob(str);
          };
          var thisBtoa = function(str) {
            return btoa(str);
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
          function arrayBufferToBinaryString(buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            return binary;
          }
          function readAsBinaryString(blob, callback) {
            if (typeof FileReader === 'undefined') {
              return callback(arrayBufferToBinaryString(new FileReaderSync().readAsArrayBuffer(blob)));
            }
            var reader = new FileReader();
            var hasBinaryString = typeof reader.readAsBinaryString === 'function';
            reader.onloadend = function(e) {
              var result = e.target.result || '';
              if (hasBinaryString) {
                return callback(result);
              }
              callback(arrayBufferToBinaryString(result));
            };
            if (hasBinaryString) {
              reader.readAsBinaryString(blob);
            } else {
              reader.readAsArrayBuffer(blob);
            }
          }
          function blobToBinaryString(blobOrBuffer, callback) {
            readAsBinaryString(blobOrBuffer, function(bin) {
              callback(bin);
            });
          }
          function blobToBase64(blobOrBuffer, callback) {
            blobToBinaryString(blobOrBuffer, function(base64) {
              callback(thisBtoa(base64));
            });
          }
          function readAsArrayBuffer(blob, callback) {
            if (typeof FileReader === 'undefined') {
              return callback(new FileReaderSync().readAsArrayBuffer(blob));
            }
            var reader = new FileReader();
            reader.onloadend = function(e) {
              var result = e.target.result || new ArrayBuffer(0);
              callback(result);
            };
            reader.readAsArrayBuffer(blob);
          }
          var setImmediateShim = global.setImmediate || global.setTimeout;
          var MD5_CHUNK_SIZE = 32768;
          function rawToBase64(raw) {
            return thisBtoa(raw);
          }
          function sliceBlob(blob, start, end) {
            if (blob.webkitSlice) {
              return blob.webkitSlice(start, end);
            }
            return blob.slice(start, end);
          }
          function appendBlob(buffer, blob, start, end, callback) {
            if (start > 0 || end < blob.size) {
              blob = sliceBlob(blob, start, end);
            }
            readAsArrayBuffer(blob, function(arrayBuffer) {
              buffer.append(arrayBuffer);
              callback();
            });
          }
          function appendString(buffer, string, start, end, callback) {
            if (start > 0 || end < string.length) {
              string = string.substring(start, end);
            }
            buffer.appendBinary(string);
            callback();
          }
          function binaryMd5(data, callback) {
            var inputIsString = typeof data === 'string';
            var len = inputIsString ? data.length : data.size;
            var chunkSize = Math.min(MD5_CHUNK_SIZE, len);
            var chunks = Math.ceil(len / chunkSize);
            var currentChunk = 0;
            var buffer = inputIsString ? new Md5() : new Md5.ArrayBuffer();
            var append = inputIsString ? appendString : appendBlob;
            function next() {
              setImmediateShim(loadNextChunk);
            }
            function done() {
              var raw = buffer.end(true);
              var base64 = rawToBase64(raw);
              callback(base64);
              buffer.destroy();
            }
            function loadNextChunk() {
              var start = currentChunk * chunkSize;
              var end = start + chunkSize;
              currentChunk++;
              if (currentChunk < chunks) {
                append(buffer, data, start, end, next);
              } else {
                append(buffer, data, start, end, done);
              }
            }
            loadNextChunk();
          }
          function stringMd5(string) {
            return Md5.hash(string);
          }
          function parseBase64(data) {
            try {
              return thisAtob(data);
            } catch (e) {
              var err = createError(BAD_ARG, 'Attachment is not a valid base64 string');
              return {error: err};
            }
          }
          function preprocessString(att, blobType, callback) {
            var asBinary = parseBase64(att.data);
            if (asBinary.error) {
              return callback(asBinary.error);
            }
            att.length = asBinary.length;
            if (blobType === 'blob') {
              att.data = binStringToBluffer(asBinary, att.content_type);
            } else if (blobType === 'base64') {
              att.data = thisBtoa(asBinary);
            } else {
              att.data = asBinary;
            }
            binaryMd5(asBinary, function(result) {
              att.digest = 'md5-' + result;
              callback();
            });
          }
          function preprocessBlob(att, blobType, callback) {
            binaryMd5(att.data, function(md5) {
              att.digest = 'md5-' + md5;
              att.length = att.data.size || att.data.length || 0;
              if (blobType === 'binary') {
                blobToBinaryString(att.data, function(binString) {
                  att.data = binString;
                  callback();
                });
              } else if (blobType === 'base64') {
                blobToBase64(att.data, function(b64) {
                  att.data = b64;
                  callback();
                });
              } else {
                callback();
              }
            });
          }
          function preprocessAttachment(att, blobType, callback) {
            if (att.stub) {
              return callback();
            }
            if (typeof att.data === 'string') {
              preprocessString(att, blobType, callback);
            } else {
              preprocessBlob(att, blobType, callback);
            }
          }
          function preprocessAttachments(docInfos, blobType, callback) {
            if (!docInfos.length) {
              return callback();
            }
            var docv = 0;
            var overallErr;
            docInfos.forEach(function(docInfo) {
              var attachments = docInfo.data && docInfo.data._attachments ? Object.keys(docInfo.data._attachments) : [];
              var recv = 0;
              if (!attachments.length) {
                return done();
              }
              function processedAttachment(err) {
                overallErr = err;
                recv++;
                if (recv === attachments.length) {
                  done();
                }
              }
              for (var key in docInfo.data._attachments) {
                if (docInfo.data._attachments.hasOwnProperty(key)) {
                  preprocessAttachment(docInfo.data._attachments[key], blobType, processedAttachment);
                }
              }
            });
            function done() {
              docv++;
              if (docInfos.length === docv) {
                if (overallErr) {
                  callback(overallErr);
                } else {
                  callback();
                }
              }
            }
          }
          function updateDoc(revLimit, prev, docInfo, results, i, cb, writeDoc, newEdits) {
            if (revExists(prev.rev_tree, docInfo.metadata.rev)) {
              results[i] = docInfo;
              return cb();
            }
            var previousWinningRev = prev.winningRev || winningRev(prev);
            var previouslyDeleted = 'deleted' in prev ? prev.deleted : isDeleted(prev, previousWinningRev);
            var deleted = 'deleted' in docInfo.metadata ? docInfo.metadata.deleted : isDeleted(docInfo.metadata);
            var isRoot = /^1-/.test(docInfo.metadata.rev);
            if (previouslyDeleted && !deleted && newEdits && isRoot) {
              var newDoc = docInfo.data;
              newDoc._rev = previousWinningRev;
              newDoc._id = docInfo.metadata.id;
              docInfo = parseDoc(newDoc, newEdits);
            }
            var merged = merge(prev.rev_tree, docInfo.metadata.rev_tree[0], revLimit);
            var inConflict = newEdits && (((previouslyDeleted && deleted && merged.conflicts !== 'new_leaf') || (!previouslyDeleted && merged.conflicts !== 'new_leaf') || (previouslyDeleted && !deleted && merged.conflicts === 'new_branch')));
            if (inConflict) {
              var err = createError(REV_CONFLICT);
              results[i] = err;
              return cb();
            }
            var newRev = docInfo.metadata.rev;
            docInfo.metadata.rev_tree = merged.tree;
            docInfo.stemmedRevs = merged.stemmedRevs || [];
            if (prev.rev_map) {
              docInfo.metadata.rev_map = prev.rev_map;
            }
            var winningRev$$1 = winningRev(docInfo.metadata);
            var winningRevIsDeleted = isDeleted(docInfo.metadata, winningRev$$1);
            var delta = (previouslyDeleted === winningRevIsDeleted) ? 0 : previouslyDeleted < winningRevIsDeleted ? -1 : 1;
            var newRevIsDeleted;
            if (newRev === winningRev$$1) {
              newRevIsDeleted = winningRevIsDeleted;
            } else {
              newRevIsDeleted = isDeleted(docInfo.metadata, newRev);
            }
            writeDoc(docInfo, winningRev$$1, winningRevIsDeleted, newRevIsDeleted, true, delta, i, cb);
          }
          function rootIsMissing(docInfo) {
            return docInfo.metadata.rev_tree[0].ids[1].status === 'missing';
          }
          function processDocs(revLimit, docInfos, api, fetchedDocs, tx, results, writeDoc, opts, overallCallback) {
            revLimit = revLimit || 1000;
            function insertDoc(docInfo, resultsIdx, callback) {
              var winningRev$$1 = winningRev(docInfo.metadata);
              var deleted = isDeleted(docInfo.metadata, winningRev$$1);
              if ('was_delete' in opts && deleted) {
                results[resultsIdx] = createError(MISSING_DOC, 'deleted');
                return callback();
              }
              var inConflict = newEdits && rootIsMissing(docInfo);
              if (inConflict) {
                var err = createError(REV_CONFLICT);
                results[resultsIdx] = err;
                return callback();
              }
              var delta = deleted ? 0 : 1;
              writeDoc(docInfo, winningRev$$1, deleted, deleted, false, delta, resultsIdx, callback);
            }
            var newEdits = opts.new_edits;
            var idsToDocs = new ExportedMap();
            var docsDone = 0;
            var docsToDo = docInfos.length;
            function checkAllDocsDone() {
              if (++docsDone === docsToDo && overallCallback) {
                overallCallback();
              }
            }
            docInfos.forEach(function(currentDoc, resultsIdx) {
              if (currentDoc._id && isLocalId(currentDoc._id)) {
                var fun = currentDoc._deleted ? '_removeLocal' : '_putLocal';
                api[fun](currentDoc, {ctx: tx}, function(err, res) {
                  results[resultsIdx] = err || res;
                  checkAllDocsDone();
                });
                return;
              }
              var id = currentDoc.metadata.id;
              if (idsToDocs.has(id)) {
                docsToDo--;
                idsToDocs.get(id).push([currentDoc, resultsIdx]);
              } else {
                idsToDocs.set(id, [[currentDoc, resultsIdx]]);
              }
            });
            idsToDocs.forEach(function(docs, id) {
              var numDone = 0;
              function docWritten() {
                if (++numDone < docs.length) {
                  nextDoc();
                } else {
                  checkAllDocsDone();
                }
              }
              function nextDoc() {
                var value = docs[numDone];
                var currentDoc = value[0];
                var resultsIdx = value[1];
                if (fetchedDocs.has(id)) {
                  updateDoc(revLimit, fetchedDocs.get(id), currentDoc, results, resultsIdx, docWritten, writeDoc, newEdits);
                } else {
                  var merged = merge([], currentDoc.metadata.rev_tree[0], revLimit);
                  currentDoc.metadata.rev_tree = merged.tree;
                  currentDoc.stemmedRevs = merged.stemmedRevs || [];
                  insertDoc(currentDoc, resultsIdx, docWritten);
                }
              }
              nextDoc();
            });
          }
          var ADAPTER_VERSION = 5;
          var DOC_STORE = 'document-store';
          var BY_SEQ_STORE = 'by-sequence';
          var ATTACH_STORE = 'attach-store';
          var ATTACH_AND_SEQ_STORE = 'attach-seq-store';
          var META_STORE = 'meta-store';
          var LOCAL_STORE = 'local-store';
          var DETECT_BLOB_SUPPORT_STORE = 'detect-blob-support';
          function safeJsonParse(str) {
            try {
              return JSON.parse(str);
            } catch (e) {
              return vuvuzela.parse(str);
            }
          }
          function safeJsonStringify(json) {
            try {
              return JSON.stringify(json);
            } catch (e) {
              return vuvuzela.stringify(json);
            }
          }
          function idbError(callback) {
            return function(evt) {
              var message = 'unknown_error';
              if (evt.target && evt.target.error) {
                message = evt.target.error.name || evt.target.error.message;
              }
              callback(createError(IDB_ERROR, message, evt.type));
            };
          }
          function encodeMetadata(metadata, winningRev, deleted) {
            return {
              data: safeJsonStringify(metadata),
              winningRev: winningRev,
              deletedOrLocal: deleted ? '1' : '0',
              seq: metadata.seq,
              id: metadata.id
            };
          }
          function decodeMetadata(storedObject) {
            if (!storedObject) {
              return null;
            }
            var metadata = safeJsonParse(storedObject.data);
            metadata.winningRev = storedObject.winningRev;
            metadata.deleted = storedObject.deletedOrLocal === '1';
            metadata.seq = storedObject.seq;
            return metadata;
          }
          function decodeDoc(doc) {
            if (!doc) {
              return doc;
            }
            var idx = doc._doc_id_rev.lastIndexOf(':');
            doc._id = doc._doc_id_rev.substring(0, idx - 1);
            doc._rev = doc._doc_id_rev.substring(idx + 1);
            delete doc._doc_id_rev;
            return doc;
          }
          function readBlobData(body, type, asBlob, callback) {
            if (asBlob) {
              if (!body) {
                callback(createBlob([''], {type: type}));
              } else if (typeof body !== 'string') {
                callback(body);
              } else {
                callback(b64ToBluffer(body, type));
              }
            } else {
              if (!body) {
                callback('');
              } else if (typeof body !== 'string') {
                readAsBinaryString(body, function(binary) {
                  callback(thisBtoa(binary));
                });
              } else {
                callback(body);
              }
            }
          }
          function fetchAttachmentsIfNecessary(doc, opts, txn, cb) {
            var attachments = Object.keys(doc._attachments || {});
            if (!attachments.length) {
              return cb && cb();
            }
            var numDone = 0;
            function checkDone() {
              if (++numDone === attachments.length && cb) {
                cb();
              }
            }
            function fetchAttachment(doc, att) {
              var attObj = doc._attachments[att];
              var digest = attObj.digest;
              var req = txn.objectStore(ATTACH_STORE).get(digest);
              req.onsuccess = function(e) {
                attObj.body = e.target.result.body;
                checkDone();
              };
            }
            attachments.forEach(function(att) {
              if (opts.attachments && opts.include_docs) {
                fetchAttachment(doc, att);
              } else {
                doc._attachments[att].stub = true;
                checkDone();
              }
            });
          }
          function postProcessAttachments(results, asBlob) {
            return PouchPromise$1.all(results.map(function(row) {
              if (row.doc && row.doc._attachments) {
                var attNames = Object.keys(row.doc._attachments);
                return PouchPromise$1.all(attNames.map(function(att) {
                  var attObj = row.doc._attachments[att];
                  if (!('body' in attObj)) {
                    return;
                  }
                  var body = attObj.body;
                  var type = attObj.content_type;
                  return new PouchPromise$1(function(resolve) {
                    readBlobData(body, type, asBlob, function(data) {
                      row.doc._attachments[att] = $inject_Object_assign(pick(attObj, ['digest', 'content_type']), {data: data});
                      resolve();
                    });
                  });
                }));
              }
            }));
          }
          function compactRevs(revs, docId, txn) {
            var possiblyOrphanedDigests = [];
            var seqStore = txn.objectStore(BY_SEQ_STORE);
            var attStore = txn.objectStore(ATTACH_STORE);
            var attAndSeqStore = txn.objectStore(ATTACH_AND_SEQ_STORE);
            var count = revs.length;
            function checkDone() {
              count--;
              if (!count) {
                deleteOrphanedAttachments();
              }
            }
            function deleteOrphanedAttachments() {
              if (!possiblyOrphanedDigests.length) {
                return;
              }
              possiblyOrphanedDigests.forEach(function(digest) {
                var countReq = attAndSeqStore.index('digestSeq').count(IDBKeyRange.bound(digest + '::', digest + '::\uffff', false, false));
                countReq.onsuccess = function(e) {
                  var count = e.target.result;
                  if (!count) {
                    attStore["delete"](digest);
                  }
                };
              });
            }
            revs.forEach(function(rev$$1) {
              var index = seqStore.index('_doc_id_rev');
              var key = docId + "::" + rev$$1;
              index.getKey(key).onsuccess = function(e) {
                var seq = e.target.result;
                if (typeof seq !== 'number') {
                  return checkDone();
                }
                seqStore["delete"](seq);
                var cursor = attAndSeqStore.index('seq').openCursor(IDBKeyRange.only(seq));
                cursor.onsuccess = function(event) {
                  var cursor = event.target.result;
                  if (cursor) {
                    var digest = cursor.value.digestSeq.split('::')[0];
                    possiblyOrphanedDigests.push(digest);
                    attAndSeqStore["delete"](cursor.primaryKey);
                    cursor["continue"]();
                  } else {
                    checkDone();
                  }
                };
              };
            });
          }
          function openTransactionSafely(idb, stores, mode) {
            try {
              return {txn: idb.transaction(stores, mode)};
            } catch (err) {
              return {error: err};
            }
          }
          var changesHandler = new Changes();
          function idbBulkDocs(dbOpts, req, opts, api, idb, callback) {
            var docInfos = req.docs;
            var txn;
            var docStore;
            var bySeqStore;
            var attachStore;
            var attachAndSeqStore;
            var metaStore;
            var docInfoError;
            var metaDoc;
            for (var i = 0,
                len = docInfos.length; i < len; i++) {
              var doc = docInfos[i];
              if (doc._id && isLocalId(doc._id)) {
                continue;
              }
              doc = docInfos[i] = parseDoc(doc, opts.new_edits);
              if (doc.error && !docInfoError) {
                docInfoError = doc;
              }
            }
            if (docInfoError) {
              return callback(docInfoError);
            }
            var allDocsProcessed = false;
            var docCountDelta = 0;
            var results = new Array(docInfos.length);
            var fetchedDocs = new ExportedMap();
            var preconditionErrored = false;
            var blobType = api._meta.blobSupport ? 'blob' : 'base64';
            preprocessAttachments(docInfos, blobType, function(err) {
              if (err) {
                return callback(err);
              }
              startTransaction();
            });
            function startTransaction() {
              var stores = [DOC_STORE, BY_SEQ_STORE, ATTACH_STORE, LOCAL_STORE, ATTACH_AND_SEQ_STORE, META_STORE];
              var txnResult = openTransactionSafely(idb, stores, 'readwrite');
              if (txnResult.error) {
                return callback(txnResult.error);
              }
              txn = txnResult.txn;
              txn.onabort = idbError(callback);
              txn.ontimeout = idbError(callback);
              txn.oncomplete = complete;
              docStore = txn.objectStore(DOC_STORE);
              bySeqStore = txn.objectStore(BY_SEQ_STORE);
              attachStore = txn.objectStore(ATTACH_STORE);
              attachAndSeqStore = txn.objectStore(ATTACH_AND_SEQ_STORE);
              metaStore = txn.objectStore(META_STORE);
              metaStore.get(META_STORE).onsuccess = function(e) {
                metaDoc = e.target.result;
                updateDocCountIfReady();
              };
              verifyAttachments(function(err) {
                if (err) {
                  preconditionErrored = true;
                  return callback(err);
                }
                fetchExistingDocs();
              });
            }
            function onAllDocsProcessed() {
              allDocsProcessed = true;
              updateDocCountIfReady();
            }
            function idbProcessDocs() {
              processDocs(dbOpts.revs_limit, docInfos, api, fetchedDocs, txn, results, writeDoc, opts, onAllDocsProcessed);
            }
            function updateDocCountIfReady() {
              if (!metaDoc || !allDocsProcessed) {
                return;
              }
              metaDoc.docCount += docCountDelta;
              metaStore.put(metaDoc);
            }
            function fetchExistingDocs() {
              if (!docInfos.length) {
                return;
              }
              var numFetched = 0;
              function checkDone() {
                if (++numFetched === docInfos.length) {
                  idbProcessDocs();
                }
              }
              function readMetadata(event) {
                var metadata = decodeMetadata(event.target.result);
                if (metadata) {
                  fetchedDocs.set(metadata.id, metadata);
                }
                checkDone();
              }
              for (var i = 0,
                  len = docInfos.length; i < len; i++) {
                var docInfo = docInfos[i];
                if (docInfo._id && isLocalId(docInfo._id)) {
                  checkDone();
                  continue;
                }
                var req = docStore.get(docInfo.metadata.id);
                req.onsuccess = readMetadata;
              }
            }
            function complete() {
              if (preconditionErrored) {
                return;
              }
              changesHandler.notify(api._meta.name);
              callback(null, results);
            }
            function verifyAttachment(digest, callback) {
              var req = attachStore.get(digest);
              req.onsuccess = function(e) {
                if (!e.target.result) {
                  var err = createError(MISSING_STUB, 'unknown stub attachment with digest ' + digest);
                  err.status = 412;
                  callback(err);
                } else {
                  callback();
                }
              };
            }
            function verifyAttachments(finish) {
              var digests = [];
              docInfos.forEach(function(docInfo) {
                if (docInfo.data && docInfo.data._attachments) {
                  Object.keys(docInfo.data._attachments).forEach(function(filename) {
                    var att = docInfo.data._attachments[filename];
                    if (att.stub) {
                      digests.push(att.digest);
                    }
                  });
                }
              });
              if (!digests.length) {
                return finish();
              }
              var numDone = 0;
              var err;
              function checkDone() {
                if (++numDone === digests.length) {
                  finish(err);
                }
              }
              digests.forEach(function(digest) {
                verifyAttachment(digest, function(attErr) {
                  if (attErr && !err) {
                    err = attErr;
                  }
                  checkDone();
                });
              });
            }
            function writeDoc(docInfo, winningRev$$1, winningRevIsDeleted, newRevIsDeleted, isUpdate, delta, resultsIdx, callback) {
              docInfo.metadata.winningRev = winningRev$$1;
              docInfo.metadata.deleted = winningRevIsDeleted;
              var doc = docInfo.data;
              doc._id = docInfo.metadata.id;
              doc._rev = docInfo.metadata.rev;
              if (newRevIsDeleted) {
                doc._deleted = true;
              }
              var hasAttachments = doc._attachments && Object.keys(doc._attachments).length;
              if (hasAttachments) {
                return writeAttachments(docInfo, winningRev$$1, winningRevIsDeleted, isUpdate, resultsIdx, callback);
              }
              docCountDelta += delta;
              updateDocCountIfReady();
              finishDoc(docInfo, winningRev$$1, winningRevIsDeleted, isUpdate, resultsIdx, callback);
            }
            function finishDoc(docInfo, winningRev$$1, winningRevIsDeleted, isUpdate, resultsIdx, callback) {
              var doc = docInfo.data;
              var metadata = docInfo.metadata;
              doc._doc_id_rev = metadata.id + '::' + metadata.rev;
              delete doc._id;
              delete doc._rev;
              function afterPutDoc(e) {
                var revsToDelete = docInfo.stemmedRevs || [];
                if (isUpdate && api.auto_compaction) {
                  revsToDelete = revsToDelete.concat(compactTree(docInfo.metadata));
                }
                if (revsToDelete && revsToDelete.length) {
                  compactRevs(revsToDelete, docInfo.metadata.id, txn);
                }
                metadata.seq = e.target.result;
                var metadataToStore = encodeMetadata(metadata, winningRev$$1, winningRevIsDeleted);
                var metaDataReq = docStore.put(metadataToStore);
                metaDataReq.onsuccess = afterPutMetadata;
              }
              function afterPutDocError(e) {
                e.preventDefault();
                e.stopPropagation();
                var index = bySeqStore.index('_doc_id_rev');
                var getKeyReq = index.getKey(doc._doc_id_rev);
                getKeyReq.onsuccess = function(e) {
                  var putReq = bySeqStore.put(doc, e.target.result);
                  putReq.onsuccess = afterPutDoc;
                };
              }
              function afterPutMetadata() {
                results[resultsIdx] = {
                  ok: true,
                  id: metadata.id,
                  rev: metadata.rev
                };
                fetchedDocs.set(docInfo.metadata.id, docInfo.metadata);
                insertAttachmentMappings(docInfo, metadata.seq, callback);
              }
              var putReq = bySeqStore.put(doc);
              putReq.onsuccess = afterPutDoc;
              putReq.onerror = afterPutDocError;
            }
            function writeAttachments(docInfo, winningRev$$1, winningRevIsDeleted, isUpdate, resultsIdx, callback) {
              var doc = docInfo.data;
              var numDone = 0;
              var attachments = Object.keys(doc._attachments);
              function collectResults() {
                if (numDone === attachments.length) {
                  finishDoc(docInfo, winningRev$$1, winningRevIsDeleted, isUpdate, resultsIdx, callback);
                }
              }
              function attachmentSaved() {
                numDone++;
                collectResults();
              }
              attachments.forEach(function(key) {
                var att = docInfo.data._attachments[key];
                if (!att.stub) {
                  var data = att.data;
                  delete att.data;
                  att.revpos = parseInt(winningRev$$1, 10);
                  var digest = att.digest;
                  saveAttachment(digest, data, attachmentSaved);
                } else {
                  numDone++;
                  collectResults();
                }
              });
            }
            function insertAttachmentMappings(docInfo, seq, callback) {
              var attsAdded = 0;
              var attsToAdd = Object.keys(docInfo.data._attachments || {});
              if (!attsToAdd.length) {
                return callback();
              }
              function checkDone() {
                if (++attsAdded === attsToAdd.length) {
                  callback();
                }
              }
              function add(att) {
                var digest = docInfo.data._attachments[att].digest;
                var req = attachAndSeqStore.put({
                  seq: seq,
                  digestSeq: digest + '::' + seq
                });
                req.onsuccess = checkDone;
                req.onerror = function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  checkDone();
                };
              }
              for (var i = 0; i < attsToAdd.length; i++) {
                add(attsToAdd[i]);
              }
            }
            function saveAttachment(digest, data, callback) {
              var getKeyReq = attachStore.count(digest);
              getKeyReq.onsuccess = function(e) {
                var count = e.target.result;
                if (count) {
                  return callback();
                }
                var newAtt = {
                  digest: digest,
                  body: data
                };
                var putReq = attachStore.put(newAtt);
                putReq.onsuccess = callback;
              };
            }
          }
          function runBatchedCursor(objectStore, keyRange, descending, batchSize, onBatch) {
            var useGetAll = typeof objectStore.getAll === 'function' && typeof objectStore.getAllKeys === 'function' && batchSize > 1 && !descending;
            var keysBatch;
            var valuesBatch;
            var pseudoCursor;
            function onGetAll(e) {
              valuesBatch = e.target.result;
              if (keysBatch) {
                onBatch(keysBatch, valuesBatch, pseudoCursor);
              }
            }
            function onGetAllKeys(e) {
              keysBatch = e.target.result;
              if (valuesBatch) {
                onBatch(keysBatch, valuesBatch, pseudoCursor);
              }
            }
            function continuePseudoCursor() {
              if (!keysBatch.length) {
                return onBatch();
              }
              var lastKey = keysBatch[keysBatch.length - 1];
              var newKeyRange;
              if (keyRange && keyRange.upper) {
                try {
                  newKeyRange = IDBKeyRange.bound(lastKey, keyRange.upper, true, keyRange.upperOpen);
                } catch (e) {
                  if (e.name === "DataError" && e.code === 0) {
                    return onBatch();
                  }
                }
              } else {
                newKeyRange = IDBKeyRange.lowerBound(lastKey, true);
              }
              keyRange = newKeyRange;
              keysBatch = null;
              valuesBatch = null;
              objectStore.getAll(keyRange, batchSize).onsuccess = onGetAll;
              objectStore.getAllKeys(keyRange, batchSize).onsuccess = onGetAllKeys;
            }
            function onCursor(e) {
              var cursor = e.target.result;
              if (!cursor) {
                return onBatch();
              }
              onBatch([cursor.key], [cursor.value], cursor);
            }
            if (useGetAll) {
              pseudoCursor = {"continue": continuePseudoCursor};
              objectStore.getAll(keyRange, batchSize).onsuccess = onGetAll;
              objectStore.getAllKeys(keyRange, batchSize).onsuccess = onGetAllKeys;
            } else if (descending) {
              objectStore.openCursor(keyRange, 'prev').onsuccess = onCursor;
            } else {
              objectStore.openCursor(keyRange).onsuccess = onCursor;
            }
          }
          function getAll(objectStore, keyRange, onSuccess) {
            if (typeof objectStore.getAll === 'function') {
              objectStore.getAll(keyRange).onsuccess = onSuccess;
              return;
            }
            var values = [];
            function onCursor(e) {
              var cursor = e.target.result;
              if (cursor) {
                values.push(cursor.value);
                cursor["continue"]();
              } else {
                onSuccess({target: {result: values}});
              }
            }
            objectStore.openCursor(keyRange).onsuccess = onCursor;
          }
          function createKeyRange(start, end, inclusiveEnd, key, descending) {
            try {
              if (start && end) {
                if (descending) {
                  return IDBKeyRange.bound(end, start, !inclusiveEnd, false);
                } else {
                  return IDBKeyRange.bound(start, end, false, !inclusiveEnd);
                }
              } else if (start) {
                if (descending) {
                  return IDBKeyRange.upperBound(start);
                } else {
                  return IDBKeyRange.lowerBound(start);
                }
              } else if (end) {
                if (descending) {
                  return IDBKeyRange.lowerBound(end, !inclusiveEnd);
                } else {
                  return IDBKeyRange.upperBound(end, !inclusiveEnd);
                }
              } else if (key) {
                return IDBKeyRange.only(key);
              }
            } catch (e) {
              return {error: e};
            }
            return null;
          }
          function idbAllDocs(opts, idb, callback) {
            var start = 'startkey' in opts ? opts.startkey : false;
            var end = 'endkey' in opts ? opts.endkey : false;
            var key = 'key' in opts ? opts.key : false;
            var skip = opts.skip || 0;
            var limit = typeof opts.limit === 'number' ? opts.limit : -1;
            var inclusiveEnd = opts.inclusive_end !== false;
            var keyRange = createKeyRange(start, end, inclusiveEnd, key, opts.descending);
            var keyRangeError = keyRange && keyRange.error;
            if (keyRangeError && !(keyRangeError.name === "DataError" && keyRangeError.code === 0)) {
              return callback(createError(IDB_ERROR, keyRangeError.name, keyRangeError.message));
            }
            var stores = [DOC_STORE, BY_SEQ_STORE, META_STORE];
            if (opts.attachments) {
              stores.push(ATTACH_STORE);
            }
            var txnResult = openTransactionSafely(idb, stores, 'readonly');
            if (txnResult.error) {
              return callback(txnResult.error);
            }
            var txn = txnResult.txn;
            txn.oncomplete = onTxnComplete;
            txn.onabort = idbError(callback);
            var docStore = txn.objectStore(DOC_STORE);
            var seqStore = txn.objectStore(BY_SEQ_STORE);
            var metaStore = txn.objectStore(META_STORE);
            var docIdRevIndex = seqStore.index('_doc_id_rev');
            var results = [];
            var docCount;
            metaStore.get(META_STORE).onsuccess = function(e) {
              docCount = e.target.result.docCount;
            };
            function fetchDocAsynchronously(metadata, row, winningRev$$1) {
              var key = metadata.id + "::" + winningRev$$1;
              docIdRevIndex.get(key).onsuccess = function onGetDoc(e) {
                row.doc = decodeDoc(e.target.result);
                if (opts.conflicts) {
                  var conflicts = collectConflicts(metadata);
                  if (conflicts.length) {
                    row.doc._conflicts = conflicts;
                  }
                }
                fetchAttachmentsIfNecessary(row.doc, opts, txn);
              };
            }
            function allDocsInner(winningRev$$1, metadata) {
              var row = {
                id: metadata.id,
                key: metadata.id,
                value: {rev: winningRev$$1}
              };
              var deleted = metadata.deleted;
              if (opts.deleted === 'ok') {
                results.push(row);
                if (deleted) {
                  row.value.deleted = true;
                  row.doc = null;
                } else if (opts.include_docs) {
                  fetchDocAsynchronously(metadata, row, winningRev$$1);
                }
              } else if (!deleted && skip-- <= 0) {
                results.push(row);
                if (opts.include_docs) {
                  fetchDocAsynchronously(metadata, row, winningRev$$1);
                }
              }
            }
            function processBatch(batchValues) {
              for (var i = 0,
                  len = batchValues.length; i < len; i++) {
                if (results.length === limit) {
                  break;
                }
                var batchValue = batchValues[i];
                var metadata = decodeMetadata(batchValue);
                var winningRev$$1 = metadata.winningRev;
                allDocsInner(winningRev$$1, metadata);
              }
            }
            function onBatch(batchKeys, batchValues, cursor) {
              if (!cursor) {
                return;
              }
              processBatch(batchValues);
              if (results.length < limit) {
                cursor["continue"]();
              }
            }
            function onGetAll(e) {
              var values = e.target.result;
              if (opts.descending) {
                values = values.reverse();
              }
              processBatch(values);
            }
            function onResultsReady() {
              callback(null, {
                total_rows: docCount,
                offset: opts.skip,
                rows: results
              });
            }
            function onTxnComplete() {
              if (opts.attachments) {
                postProcessAttachments(results, opts.binary).then(onResultsReady);
              } else {
                onResultsReady();
              }
            }
            if (keyRangeError || limit === 0) {
              return;
            }
            if (limit === -1) {
              return getAll(docStore, keyRange, onGetAll);
            }
            runBatchedCursor(docStore, keyRange, opts.descending, limit + skip, onBatch);
          }
          function checkBlobSupport(txn) {
            return new PouchPromise$1(function(resolve) {
              var blob = createBlob(['']);
              var req = txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');
              req.onsuccess = function() {
                var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
                var matchedEdge = navigator.userAgent.match(/Edge\//);
                resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
              };
              txn.onabort = function(e) {
                e.preventDefault();
                e.stopPropagation();
                resolve(false);
              };
            })["catch"](function() {
              return false;
            });
          }
          function countDocs(txn, cb) {
            var index = txn.objectStore(DOC_STORE).index('deletedOrLocal');
            index.count(IDBKeyRange.only('0')).onsuccess = function(e) {
              cb(e.target.result);
            };
          }
          var running = false;
          var queue = [];
          function tryCode(fun, err, res, PouchDB) {
            try {
              fun(err, res);
            } catch (err) {
              PouchDB.emit('error', err);
            }
          }
          function applyNext() {
            if (running || !queue.length) {
              return;
            }
            running = true;
            queue.shift()();
          }
          function enqueueTask(action, callback, PouchDB) {
            queue.push(function runAction() {
              action(function runCallback(err, res) {
                tryCode(callback, err, res, PouchDB);
                running = false;
                nextTick(function runNext() {
                  applyNext(PouchDB);
                });
              });
            });
            applyNext();
          }
          function changes(opts, api, dbName, idb) {
            opts = clone(opts);
            if (opts.continuous) {
              var id = dbName + ':' + uuid();
              changesHandler.addListener(dbName, id, api, opts);
              changesHandler.notify(dbName);
              return {cancel: function() {
                  changesHandler.removeListener(dbName, id);
                }};
            }
            var docIds = opts.doc_ids && new ExportedSet(opts.doc_ids);
            opts.since = opts.since || 0;
            var lastSeq = opts.since;
            var limit = 'limit' in opts ? opts.limit : -1;
            if (limit === 0) {
              limit = 1;
            }
            var returnDocs;
            if ('return_docs' in opts) {
              returnDocs = opts.return_docs;
            } else if ('returnDocs' in opts) {
              returnDocs = opts.returnDocs;
            } else {
              returnDocs = true;
            }
            var results = [];
            var numResults = 0;
            var filter = filterChange(opts);
            var docIdsToMetadata = new ExportedMap();
            var txn;
            var bySeqStore;
            var docStore;
            var docIdRevIndex;
            function onBatch(batchKeys, batchValues, cursor) {
              if (!cursor || !batchKeys.length) {
                return;
              }
              var winningDocs = new Array(batchKeys.length);
              var metadatas = new Array(batchKeys.length);
              function processMetadataAndWinningDoc(metadata, winningDoc) {
                var change = opts.processChange(winningDoc, metadata, opts);
                lastSeq = change.seq = metadata.seq;
                var filtered = filter(change);
                if (typeof filtered === 'object') {
                  return opts.complete(filtered);
                }
                if (filtered) {
                  numResults++;
                  if (returnDocs) {
                    results.push(change);
                  }
                  if (opts.attachments && opts.include_docs) {
                    fetchAttachmentsIfNecessary(winningDoc, opts, txn, function() {
                      postProcessAttachments([change], opts.binary).then(function() {
                        opts.onChange(change);
                      });
                    });
                  } else {
                    opts.onChange(change);
                  }
                }
              }
              function onBatchDone() {
                for (var i = 0,
                    len = winningDocs.length; i < len; i++) {
                  if (numResults === limit) {
                    break;
                  }
                  var winningDoc = winningDocs[i];
                  if (!winningDoc) {
                    continue;
                  }
                  var metadata = metadatas[i];
                  processMetadataAndWinningDoc(metadata, winningDoc);
                }
                if (numResults !== limit) {
                  cursor["continue"]();
                }
              }
              var numDone = 0;
              batchValues.forEach(function(value, i) {
                var doc = decodeDoc(value);
                var seq = batchKeys[i];
                fetchWinningDocAndMetadata(doc, seq, function(metadata, winningDoc) {
                  metadatas[i] = metadata;
                  winningDocs[i] = winningDoc;
                  if (++numDone === batchKeys.length) {
                    onBatchDone();
                  }
                });
              });
            }
            function onGetMetadata(doc, seq, metadata, cb) {
              if (metadata.seq !== seq) {
                return cb();
              }
              if (metadata.winningRev === doc._rev) {
                return cb(metadata, doc);
              }
              var docIdRev = doc._id + '::' + metadata.winningRev;
              var req = docIdRevIndex.get(docIdRev);
              req.onsuccess = function(e) {
                cb(metadata, decodeDoc(e.target.result));
              };
            }
            function fetchWinningDocAndMetadata(doc, seq, cb) {
              if (docIds && !docIds.has(doc._id)) {
                return cb();
              }
              var metadata = docIdsToMetadata.get(doc._id);
              if (metadata) {
                return onGetMetadata(doc, seq, metadata, cb);
              }
              docStore.get(doc._id).onsuccess = function(e) {
                metadata = decodeMetadata(e.target.result);
                docIdsToMetadata.set(doc._id, metadata);
                onGetMetadata(doc, seq, metadata, cb);
              };
            }
            function finish() {
              opts.complete(null, {
                results: results,
                last_seq: lastSeq
              });
            }
            function onTxnComplete() {
              if (!opts.continuous && opts.attachments) {
                postProcessAttachments(results).then(finish);
              } else {
                finish();
              }
            }
            var objectStores = [DOC_STORE, BY_SEQ_STORE];
            if (opts.attachments) {
              objectStores.push(ATTACH_STORE);
            }
            var txnResult = openTransactionSafely(idb, objectStores, 'readonly');
            if (txnResult.error) {
              return opts.complete(txnResult.error);
            }
            txn = txnResult.txn;
            txn.onabort = idbError(opts.complete);
            txn.oncomplete = onTxnComplete;
            bySeqStore = txn.objectStore(BY_SEQ_STORE);
            docStore = txn.objectStore(DOC_STORE);
            docIdRevIndex = bySeqStore.index('_doc_id_rev');
            var keyRange = (opts.since && !opts.descending) ? IDBKeyRange.lowerBound(opts.since, true) : null;
            runBatchedCursor(bySeqStore, keyRange, opts.descending, limit, onBatch);
          }
          var cachedDBs = new ExportedMap();
          var blobSupportPromise;
          var openReqList = new ExportedMap();
          function IdbPouch(opts, callback) {
            var api = this;
            enqueueTask(function(thisCallback) {
              init(api, opts, thisCallback);
            }, callback, api.constructor);
          }
          function init(api, opts, callback) {
            var dbName = opts.name;
            var idb = null;
            api._meta = null;
            function createSchema(db) {
              var docStore = db.createObjectStore(DOC_STORE, {keyPath: 'id'});
              db.createObjectStore(BY_SEQ_STORE, {autoIncrement: true}).createIndex('_doc_id_rev', '_doc_id_rev', {unique: true});
              db.createObjectStore(ATTACH_STORE, {keyPath: 'digest'});
              db.createObjectStore(META_STORE, {
                keyPath: 'id',
                autoIncrement: false
              });
              db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
              docStore.createIndex('deletedOrLocal', 'deletedOrLocal', {unique: false});
              db.createObjectStore(LOCAL_STORE, {keyPath: '_id'});
              var attAndSeqStore = db.createObjectStore(ATTACH_AND_SEQ_STORE, {autoIncrement: true});
              attAndSeqStore.createIndex('seq', 'seq');
              attAndSeqStore.createIndex('digestSeq', 'digestSeq', {unique: true});
            }
            function addDeletedOrLocalIndex(txn, callback) {
              var docStore = txn.objectStore(DOC_STORE);
              docStore.createIndex('deletedOrLocal', 'deletedOrLocal', {unique: false});
              docStore.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                  var metadata = cursor.value;
                  var deleted = isDeleted(metadata);
                  metadata.deletedOrLocal = deleted ? "1" : "0";
                  docStore.put(metadata);
                  cursor["continue"]();
                } else {
                  callback();
                }
              };
            }
            function createLocalStoreSchema(db) {
              db.createObjectStore(LOCAL_STORE, {keyPath: '_id'}).createIndex('_doc_id_rev', '_doc_id_rev', {unique: true});
            }
            function migrateLocalStore(txn, cb) {
              var localStore = txn.objectStore(LOCAL_STORE);
              var docStore = txn.objectStore(DOC_STORE);
              var seqStore = txn.objectStore(BY_SEQ_STORE);
              var cursor = docStore.openCursor();
              cursor.onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                  var metadata = cursor.value;
                  var docId = metadata.id;
                  var local = isLocalId(docId);
                  var rev$$1 = winningRev(metadata);
                  if (local) {
                    var docIdRev = docId + "::" + rev$$1;
                    var start = docId + "::";
                    var end = docId + "::~";
                    var index = seqStore.index('_doc_id_rev');
                    var range = IDBKeyRange.bound(start, end, false, false);
                    var seqCursor = index.openCursor(range);
                    seqCursor.onsuccess = function(e) {
                      seqCursor = e.target.result;
                      if (!seqCursor) {
                        docStore["delete"](cursor.primaryKey);
                        cursor["continue"]();
                      } else {
                        var data = seqCursor.value;
                        if (data._doc_id_rev === docIdRev) {
                          localStore.put(data);
                        }
                        seqStore["delete"](seqCursor.primaryKey);
                        seqCursor["continue"]();
                      }
                    };
                  } else {
                    cursor["continue"]();
                  }
                } else if (cb) {
                  cb();
                }
              };
            }
            function addAttachAndSeqStore(db) {
              var attAndSeqStore = db.createObjectStore(ATTACH_AND_SEQ_STORE, {autoIncrement: true});
              attAndSeqStore.createIndex('seq', 'seq');
              attAndSeqStore.createIndex('digestSeq', 'digestSeq', {unique: true});
            }
            function migrateAttsAndSeqs(txn, callback) {
              var seqStore = txn.objectStore(BY_SEQ_STORE);
              var attStore = txn.objectStore(ATTACH_STORE);
              var attAndSeqStore = txn.objectStore(ATTACH_AND_SEQ_STORE);
              var req = attStore.count();
              req.onsuccess = function(e) {
                var count = e.target.result;
                if (!count) {
                  return callback();
                }
                seqStore.openCursor().onsuccess = function(e) {
                  var cursor = e.target.result;
                  if (!cursor) {
                    return callback();
                  }
                  var doc = cursor.value;
                  var seq = cursor.primaryKey;
                  var atts = Object.keys(doc._attachments || {});
                  var digestMap = {};
                  for (var j = 0; j < atts.length; j++) {
                    var att = doc._attachments[atts[j]];
                    digestMap[att.digest] = true;
                  }
                  var digests = Object.keys(digestMap);
                  for (j = 0; j < digests.length; j++) {
                    var digest = digests[j];
                    attAndSeqStore.put({
                      seq: seq,
                      digestSeq: digest + '::' + seq
                    });
                  }
                  cursor["continue"]();
                };
              };
            }
            function migrateMetadata(txn) {
              function decodeMetadataCompat(storedObject) {
                if (!storedObject.data) {
                  storedObject.deleted = storedObject.deletedOrLocal === '1';
                  return storedObject;
                }
                return decodeMetadata(storedObject);
              }
              var bySeqStore = txn.objectStore(BY_SEQ_STORE);
              var docStore = txn.objectStore(DOC_STORE);
              var cursor = docStore.openCursor();
              cursor.onsuccess = function(e) {
                var cursor = e.target.result;
                if (!cursor) {
                  return;
                }
                var metadata = decodeMetadataCompat(cursor.value);
                metadata.winningRev = metadata.winningRev || winningRev(metadata);
                function fetchMetadataSeq() {
                  var start = metadata.id + '::';
                  var end = metadata.id + '::\uffff';
                  var req = bySeqStore.index('_doc_id_rev').openCursor(IDBKeyRange.bound(start, end));
                  var metadataSeq = 0;
                  req.onsuccess = function(e) {
                    var cursor = e.target.result;
                    if (!cursor) {
                      metadata.seq = metadataSeq;
                      return onGetMetadataSeq();
                    }
                    var seq = cursor.primaryKey;
                    if (seq > metadataSeq) {
                      metadataSeq = seq;
                    }
                    cursor["continue"]();
                  };
                }
                function onGetMetadataSeq() {
                  var metadataToStore = encodeMetadata(metadata, metadata.winningRev, metadata.deleted);
                  var req = docStore.put(metadataToStore);
                  req.onsuccess = function() {
                    cursor["continue"]();
                  };
                }
                if (metadata.seq) {
                  return onGetMetadataSeq();
                }
                fetchMetadataSeq();
              };
            }
            api._remote = false;
            api.type = function() {
              return 'idb';
            };
            api._id = toPromise(function(callback) {
              callback(null, api._meta.instanceId);
            });
            api._bulkDocs = function idb_bulkDocs(req, reqOpts, callback) {
              idbBulkDocs(opts, req, reqOpts, api, idb, callback);
            };
            api._get = function idb_get(id, opts, callback) {
              var doc;
              var metadata;
              var err;
              var txn = opts.ctx;
              if (!txn) {
                var txnResult = openTransactionSafely(idb, [DOC_STORE, BY_SEQ_STORE, ATTACH_STORE], 'readonly');
                if (txnResult.error) {
                  return callback(txnResult.error);
                }
                txn = txnResult.txn;
              }
              function finish() {
                callback(err, {
                  doc: doc,
                  metadata: metadata,
                  ctx: txn
                });
              }
              txn.objectStore(DOC_STORE).get(id).onsuccess = function(e) {
                metadata = decodeMetadata(e.target.result);
                if (!metadata) {
                  err = createError(MISSING_DOC, 'missing');
                  return finish();
                }
                var rev$$1;
                if (!opts.rev) {
                  rev$$1 = metadata.winningRev;
                  var deleted = isDeleted(metadata);
                  if (deleted) {
                    err = createError(MISSING_DOC, "deleted");
                    return finish();
                  }
                } else {
                  rev$$1 = opts.latest ? latest(opts.rev, metadata) : opts.rev;
                }
                var objectStore = txn.objectStore(BY_SEQ_STORE);
                var key = metadata.id + '::' + rev$$1;
                objectStore.index('_doc_id_rev').get(key).onsuccess = function(e) {
                  doc = e.target.result;
                  if (doc) {
                    doc = decodeDoc(doc);
                  }
                  if (!doc) {
                    err = createError(MISSING_DOC, 'missing');
                    return finish();
                  }
                  finish();
                };
              };
            };
            api._getAttachment = function(docId, attachId, attachment, opts, callback) {
              var txn;
              if (opts.ctx) {
                txn = opts.ctx;
              } else {
                var txnResult = openTransactionSafely(idb, [DOC_STORE, BY_SEQ_STORE, ATTACH_STORE], 'readonly');
                if (txnResult.error) {
                  return callback(txnResult.error);
                }
                txn = txnResult.txn;
              }
              var digest = attachment.digest;
              var type = attachment.content_type;
              txn.objectStore(ATTACH_STORE).get(digest).onsuccess = function(e) {
                var body = e.target.result.body;
                readBlobData(body, type, opts.binary, function(blobData) {
                  callback(null, blobData);
                });
              };
            };
            api._info = function idb_info(callback) {
              var updateSeq;
              var docCount;
              var txnResult = openTransactionSafely(idb, [META_STORE, BY_SEQ_STORE], 'readonly');
              if (txnResult.error) {
                return callback(txnResult.error);
              }
              var txn = txnResult.txn;
              txn.objectStore(META_STORE).get(META_STORE).onsuccess = function(e) {
                docCount = e.target.result.docCount;
              };
              txn.objectStore(BY_SEQ_STORE).openCursor(null, 'prev').onsuccess = function(e) {
                var cursor = e.target.result;
                updateSeq = cursor ? cursor.key : 0;
              };
              txn.oncomplete = function() {
                callback(null, {
                  doc_count: docCount,
                  update_seq: updateSeq,
                  idb_attachment_format: (api._meta.blobSupport ? 'binary' : 'base64')
                });
              };
            };
            api._allDocs = function idb_allDocs(opts, callback) {
              idbAllDocs(opts, idb, callback);
            };
            api._changes = function idbChanges(opts) {
              return changes(opts, api, dbName, idb);
            };
            api._close = function(callback) {
              idb.close();
              cachedDBs["delete"](dbName);
              callback();
            };
            api._getRevisionTree = function(docId, callback) {
              var txnResult = openTransactionSafely(idb, [DOC_STORE], 'readonly');
              if (txnResult.error) {
                return callback(txnResult.error);
              }
              var txn = txnResult.txn;
              var req = txn.objectStore(DOC_STORE).get(docId);
              req.onsuccess = function(event) {
                var doc = decodeMetadata(event.target.result);
                if (!doc) {
                  callback(createError(MISSING_DOC));
                } else {
                  callback(null, doc.rev_tree);
                }
              };
            };
            api._doCompaction = function(docId, revs, callback) {
              var stores = [DOC_STORE, BY_SEQ_STORE, ATTACH_STORE, ATTACH_AND_SEQ_STORE];
              var txnResult = openTransactionSafely(idb, stores, 'readwrite');
              if (txnResult.error) {
                return callback(txnResult.error);
              }
              var txn = txnResult.txn;
              var docStore = txn.objectStore(DOC_STORE);
              docStore.get(docId).onsuccess = function(event) {
                var metadata = decodeMetadata(event.target.result);
                traverseRevTree(metadata.rev_tree, function(isLeaf, pos, revHash, ctx, opts) {
                  var rev$$1 = pos + '-' + revHash;
                  if (revs.indexOf(rev$$1) !== -1) {
                    opts.status = 'missing';
                  }
                });
                compactRevs(revs, docId, txn);
                var winningRev$$1 = metadata.winningRev;
                var deleted = metadata.deleted;
                txn.objectStore(DOC_STORE).put(encodeMetadata(metadata, winningRev$$1, deleted));
              };
              txn.onabort = idbError(callback);
              txn.oncomplete = function() {
                callback();
              };
            };
            api._getLocal = function(id, callback) {
              var txnResult = openTransactionSafely(idb, [LOCAL_STORE], 'readonly');
              if (txnResult.error) {
                return callback(txnResult.error);
              }
              var tx = txnResult.txn;
              var req = tx.objectStore(LOCAL_STORE).get(id);
              req.onerror = idbError(callback);
              req.onsuccess = function(e) {
                var doc = e.target.result;
                if (!doc) {
                  callback(createError(MISSING_DOC));
                } else {
                  delete doc['_doc_id_rev'];
                  callback(null, doc);
                }
              };
            };
            api._putLocal = function(doc, opts, callback) {
              if (typeof opts === 'function') {
                callback = opts;
                opts = {};
              }
              delete doc._revisions;
              var oldRev = doc._rev;
              var id = doc._id;
              if (!oldRev) {
                doc._rev = '0-1';
              } else {
                doc._rev = '0-' + (parseInt(oldRev.split('-')[1], 10) + 1);
              }
              var tx = opts.ctx;
              var ret;
              if (!tx) {
                var txnResult = openTransactionSafely(idb, [LOCAL_STORE], 'readwrite');
                if (txnResult.error) {
                  return callback(txnResult.error);
                }
                tx = txnResult.txn;
                tx.onerror = idbError(callback);
                tx.oncomplete = function() {
                  if (ret) {
                    callback(null, ret);
                  }
                };
              }
              var oStore = tx.objectStore(LOCAL_STORE);
              var req;
              if (oldRev) {
                req = oStore.get(id);
                req.onsuccess = function(e) {
                  var oldDoc = e.target.result;
                  if (!oldDoc || oldDoc._rev !== oldRev) {
                    callback(createError(REV_CONFLICT));
                  } else {
                    var req = oStore.put(doc);
                    req.onsuccess = function() {
                      ret = {
                        ok: true,
                        id: doc._id,
                        rev: doc._rev
                      };
                      if (opts.ctx) {
                        callback(null, ret);
                      }
                    };
                  }
                };
              } else {
                req = oStore.add(doc);
                req.onerror = function(e) {
                  callback(createError(REV_CONFLICT));
                  e.preventDefault();
                  e.stopPropagation();
                };
                req.onsuccess = function() {
                  ret = {
                    ok: true,
                    id: doc._id,
                    rev: doc._rev
                  };
                  if (opts.ctx) {
                    callback(null, ret);
                  }
                };
              }
            };
            api._removeLocal = function(doc, opts, callback) {
              if (typeof opts === 'function') {
                callback = opts;
                opts = {};
              }
              var tx = opts.ctx;
              if (!tx) {
                var txnResult = openTransactionSafely(idb, [LOCAL_STORE], 'readwrite');
                if (txnResult.error) {
                  return callback(txnResult.error);
                }
                tx = txnResult.txn;
                tx.oncomplete = function() {
                  if (ret) {
                    callback(null, ret);
                  }
                };
              }
              var ret;
              var id = doc._id;
              var oStore = tx.objectStore(LOCAL_STORE);
              var req = oStore.get(id);
              req.onerror = idbError(callback);
              req.onsuccess = function(e) {
                var oldDoc = e.target.result;
                if (!oldDoc || oldDoc._rev !== doc._rev) {
                  callback(createError(MISSING_DOC));
                } else {
                  oStore["delete"](id);
                  ret = {
                    ok: true,
                    id: id,
                    rev: '0-0'
                  };
                  if (opts.ctx) {
                    callback(null, ret);
                  }
                }
              };
            };
            api._destroy = function(opts, callback) {
              changesHandler.removeAllListeners(dbName);
              var openReq = openReqList.get(dbName);
              if (openReq && openReq.result) {
                openReq.result.close();
                cachedDBs["delete"](dbName);
              }
              var req = indexedDB.deleteDatabase(dbName);
              req.onsuccess = function() {
                openReqList["delete"](dbName);
                if (hasLocalStorage() && (dbName in localStorage)) {
                  delete localStorage[dbName];
                }
                callback(null, {'ok': true});
              };
              req.onerror = idbError(callback);
            };
            var cached = cachedDBs.get(dbName);
            if (cached) {
              idb = cached.idb;
              api._meta = cached.global;
              return nextTick(function() {
                callback(null, api);
              });
            }
            var req;
            if (opts.storage) {
              req = tryStorageOption(dbName, opts.storage);
            } else {
              req = indexedDB.open(dbName, ADAPTER_VERSION);
            }
            openReqList.set(dbName, req);
            req.onupgradeneeded = function(e) {
              var db = e.target.result;
              if (e.oldVersion < 1) {
                return createSchema(db);
              }
              var txn = e.currentTarget.transaction;
              if (e.oldVersion < 3) {
                createLocalStoreSchema(db);
              }
              if (e.oldVersion < 4) {
                addAttachAndSeqStore(db);
              }
              var migrations = [addDeletedOrLocalIndex, migrateLocalStore, migrateAttsAndSeqs, migrateMetadata];
              var i = e.oldVersion;
              function next() {
                var migration = migrations[i - 1];
                i++;
                if (migration) {
                  migration(txn, next);
                }
              }
              next();
            };
            req.onsuccess = function(e) {
              idb = e.target.result;
              idb.onversionchange = function() {
                idb.close();
                cachedDBs["delete"](dbName);
              };
              idb.onabort = function(e) {
                guardedConsole('error', 'Database has a global failure', e.target.error);
                idb.close();
                cachedDBs["delete"](dbName);
              };
              var txn = idb.transaction([META_STORE, DETECT_BLOB_SUPPORT_STORE, DOC_STORE], 'readwrite');
              var storedMetaDoc = false;
              var metaDoc;
              var docCount;
              var blobSupport;
              var instanceId;
              function completeSetup() {
                if (typeof blobSupport === 'undefined' || !storedMetaDoc) {
                  return;
                }
                api._meta = {
                  name: dbName,
                  instanceId: instanceId,
                  blobSupport: blobSupport
                };
                cachedDBs.set(dbName, {
                  idb: idb,
                  global: api._meta
                });
                callback(null, api);
              }
              function storeMetaDocIfReady() {
                if (typeof docCount === 'undefined' || typeof metaDoc === 'undefined') {
                  return;
                }
                var instanceKey = dbName + '_id';
                if (instanceKey in metaDoc) {
                  instanceId = metaDoc[instanceKey];
                } else {
                  metaDoc[instanceKey] = instanceId = uuid();
                }
                metaDoc.docCount = docCount;
                txn.objectStore(META_STORE).put(metaDoc);
              }
              txn.objectStore(META_STORE).get(META_STORE).onsuccess = function(e) {
                metaDoc = e.target.result || {id: META_STORE};
                storeMetaDocIfReady();
              };
              countDocs(txn, function(count) {
                docCount = count;
                storeMetaDocIfReady();
              });
              if (!blobSupportPromise) {
                blobSupportPromise = checkBlobSupport(txn);
              }
              blobSupportPromise.then(function(val) {
                blobSupport = val;
                completeSetup();
              });
              txn.oncomplete = function() {
                storedMetaDoc = true;
                completeSetup();
              };
            };
            req.onerror = function() {
              var msg = 'Failed to open indexedDB, are you in private browsing mode?';
              guardedConsole('error', msg);
              callback(createError(IDB_ERROR, msg));
            };
          }
          IdbPouch.valid = function() {
            var isSafari = typeof openDatabase !== 'undefined' && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);
            return !isSafari && typeof indexedDB !== 'undefined' && typeof IDBKeyRange !== 'undefined';
          };
          function tryStorageOption(dbName, storage) {
            try {
              return indexedDB.open(dbName, {
                version: ADAPTER_VERSION,
                storage: storage
              });
            } catch (err) {
              return indexedDB.open(dbName, ADAPTER_VERSION);
            }
          }
          var IDBPouch = function(PouchDB) {
            PouchDB.adapter('idb', IdbPouch, true);
          };
          function decodeUtf8(str) {
            return decodeURIComponent(escape(str));
          }
          function hexToInt(charCode) {
            return charCode < 65 ? (charCode - 48) : (charCode - 55);
          }
          function parseHexUtf8(str, start, end) {
            var result = '';
            while (start < end) {
              result += String.fromCharCode((hexToInt(str.charCodeAt(start++)) << 4) | hexToInt(str.charCodeAt(start++)));
            }
            return result;
          }
          function parseHexUtf16(str, start, end) {
            var result = '';
            while (start < end) {
              result += String.fromCharCode((hexToInt(str.charCodeAt(start + 2)) << 12) | (hexToInt(str.charCodeAt(start + 3)) << 8) | (hexToInt(str.charCodeAt(start)) << 4) | hexToInt(str.charCodeAt(start + 1)));
              start += 4;
            }
            return result;
          }
          function parseHexString(str, encoding) {
            if (encoding === 'UTF-8') {
              return decodeUtf8(parseHexUtf8(str, 0, str.length));
            } else {
              return parseHexUtf16(str, 0, str.length);
            }
          }
          function quote(str) {
            return "'" + str + "'";
          }
          var ADAPTER_VERSION$1 = 7;
          var DOC_STORE$1 = quote('document-store');
          var BY_SEQ_STORE$1 = quote('by-sequence');
          var ATTACH_STORE$1 = quote('attach-store');
          var LOCAL_STORE$1 = quote('local-store');
          var META_STORE$1 = quote('metadata-store');
          var ATTACH_AND_SEQ_STORE$1 = quote('attach-seq-store');
          function escapeBlob(str) {
            return str.replace(/\u0002/g, '\u0002\u0002').replace(/\u0001/g, '\u0001\u0002').replace(/\u0000/g, '\u0001\u0001');
          }
          function unescapeBlob(str) {
            return str.replace(/\u0001\u0001/g, '\u0000').replace(/\u0001\u0002/g, '\u0001').replace(/\u0002\u0002/g, '\u0002');
          }
          function stringifyDoc(doc) {
            delete doc._id;
            delete doc._rev;
            return JSON.stringify(doc);
          }
          function unstringifyDoc(doc, id, rev$$1) {
            doc = JSON.parse(doc);
            doc._id = id;
            doc._rev = rev$$1;
            return doc;
          }
          function qMarks(num) {
            var s = '(';
            while (num--) {
              s += '?';
              if (num) {
                s += ',';
              }
            }
            return s + ')';
          }
          function select(selector, table, joiner, where, orderBy) {
            return 'SELECT ' + selector + ' FROM ' + (typeof table === 'string' ? table : table.join(' JOIN ')) + (joiner ? (' ON ' + joiner) : '') + (where ? (' WHERE ' + (typeof where === 'string' ? where : where.join(' AND '))) : '') + (orderBy ? (' ORDER BY ' + orderBy) : '');
          }
          function compactRevs$1(revs, docId, tx) {
            if (!revs.length) {
              return;
            }
            var numDone = 0;
            var seqs = [];
            function checkDone() {
              if (++numDone === revs.length) {
                deleteOrphans();
              }
            }
            function deleteOrphans() {
              if (!seqs.length) {
                return;
              }
              var sql = 'SELECT DISTINCT digest AS digest FROM ' + ATTACH_AND_SEQ_STORE$1 + ' WHERE seq IN ' + qMarks(seqs.length);
              tx.executeSql(sql, seqs, function(tx, res) {
                var digestsToCheck = [];
                for (var i = 0; i < res.rows.length; i++) {
                  digestsToCheck.push(res.rows.item(i).digest);
                }
                if (!digestsToCheck.length) {
                  return;
                }
                var sql = 'DELETE FROM ' + ATTACH_AND_SEQ_STORE$1 + ' WHERE seq IN (' + seqs.map(function() {
                  return '?';
                }).join(',') + ')';
                tx.executeSql(sql, seqs, function(tx) {
                  var sql = 'SELECT digest FROM ' + ATTACH_AND_SEQ_STORE$1 + ' WHERE digest IN (' + digestsToCheck.map(function() {
                    return '?';
                  }).join(',') + ')';
                  tx.executeSql(sql, digestsToCheck, function(tx, res) {
                    var nonOrphanedDigests = new ExportedSet();
                    for (var i = 0; i < res.rows.length; i++) {
                      nonOrphanedDigests.add(res.rows.item(i).digest);
                    }
                    digestsToCheck.forEach(function(digest) {
                      if (nonOrphanedDigests.has(digest)) {
                        return;
                      }
                      tx.executeSql('DELETE FROM ' + ATTACH_AND_SEQ_STORE$1 + ' WHERE digest=?', [digest]);
                      tx.executeSql('DELETE FROM ' + ATTACH_STORE$1 + ' WHERE digest=?', [digest]);
                    });
                  });
                });
              });
            }
            revs.forEach(function(rev$$1) {
              var sql = 'SELECT seq FROM ' + BY_SEQ_STORE$1 + ' WHERE doc_id=? AND rev=?';
              tx.executeSql(sql, [docId, rev$$1], function(tx, res) {
                if (!res.rows.length) {
                  return checkDone();
                }
                var seq = res.rows.item(0).seq;
                seqs.push(seq);
                tx.executeSql('DELETE FROM ' + BY_SEQ_STORE$1 + ' WHERE seq=?', [seq], checkDone);
              });
            });
          }
          function websqlError(callback) {
            return function(event) {
              guardedConsole('error', 'WebSQL threw an error', event);
              var errorNameMatch = event && event.constructor.toString().match(/function ([^(]+)/);
              var errorName = (errorNameMatch && errorNameMatch[1]) || event.type;
              var errorReason = event.target || event.message;
              callback(createError(WSQ_ERROR, errorReason, errorName));
            };
          }
          function getSize(opts) {
            if ('size' in opts) {
              return opts.size * 1000000;
            }
            var isAndroid = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);
            return isAndroid ? 5000000 : 1;
          }
          function websqlBulkDocs(dbOpts, req, opts, api, db, websqlChanges, callback) {
            var newEdits = opts.new_edits;
            var userDocs = req.docs;
            var docInfos = userDocs.map(function(doc) {
              if (doc._id && isLocalId(doc._id)) {
                return doc;
              }
              var newDoc = parseDoc(doc, newEdits);
              return newDoc;
            });
            var docInfoErrors = docInfos.filter(function(docInfo) {
              return docInfo.error;
            });
            if (docInfoErrors.length) {
              return callback(docInfoErrors[0]);
            }
            var tx;
            var results = new Array(docInfos.length);
            var fetchedDocs = new ExportedMap();
            var preconditionErrored;
            function complete() {
              if (preconditionErrored) {
                return callback(preconditionErrored);
              }
              websqlChanges.notify(api._name);
              callback(null, results);
            }
            function verifyAttachment(digest, callback) {
              var sql = 'SELECT count(*) as cnt FROM ' + ATTACH_STORE$1 + ' WHERE digest=?';
              tx.executeSql(sql, [digest], function(tx, result) {
                if (result.rows.item(0).cnt === 0) {
                  var err = createError(MISSING_STUB, 'unknown stub attachment with digest ' + digest);
                  callback(err);
                } else {
                  callback();
                }
              });
            }
            function verifyAttachments(finish) {
              var digests = [];
              docInfos.forEach(function(docInfo) {
                if (docInfo.data && docInfo.data._attachments) {
                  Object.keys(docInfo.data._attachments).forEach(function(filename) {
                    var att = docInfo.data._attachments[filename];
                    if (att.stub) {
                      digests.push(att.digest);
                    }
                  });
                }
              });
              if (!digests.length) {
                return finish();
              }
              var numDone = 0;
              var err;
              function checkDone() {
                if (++numDone === digests.length) {
                  finish(err);
                }
              }
              digests.forEach(function(digest) {
                verifyAttachment(digest, function(attErr) {
                  if (attErr && !err) {
                    err = attErr;
                  }
                  checkDone();
                });
              });
            }
            function writeDoc(docInfo, winningRev$$1, winningRevIsDeleted, newRevIsDeleted, isUpdate, delta, resultsIdx, callback) {
              function finish() {
                var data = docInfo.data;
                var deletedInt = newRevIsDeleted ? 1 : 0;
                var id = data._id;
                var rev = data._rev;
                var json = stringifyDoc(data);
                var sql = 'INSERT INTO ' + BY_SEQ_STORE$1 + ' (doc_id, rev, json, deleted) VALUES (?, ?, ?, ?);';
                var sqlArgs = [id, rev, json, deletedInt];
                function insertAttachmentMappings(seq, callback) {
                  var attsAdded = 0;
                  var attsToAdd = Object.keys(data._attachments || {});
                  if (!attsToAdd.length) {
                    return callback();
                  }
                  function checkDone() {
                    if (++attsAdded === attsToAdd.length) {
                      callback();
                    }
                    return false;
                  }
                  function add(att) {
                    var sql = 'INSERT INTO ' + ATTACH_AND_SEQ_STORE$1 + ' (digest, seq) VALUES (?,?)';
                    var sqlArgs = [data._attachments[att].digest, seq];
                    tx.executeSql(sql, sqlArgs, checkDone, checkDone);
                  }
                  for (var i = 0; i < attsToAdd.length; i++) {
                    add(attsToAdd[i]);
                  }
                }
                tx.executeSql(sql, sqlArgs, function(tx, result) {
                  var seq = result.insertId;
                  insertAttachmentMappings(seq, function() {
                    dataWritten(tx, seq);
                  });
                }, function() {
                  var fetchSql = select('seq', BY_SEQ_STORE$1, null, 'doc_id=? AND rev=?');
                  tx.executeSql(fetchSql, [id, rev], function(tx, res) {
                    var seq = res.rows.item(0).seq;
                    var sql = 'UPDATE ' + BY_SEQ_STORE$1 + ' SET json=?, deleted=? WHERE doc_id=? AND rev=?;';
                    var sqlArgs = [json, deletedInt, id, rev];
                    tx.executeSql(sql, sqlArgs, function(tx) {
                      insertAttachmentMappings(seq, function() {
                        dataWritten(tx, seq);
                      });
                    });
                  });
                  return false;
                });
              }
              function collectResults(attachmentErr) {
                if (!err) {
                  if (attachmentErr) {
                    err = attachmentErr;
                    callback(err);
                  } else if (recv === attachments.length) {
                    finish();
                  }
                }
              }
              var err = null;
              var recv = 0;
              docInfo.data._id = docInfo.metadata.id;
              docInfo.data._rev = docInfo.metadata.rev;
              var attachments = Object.keys(docInfo.data._attachments || {});
              if (newRevIsDeleted) {
                docInfo.data._deleted = true;
              }
              function attachmentSaved(err) {
                recv++;
                collectResults(err);
              }
              attachments.forEach(function(key) {
                var att = docInfo.data._attachments[key];
                if (!att.stub) {
                  var data = att.data;
                  delete att.data;
                  att.revpos = parseInt(winningRev$$1, 10);
                  var digest = att.digest;
                  saveAttachment(digest, data, attachmentSaved);
                } else {
                  recv++;
                  collectResults();
                }
              });
              if (!attachments.length) {
                finish();
              }
              function dataWritten(tx, seq) {
                var id = docInfo.metadata.id;
                var revsToCompact = docInfo.stemmedRevs || [];
                if (isUpdate && api.auto_compaction) {
                  revsToCompact = compactTree(docInfo.metadata).concat(revsToCompact);
                }
                if (revsToCompact.length) {
                  compactRevs$1(revsToCompact, id, tx);
                }
                docInfo.metadata.seq = seq;
                var rev = docInfo.metadata.rev;
                delete docInfo.metadata.rev;
                var sql = isUpdate ? 'UPDATE ' + DOC_STORE$1 + ' SET json=?, max_seq=?, winningseq=' + '(SELECT seq FROM ' + BY_SEQ_STORE$1 + ' WHERE doc_id=' + DOC_STORE$1 + '.id AND rev=?) WHERE id=?' : 'INSERT INTO ' + DOC_STORE$1 + ' (id, winningseq, max_seq, json) VALUES (?,?,?,?);';
                var metadataStr = safeJsonStringify(docInfo.metadata);
                var params = isUpdate ? [metadataStr, seq, winningRev$$1, id] : [id, seq, seq, metadataStr];
                tx.executeSql(sql, params, function() {
                  results[resultsIdx] = {
                    ok: true,
                    id: docInfo.metadata.id,
                    rev: rev
                  };
                  fetchedDocs.set(id, docInfo.metadata);
                  callback();
                });
              }
            }
            function websqlProcessDocs() {
              processDocs(dbOpts.revs_limit, docInfos, api, fetchedDocs, tx, results, writeDoc, opts);
            }
            function fetchExistingDocs(callback) {
              if (!docInfos.length) {
                return callback();
              }
              var numFetched = 0;
              function checkDone() {
                if (++numFetched === docInfos.length) {
                  callback();
                }
              }
              docInfos.forEach(function(docInfo) {
                if (docInfo._id && isLocalId(docInfo._id)) {
                  return checkDone();
                }
                var id = docInfo.metadata.id;
                tx.executeSql('SELECT json FROM ' + DOC_STORE$1 + ' WHERE id = ?', [id], function(tx, result) {
                  if (result.rows.length) {
                    var metadata = safeJsonParse(result.rows.item(0).json);
                    fetchedDocs.set(id, metadata);
                  }
                  checkDone();
                });
              });
            }
            function saveAttachment(digest, data, callback) {
              var sql = 'SELECT digest FROM ' + ATTACH_STORE$1 + ' WHERE digest=?';
              tx.executeSql(sql, [digest], function(tx, result) {
                if (result.rows.length) {
                  return callback();
                }
                sql = 'INSERT INTO ' + ATTACH_STORE$1 + ' (digest, body, escaped) VALUES (?,?,1)';
                tx.executeSql(sql, [digest, escapeBlob(data)], function() {
                  callback();
                }, function() {
                  callback();
                  return false;
                });
              });
            }
            preprocessAttachments(docInfos, 'binary', function(err) {
              if (err) {
                return callback(err);
              }
              db.transaction(function(txn) {
                tx = txn;
                verifyAttachments(function(err) {
                  if (err) {
                    preconditionErrored = err;
                  } else {
                    fetchExistingDocs(websqlProcessDocs);
                  }
                });
              }, websqlError(callback), complete);
            });
          }
          var cachedDatabases = new ExportedMap();
          function openDatabaseWithOpts(opts) {
            return opts.websql(opts.name, opts.version, opts.description, opts.size);
          }
          function openDBSafely(opts) {
            try {
              return {db: openDatabaseWithOpts(opts)};
            } catch (err) {
              return {error: err};
            }
          }
          function openDB$1(opts) {
            var cachedResult = cachedDatabases.get(opts.name);
            if (!cachedResult) {
              cachedResult = openDBSafely(opts);
              cachedDatabases.set(opts.name, cachedResult);
            }
            return cachedResult;
          }
          var websqlChanges = new Changes();
          function fetchAttachmentsIfNecessary$1(doc, opts, api, txn, cb) {
            var attachments = Object.keys(doc._attachments || {});
            if (!attachments.length) {
              return cb && cb();
            }
            var numDone = 0;
            function checkDone() {
              if (++numDone === attachments.length && cb) {
                cb();
              }
            }
            function fetchAttachment(doc, att) {
              var attObj = doc._attachments[att];
              var attOpts = {
                binary: opts.binary,
                ctx: txn
              };
              api._getAttachment(doc._id, att, attObj, attOpts, function(_, data) {
                doc._attachments[att] = $inject_Object_assign(pick(attObj, ['digest', 'content_type']), {data: data});
                checkDone();
              });
            }
            attachments.forEach(function(att) {
              if (opts.attachments && opts.include_docs) {
                fetchAttachment(doc, att);
              } else {
                doc._attachments[att].stub = true;
                checkDone();
              }
            });
          }
          var POUCH_VERSION = 1;
          var BY_SEQ_STORE_DELETED_INDEX_SQL = 'CREATE INDEX IF NOT EXISTS \'by-seq-deleted-idx\' ON ' + BY_SEQ_STORE$1 + ' (seq, deleted)';
          var BY_SEQ_STORE_DOC_ID_REV_INDEX_SQL = 'CREATE UNIQUE INDEX IF NOT EXISTS \'by-seq-doc-id-rev\' ON ' + BY_SEQ_STORE$1 + ' (doc_id, rev)';
          var DOC_STORE_WINNINGSEQ_INDEX_SQL = 'CREATE INDEX IF NOT EXISTS \'doc-winningseq-idx\' ON ' + DOC_STORE$1 + ' (winningseq)';
          var ATTACH_AND_SEQ_STORE_SEQ_INDEX_SQL = 'CREATE INDEX IF NOT EXISTS \'attach-seq-seq-idx\' ON ' + ATTACH_AND_SEQ_STORE$1 + ' (seq)';
          var ATTACH_AND_SEQ_STORE_ATTACH_INDEX_SQL = 'CREATE UNIQUE INDEX IF NOT EXISTS \'attach-seq-digest-idx\' ON ' + ATTACH_AND_SEQ_STORE$1 + ' (digest, seq)';
          var DOC_STORE_AND_BY_SEQ_JOINER = BY_SEQ_STORE$1 + '.seq = ' + DOC_STORE$1 + '.winningseq';
          var SELECT_DOCS = BY_SEQ_STORE$1 + '.seq AS seq, ' + BY_SEQ_STORE$1 + '.deleted AS deleted, ' + BY_SEQ_STORE$1 + '.json AS data, ' + BY_SEQ_STORE$1 + '.rev AS rev, ' + DOC_STORE$1 + '.json AS metadata';
          function WebSqlPouch$1(opts, callback) {
            var api = this;
            var instanceId = null;
            var size = getSize(opts);
            var idRequests = [];
            var encoding;
            api._name = opts.name;
            var websqlOpts = $inject_Object_assign({}, opts, {
              version: POUCH_VERSION,
              description: opts.name,
              size: size
            });
            var openDBResult = openDB$1(websqlOpts);
            if (openDBResult.error) {
              return websqlError(callback)(openDBResult.error);
            }
            var db = openDBResult.db;
            if (typeof db.readTransaction !== 'function') {
              db.readTransaction = db.transaction;
            }
            function dbCreated() {
              if (hasLocalStorage()) {
                window.localStorage['_pouch__websqldb_' + api._name] = true;
              }
              callback(null, api);
            }
            function runMigration2(tx, callback) {
              tx.executeSql(DOC_STORE_WINNINGSEQ_INDEX_SQL);
              tx.executeSql('ALTER TABLE ' + BY_SEQ_STORE$1 + ' ADD COLUMN deleted TINYINT(1) DEFAULT 0', [], function() {
                tx.executeSql(BY_SEQ_STORE_DELETED_INDEX_SQL);
                tx.executeSql('ALTER TABLE ' + DOC_STORE$1 + ' ADD COLUMN local TINYINT(1) DEFAULT 0', [], function() {
                  tx.executeSql('CREATE INDEX IF NOT EXISTS \'doc-store-local-idx\' ON ' + DOC_STORE$1 + ' (local, id)');
                  var sql = 'SELECT ' + DOC_STORE$1 + '.winningseq AS seq, ' + DOC_STORE$1 + '.json AS metadata FROM ' + BY_SEQ_STORE$1 + ' JOIN ' + DOC_STORE$1 + ' ON ' + BY_SEQ_STORE$1 + '.seq = ' + DOC_STORE$1 + '.winningseq';
                  tx.executeSql(sql, [], function(tx, result) {
                    var deleted = [];
                    var local = [];
                    for (var i = 0; i < result.rows.length; i++) {
                      var item = result.rows.item(i);
                      var seq = item.seq;
                      var metadata = JSON.parse(item.metadata);
                      if (isDeleted(metadata)) {
                        deleted.push(seq);
                      }
                      if (isLocalId(metadata.id)) {
                        local.push(metadata.id);
                      }
                    }
                    tx.executeSql('UPDATE ' + DOC_STORE$1 + 'SET local = 1 WHERE id IN ' + qMarks(local.length), local, function() {
                      tx.executeSql('UPDATE ' + BY_SEQ_STORE$1 + ' SET deleted = 1 WHERE seq IN ' + qMarks(deleted.length), deleted, callback);
                    });
                  });
                });
              });
            }
            function runMigration3(tx, callback) {
              var local = 'CREATE TABLE IF NOT EXISTS ' + LOCAL_STORE$1 + ' (id UNIQUE, rev, json)';
              tx.executeSql(local, [], function() {
                var sql = 'SELECT ' + DOC_STORE$1 + '.id AS id, ' + BY_SEQ_STORE$1 + '.json AS data ' + 'FROM ' + BY_SEQ_STORE$1 + ' JOIN ' + DOC_STORE$1 + ' ON ' + BY_SEQ_STORE$1 + '.seq = ' + DOC_STORE$1 + '.winningseq WHERE local = 1';
                tx.executeSql(sql, [], function(tx, res) {
                  var rows = [];
                  for (var i = 0; i < res.rows.length; i++) {
                    rows.push(res.rows.item(i));
                  }
                  function doNext() {
                    if (!rows.length) {
                      return callback(tx);
                    }
                    var row = rows.shift();
                    var rev$$1 = JSON.parse(row.data)._rev;
                    tx.executeSql('INSERT INTO ' + LOCAL_STORE$1 + ' (id, rev, json) VALUES (?,?,?)', [row.id, rev$$1, row.data], function(tx) {
                      tx.executeSql('DELETE FROM ' + DOC_STORE$1 + ' WHERE id=?', [row.id], function(tx) {
                        tx.executeSql('DELETE FROM ' + BY_SEQ_STORE$1 + ' WHERE seq=?', [row.seq], function() {
                          doNext();
                        });
                      });
                    });
                  }
                  doNext();
                });
              });
            }
            function runMigration4(tx, callback) {
              function updateRows(rows) {
                function doNext() {
                  if (!rows.length) {
                    return callback(tx);
                  }
                  var row = rows.shift();
                  var doc_id_rev = parseHexString(row.hex, encoding);
                  var idx = doc_id_rev.lastIndexOf('::');
                  var doc_id = doc_id_rev.substring(0, idx);
                  var rev$$1 = doc_id_rev.substring(idx + 2);
                  var sql = 'UPDATE ' + BY_SEQ_STORE$1 + ' SET doc_id=?, rev=? WHERE doc_id_rev=?';
                  tx.executeSql(sql, [doc_id, rev$$1, doc_id_rev], function() {
                    doNext();
                  });
                }
                doNext();
              }
              var sql = 'ALTER TABLE ' + BY_SEQ_STORE$1 + ' ADD COLUMN doc_id';
              tx.executeSql(sql, [], function(tx) {
                var sql = 'ALTER TABLE ' + BY_SEQ_STORE$1 + ' ADD COLUMN rev';
                tx.executeSql(sql, [], function(tx) {
                  tx.executeSql(BY_SEQ_STORE_DOC_ID_REV_INDEX_SQL, [], function(tx) {
                    var sql = 'SELECT hex(doc_id_rev) as hex FROM ' + BY_SEQ_STORE$1;
                    tx.executeSql(sql, [], function(tx, res) {
                      var rows = [];
                      for (var i = 0; i < res.rows.length; i++) {
                        rows.push(res.rows.item(i));
                      }
                      updateRows(rows);
                    });
                  });
                });
              });
            }
            function runMigration5(tx, callback) {
              function migrateAttsAndSeqs(tx) {
                var sql = 'SELECT COUNT(*) AS cnt FROM ' + ATTACH_STORE$1;
                tx.executeSql(sql, [], function(tx, res) {
                  var count = res.rows.item(0).cnt;
                  if (!count) {
                    return callback(tx);
                  }
                  var offset = 0;
                  var pageSize = 10;
                  function nextPage() {
                    var sql = select(SELECT_DOCS + ', ' + DOC_STORE$1 + '.id AS id', [DOC_STORE$1, BY_SEQ_STORE$1], DOC_STORE_AND_BY_SEQ_JOINER, null, DOC_STORE$1 + '.id ');
                    sql += ' LIMIT ' + pageSize + ' OFFSET ' + offset;
                    offset += pageSize;
                    tx.executeSql(sql, [], function(tx, res) {
                      if (!res.rows.length) {
                        return callback(tx);
                      }
                      var digestSeqs = {};
                      function addDigestSeq(digest, seq) {
                        var seqs = digestSeqs[digest] = (digestSeqs[digest] || []);
                        if (seqs.indexOf(seq) === -1) {
                          seqs.push(seq);
                        }
                      }
                      for (var i = 0; i < res.rows.length; i++) {
                        var row = res.rows.item(i);
                        var doc = unstringifyDoc(row.data, row.id, row.rev);
                        var atts = Object.keys(doc._attachments || {});
                        for (var j = 0; j < atts.length; j++) {
                          var att = doc._attachments[atts[j]];
                          addDigestSeq(att.digest, row.seq);
                        }
                      }
                      var digestSeqPairs = [];
                      Object.keys(digestSeqs).forEach(function(digest) {
                        var seqs = digestSeqs[digest];
                        seqs.forEach(function(seq) {
                          digestSeqPairs.push([digest, seq]);
                        });
                      });
                      if (!digestSeqPairs.length) {
                        return nextPage();
                      }
                      var numDone = 0;
                      digestSeqPairs.forEach(function(pair) {
                        var sql = 'INSERT INTO ' + ATTACH_AND_SEQ_STORE$1 + ' (digest, seq) VALUES (?,?)';
                        tx.executeSql(sql, pair, function() {
                          if (++numDone === digestSeqPairs.length) {
                            nextPage();
                          }
                        });
                      });
                    });
                  }
                  nextPage();
                });
              }
              var attachAndRev = 'CREATE TABLE IF NOT EXISTS ' + ATTACH_AND_SEQ_STORE$1 + ' (digest, seq INTEGER)';
              tx.executeSql(attachAndRev, [], function(tx) {
                tx.executeSql(ATTACH_AND_SEQ_STORE_ATTACH_INDEX_SQL, [], function(tx) {
                  tx.executeSql(ATTACH_AND_SEQ_STORE_SEQ_INDEX_SQL, [], migrateAttsAndSeqs);
                });
              });
            }
            function runMigration6(tx, callback) {
              var sql = 'ALTER TABLE ' + ATTACH_STORE$1 + ' ADD COLUMN escaped TINYINT(1) DEFAULT 0';
              tx.executeSql(sql, [], callback);
            }
            function runMigration7(tx, callback) {
              var sql = 'ALTER TABLE ' + DOC_STORE$1 + ' ADD COLUMN max_seq INTEGER';
              tx.executeSql(sql, [], function(tx) {
                var sql = 'UPDATE ' + DOC_STORE$1 + ' SET max_seq=(SELECT MAX(seq) FROM ' + BY_SEQ_STORE$1 + ' WHERE doc_id=id)';
                tx.executeSql(sql, [], function(tx) {
                  var sql = 'CREATE UNIQUE INDEX IF NOT EXISTS \'doc-max-seq-idx\' ON ' + DOC_STORE$1 + ' (max_seq)';
                  tx.executeSql(sql, [], callback);
                });
              });
            }
            function checkEncoding(tx, cb) {
              tx.executeSql('SELECT HEX("a") AS hex', [], function(tx, res) {
                var hex = res.rows.item(0).hex;
                encoding = hex.length === 2 ? 'UTF-8' : 'UTF-16';
                cb();
              });
            }
            function onGetInstanceId() {
              while (idRequests.length > 0) {
                var idCallback = idRequests.pop();
                idCallback(null, instanceId);
              }
            }
            function onGetVersion(tx, dbVersion) {
              if (dbVersion === 0) {
                var meta = 'CREATE TABLE IF NOT EXISTS ' + META_STORE$1 + ' (dbid, db_version INTEGER)';
                var attach = 'CREATE TABLE IF NOT EXISTS ' + ATTACH_STORE$1 + ' (digest UNIQUE, escaped TINYINT(1), body BLOB)';
                var attachAndRev = 'CREATE TABLE IF NOT EXISTS ' + ATTACH_AND_SEQ_STORE$1 + ' (digest, seq INTEGER)';
                var doc = 'CREATE TABLE IF NOT EXISTS ' + DOC_STORE$1 + ' (id unique, json, winningseq, max_seq INTEGER UNIQUE)';
                var seq = 'CREATE TABLE IF NOT EXISTS ' + BY_SEQ_STORE$1 + ' (seq INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' + 'json, deleted TINYINT(1), doc_id, rev)';
                var local = 'CREATE TABLE IF NOT EXISTS ' + LOCAL_STORE$1 + ' (id UNIQUE, rev, json)';
                tx.executeSql(attach);
                tx.executeSql(local);
                tx.executeSql(attachAndRev, [], function() {
                  tx.executeSql(ATTACH_AND_SEQ_STORE_SEQ_INDEX_SQL);
                  tx.executeSql(ATTACH_AND_SEQ_STORE_ATTACH_INDEX_SQL);
                });
                tx.executeSql(doc, [], function() {
                  tx.executeSql(DOC_STORE_WINNINGSEQ_INDEX_SQL);
                  tx.executeSql(seq, [], function() {
                    tx.executeSql(BY_SEQ_STORE_DELETED_INDEX_SQL);
                    tx.executeSql(BY_SEQ_STORE_DOC_ID_REV_INDEX_SQL);
                    tx.executeSql(meta, [], function() {
                      var initSeq = 'INSERT INTO ' + META_STORE$1 + ' (db_version, dbid) VALUES (?,?)';
                      instanceId = uuid();
                      var initSeqArgs = [ADAPTER_VERSION$1, instanceId];
                      tx.executeSql(initSeq, initSeqArgs, function() {
                        onGetInstanceId();
                      });
                    });
                  });
                });
              } else {
                var setupDone = function() {
                  var migrated = dbVersion < ADAPTER_VERSION$1;
                  if (migrated) {
                    tx.executeSql('UPDATE ' + META_STORE$1 + ' SET db_version = ' + ADAPTER_VERSION$1);
                  }
                  var sql = 'SELECT dbid FROM ' + META_STORE$1;
                  tx.executeSql(sql, [], function(tx, result) {
                    instanceId = result.rows.item(0).dbid;
                    onGetInstanceId();
                  });
                };
                var tasks = [runMigration2, runMigration3, runMigration4, runMigration5, runMigration6, runMigration7, setupDone];
                var i = dbVersion;
                var nextMigration = function(tx) {
                  tasks[i - 1](tx, nextMigration);
                  i++;
                };
                nextMigration(tx);
              }
            }
            function setup() {
              db.transaction(function(tx) {
                checkEncoding(tx, function() {
                  fetchVersion(tx);
                });
              }, websqlError(callback), dbCreated);
            }
            function fetchVersion(tx) {
              var sql = 'SELECT sql FROM sqlite_master WHERE tbl_name = ' + META_STORE$1;
              tx.executeSql(sql, [], function(tx, result) {
                if (!result.rows.length) {
                  onGetVersion(tx, 0);
                } else if (!/db_version/.test(result.rows.item(0).sql)) {
                  tx.executeSql('ALTER TABLE ' + META_STORE$1 + ' ADD COLUMN db_version INTEGER', [], function() {
                    onGetVersion(tx, 1);
                  });
                } else {
                  tx.executeSql('SELECT db_version FROM ' + META_STORE$1, [], function(tx, result) {
                    var dbVersion = result.rows.item(0).db_version;
                    onGetVersion(tx, dbVersion);
                  });
                }
              });
            }
            setup();
            function getMaxSeq(tx, callback) {
              var sql = 'SELECT MAX(seq) AS seq FROM ' + BY_SEQ_STORE$1;
              tx.executeSql(sql, [], function(tx, res) {
                var updateSeq = res.rows.item(0).seq || 0;
                callback(updateSeq);
              });
            }
            function countDocs(tx, callback) {
              var sql = select('COUNT(' + DOC_STORE$1 + '.id) AS \'num\'', [DOC_STORE$1, BY_SEQ_STORE$1], DOC_STORE_AND_BY_SEQ_JOINER, BY_SEQ_STORE$1 + '.deleted=0');
              tx.executeSql(sql, [], function(tx, result) {
                callback(result.rows.item(0).num);
              });
            }
            api._remote = false;
            api.type = function() {
              return 'websql';
            };
            api._id = toPromise(function(callback) {
              callback(null, instanceId);
            });
            api._info = function(callback) {
              var seq;
              var docCount;
              db.readTransaction(function(tx) {
                getMaxSeq(tx, function(theSeq) {
                  seq = theSeq;
                });
                countDocs(tx, function(theDocCount) {
                  docCount = theDocCount;
                });
              }, websqlError(callback), function() {
                callback(null, {
                  doc_count: docCount,
                  update_seq: seq,
                  websql_encoding: encoding
                });
              });
            };
            api._bulkDocs = function(req, reqOpts, callback) {
              websqlBulkDocs(opts, req, reqOpts, api, db, websqlChanges, callback);
            };
            function latest$$1(tx, id, rev$$1, callback, finish) {
              var sql = select(SELECT_DOCS, [DOC_STORE$1, BY_SEQ_STORE$1], DOC_STORE_AND_BY_SEQ_JOINER, DOC_STORE$1 + '.id=?');
              var sqlArgs = [id];
              tx.executeSql(sql, sqlArgs, function(a, results) {
                if (!results.rows.length) {
                  var err = createError(MISSING_DOC, 'missing');
                  return finish(err);
                }
                var item = results.rows.item(0);
                var metadata = safeJsonParse(item.metadata);
                callback(latest(rev$$1, metadata));
              });
            }
            api._get = function(id, opts, callback) {
              var doc;
              var metadata;
              var tx = opts.ctx;
              if (!tx) {
                return db.readTransaction(function(txn) {
                  api._get(id, $inject_Object_assign({ctx: txn}, opts), callback);
                });
              }
              function finish(err) {
                callback(err, {
                  doc: doc,
                  metadata: metadata,
                  ctx: tx
                });
              }
              var sql;
              var sqlArgs;
              if (!opts.rev) {
                sql = select(SELECT_DOCS, [DOC_STORE$1, BY_SEQ_STORE$1], DOC_STORE_AND_BY_SEQ_JOINER, DOC_STORE$1 + '.id=?');
                sqlArgs = [id];
              } else if (opts.latest) {
                latest$$1(tx, id, opts.rev, function(latestRev) {
                  opts.latest = false;
                  opts.rev = latestRev;
                  api._get(id, opts, callback);
                }, finish);
                return;
              } else {
                sql = select(SELECT_DOCS, [DOC_STORE$1, BY_SEQ_STORE$1], DOC_STORE$1 + '.id=' + BY_SEQ_STORE$1 + '.doc_id', [BY_SEQ_STORE$1 + '.doc_id=?', BY_SEQ_STORE$1 + '.rev=?']);
                sqlArgs = [id, opts.rev];
              }
              tx.executeSql(sql, sqlArgs, function(a, results) {
                if (!results.rows.length) {
                  var missingErr = createError(MISSING_DOC, 'missing');
                  return finish(missingErr);
                }
                var item = results.rows.item(0);
                metadata = safeJsonParse(item.metadata);
                if (item.deleted && !opts.rev) {
                  var deletedErr = createError(MISSING_DOC, 'deleted');
                  return finish(deletedErr);
                }
                doc = unstringifyDoc(item.data, metadata.id, item.rev);
                finish();
              });
            };
            api._allDocs = function(opts, callback) {
              var results = [];
              var totalRows;
              var start = 'startkey' in opts ? opts.startkey : false;
              var end = 'endkey' in opts ? opts.endkey : false;
              var key = 'key' in opts ? opts.key : false;
              var descending = 'descending' in opts ? opts.descending : false;
              var limit = 'limit' in opts ? opts.limit : -1;
              var offset = 'skip' in opts ? opts.skip : 0;
              var inclusiveEnd = opts.inclusive_end !== false;
              var sqlArgs = [];
              var criteria = [];
              if (key !== false) {
                criteria.push(DOC_STORE$1 + '.id = ?');
                sqlArgs.push(key);
              } else if (start !== false || end !== false) {
                if (start !== false) {
                  criteria.push(DOC_STORE$1 + '.id ' + (descending ? '<=' : '>=') + ' ?');
                  sqlArgs.push(start);
                }
                if (end !== false) {
                  var comparator = descending ? '>' : '<';
                  if (inclusiveEnd) {
                    comparator += '=';
                  }
                  criteria.push(DOC_STORE$1 + '.id ' + comparator + ' ?');
                  sqlArgs.push(end);
                }
                if (key !== false) {
                  criteria.push(DOC_STORE$1 + '.id = ?');
                  sqlArgs.push(key);
                }
              }
              if (opts.deleted !== 'ok') {
                criteria.push(BY_SEQ_STORE$1 + '.deleted = 0');
              }
              db.readTransaction(function(tx) {
                countDocs(tx, function(docCount) {
                  totalRows = docCount;
                });
                if (limit === 0) {
                  return;
                }
                var sql = select(SELECT_DOCS, [DOC_STORE$1, BY_SEQ_STORE$1], DOC_STORE_AND_BY_SEQ_JOINER, criteria, DOC_STORE$1 + '.id ' + (descending ? 'DESC' : 'ASC'));
                sql += ' LIMIT ' + limit + ' OFFSET ' + offset;
                tx.executeSql(sql, sqlArgs, function(tx, result) {
                  for (var i = 0,
                      l = result.rows.length; i < l; i++) {
                    var item = result.rows.item(i);
                    var metadata = safeJsonParse(item.metadata);
                    var id = metadata.id;
                    var data = unstringifyDoc(item.data, id, item.rev);
                    var winningRev$$1 = data._rev;
                    var doc = {
                      id: id,
                      key: id,
                      value: {rev: winningRev$$1}
                    };
                    if (opts.include_docs) {
                      doc.doc = data;
                      doc.doc._rev = winningRev$$1;
                      if (opts.conflicts) {
                        var conflicts = collectConflicts(metadata);
                        if (conflicts.length) {
                          doc.doc._conflicts = conflicts;
                        }
                      }
                      fetchAttachmentsIfNecessary$1(doc.doc, opts, api, tx);
                    }
                    if (item.deleted) {
                      if (opts.deleted === 'ok') {
                        doc.value.deleted = true;
                        doc.doc = null;
                      } else {
                        continue;
                      }
                    }
                    results.push(doc);
                  }
                });
              }, websqlError(callback), function() {
                callback(null, {
                  total_rows: totalRows,
                  offset: opts.skip,
                  rows: results
                });
              });
            };
            api._changes = function(opts) {
              opts = clone(opts);
              if (opts.continuous) {
                var id = api._name + ':' + uuid();
                websqlChanges.addListener(api._name, id, api, opts);
                websqlChanges.notify(api._name);
                return {cancel: function() {
                    websqlChanges.removeListener(api._name, id);
                  }};
              }
              var descending = opts.descending;
              opts.since = opts.since && !descending ? opts.since : 0;
              var limit = 'limit' in opts ? opts.limit : -1;
              if (limit === 0) {
                limit = 1;
              }
              var returnDocs;
              if ('return_docs' in opts) {
                returnDocs = opts.return_docs;
              } else if ('returnDocs' in opts) {
                returnDocs = opts.returnDocs;
              } else {
                returnDocs = true;
              }
              var results = [];
              var numResults = 0;
              function fetchChanges() {
                var selectStmt = DOC_STORE$1 + '.json AS metadata, ' + DOC_STORE$1 + '.max_seq AS maxSeq, ' + BY_SEQ_STORE$1 + '.json AS winningDoc, ' + BY_SEQ_STORE$1 + '.rev AS winningRev ';
                var from = DOC_STORE$1 + ' JOIN ' + BY_SEQ_STORE$1;
                var joiner = DOC_STORE$1 + '.id=' + BY_SEQ_STORE$1 + '.doc_id' + ' AND ' + DOC_STORE$1 + '.winningseq=' + BY_SEQ_STORE$1 + '.seq';
                var criteria = ['maxSeq > ?'];
                var sqlArgs = [opts.since];
                if (opts.doc_ids) {
                  criteria.push(DOC_STORE$1 + '.id IN ' + qMarks(opts.doc_ids.length));
                  sqlArgs = sqlArgs.concat(opts.doc_ids);
                }
                var orderBy = 'maxSeq ' + (descending ? 'DESC' : 'ASC');
                var sql = select(selectStmt, from, joiner, criteria, orderBy);
                var filter = filterChange(opts);
                if (!opts.view && !opts.filter) {
                  sql += ' LIMIT ' + limit;
                }
                var lastSeq = opts.since || 0;
                db.readTransaction(function(tx) {
                  tx.executeSql(sql, sqlArgs, function(tx, result) {
                    function reportChange(change) {
                      return function() {
                        opts.onChange(change);
                      };
                    }
                    for (var i = 0,
                        l = result.rows.length; i < l; i++) {
                      var item = result.rows.item(i);
                      var metadata = safeJsonParse(item.metadata);
                      lastSeq = item.maxSeq;
                      var doc = unstringifyDoc(item.winningDoc, metadata.id, item.winningRev);
                      var change = opts.processChange(doc, metadata, opts);
                      change.seq = item.maxSeq;
                      var filtered = filter(change);
                      if (typeof filtered === 'object') {
                        return opts.complete(filtered);
                      }
                      if (filtered) {
                        numResults++;
                        if (returnDocs) {
                          results.push(change);
                        }
                        if (opts.attachments && opts.include_docs) {
                          fetchAttachmentsIfNecessary$1(doc, opts, api, tx, reportChange(change));
                        } else {
                          reportChange(change)();
                        }
                      }
                      if (numResults === limit) {
                        break;
                      }
                    }
                  });
                }, websqlError(opts.complete), function() {
                  if (!opts.continuous) {
                    opts.complete(null, {
                      results: results,
                      last_seq: lastSeq
                    });
                  }
                });
              }
              fetchChanges();
            };
            api._close = function(callback) {
              callback();
            };
            api._getAttachment = function(docId, attachId, attachment, opts, callback) {
              var res;
              var tx = opts.ctx;
              var digest = attachment.digest;
              var type = attachment.content_type;
              var sql = 'SELECT escaped, ' + 'CASE WHEN escaped = 1 THEN body ELSE HEX(body) END AS body FROM ' + ATTACH_STORE$1 + ' WHERE digest=?';
              tx.executeSql(sql, [digest], function(tx, result) {
                var item = result.rows.item(0);
                var data = item.escaped ? unescapeBlob(item.body) : parseHexString(item.body, encoding);
                if (opts.binary) {
                  res = binStringToBluffer(data, type);
                } else {
                  res = thisBtoa(data);
                }
                callback(null, res);
              });
            };
            api._getRevisionTree = function(docId, callback) {
              db.readTransaction(function(tx) {
                var sql = 'SELECT json AS metadata FROM ' + DOC_STORE$1 + ' WHERE id = ?';
                tx.executeSql(sql, [docId], function(tx, result) {
                  if (!result.rows.length) {
                    callback(createError(MISSING_DOC));
                  } else {
                    var data = safeJsonParse(result.rows.item(0).metadata);
                    callback(null, data.rev_tree);
                  }
                });
              });
            };
            api._doCompaction = function(docId, revs, callback) {
              if (!revs.length) {
                return callback();
              }
              db.transaction(function(tx) {
                var sql = 'SELECT json AS metadata FROM ' + DOC_STORE$1 + ' WHERE id = ?';
                tx.executeSql(sql, [docId], function(tx, result) {
                  var metadata = safeJsonParse(result.rows.item(0).metadata);
                  traverseRevTree(metadata.rev_tree, function(isLeaf, pos, revHash, ctx, opts) {
                    var rev$$1 = pos + '-' + revHash;
                    if (revs.indexOf(rev$$1) !== -1) {
                      opts.status = 'missing';
                    }
                  });
                  var sql = 'UPDATE ' + DOC_STORE$1 + ' SET json = ? WHERE id = ?';
                  tx.executeSql(sql, [safeJsonStringify(metadata), docId]);
                });
                compactRevs$1(revs, docId, tx);
              }, websqlError(callback), function() {
                callback();
              });
            };
            api._getLocal = function(id, callback) {
              db.readTransaction(function(tx) {
                var sql = 'SELECT json, rev FROM ' + LOCAL_STORE$1 + ' WHERE id=?';
                tx.executeSql(sql, [id], function(tx, res) {
                  if (res.rows.length) {
                    var item = res.rows.item(0);
                    var doc = unstringifyDoc(item.json, id, item.rev);
                    callback(null, doc);
                  } else {
                    callback(createError(MISSING_DOC));
                  }
                });
              });
            };
            api._putLocal = function(doc, opts, callback) {
              if (typeof opts === 'function') {
                callback = opts;
                opts = {};
              }
              delete doc._revisions;
              var oldRev = doc._rev;
              var id = doc._id;
              var newRev;
              if (!oldRev) {
                newRev = doc._rev = '0-1';
              } else {
                newRev = doc._rev = '0-' + (parseInt(oldRev.split('-')[1], 10) + 1);
              }
              var json = stringifyDoc(doc);
              var ret;
              function putLocal(tx) {
                var sql;
                var values;
                if (oldRev) {
                  sql = 'UPDATE ' + LOCAL_STORE$1 + ' SET rev=?, json=? ' + 'WHERE id=? AND rev=?';
                  values = [newRev, json, id, oldRev];
                } else {
                  sql = 'INSERT INTO ' + LOCAL_STORE$1 + ' (id, rev, json) VALUES (?,?,?)';
                  values = [id, newRev, json];
                }
                tx.executeSql(sql, values, function(tx, res) {
                  if (res.rowsAffected) {
                    ret = {
                      ok: true,
                      id: id,
                      rev: newRev
                    };
                    if (opts.ctx) {
                      callback(null, ret);
                    }
                  } else {
                    callback(createError(REV_CONFLICT));
                  }
                }, function() {
                  callback(createError(REV_CONFLICT));
                  return false;
                });
              }
              if (opts.ctx) {
                putLocal(opts.ctx);
              } else {
                db.transaction(putLocal, websqlError(callback), function() {
                  if (ret) {
                    callback(null, ret);
                  }
                });
              }
            };
            api._removeLocal = function(doc, opts, callback) {
              if (typeof opts === 'function') {
                callback = opts;
                opts = {};
              }
              var ret;
              function removeLocal(tx) {
                var sql = 'DELETE FROM ' + LOCAL_STORE$1 + ' WHERE id=? AND rev=?';
                var params = [doc._id, doc._rev];
                tx.executeSql(sql, params, function(tx, res) {
                  if (!res.rowsAffected) {
                    return callback(createError(MISSING_DOC));
                  }
                  ret = {
                    ok: true,
                    id: doc._id,
                    rev: '0-0'
                  };
                  if (opts.ctx) {
                    callback(null, ret);
                  }
                });
              }
              if (opts.ctx) {
                removeLocal(opts.ctx);
              } else {
                db.transaction(removeLocal, websqlError(callback), function() {
                  if (ret) {
                    callback(null, ret);
                  }
                });
              }
            };
            api._destroy = function(opts, callback) {
              websqlChanges.removeAllListeners(api._name);
              db.transaction(function(tx) {
                var stores = [DOC_STORE$1, BY_SEQ_STORE$1, ATTACH_STORE$1, META_STORE$1, LOCAL_STORE$1, ATTACH_AND_SEQ_STORE$1];
                stores.forEach(function(store) {
                  tx.executeSql('DROP TABLE IF EXISTS ' + store, []);
                });
              }, websqlError(callback), function() {
                if (hasLocalStorage()) {
                  delete window.localStorage['_pouch__websqldb_' + api._name];
                  delete window.localStorage[api._name];
                }
                callback(null, {'ok': true});
              });
            };
          }
          function canOpenTestDB() {
            try {
              openDatabase('_pouch_validate_websql', 1, '', 1);
              return true;
            } catch (err) {
              return false;
            }
          }
          function isValidWebSQL() {
            if (typeof indexedDB === 'undefined' || indexedDB === null || !/iP(hone|od|ad)/.test(navigator.userAgent)) {
              return true;
            }
            var hasLS = hasLocalStorage();
            var localStorageKey = '_pouch__websqldb_valid_' + navigator.userAgent;
            if (hasLS && localStorage[localStorageKey]) {
              return localStorage[localStorageKey] === '1';
            }
            var openedTestDB = canOpenTestDB();
            if (hasLS) {
              localStorage[localStorageKey] = openedTestDB ? '1' : '0';
            }
            return openedTestDB;
          }
          function valid() {
            if (typeof openDatabase !== 'function') {
              return false;
            }
            return isValidWebSQL();
          }
          function openDB(name, version, description, size) {
            return openDatabase(name, version, description, size);
          }
          function WebSQLPouch(opts, callback) {
            var _opts = $inject_Object_assign({websql: openDB}, opts);
            WebSqlPouch$1.call(this, _opts, callback);
          }
          WebSQLPouch.valid = valid;
          WebSQLPouch.use_prefix = true;
          var WebSqlPouch = function(PouchDB) {
            PouchDB.adapter('websql', WebSQLPouch, true);
          };
          function wrappedFetch() {
            var wrappedPromise = {};
            var promise = new PouchPromise$1(function(resolve, reject) {
              wrappedPromise.resolve = resolve;
              wrappedPromise.reject = reject;
            });
            var args = new Array(arguments.length);
            for (var i = 0; i < args.length; i++) {
              args[i] = arguments[i];
            }
            wrappedPromise.promise = promise;
            PouchPromise$1.resolve().then(function() {
              return fetch.apply(null, args);
            }).then(function(response) {
              wrappedPromise.resolve(response);
            })["catch"](function(error) {
              wrappedPromise.reject(error);
            });
            return wrappedPromise;
          }
          function fetchRequest(options, callback) {
            var wrappedPromise,
                timer,
                response;
            var headers = new Headers();
            var fetchOptions = {
              method: options.method,
              credentials: 'include',
              headers: headers
            };
            if (options.json) {
              headers.set('Accept', 'application/json');
              headers.set('Content-Type', options.headers['Content-Type'] || 'application/json');
            }
            if (options.body && options.processData && typeof options.body !== 'string') {
              fetchOptions.body = JSON.stringify(options.body);
            } else if ('body' in options) {
              fetchOptions.body = options.body;
            } else {
              fetchOptions.body = null;
            }
            Object.keys(options.headers).forEach(function(key) {
              if (options.headers.hasOwnProperty(key)) {
                headers.set(key, options.headers[key]);
              }
            });
            wrappedPromise = wrappedFetch(options.url, fetchOptions);
            if (options.timeout > 0) {
              timer = setTimeout(function() {
                wrappedPromise.reject(new Error('Load timeout for resource: ' + options.url));
              }, options.timeout);
            }
            wrappedPromise.promise.then(function(fetchResponse) {
              response = {statusCode: fetchResponse.status};
              if (options.timeout > 0) {
                clearTimeout(timer);
              }
              if (response.statusCode >= 200 && response.statusCode < 300) {
                return options.binary ? fetchResponse.blob() : fetchResponse.text();
              }
              return fetchResponse.json();
            }).then(function(result) {
              if (response.statusCode >= 200 && response.statusCode < 300) {
                callback(null, response, result);
              } else {
                result.status = response.statusCode;
                callback(result);
              }
            })["catch"](function(error) {
              if (!error) {
                error = new Error('canceled');
              }
              callback(error);
            });
            return {abort: wrappedPromise.reject};
          }
          function xhRequest(options, callback) {
            var xhr,
                timer;
            var timedout = false;
            var abortReq = function() {
              xhr.abort();
              cleanUp();
            };
            var timeoutReq = function() {
              timedout = true;
              xhr.abort();
              cleanUp();
            };
            var ret = {abort: abortReq};
            var cleanUp = function() {
              clearTimeout(timer);
              ret.abort = function() {};
              if (xhr) {
                xhr.onprogress = undefined;
                if (xhr.upload) {
                  xhr.upload.onprogress = undefined;
                }
                xhr.onreadystatechange = undefined;
                xhr = undefined;
              }
            };
            if (options.xhr) {
              xhr = new options.xhr();
            } else {
              xhr = new XMLHttpRequest();
            }
            try {
              xhr.open(options.method, options.url);
            } catch (exception) {
              return callback(new Error(exception.name || 'Url is invalid'));
            }
            xhr.withCredentials = ('withCredentials' in options) ? options.withCredentials : true;
            if (options.method === 'GET') {
              delete options.headers['Content-Type'];
            } else if (options.json) {
              options.headers.Accept = 'application/json';
              options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
              if (options.body && options.processData && typeof options.body !== "string") {
                options.body = JSON.stringify(options.body);
              }
            }
            if (options.binary) {
              xhr.responseType = 'arraybuffer';
            }
            if (!('body' in options)) {
              options.body = null;
            }
            for (var key in options.headers) {
              if (options.headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, options.headers[key]);
              }
            }
            if (options.timeout > 0) {
              timer = setTimeout(timeoutReq, options.timeout);
              xhr.onprogress = function() {
                clearTimeout(timer);
                if (xhr.readyState !== 4) {
                  timer = setTimeout(timeoutReq, options.timeout);
                }
              };
              if (typeof xhr.upload !== 'undefined') {
                xhr.upload.onprogress = xhr.onprogress;
              }
            }
            xhr.onreadystatechange = function() {
              if (xhr.readyState !== 4) {
                return;
              }
              var response = {statusCode: xhr.status};
              if (xhr.status >= 200 && xhr.status < 300) {
                var data;
                if (options.binary) {
                  data = createBlob([xhr.response || ''], {type: xhr.getResponseHeader('Content-Type')});
                } else {
                  data = xhr.responseText;
                }
                callback(null, response, data);
              } else {
                var err = {};
                if (timedout) {
                  err = new Error('ETIMEDOUT');
                  err.code = 'ETIMEDOUT';
                } else if (typeof xhr.response === 'string') {
                  try {
                    err = JSON.parse(xhr.response);
                  } catch (e) {}
                }
                err.status = xhr.status;
                callback(err);
              }
              cleanUp();
            };
            if (options.body && (options.body instanceof Blob)) {
              readAsArrayBuffer(options.body, function(arrayBuffer) {
                xhr.send(arrayBuffer);
              });
            } else {
              xhr.send(options.body);
            }
            return ret;
          }
          function testXhr() {
            try {
              new XMLHttpRequest();
              return true;
            } catch (err) {
              return false;
            }
          }
          var hasXhr = testXhr();
          function ajax$1(options, callback) {
            if (!false && (hasXhr || options.xhr)) {
              return xhRequest(options, callback);
            } else {
              return fetchRequest(options, callback);
            }
          }
          var res$2 = function() {};
          function defaultBody() {
            return '';
          }
          function ajaxCore$1(options, callback) {
            options = clone(options);
            var defaultOptions = {
              method: "GET",
              headers: {},
              json: true,
              processData: true,
              timeout: 10000,
              cache: false
            };
            options = $inject_Object_assign(defaultOptions, options);
            function onSuccess(obj, resp, cb) {
              if (!options.binary && options.json && typeof obj === 'string') {
                try {
                  obj = JSON.parse(obj);
                } catch (e) {
                  return cb(e);
                }
              }
              if (Array.isArray(obj)) {
                obj = obj.map(function(v) {
                  if (v.error || v.missing) {
                    return generateErrorFromResponse(v);
                  } else {
                    return v;
                  }
                });
              }
              if (options.binary) {
                res$2(obj, resp);
              }
              cb(null, obj, resp);
            }
            if (options.json) {
              if (!options.binary) {
                options.headers.Accept = 'application/json';
              }
              options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
            }
            if (options.binary) {
              options.encoding = null;
              options.json = false;
            }
            if (!options.processData) {
              options.json = false;
            }
            return ajax$1(options, function(err, response, body) {
              if (err) {
                return callback(generateErrorFromResponse(err));
              }
              var error;
              var content_type = response.headers && response.headers['content-type'];
              var data = body || defaultBody();
              if (!options.binary && (options.json || !options.processData) && typeof data !== 'object' && (/json/.test(content_type) || (/^[\s]*\{/.test(data) && /\}[\s]*$/.test(data)))) {
                try {
                  data = JSON.parse(data.toString());
                } catch (e) {}
              }
              if (response.statusCode >= 200 && response.statusCode < 300) {
                onSuccess(data, response, callback);
              } else {
                error = generateErrorFromResponse(data);
                error.status = response.statusCode;
                callback(error);
              }
            });
          }
          function ajax(opts, callback) {
            var ua = (navigator && navigator.userAgent) ? navigator.userAgent.toLowerCase() : '';
            var isSafari = ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1;
            var isIE = ua.indexOf('msie') !== -1;
            var isEdge = ua.indexOf('edge') !== -1;
            var shouldCacheBust = (isSafari || ((isIE || isEdge) && opts.method === 'GET'));
            var cache = 'cache' in opts ? opts.cache : true;
            var isBlobUrl = /^blob:/.test(opts.url);
            if (!isBlobUrl && (shouldCacheBust || !cache)) {
              var hasArgs = opts.url.indexOf('?') !== -1;
              opts.url += (hasArgs ? '&' : '?') + '_nonce=' + Date.now();
            }
            return ajaxCore$1(opts, callback);
          }
          function pool(promiseFactories, limit) {
            return new PouchPromise$1(function(resolve, reject) {
              var running = 0;
              var current = 0;
              var done = 0;
              var len = promiseFactories.length;
              var err;
              function runNext() {
                running++;
                promiseFactories[current++]().then(onSuccess, onError);
              }
              function doNext() {
                if (++done === len) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                } else {
                  runNextBatch();
                }
              }
              function onSuccess() {
                running--;
                doNext();
              }
              function onError(thisErr) {
                running--;
                err = err || thisErr;
                doNext();
              }
              function runNextBatch() {
                while (running < limit && current < len) {
                  runNext();
                }
              }
              runNextBatch();
            });
          }
          var CHANGES_BATCH_SIZE = 25;
          var MAX_SIMULTANEOUS_REVS = 50;
          var CHANGES_TIMEOUT_BUFFER = 5000;
          var DEFAULT_HEARTBEAT = 10000;
          var supportsBulkGetMap = {};
          function readAttachmentsAsBlobOrBuffer(row) {
            var atts = row.doc && row.doc._attachments;
            if (!atts) {
              return;
            }
            Object.keys(atts).forEach(function(filename) {
              var att = atts[filename];
              att.data = b64ToBluffer(att.data, att.content_type);
            });
          }
          function encodeDocId(id) {
            if (/^_design/.test(id)) {
              return '_design/' + encodeURIComponent(id.slice(8));
            }
            if (/^_local/.test(id)) {
              return '_local/' + encodeURIComponent(id.slice(7));
            }
            return encodeURIComponent(id);
          }
          function preprocessAttachments$2(doc) {
            if (!doc._attachments || !Object.keys(doc._attachments)) {
              return PouchPromise$1.resolve();
            }
            return PouchPromise$1.all(Object.keys(doc._attachments).map(function(key) {
              var attachment = doc._attachments[key];
              if (attachment.data && typeof attachment.data !== 'string') {
                return new PouchPromise$1(function(resolve) {
                  blobToBase64(attachment.data, resolve);
                }).then(function(b64) {
                  attachment.data = b64;
                });
              }
            }));
          }
          function hasUrlPrefix(opts) {
            if (!opts.prefix) {
              return false;
            }
            var protocol = parseUri(opts.prefix).protocol;
            return protocol === 'http' || protocol === 'https';
          }
          function getHost(name, opts) {
            if (hasUrlPrefix(opts)) {
              var dbName = opts.name.substr(opts.prefix.length);
              name = opts.prefix + encodeURIComponent(dbName);
            }
            var uri = parseUri(name);
            if (uri.user || uri.password) {
              uri.auth = {
                username: uri.user,
                password: uri.password
              };
            }
            var parts = uri.path.replace(/(^\/|\/$)/g, '').split('/');
            uri.db = parts.pop();
            if (uri.db.indexOf('%') === -1) {
              uri.db = encodeURIComponent(uri.db);
            }
            uri.path = parts.join('/');
            return uri;
          }
          function genDBUrl(opts, path) {
            return genUrl(opts, opts.db + '/' + path);
          }
          function genUrl(opts, path) {
            var pathDel = !opts.path ? '' : '/';
            return opts.protocol + '://' + opts.host + (opts.port ? (':' + opts.port) : '') + '/' + opts.path + pathDel + path;
          }
          function paramsToStr(params) {
            return '?' + Object.keys(params).map(function(k) {
              return k + '=' + encodeURIComponent(params[k]);
            }).join('&');
          }
          function HttpPouch(opts, callback) {
            var api = this;
            var host = getHost(opts.name, opts);
            var dbUrl = genDBUrl(host, '');
            opts = clone(opts);
            var ajaxOpts = opts.ajax || {};
            if (opts.auth || host.auth) {
              var nAuth = opts.auth || host.auth;
              var str = nAuth.username + ':' + nAuth.password;
              var token = thisBtoa(unescape(encodeURIComponent(str)));
              ajaxOpts.headers = ajaxOpts.headers || {};
              ajaxOpts.headers.Authorization = 'Basic ' + token;
            }
            api._ajax = ajax;
            function ajax$$1(userOpts, options, callback) {
              var reqAjax = userOpts.ajax || {};
              var reqOpts = $inject_Object_assign(clone(ajaxOpts), reqAjax, options);
              var defaultHeaders = clone(ajaxOpts.headers || {});
              reqOpts.headers = $inject_Object_assign(defaultHeaders, reqAjax.headers, options.headers || {});
              if (api.constructor.listeners('debug').length) {
                api.constructor.emit('debug', ['http', reqOpts.method, reqOpts.url]);
              }
              return api._ajax(reqOpts, callback);
            }
            function ajaxPromise(userOpts, opts) {
              return new PouchPromise$1(function(resolve, reject) {
                ajax$$1(userOpts, opts, function(err, res) {
                  if (err) {
                    return reject(err);
                  }
                  resolve(res);
                });
              });
            }
            function adapterFun$$1(name, fun) {
              return adapterFun(name, getArguments(function(args) {
                setup().then(function() {
                  return fun.apply(this, args);
                })["catch"](function(e) {
                  var callback = args.pop();
                  callback(e);
                });
              }));
            }
            var setupPromise;
            function setup() {
              if (opts.skipSetup || opts.skip_setup) {
                return PouchPromise$1.resolve();
              }
              if (setupPromise) {
                return setupPromise;
              }
              var checkExists = {
                method: 'GET',
                url: dbUrl
              };
              setupPromise = ajaxPromise({}, checkExists)["catch"](function(err) {
                if (err && err.status && err.status === 404) {
                  explainError(404, 'PouchDB is just detecting if the remote exists.');
                  return ajaxPromise({}, {
                    method: 'PUT',
                    url: dbUrl
                  });
                } else {
                  return PouchPromise$1.reject(err);
                }
              })["catch"](function(err) {
                if (err && err.status && err.status === 412) {
                  return true;
                }
                return PouchPromise$1.reject(err);
              });
              setupPromise["catch"](function() {
                setupPromise = null;
              });
              return setupPromise;
            }
            nextTick(function() {
              callback(null, api);
            });
            api._remote = true;
            api.type = function() {
              return 'http';
            };
            api.id = adapterFun$$1('id', function(callback) {
              ajax$$1({}, {
                method: 'GET',
                url: genUrl(host, '')
              }, function(err, result) {
                var uuid$$1 = (result && result.uuid) ? (result.uuid + host.db) : genDBUrl(host, '');
                callback(null, uuid$$1);
              });
            });
            api.request = adapterFun$$1('request', function(options, callback) {
              options.url = genDBUrl(host, options.url);
              ajax$$1({}, options, callback);
            });
            api.compact = adapterFun$$1('compact', function(opts, callback) {
              if (typeof opts === 'function') {
                callback = opts;
                opts = {};
              }
              opts = clone(opts);
              ajax$$1(opts, {
                url: genDBUrl(host, '_compact'),
                method: 'POST'
              }, function() {
                function ping() {
                  api.info(function(err, res) {
                    if (res && !res.compact_running) {
                      callback(null, {ok: true});
                    } else {
                      setTimeout(ping, opts.interval || 200);
                    }
                  });
                }
                ping();
              });
            });
            api.bulkGet = adapterFun('bulkGet', function(opts, callback) {
              var self = this;
              function doBulkGet(cb) {
                var params = {};
                if (opts.revs) {
                  params.revs = true;
                }
                if (opts.attachments) {
                  params.attachments = true;
                }
                if (opts.latest) {
                  params.latest = true;
                }
                ajax$$1(opts, {
                  url: genDBUrl(host, '_bulk_get' + paramsToStr(params)),
                  method: 'POST',
                  body: {docs: opts.docs}
                }, cb);
              }
              function doBulkGetShim() {
                var batchSize = MAX_SIMULTANEOUS_REVS;
                var numBatches = Math.ceil(opts.docs.length / batchSize);
                var numDone = 0;
                var results = new Array(numBatches);
                function onResult(batchNum) {
                  return function(err, res) {
                    results[batchNum] = res.results;
                    if (++numDone === numBatches) {
                      callback(null, {results: flatten(results)});
                    }
                  };
                }
                for (var i = 0; i < numBatches; i++) {
                  var subOpts = pick(opts, ['revs', 'attachments', 'latest']);
                  subOpts.ajax = ajaxOpts;
                  subOpts.docs = opts.docs.slice(i * batchSize, Math.min(opts.docs.length, (i + 1) * batchSize));
                  bulkGet(self, subOpts, onResult(i));
                }
              }
              var dbUrl = genUrl(host, '');
              var supportsBulkGet = supportsBulkGetMap[dbUrl];
              if (typeof supportsBulkGet !== 'boolean') {
                doBulkGet(function(err, res) {
                  if (err) {
                    supportsBulkGetMap[dbUrl] = false;
                    explainError(err.status, 'PouchDB is just detecting if the remote ' + 'supports the _bulk_get API.');
                    doBulkGetShim();
                  } else {
                    supportsBulkGetMap[dbUrl] = true;
                    callback(null, res);
                  }
                });
              } else if (supportsBulkGet) {
                doBulkGet(callback);
              } else {
                doBulkGetShim();
              }
            });
            api._info = function(callback) {
              setup().then(function() {
                ajax$$1({}, {
                  method: 'GET',
                  url: genDBUrl(host, '')
                }, function(err, res) {
                  if (err) {
                    return callback(err);
                  }
                  res.host = genDBUrl(host, '');
                  callback(null, res);
                });
              })["catch"](callback);
            };
            api.get = adapterFun$$1('get', function(id, opts, callback) {
              if (typeof opts === 'function') {
                callback = opts;
                opts = {};
              }
              opts = clone(opts);
              var params = {};
              if (opts.revs) {
                params.revs = true;
              }
              if (opts.revs_info) {
                params.revs_info = true;
              }
              if (opts.latest) {
                params.latest = true;
              }
              if (opts.open_revs) {
                if (opts.open_revs !== "all") {
                  opts.open_revs = JSON.stringify(opts.open_revs);
                }
                params.open_revs = opts.open_revs;
              }
              if (opts.rev) {
                params.rev = opts.rev;
              }
              if (opts.conflicts) {
                params.conflicts = opts.conflicts;
              }
              id = encodeDocId(id);
              var options = {
                method: 'GET',
                url: genDBUrl(host, id + paramsToStr(params))
              };
              function fetchAttachments(doc) {
                var atts = doc._attachments;
                var filenames = atts && Object.keys(atts);
                if (!atts || !filenames.length) {
                  return;
                }
                function fetch(filename) {
                  var att = atts[filename];
                  var path = encodeDocId(doc._id) + '/' + encodeAttachmentId(filename) + '?rev=' + doc._rev;
                  return ajaxPromise(opts, {
                    method: 'GET',
                    url: genDBUrl(host, path),
                    binary: true
                  }).then(function(blob) {
                    if (opts.binary) {
                      return blob;
                    }
                    return new PouchPromise$1(function(resolve) {
                      blobToBase64(blob, resolve);
                    });
                  }).then(function(data) {
                    delete att.stub;
                    delete att.length;
                    att.data = data;
                  });
                }
                var promiseFactories = filenames.map(function(filename) {
                  return function() {
                    return fetch(filename);
                  };
                });
                return pool(promiseFactories, 5);
              }
              function fetchAllAttachments(docOrDocs) {
                if (Array.isArray(docOrDocs)) {
                  return PouchPromise$1.all(docOrDocs.map(function(doc) {
                    if (doc.ok) {
                      return fetchAttachments(doc.ok);
                    }
                  }));
                }
                return fetchAttachments(docOrDocs);
              }
              ajaxPromise(opts, options).then(function(res) {
                return PouchPromise$1.resolve().then(function() {
                  if (opts.attachments) {
                    return fetchAllAttachments(res);
                  }
                }).then(function() {
                  callback(null, res);
                });
              })["catch"](function(e) {
                e.docId = id;
                callback(e);
              });
            });
            api.remove = adapterFun$$1('remove', function(docOrId, optsOrRev, opts, callback) {
              var doc;
              if (typeof optsOrRev === 'string') {
                doc = {
                  _id: docOrId,
                  _rev: optsOrRev
                };
                if (typeof opts === 'function') {
                  callback = opts;
                  opts = {};
                }
              } else {
                doc = docOrId;
                if (typeof optsOrRev === 'function') {
                  callback = optsOrRev;
                  opts = {};
                } else {
                  callback = opts;
                  opts = optsOrRev;
                }
              }
              var rev$$1 = (doc._rev || opts.rev);
              ajax$$1(opts, {
                method: 'DELETE',
                url: genDBUrl(host, encodeDocId(doc._id)) + '?rev=' + rev$$1
              }, callback);
            });
            function encodeAttachmentId(attachmentId) {
              return attachmentId.split("/").map(encodeURIComponent).join("/");
            }
            api.getAttachment = adapterFun$$1('getAttachment', function(docId, attachmentId, opts, callback) {
              if (typeof opts === 'function') {
                callback = opts;
                opts = {};
              }
              var params = opts.rev ? ('?rev=' + opts.rev) : '';
              var url = genDBUrl(host, encodeDocId(docId)) + '/' + encodeAttachmentId(attachmentId) + params;
              ajax$$1(opts, {
                method: 'GET',
                url: url,
                binary: true
              }, callback);
            });
            api.removeAttachment = adapterFun$$1('removeAttachment', function(docId, attachmentId, rev$$1, callback) {
              var url = genDBUrl(host, encodeDocId(docId) + '/' + encodeAttachmentId(attachmentId)) + '?rev=' + rev$$1;
              ajax$$1({}, {
                method: 'DELETE',
                url: url
              }, callback);
            });
            api.putAttachment = adapterFun$$1('putAttachment', function(docId, attachmentId, rev$$1, blob, type, callback) {
              if (typeof type === 'function') {
                callback = type;
                type = blob;
                blob = rev$$1;
                rev$$1 = null;
              }
              var id = encodeDocId(docId) + '/' + encodeAttachmentId(attachmentId);
              var url = genDBUrl(host, id);
              if (rev$$1) {
                url += '?rev=' + rev$$1;
              }
              if (typeof blob === 'string') {
                var binary;
                try {
                  binary = thisAtob(blob);
                } catch (err) {
                  return callback(createError(BAD_ARG, 'Attachment is not a valid base64 string'));
                }
                blob = binary ? binStringToBluffer(binary, type) : '';
              }
              var opts = {
                headers: {'Content-Type': type},
                method: 'PUT',
                url: url,
                processData: false,
                body: blob,
                timeout: ajaxOpts.timeout || 60000
              };
              ajax$$1({}, opts, callback);
            });
            api._bulkDocs = function(req, opts, callback) {
              req.new_edits = opts.new_edits;
              setup().then(function() {
                return PouchPromise$1.all(req.docs.map(preprocessAttachments$2));
              }).then(function() {
                ajax$$1(opts, {
                  method: 'POST',
                  url: genDBUrl(host, '_bulk_docs'),
                  timeout: opts.timeout,
                  body: req
                }, function(err, results) {
                  if (err) {
                    return callback(err);
                  }
                  results.forEach(function(result) {
                    result.ok = true;
                  });
                  callback(null, results);
                });
              })["catch"](callback);
            };
            api._put = function(doc, opts, callback) {
              setup().then(function() {
                return preprocessAttachments$2(doc);
              }).then(function() {
                ajax$$1(opts, {
                  method: 'PUT',
                  url: genDBUrl(host, encodeDocId(doc._id)),
                  body: doc
                }, function(err, result) {
                  if (err) {
                    err.docId = doc && doc._id;
                    return callback(err);
                  }
                  callback(null, result);
                });
              })["catch"](callback);
            };
            api.allDocs = adapterFun$$1('allDocs', function(opts, callback) {
              if (typeof opts === 'function') {
                callback = opts;
                opts = {};
              }
              opts = clone(opts);
              var params = {};
              var body;
              var method = 'GET';
              if (opts.conflicts) {
                params.conflicts = true;
              }
              if (opts.descending) {
                params.descending = true;
              }
              if (opts.include_docs) {
                params.include_docs = true;
              }
              if (opts.attachments) {
                params.attachments = true;
              }
              if (opts.key) {
                params.key = JSON.stringify(opts.key);
              }
              if (opts.start_key) {
                opts.startkey = opts.start_key;
              }
              if (opts.startkey) {
                params.startkey = JSON.stringify(opts.startkey);
              }
              if (opts.end_key) {
                opts.endkey = opts.end_key;
              }
              if (opts.endkey) {
                params.endkey = JSON.stringify(opts.endkey);
              }
              if (typeof opts.inclusive_end !== 'undefined') {
                params.inclusive_end = !!opts.inclusive_end;
              }
              if (typeof opts.limit !== 'undefined') {
                params.limit = opts.limit;
              }
              if (typeof opts.skip !== 'undefined') {
                params.skip = opts.skip;
              }
              var paramStr = paramsToStr(params);
              if (typeof opts.keys !== 'undefined') {
                method = 'POST';
                body = {keys: opts.keys};
              }
              ajaxPromise(opts, {
                method: method,
                url: genDBUrl(host, '_all_docs' + paramStr),
                body: body
              }).then(function(res) {
                if (opts.include_docs && opts.attachments && opts.binary) {
                  res.rows.forEach(readAttachmentsAsBlobOrBuffer);
                }
                callback(null, res);
              })["catch"](callback);
            });
            api._changes = function(opts) {
              var batchSize = 'batch_size' in opts ? opts.batch_size : CHANGES_BATCH_SIZE;
              opts = clone(opts);
              if (opts.continuous && !('heartbeat' in opts)) {
                opts.heartbeat = DEFAULT_HEARTBEAT;
              }
              var requestTimeout = ('timeout' in opts) ? opts.timeout : ('timeout' in ajaxOpts) ? ajaxOpts.timeout : 30 * 1000;
              if ('timeout' in opts && opts.timeout && (requestTimeout - opts.timeout) < CHANGES_TIMEOUT_BUFFER) {
                requestTimeout = opts.timeout + CHANGES_TIMEOUT_BUFFER;
              }
              if ('heartbeat' in opts && opts.heartbeat && (requestTimeout - opts.heartbeat) < CHANGES_TIMEOUT_BUFFER) {
                requestTimeout = opts.heartbeat + CHANGES_TIMEOUT_BUFFER;
              }
              var params = {};
              if ('timeout' in opts && opts.timeout) {
                params.timeout = opts.timeout;
              }
              var limit = (typeof opts.limit !== 'undefined') ? opts.limit : false;
              var returnDocs;
              if ('return_docs' in opts) {
                returnDocs = opts.return_docs;
              } else if ('returnDocs' in opts) {
                returnDocs = opts.returnDocs;
              } else {
                returnDocs = true;
              }
              var leftToFetch = limit;
              if (opts.style) {
                params.style = opts.style;
              }
              if (opts.include_docs || opts.filter && typeof opts.filter === 'function') {
                params.include_docs = true;
              }
              if (opts.attachments) {
                params.attachments = true;
              }
              if (opts.continuous) {
                params.feed = 'longpoll';
              }
              if (opts.conflicts) {
                params.conflicts = true;
              }
              if (opts.descending) {
                params.descending = true;
              }
              if ('heartbeat' in opts) {
                if (opts.heartbeat) {
                  params.heartbeat = opts.heartbeat;
                }
              }
              if (opts.filter && typeof opts.filter === 'string') {
                params.filter = opts.filter;
              }
              if (opts.view && typeof opts.view === 'string') {
                params.filter = '_view';
                params.view = opts.view;
              }
              if (opts.query_params && typeof opts.query_params === 'object') {
                for (var param_name in opts.query_params) {
                  if (opts.query_params.hasOwnProperty(param_name)) {
                    params[param_name] = opts.query_params[param_name];
                  }
                }
              }
              var method = 'GET';
              var body;
              if (opts.doc_ids) {
                params.filter = '_doc_ids';
                method = 'POST';
                body = {doc_ids: opts.doc_ids};
              } else if (opts.selector) {
                params.filter = '_selector';
                method = 'POST';
                body = {selector: opts.selector};
              }
              var xhr;
              var lastFetchedSeq;
              var fetch = function(since, callback) {
                if (opts.aborted) {
                  return;
                }
                params.since = since;
                if (typeof params.since === "object") {
                  params.since = JSON.stringify(params.since);
                }
                if (opts.descending) {
                  if (limit) {
                    params.limit = leftToFetch;
                  }
                } else {
                  params.limit = (!limit || leftToFetch > batchSize) ? batchSize : leftToFetch;
                }
                var xhrOpts = {
                  method: method,
                  url: genDBUrl(host, '_changes' + paramsToStr(params)),
                  timeout: requestTimeout,
                  body: body
                };
                lastFetchedSeq = since;
                if (opts.aborted) {
                  return;
                }
                setup().then(function() {
                  xhr = ajax$$1(opts, xhrOpts, callback);
                })["catch"](callback);
              };
              var results = {results: []};
              var fetched = function(err, res) {
                if (opts.aborted) {
                  return;
                }
                var raw_results_length = 0;
                if (res && res.results) {
                  raw_results_length = res.results.length;
                  results.last_seq = res.last_seq;
                  var req = {};
                  req.query = opts.query_params;
                  res.results = res.results.filter(function(c) {
                    leftToFetch--;
                    var ret = filterChange(opts)(c);
                    if (ret) {
                      if (opts.include_docs && opts.attachments && opts.binary) {
                        readAttachmentsAsBlobOrBuffer(c);
                      }
                      if (returnDocs) {
                        results.results.push(c);
                      }
                      opts.onChange(c);
                    }
                    return ret;
                  });
                } else if (err) {
                  opts.aborted = true;
                  opts.complete(err);
                  return;
                }
                if (res && res.last_seq) {
                  lastFetchedSeq = res.last_seq;
                }
                var finished = (limit && leftToFetch <= 0) || (res && raw_results_length < batchSize) || (opts.descending);
                if ((opts.continuous && !(limit && leftToFetch <= 0)) || !finished) {
                  nextTick(function() {
                    fetch(lastFetchedSeq, fetched);
                  });
                } else {
                  opts.complete(null, results);
                }
              };
              fetch(opts.since || 0, fetched);
              return {cancel: function() {
                  opts.aborted = true;
                  if (xhr) {
                    xhr.abort();
                  }
                }};
            };
            api.revsDiff = adapterFun$$1('revsDiff', function(req, opts, callback) {
              if (typeof opts === 'function') {
                callback = opts;
                opts = {};
              }
              ajax$$1(opts, {
                method: 'POST',
                url: genDBUrl(host, '_revs_diff'),
                body: req
              }, callback);
            });
            api._close = function(callback) {
              callback();
            };
            api._destroy = function(options, callback) {
              ajax$$1(options, {
                url: genDBUrl(host, ''),
                method: 'DELETE'
              }, function(err, resp) {
                if (err && err.status && err.status !== 404) {
                  return callback(err);
                }
                callback(null, resp);
              });
            };
          }
          HttpPouch.valid = function() {
            return true;
          };
          var HttpPouch$1 = function(PouchDB) {
            PouchDB.adapter('http', HttpPouch, false);
            PouchDB.adapter('https', HttpPouch, false);
          };
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
          function promisedCallback(promise, callback) {
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
          function callbackify(fun) {
            return getArguments(function(args) {
              var cb = args.pop();
              var promise = fun.apply(this, args);
              if (typeof cb === 'function') {
                promisedCallback(promise, cb);
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
          function uniq(arr) {
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
          function createBuiltInError(name) {
            var message = 'builtin ' + name + ' function requires map values to be numbers' + ' or number arrays';
            return new BuiltInError(message);
          }
          function sum(values) {
            var result = 0;
            for (var i = 0,
                len = values.length; i < len; i++) {
              var num = values[i];
              if (typeof num !== 'number') {
                if (Array.isArray(num)) {
                  result = typeof result === 'number' ? [result] : result;
                  for (var j = 0,
                      jLen = num.length; j < jLen; j++) {
                    var jNum = num[j];
                    if (typeof jNum !== 'number') {
                      throw createBuiltInError('_sum');
                    } else if (typeof result[j] === 'undefined') {
                      result.push(jNum);
                    } else {
                      result[j] += jNum;
                    }
                  }
                } else {
                  throw createBuiltInError('_sum');
                }
              } else if (typeof result === 'number') {
                result += num;
              } else {
                result[0] += num;
              }
            }
            return result;
          }
          var log = guardedConsole.bind(null, 'log');
          var isArray = Array.isArray;
          var toJSON = JSON.parse;
          function evalFunctionWithEval(func, emit) {
            return scopeEval("return (" + func.replace(/;\s*$/, "") + ");", {
              emit: emit,
              sum: sum,
              log: log,
              isArray: isArray,
              toJSON: toJSON
            });
          }
          function TaskQueue$2() {
            this.promise = new PouchPromise$1(function(fulfill) {
              fulfill();
            });
          }
          TaskQueue$2.prototype.add = function(promiseFactory) {
            this.promise = this.promise["catch"](function() {}).then(function() {
              return promiseFactory();
            });
            return this.promise;
          };
          TaskQueue$2.prototype.finish = function() {
            return this.promise;
          };
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
          var persistentQueues = {};
          var tempViewQueue = new TaskQueue$2();
          var CHANGES_BATCH_SIZE$1 = 50;
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
          function createAbstractMapReduce(localDocName, mapper, reducer, ddocValidator) {
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
                metaDoc.keys = uniq(newKeys.concat(metaDoc.keys));
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
                queue = persistentQueues[viewName] = new TaskQueue$2();
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
              var queue = new TaskQueue$2();
              function processNextBatch() {
                return view.sourceDB.changes({
                  conflicts: true,
                  include_docs: true,
                  style: 'all_docs',
                  since: currentSeq,
                  limit: CHANGES_BATCH_SIZE$1
                }).then(processBatch);
              }
              function processBatch(response) {
                var results = response.results;
                if (!results.length) {
                  return;
                }
                var docIdsToChangesAndEmits = createDocIdsToChangesAndEmits(results);
                queue.add(processChange(docIdsToChangesAndEmits, currentSeq));
                if (results.length < CHANGES_BATCH_SIZE$1) {
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
                  var docIds = uniq(rows.map(rowToDocId));
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
              promisedCallback(promise, callback);
              return promise;
            }
            var abstractViewCleanup = callbackify(function() {
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
          var builtInReduce = {
            _sum: function(keys, values) {
              return sum(values);
            },
            _count: function(keys, values) {
              return values.length;
            },
            _stats: function(keys, values) {
              function sumsqr(values) {
                var _sumsqr = 0;
                for (var i = 0,
                    len = values.length; i < len; i++) {
                  var num = values[i];
                  _sumsqr += (num * num);
                }
                return _sumsqr;
              }
              return {
                sum: sum(values),
                min: Math.min.apply(null, values),
                max: Math.max.apply(null, values),
                count: values.length,
                sumsqr: sumsqr(values)
              };
            }
          };
          function getBuiltIn(reduceFunString) {
            if (/^_sum/.test(reduceFunString)) {
              return builtInReduce._sum;
            } else if (/^_count/.test(reduceFunString)) {
              return builtInReduce._count;
            } else if (/^_stats/.test(reduceFunString)) {
              return builtInReduce._stats;
            } else if (/^_/.test(reduceFunString)) {
              throw new Error(reduceFunString + ' is not a supported reduce function.');
            }
          }
          function mapper(mapFun, emit) {
            if (typeof mapFun === "function" && mapFun.length === 2) {
              var origMap = mapFun;
              return function(doc) {
                return origMap(doc, emit);
              };
            } else {
              return evalFunctionWithEval(mapFun.toString(), emit);
            }
          }
          function reducer(reduceFun) {
            var reduceFunString = reduceFun.toString();
            var builtIn = getBuiltIn(reduceFunString);
            if (builtIn) {
              return builtIn;
            } else {
              return evalFunctionWithEval(reduceFunString);
            }
          }
          function ddocValidator(ddoc, viewName) {
            var fun = ddoc.views && ddoc.views[viewName];
            if (typeof fun.map !== 'string') {
              throw new NotFoundError('ddoc ' + ddoc._id + ' has no string view named ' + viewName + ', instead found object of type: ' + typeof fun.map);
            }
          }
          var localDocName = 'mrviews';
          var abstract = createAbstractMapReduce(localDocName, mapper, reducer, ddocValidator);
          function query(fun, opts, callback) {
            return abstract.query.call(this, fun, opts, callback);
          }
          function viewCleanup(callback) {
            return abstract.viewCleanup.call(this, callback);
          }
          var mapreduce = {
            query: query,
            viewCleanup: viewCleanup
          };
          function isGenOne$1(rev$$1) {
            return /^1-/.test(rev$$1);
          }
          function fileHasChanged(localDoc, remoteDoc, filename) {
            return !localDoc._attachments || !localDoc._attachments[filename] || localDoc._attachments[filename].digest !== remoteDoc._attachments[filename].digest;
          }
          function getDocAttachments(db, doc) {
            var filenames = Object.keys(doc._attachments);
            return PouchPromise$1.all(filenames.map(function(filename) {
              return db.getAttachment(doc._id, filename, {rev: doc._rev});
            }));
          }
          function getDocAttachmentsFromTargetOrSource(target, src, doc) {
            var doCheckForLocalAttachments = isRemote(src) && !isRemote(target);
            var filenames = Object.keys(doc._attachments);
            if (!doCheckForLocalAttachments) {
              return getDocAttachments(src, doc);
            }
            return target.get(doc._id).then(function(localDoc) {
              return PouchPromise$1.all(filenames.map(function(filename) {
                if (fileHasChanged(localDoc, doc, filename)) {
                  return src.getAttachment(doc._id, filename);
                }
                return target.getAttachment(localDoc._id, filename);
              }));
            })["catch"](function(error) {
              if (error.status !== 404) {
                throw error;
              }
              return getDocAttachments(src, doc);
            });
          }
          function createBulkGetOpts(diffs) {
            var requests = [];
            Object.keys(diffs).forEach(function(id) {
              var missingRevs = diffs[id].missing;
              missingRevs.forEach(function(missingRev) {
                requests.push({
                  id: id,
                  rev: missingRev
                });
              });
            });
            return {
              docs: requests,
              revs: true,
              latest: true
            };
          }
          function getDocs(src, target, diffs, state) {
            diffs = clone(diffs);
            var resultDocs = [],
                ok = true;
            function getAllDocs() {
              var bulkGetOpts = createBulkGetOpts(diffs);
              if (!bulkGetOpts.docs.length) {
                return;
              }
              return src.bulkGet(bulkGetOpts).then(function(bulkGetResponse) {
                if (state.cancelled) {
                  throw new Error('cancelled');
                }
                return PouchPromise$1.all(bulkGetResponse.results.map(function(bulkGetInfo) {
                  return PouchPromise$1.all(bulkGetInfo.docs.map(function(doc) {
                    var remoteDoc = doc.ok;
                    if (doc.error) {
                      ok = false;
                    }
                    if (!remoteDoc || !remoteDoc._attachments) {
                      return remoteDoc;
                    }
                    return getDocAttachmentsFromTargetOrSource(target, src, remoteDoc).then(function(attachments) {
                      var filenames = Object.keys(remoteDoc._attachments);
                      attachments.forEach(function(attachment, i) {
                        var att = remoteDoc._attachments[filenames[i]];
                        delete att.stub;
                        delete att.length;
                        att.data = attachment;
                      });
                      return remoteDoc;
                    });
                  }));
                })).then(function(results) {
                  resultDocs = resultDocs.concat(flatten(results).filter(Boolean));
                });
              });
            }
            function hasAttachments(doc) {
              return doc._attachments && Object.keys(doc._attachments).length > 0;
            }
            function hasConflicts(doc) {
              return doc._conflicts && doc._conflicts.length > 0;
            }
            function fetchRevisionOneDocs(ids) {
              return src.allDocs({
                keys: ids,
                include_docs: true,
                conflicts: true
              }).then(function(res) {
                if (state.cancelled) {
                  throw new Error('cancelled');
                }
                res.rows.forEach(function(row) {
                  if (row.deleted || !row.doc || !isGenOne$1(row.value.rev) || hasAttachments(row.doc) || hasConflicts(row.doc)) {
                    return;
                  }
                  if (row.doc._conflicts) {
                    delete row.doc._conflicts;
                  }
                  resultDocs.push(row.doc);
                  delete diffs[row.id];
                });
              });
            }
            function getRevisionOneDocs() {
              var ids = Object.keys(diffs).filter(function(id) {
                var missing = diffs[id].missing;
                return missing.length === 1 && isGenOne$1(missing[0]);
              });
              if (ids.length > 0) {
                return fetchRevisionOneDocs(ids);
              }
            }
            function returnResult() {
              return {
                ok: ok,
                docs: resultDocs
              };
            }
            return PouchPromise$1.resolve().then(getRevisionOneDocs).then(getAllDocs).then(returnResult);
          }
          var CHECKPOINT_VERSION = 1;
          var REPLICATOR = "pouchdb";
          var CHECKPOINT_HISTORY_SIZE = 5;
          var LOWEST_SEQ = 0;
          function updateCheckpoint(db, id, checkpoint, session, returnValue) {
            return db.get(id)["catch"](function(err) {
              if (err.status === 404) {
                if (db.adapter === 'http' || db.adapter === 'https') {
                  explainError(404, 'PouchDB is just checking if a remote checkpoint exists.');
                }
                return {
                  session_id: session,
                  _id: id,
                  history: [],
                  replicator: REPLICATOR,
                  version: CHECKPOINT_VERSION
                };
              }
              throw err;
            }).then(function(doc) {
              if (returnValue.cancelled) {
                return;
              }
              if (doc.last_seq === checkpoint) {
                return;
              }
              doc.history = (doc.history || []).filter(function(item) {
                return item.session_id !== session;
              });
              doc.history.unshift({
                last_seq: checkpoint,
                session_id: session
              });
              doc.history = doc.history.slice(0, CHECKPOINT_HISTORY_SIZE);
              doc.version = CHECKPOINT_VERSION;
              doc.replicator = REPLICATOR;
              doc.session_id = session;
              doc.last_seq = checkpoint;
              return db.put(doc)["catch"](function(err) {
                if (err.status === 409) {
                  return updateCheckpoint(db, id, checkpoint, session, returnValue);
                }
                throw err;
              });
            });
          }
          function Checkpointer(src, target, id, returnValue, opts) {
            this.src = src;
            this.target = target;
            this.id = id;
            this.returnValue = returnValue;
            this.opts = opts;
          }
          Checkpointer.prototype.writeCheckpoint = function(checkpoint, session) {
            var self = this;
            return this.updateTarget(checkpoint, session).then(function() {
              return self.updateSource(checkpoint, session);
            });
          };
          Checkpointer.prototype.updateTarget = function(checkpoint, session) {
            if (this.opts.writeTargetCheckpoint) {
              return updateCheckpoint(this.target, this.id, checkpoint, session, this.returnValue);
            } else {
              return PouchPromise$1.resolve(true);
            }
          };
          Checkpointer.prototype.updateSource = function(checkpoint, session) {
            if (this.opts.writeSourceCheckpoint) {
              var self = this;
              if (this.readOnlySource) {
                return PouchPromise$1.resolve(true);
              }
              return updateCheckpoint(this.src, this.id, checkpoint, session, this.returnValue)["catch"](function(err) {
                if (isForbiddenError(err)) {
                  self.readOnlySource = true;
                  return true;
                }
                throw err;
              });
            } else {
              return PouchPromise$1.resolve(true);
            }
          };
          var comparisons = {
            "undefined": function(targetDoc, sourceDoc) {
              if (collate(targetDoc.last_seq, sourceDoc.last_seq) === 0) {
                return sourceDoc.last_seq;
              }
              return 0;
            },
            "1": function(targetDoc, sourceDoc) {
              return compareReplicationLogs(sourceDoc, targetDoc).last_seq;
            }
          };
          Checkpointer.prototype.getCheckpoint = function() {
            var self = this;
            return self.target.get(self.id).then(function(targetDoc) {
              if (self.readOnlySource) {
                return PouchPromise$1.resolve(targetDoc.last_seq);
              }
              return self.src.get(self.id).then(function(sourceDoc) {
                if (targetDoc.version !== sourceDoc.version) {
                  return LOWEST_SEQ;
                }
                var version;
                if (targetDoc.version) {
                  version = targetDoc.version.toString();
                } else {
                  version = "undefined";
                }
                if (version in comparisons) {
                  return comparisons[version](targetDoc, sourceDoc);
                }
                return LOWEST_SEQ;
              }, function(err) {
                if (err.status === 404 && targetDoc.last_seq) {
                  return self.src.put({
                    _id: self.id,
                    last_seq: LOWEST_SEQ
                  }).then(function() {
                    return LOWEST_SEQ;
                  }, function(err) {
                    if (isForbiddenError(err)) {
                      self.readOnlySource = true;
                      return targetDoc.last_seq;
                    }
                    return LOWEST_SEQ;
                  });
                }
                throw err;
              });
            })["catch"](function(err) {
              if (err.status !== 404) {
                throw err;
              }
              return LOWEST_SEQ;
            });
          };
          function compareReplicationLogs(srcDoc, tgtDoc) {
            if (srcDoc.session_id === tgtDoc.session_id) {
              return {
                last_seq: srcDoc.last_seq,
                history: srcDoc.history
              };
            }
            return compareReplicationHistory(srcDoc.history, tgtDoc.history);
          }
          function compareReplicationHistory(sourceHistory, targetHistory) {
            var S = sourceHistory[0];
            var sourceRest = sourceHistory.slice(1);
            var T = targetHistory[0];
            var targetRest = targetHistory.slice(1);
            if (!S || targetHistory.length === 0) {
              return {
                last_seq: LOWEST_SEQ,
                history: []
              };
            }
            var sourceId = S.session_id;
            if (hasSessionId(sourceId, targetHistory)) {
              return {
                last_seq: S.last_seq,
                history: sourceHistory
              };
            }
            var targetId = T.session_id;
            if (hasSessionId(targetId, sourceRest)) {
              return {
                last_seq: T.last_seq,
                history: targetRest
              };
            }
            return compareReplicationHistory(sourceRest, targetRest);
          }
          function hasSessionId(sessionId, history) {
            var props = history[0];
            var rest = history.slice(1);
            if (!sessionId || history.length === 0) {
              return false;
            }
            if (sessionId === props.session_id) {
              return true;
            }
            return hasSessionId(sessionId, rest);
          }
          function isForbiddenError(err) {
            return typeof err.status === 'number' && Math.floor(err.status / 100) === 4;
          }
          var STARTING_BACK_OFF = 0;
          function backOff(opts, returnValue, error, callback) {
            if (opts.retry === false) {
              returnValue.emit('error', error);
              returnValue.removeAllListeners();
              return;
            }
            if (typeof opts.back_off_function !== 'function') {
              opts.back_off_function = defaultBackOff;
            }
            returnValue.emit('requestError', error);
            if (returnValue.state === 'active' || returnValue.state === 'pending') {
              returnValue.emit('paused', error);
              returnValue.state = 'stopped';
              var backOffSet = function backoffTimeSet() {
                opts.current_back_off = STARTING_BACK_OFF;
              };
              var removeBackOffSetter = function removeBackOffTimeSet() {
                returnValue.removeListener('active', backOffSet);
              };
              returnValue.once('paused', removeBackOffSetter);
              returnValue.once('active', backOffSet);
            }
            opts.current_back_off = opts.current_back_off || STARTING_BACK_OFF;
            opts.current_back_off = opts.back_off_function(opts.current_back_off);
            setTimeout(callback, opts.current_back_off);
          }
          function sortObjectPropertiesByKey(queryParams) {
            return Object.keys(queryParams).sort(collate).reduce(function(result, key) {
              result[key] = queryParams[key];
              return result;
            }, {});
          }
          function generateReplicationId(src, target, opts) {
            var docIds = opts.doc_ids ? opts.doc_ids.sort(collate) : '';
            var filterFun = opts.filter ? opts.filter.toString() : '';
            var queryParams = '';
            var filterViewName = '';
            var selector = '';
            if (opts.selector) {
              selector = JSON.stringify(opts.selector);
            }
            if (opts.filter && opts.query_params) {
              queryParams = JSON.stringify(sortObjectPropertiesByKey(opts.query_params));
            }
            if (opts.filter && opts.filter === '_view') {
              filterViewName = opts.view.toString();
            }
            return PouchPromise$1.all([src.id(), target.id()]).then(function(res) {
              var queryData = res[0] + res[1] + filterFun + filterViewName + queryParams + docIds + selector;
              return new PouchPromise$1(function(resolve) {
                binaryMd5(queryData, resolve);
              });
            }).then(function(md5sum) {
              md5sum = md5sum.replace(/\//g, '.').replace(/\+/g, '_');
              return '_local/' + md5sum;
            });
          }
          function replicate(src, target, opts, returnValue, result) {
            var batches = [];
            var currentBatch;
            var pendingBatch = {
              seq: 0,
              changes: [],
              docs: []
            };
            var writingCheckpoint = false;
            var changesCompleted = false;
            var replicationCompleted = false;
            var last_seq = 0;
            var continuous = opts.continuous || opts.live || false;
            var batch_size = opts.batch_size || 100;
            var batches_limit = opts.batches_limit || 10;
            var changesPending = false;
            var doc_ids = opts.doc_ids;
            var selector = opts.selector;
            var repId;
            var checkpointer;
            var changedDocs = [];
            var session = uuid();
            result = result || {
              ok: true,
              start_time: new Date(),
              docs_read: 0,
              docs_written: 0,
              doc_write_failures: 0,
              errors: []
            };
            var changesOpts = {};
            returnValue.ready(src, target);
            function initCheckpointer() {
              if (checkpointer) {
                return PouchPromise$1.resolve();
              }
              return generateReplicationId(src, target, opts).then(function(res) {
                repId = res;
                var checkpointOpts = {};
                if (opts.checkpoint === false) {
                  checkpointOpts = {
                    writeSourceCheckpoint: false,
                    writeTargetCheckpoint: false
                  };
                } else if (opts.checkpoint === 'source') {
                  checkpointOpts = {
                    writeSourceCheckpoint: true,
                    writeTargetCheckpoint: false
                  };
                } else if (opts.checkpoint === 'target') {
                  checkpointOpts = {
                    writeSourceCheckpoint: false,
                    writeTargetCheckpoint: true
                  };
                } else {
                  checkpointOpts = {
                    writeSourceCheckpoint: true,
                    writeTargetCheckpoint: true
                  };
                }
                checkpointer = new Checkpointer(src, target, repId, returnValue, checkpointOpts);
              });
            }
            function writeDocs() {
              changedDocs = [];
              if (currentBatch.docs.length === 0) {
                return;
              }
              var docs = currentBatch.docs;
              var bulkOpts = {timeout: opts.timeout};
              return target.bulkDocs({
                docs: docs,
                new_edits: false
              }, bulkOpts).then(function(res) {
                if (returnValue.cancelled) {
                  completeReplication();
                  throw new Error('cancelled');
                }
                var errorsById = Object.create(null);
                res.forEach(function(res) {
                  if (res.error) {
                    errorsById[res.id] = res;
                  }
                });
                var errorsNo = Object.keys(errorsById).length;
                result.doc_write_failures += errorsNo;
                result.docs_written += docs.length - errorsNo;
                docs.forEach(function(doc) {
                  var error = errorsById[doc._id];
                  if (error) {
                    result.errors.push(error);
                    if (error.name === 'unauthorized' || error.name === 'forbidden') {
                      returnValue.emit('denied', clone(error));
                    } else {
                      throw error;
                    }
                  } else {
                    changedDocs.push(doc);
                  }
                });
              }, function(err) {
                result.doc_write_failures += docs.length;
                throw err;
              });
            }
            function finishBatch() {
              if (currentBatch.error) {
                throw new Error('There was a problem getting docs.');
              }
              result.last_seq = last_seq = currentBatch.seq;
              var outResult = clone(result);
              if (changedDocs.length) {
                outResult.docs = changedDocs;
                returnValue.emit('change', outResult);
              }
              writingCheckpoint = true;
              return checkpointer.writeCheckpoint(currentBatch.seq, session).then(function() {
                writingCheckpoint = false;
                if (returnValue.cancelled) {
                  completeReplication();
                  throw new Error('cancelled');
                }
                currentBatch = undefined;
                getChanges();
              })["catch"](function(err) {
                onCheckpointError(err);
                throw err;
              });
            }
            function getDiffs() {
              var diff = {};
              currentBatch.changes.forEach(function(change) {
                if (change.id === "_user/") {
                  return;
                }
                diff[change.id] = change.changes.map(function(x) {
                  return x.rev;
                });
              });
              return target.revsDiff(diff).then(function(diffs) {
                if (returnValue.cancelled) {
                  completeReplication();
                  throw new Error('cancelled');
                }
                currentBatch.diffs = diffs;
              });
            }
            function getBatchDocs() {
              return getDocs(src, target, currentBatch.diffs, returnValue).then(function(got) {
                currentBatch.error = !got.ok;
                got.docs.forEach(function(doc) {
                  delete currentBatch.diffs[doc._id];
                  result.docs_read++;
                  currentBatch.docs.push(doc);
                });
              });
            }
            function startNextBatch() {
              if (returnValue.cancelled || currentBatch) {
                return;
              }
              if (batches.length === 0) {
                processPendingBatch(true);
                return;
              }
              currentBatch = batches.shift();
              getDiffs().then(getBatchDocs).then(writeDocs).then(finishBatch).then(startNextBatch)["catch"](function(err) {
                abortReplication('batch processing terminated with error', err);
              });
            }
            function processPendingBatch(immediate) {
              if (pendingBatch.changes.length === 0) {
                if (batches.length === 0 && !currentBatch) {
                  if ((continuous && changesOpts.live) || changesCompleted) {
                    returnValue.state = 'pending';
                    returnValue.emit('paused');
                  }
                  if (changesCompleted) {
                    completeReplication();
                  }
                }
                return;
              }
              if (immediate || changesCompleted || pendingBatch.changes.length >= batch_size) {
                batches.push(pendingBatch);
                pendingBatch = {
                  seq: 0,
                  changes: [],
                  docs: []
                };
                if (returnValue.state === 'pending' || returnValue.state === 'stopped') {
                  returnValue.state = 'active';
                  returnValue.emit('active');
                }
                startNextBatch();
              }
            }
            function abortReplication(reason, err) {
              if (replicationCompleted) {
                return;
              }
              if (!err.message) {
                err.message = reason;
              }
              result.ok = false;
              result.status = 'aborting';
              batches = [];
              pendingBatch = {
                seq: 0,
                changes: [],
                docs: []
              };
              completeReplication(err);
            }
            function completeReplication(fatalError) {
              if (replicationCompleted) {
                return;
              }
              if (returnValue.cancelled) {
                result.status = 'cancelled';
                if (writingCheckpoint) {
                  return;
                }
              }
              result.status = result.status || 'complete';
              result.end_time = new Date();
              result.last_seq = last_seq;
              replicationCompleted = true;
              if (fatalError) {
                fatalError = createError(fatalError);
                fatalError.result = result;
                if (fatalError.name === 'unauthorized' || fatalError.name === 'forbidden') {
                  returnValue.emit('error', fatalError);
                  returnValue.removeAllListeners();
                } else {
                  backOff(opts, returnValue, fatalError, function() {
                    replicate(src, target, opts, returnValue);
                  });
                }
              } else {
                returnValue.emit('complete', result);
                returnValue.removeAllListeners();
              }
            }
            function onChange(change) {
              if (returnValue.cancelled) {
                return completeReplication();
              }
              var filter = filterChange(opts)(change);
              if (!filter) {
                return;
              }
              pendingBatch.seq = change.seq;
              pendingBatch.changes.push(change);
              processPendingBatch(batches.length === 0 && changesOpts.live);
            }
            function onChangesComplete(changes) {
              changesPending = false;
              if (returnValue.cancelled) {
                return completeReplication();
              }
              if (changes.results.length > 0) {
                changesOpts.since = changes.last_seq;
                getChanges();
                processPendingBatch(true);
              } else {
                var complete = function() {
                  if (continuous) {
                    changesOpts.live = true;
                    getChanges();
                  } else {
                    changesCompleted = true;
                  }
                  processPendingBatch(true);
                };
                if (!currentBatch && changes.results.length === 0) {
                  writingCheckpoint = true;
                  checkpointer.writeCheckpoint(changes.last_seq, session).then(function() {
                    writingCheckpoint = false;
                    result.last_seq = last_seq = changes.last_seq;
                    complete();
                  })["catch"](onCheckpointError);
                } else {
                  complete();
                }
              }
            }
            function onChangesError(err) {
              changesPending = false;
              if (returnValue.cancelled) {
                return completeReplication();
              }
              abortReplication('changes rejected', err);
            }
            function getChanges() {
              if (!(!changesPending && !changesCompleted && batches.length < batches_limit)) {
                return;
              }
              changesPending = true;
              function abortChanges() {
                changes.cancel();
              }
              function removeListener() {
                returnValue.removeListener('cancel', abortChanges);
              }
              if (returnValue._changes) {
                returnValue.removeListener('cancel', returnValue._abortChanges);
                returnValue._changes.cancel();
              }
              returnValue.once('cancel', abortChanges);
              var changes = src.changes(changesOpts).on('change', onChange);
              changes.then(removeListener, removeListener);
              changes.then(onChangesComplete)["catch"](onChangesError);
              if (opts.retry) {
                returnValue._changes = changes;
                returnValue._abortChanges = abortChanges;
              }
            }
            function startChanges() {
              initCheckpointer().then(function() {
                if (returnValue.cancelled) {
                  completeReplication();
                  return;
                }
                return checkpointer.getCheckpoint().then(function(checkpoint) {
                  last_seq = checkpoint;
                  changesOpts = {
                    since: last_seq,
                    limit: batch_size,
                    batch_size: batch_size,
                    style: 'all_docs',
                    doc_ids: doc_ids,
                    selector: selector,
                    return_docs: true
                  };
                  if (opts.filter) {
                    if (typeof opts.filter !== 'string') {
                      changesOpts.include_docs = true;
                    } else {
                      changesOpts.filter = opts.filter;
                    }
                  }
                  if ('heartbeat' in opts) {
                    changesOpts.heartbeat = opts.heartbeat;
                  }
                  if ('timeout' in opts) {
                    changesOpts.timeout = opts.timeout;
                  }
                  if (opts.query_params) {
                    changesOpts.query_params = opts.query_params;
                  }
                  if (opts.view) {
                    changesOpts.view = opts.view;
                  }
                  getChanges();
                });
              })["catch"](function(err) {
                abortReplication('getCheckpoint rejected with ', err);
              });
            }
            function onCheckpointError(err) {
              writingCheckpoint = false;
              abortReplication('writeCheckpoint completed with error', err);
            }
            if (returnValue.cancelled) {
              completeReplication();
              return;
            }
            if (!returnValue._addedListeners) {
              returnValue.once('cancel', completeReplication);
              if (typeof opts.complete === 'function') {
                returnValue.once('error', opts.complete);
                returnValue.once('complete', function(result) {
                  opts.complete(null, result);
                });
              }
              returnValue._addedListeners = true;
            }
            if (typeof opts.since === 'undefined') {
              startChanges();
            } else {
              initCheckpointer().then(function() {
                writingCheckpoint = true;
                return checkpointer.writeCheckpoint(opts.since, session);
              }).then(function() {
                writingCheckpoint = false;
                if (returnValue.cancelled) {
                  completeReplication();
                  return;
                }
                last_seq = opts.since;
                startChanges();
              })["catch"](onCheckpointError);
            }
          }
          inherits(Replication, events.EventEmitter);
          function Replication() {
            events.EventEmitter.call(this);
            this.cancelled = false;
            this.state = 'pending';
            var self = this;
            var promise = new PouchPromise$1(function(fulfill, reject) {
              self.once('complete', fulfill);
              self.once('error', reject);
            });
            self.then = function(resolve, reject) {
              return promise.then(resolve, reject);
            };
            self["catch"] = function(reject) {
              return promise["catch"](reject);
            };
            self["catch"](function() {});
          }
          Replication.prototype.cancel = function() {
            this.cancelled = true;
            this.state = 'cancelled';
            this.emit('cancel');
          };
          Replication.prototype.ready = function(src, target) {
            var self = this;
            if (self._readyCalled) {
              return;
            }
            self._readyCalled = true;
            function onDestroy() {
              self.cancel();
            }
            src.once('destroyed', onDestroy);
            target.once('destroyed', onDestroy);
            function cleanup() {
              src.removeListener('destroyed', onDestroy);
              target.removeListener('destroyed', onDestroy);
            }
            self.once('complete', cleanup);
          };
          function toPouch(db, opts) {
            var PouchConstructor = opts.PouchConstructor;
            if (typeof db === 'string') {
              return new PouchConstructor(db, opts);
            } else {
              return db;
            }
          }
          function replicateWrapper(src, target, opts, callback) {
            if (typeof opts === 'function') {
              callback = opts;
              opts = {};
            }
            if (typeof opts === 'undefined') {
              opts = {};
            }
            if (opts.doc_ids && !Array.isArray(opts.doc_ids)) {
              throw createError(BAD_REQUEST, "`doc_ids` filter parameter is not a list.");
            }
            opts.complete = callback;
            opts = clone(opts);
            opts.continuous = opts.continuous || opts.live;
            opts.retry = ('retry' in opts) ? opts.retry : false;
            opts.PouchConstructor = opts.PouchConstructor || this;
            var replicateRet = new Replication(opts);
            var srcPouch = toPouch(src, opts);
            var targetPouch = toPouch(target, opts);
            replicate(srcPouch, targetPouch, opts, replicateRet);
            return replicateRet;
          }
          inherits(Sync, events.EventEmitter);
          function sync$1(src, target, opts, callback) {
            if (typeof opts === 'function') {
              callback = opts;
              opts = {};
            }
            if (typeof opts === 'undefined') {
              opts = {};
            }
            opts = clone(opts);
            opts.PouchConstructor = opts.PouchConstructor || this;
            src = toPouch(src, opts);
            target = toPouch(target, opts);
            return new Sync(src, target, opts, callback);
          }
          function Sync(src, target, opts, callback) {
            var self = this;
            this.canceled = false;
            var optsPush = opts.push ? $inject_Object_assign({}, opts, opts.push) : opts;
            var optsPull = opts.pull ? $inject_Object_assign({}, opts, opts.pull) : opts;
            this.push = replicateWrapper(src, target, optsPush);
            this.pull = replicateWrapper(target, src, optsPull);
            this.pushPaused = true;
            this.pullPaused = true;
            function pullChange(change) {
              self.emit('change', {
                direction: 'pull',
                change: change
              });
            }
            function pushChange(change) {
              self.emit('change', {
                direction: 'push',
                change: change
              });
            }
            function pushDenied(doc) {
              self.emit('denied', {
                direction: 'push',
                doc: doc
              });
            }
            function pullDenied(doc) {
              self.emit('denied', {
                direction: 'pull',
                doc: doc
              });
            }
            function pushPaused() {
              self.pushPaused = true;
              if (self.pullPaused) {
                self.emit('paused');
              }
            }
            function pullPaused() {
              self.pullPaused = true;
              if (self.pushPaused) {
                self.emit('paused');
              }
            }
            function pushActive() {
              self.pushPaused = false;
              if (self.pullPaused) {
                self.emit('active', {direction: 'push'});
              }
            }
            function pullActive() {
              self.pullPaused = false;
              if (self.pushPaused) {
                self.emit('active', {direction: 'pull'});
              }
            }
            var removed = {};
            function removeAll(type) {
              return function(event, func) {
                var isChange = event === 'change' && (func === pullChange || func === pushChange);
                var isDenied = event === 'denied' && (func === pullDenied || func === pushDenied);
                var isPaused = event === 'paused' && (func === pullPaused || func === pushPaused);
                var isActive = event === 'active' && (func === pullActive || func === pushActive);
                if (isChange || isDenied || isPaused || isActive) {
                  if (!(event in removed)) {
                    removed[event] = {};
                  }
                  removed[event][type] = true;
                  if (Object.keys(removed[event]).length === 2) {
                    self.removeAllListeners(event);
                  }
                }
              };
            }
            if (opts.live) {
              this.push.on('complete', self.pull.cancel.bind(self.pull));
              this.pull.on('complete', self.push.cancel.bind(self.push));
            }
            function addOneListener(ee, event, listener) {
              if (ee.listeners(event).indexOf(listener) == -1) {
                ee.on(event, listener);
              }
            }
            this.on('newListener', function(event) {
              if (event === 'change') {
                addOneListener(self.pull, 'change', pullChange);
                addOneListener(self.push, 'change', pushChange);
              } else if (event === 'denied') {
                addOneListener(self.pull, 'denied', pullDenied);
                addOneListener(self.push, 'denied', pushDenied);
              } else if (event === 'active') {
                addOneListener(self.pull, 'active', pullActive);
                addOneListener(self.push, 'active', pushActive);
              } else if (event === 'paused') {
                addOneListener(self.pull, 'paused', pullPaused);
                addOneListener(self.push, 'paused', pushPaused);
              }
            });
            this.on('removeListener', function(event) {
              if (event === 'change') {
                self.pull.removeListener('change', pullChange);
                self.push.removeListener('change', pushChange);
              } else if (event === 'denied') {
                self.pull.removeListener('denied', pullDenied);
                self.push.removeListener('denied', pushDenied);
              } else if (event === 'active') {
                self.pull.removeListener('active', pullActive);
                self.push.removeListener('active', pushActive);
              } else if (event === 'paused') {
                self.pull.removeListener('paused', pullPaused);
                self.push.removeListener('paused', pushPaused);
              }
            });
            this.pull.on('removeListener', removeAll('pull'));
            this.push.on('removeListener', removeAll('push'));
            var promise = PouchPromise$1.all([this.push, this.pull]).then(function(resp) {
              var out = {
                push: resp[0],
                pull: resp[1]
              };
              self.emit('complete', out);
              if (callback) {
                callback(null, out);
              }
              self.removeAllListeners();
              return out;
            }, function(err) {
              self.cancel();
              if (callback) {
                callback(err);
              } else {
                self.emit('error', err);
              }
              self.removeAllListeners();
              if (callback) {
                throw err;
              }
            });
            this.then = function(success, err) {
              return promise.then(success, err);
            };
            this["catch"] = function(err) {
              return promise["catch"](err);
            };
          }
          Sync.prototype.cancel = function() {
            if (!this.canceled) {
              this.canceled = true;
              this.push.cancel();
              this.pull.cancel();
            }
          };
          function replication(PouchDB) {
            PouchDB.replicate = replicateWrapper;
            PouchDB.sync = sync$1;
            Object.defineProperty(PouchDB.prototype, 'replicate', {get: function() {
                var self = this;
                return {
                  from: function(other, opts, callback) {
                    return self.constructor.replicate(other, self, opts, callback);
                  },
                  to: function(other, opts, callback) {
                    return self.constructor.replicate(self, other, opts, callback);
                  }
                };
              }});
            PouchDB.prototype.sync = function(dbName, opts, callback) {
              return this.constructor.sync(this, dbName, opts, callback);
            };
          }
          PouchDB$5.plugin(IDBPouch).plugin(WebSqlPouch).plugin(HttpPouch$1).plugin(mapreduce).plugin(replication);
          module.exports = PouchDB$5;
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, {
        "1": 1,
        "10": 10,
        "13": 13,
        "14": 14,
        "2": 2,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7
      }]
    }, {}, [15])(15);
  });
})(require('process'));
