/* */ 
(function(process) {
  'use strict';
  var LIBRARY = require('./_library');
  var global = require('./_global');
  var ctx = require('./_ctx');
  var classof = require('./_classof');
  var $export = require('./_export');
  var isObject = require('./_is-object');
  var aFunction = require('./_a-function');
  var anInstance = require('./_an-instance');
  var forOf = require('./_for-of');
  var speciesConstructor = require('./_species-constructor');
  var task = require('./_task').set;
  var microtask = require('./_microtask')();
  var newPromiseCapabilityModule = require('./_new-promise-capability');
  var perform = require('./_perform');
  var promiseResolve = require('./_promise-resolve');
  var PROMISE = 'Promise';
  var TypeError = global.TypeError;
  var process = global.process;
  var $Promise = global[PROMISE];
  var isNode = classof(process) == 'process';
  var empty = function() {};
  var Internal,
      newGenericPromiseCapability,
      OwnPromiseCapability,
      Wrapper;
  var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;
  var USE_NATIVE = !!function() {
    try {
      var promise = $Promise.resolve(1);
      var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function(exec) {
        exec(empty, empty);
      };
      return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
    } catch (e) {}
  }();
  var isThenable = function(it) {
    var then;
    return isObject(it) && typeof(then = it.then) == 'function' ? then : false;
  };
  var notify = function(promise, isReject) {
    if (promise._n)
      return;
    promise._n = true;
    var chain = promise._c;
    microtask(function() {
      var value = promise._v;
      var ok = promise._s == 1;
      var i = 0;
      var run = function(reaction) {
        var handler = ok ? reaction.ok : reaction.fail;
        var resolve = reaction.resolve;
        var reject = reaction.reject;
        var domain = reaction.domain;
        var result,
            then;
        try {
          if (handler) {
            if (!ok) {
              if (promise._h == 2)
                onHandleUnhandled(promise);
              promise._h = 1;
            }
            if (handler === true)
              result = value;
            else {
              if (domain)
                domain.enter();
              result = handler(value);
              if (domain)
                domain.exit();
            }
            if (result === reaction.promise) {
              reject(TypeError('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else
              resolve(result);
          } else
            reject(value);
        } catch (e) {
          reject(e);
        }
      };
      while (chain.length > i)
        run(chain[i++]);
      promise._c = [];
      promise._n = false;
      if (isReject && !promise._h)
        onUnhandled(promise);
    });
  };
  var onUnhandled = function(promise) {
    task.call(global, function() {
      var value = promise._v;
      var unhandled = isUnhandled(promise);
      var result,
          handler,
          console;
      if (unhandled) {
        result = perform(function() {
          if (isNode) {
            process.emit('unhandledRejection', value, promise);
          } else if (handler = global.onunhandledrejection) {
            handler({
              promise: promise,
              reason: value
            });
          } else if ((console = global.console) && console.error) {
            console.error('Unhandled promise rejection', value);
          }
        });
        promise._h = isNode || isUnhandled(promise) ? 2 : 1;
      }
      promise._a = undefined;
      if (unhandled && result.e)
        throw result.v;
    });
  };
  var isUnhandled = function(promise) {
    if (promise._h == 1)
      return false;
    var chain = promise._a || promise._c;
    var i = 0;
    var reaction;
    while (chain.length > i) {
      reaction = chain[i++];
      if (reaction.fail || !isUnhandled(reaction.promise))
        return false;
    }
    return true;
  };
  var onHandleUnhandled = function(promise) {
    task.call(global, function() {
      var handler;
      if (isNode) {
        process.emit('rejectionHandled', promise);
      } else if (handler = global.onrejectionhandled) {
        handler({
          promise: promise,
          reason: promise._v
        });
      }
    });
  };
  var $reject = function(value) {
    var promise = this;
    if (promise._d)
      return;
    promise._d = true;
    promise = promise._w || promise;
    promise._v = value;
    promise._s = 2;
    if (!promise._a)
      promise._a = promise._c.slice();
    notify(promise, true);
  };
  var $resolve = function(value) {
    var promise = this;
    var then;
    if (promise._d)
      return;
    promise._d = true;
    promise = promise._w || promise;
    try {
      if (promise === value)
        throw TypeError("Promise can't be resolved itself");
      if (then = isThenable(value)) {
        microtask(function() {
          var wrapper = {
            _w: promise,
            _d: false
          };
          try {
            then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
          } catch (e) {
            $reject.call(wrapper, e);
          }
        });
      } else {
        promise._v = value;
        promise._s = 1;
        notify(promise, false);
      }
    } catch (e) {
      $reject.call({
        _w: promise,
        _d: false
      }, e);
    }
  };
  if (!USE_NATIVE) {
    $Promise = function Promise(executor) {
      anInstance(this, $Promise, PROMISE, '_h');
      aFunction(executor);
      Internal.call(this);
      try {
        executor(ctx($resolve, this, 1), ctx($reject, this, 1));
      } catch (err) {
        $reject.call(this, err);
      }
    };
    Internal = function Promise(executor) {
      this._c = [];
      this._a = undefined;
      this._s = 0;
      this._d = false;
      this._v = undefined;
      this._h = 0;
      this._n = false;
    };
    Internal.prototype = require('./_redefine-all')($Promise.prototype, {
      then: function then(onFulfilled, onRejected) {
        var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected == 'function' && onRejected;
        reaction.domain = isNode ? process.domain : undefined;
        this._c.push(reaction);
        if (this._a)
          this._a.push(reaction);
        if (this._s)
          notify(this, false);
        return reaction.promise;
      },
      'catch': function(onRejected) {
        return this.then(undefined, onRejected);
      }
    });
    OwnPromiseCapability = function() {
      var promise = new Internal();
      this.promise = promise;
      this.resolve = ctx($resolve, promise, 1);
      this.reject = ctx($reject, promise, 1);
    };
    newPromiseCapabilityModule.f = newPromiseCapability = function(C) {
      return C === $Promise || C === Wrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
    };
  }
  $export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
  require('./_set-to-string-tag')($Promise, PROMISE);
  require('./_set-species')(PROMISE);
  Wrapper = require('./_core')[PROMISE];
  $export($export.S + $export.F * !USE_NATIVE, PROMISE, {reject: function reject(r) {
      var capability = newPromiseCapability(this);
      var $$reject = capability.reject;
      $$reject(r);
      return capability.promise;
    }});
  $export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {resolve: function resolve(x) {
      return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
    }});
  $export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function(iter) {
    $Promise.all(iter)['catch'](empty);
  })), PROMISE, {
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform(function() {
        var values = [];
        var index = 0;
        var remaining = 1;
        forOf(iterable, false, function(promise) {
          var $index = index++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          C.resolve(promise).then(function(value) {
            if (alreadyCalled)
              return;
            alreadyCalled = true;
            values[$index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.e)
        reject(result.v);
      return capability.promise;
    },
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var reject = capability.reject;
      var result = perform(function() {
        forOf(iterable, false, function(promise) {
          C.resolve(promise).then(capability.resolve, reject);
        });
      });
      if (result.e)
        reject(result.v);
      return capability.promise;
    }
  });
})(require('process'));
