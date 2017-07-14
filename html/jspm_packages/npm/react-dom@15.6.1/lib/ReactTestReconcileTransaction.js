/* */ 
'use strict';
var _assign = require('object-assign');
var CallbackQueue = require('./CallbackQueue');
var PooledClass = require('./PooledClass');
var Transaction = require('./Transaction');
var ReactUpdateQueue = require('./ReactUpdateQueue');
var ON_DOM_READY_QUEUEING = {
  initialize: function() {
    this.reactMountReady.reset();
  },
  close: function() {
    this.reactMountReady.notifyAll();
  }
};
var TRANSACTION_WRAPPERS = [ON_DOM_READY_QUEUEING];
function ReactTestReconcileTransaction(testOptions) {
  this.reinitializeTransaction();
  this.testOptions = testOptions;
  this.reactMountReady = CallbackQueue.getPooled(this);
}
var Mixin = {
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },
  getReactMountReady: function() {
    return this.reactMountReady;
  },
  getTestOptions: function() {
    return this.testOptions;
  },
  getUpdateQueue: function() {
    return ReactUpdateQueue;
  },
  checkpoint: function() {
    return this.reactMountReady.checkpoint();
  },
  rollback: function(checkpoint) {
    this.reactMountReady.rollback(checkpoint);
  },
  destructor: function() {
    CallbackQueue.release(this.reactMountReady);
    this.reactMountReady = null;
  }
};
_assign(ReactTestReconcileTransaction.prototype, Transaction, ReactTestReconcileTransaction, Mixin);
PooledClass.addPoolingTo(ReactTestReconcileTransaction);
module.exports = ReactTestReconcileTransaction;
