/* */ 
(function(process) {
  var ctx = require('./_ctx');
  var invoke = require('./_invoke');
  var html = require('./_html');
  var cel = require('./_dom-create');
  var global = require('./_global');
  var process = global.process;
  var setTask = global.setImmediate;
  var clearTask = global.clearImmediate;
  var MessageChannel = global.MessageChannel;
  var Dispatch = global.Dispatch;
  var counter = 0;
  var queue = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer,
      channel,
      port;
  var run = function() {
    var id = +this;
    if (queue.hasOwnProperty(id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  };
  var listener = function(event) {
    run.call(event.data);
  };
  if (!setTask || !clearTask) {
    setTask = function setImmediate(fn) {
      var args = [];
      var i = 1;
      while (arguments.length > i)
        args.push(arguments[i++]);
      queue[++counter] = function() {
        invoke(typeof fn == 'function' ? fn : Function(fn), args);
      };
      defer(counter);
      return counter;
    };
    clearTask = function clearImmediate(id) {
      delete queue[id];
    };
    if (require('./_cof')(process) == 'process') {
      defer = function(id) {
        process.nextTick(ctx(run, id, 1));
      };
    } else if (Dispatch && Dispatch.now) {
      defer = function(id) {
        Dispatch.now(ctx(run, id, 1));
      };
    } else if (MessageChannel) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = ctx(port.postMessage, port, 1);
    } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
      defer = function(id) {
        global.postMessage(id + '', '*');
      };
      global.addEventListener('message', listener, false);
    } else if (ONREADYSTATECHANGE in cel('script')) {
      defer = function(id) {
        html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function() {
          html.removeChild(this);
          run.call(id);
        };
      };
    } else {
      defer = function(id) {
        setTimeout(ctx(run, id, 1), 0);
      };
    }
  }
  module.exports = {
    set: setTask,
    clear: clearTask
  };
})(require('process'));
