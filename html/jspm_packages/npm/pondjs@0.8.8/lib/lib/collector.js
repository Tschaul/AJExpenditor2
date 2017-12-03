/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var _keys = require('babel-runtime/core-js/object/keys');
var _keys2 = _interopRequireDefault(_keys);
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
var _createClass2 = require('babel-runtime/helpers/createClass');
var _createClass3 = _interopRequireDefault(_createClass2);
var _underscore = require('underscore');
var _underscore2 = _interopRequireDefault(_underscore);
var _collection = require('./collection');
var _collection2 = _interopRequireDefault(_collection);
var _index = require('./index');
var _index2 = _interopRequireDefault(_index);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
var Collector = function() {
  function Collector(options, onTrigger) {
    (0, _classCallCheck3.default)(this, Collector);
    var windowType = options.windowType,
        windowDuration = options.windowDuration,
        groupBy = options.groupBy,
        emitOn = options.emitOn;
    this._groupBy = groupBy;
    this._emitOn = emitOn;
    this._windowType = windowType;
    this._windowDuration = windowDuration;
    this._onTrigger = onTrigger;
    this._collections = {};
  }
  (0, _createClass3.default)(Collector, [{
    key: "flushCollections",
    value: function flushCollections() {
      this.emitCollections(this._collections);
    }
  }, {
    key: "emitCollections",
    value: function emitCollections(collections) {
      var _this = this;
      if (this._onTrigger) {
        _underscore2.default.each(collections, function(c) {
          var collection = c.collection,
              windowKey = c.windowKey,
              groupByKey = c.groupByKey;
          _this._onTrigger && _this._onTrigger(collection, windowKey, groupByKey);
        });
      }
    }
  }, {
    key: "addEvent",
    value: function addEvent(event) {
      var _this2 = this;
      var timestamp = event.timestamp();
      var windowType = this._windowType;
      var windowKey = void 0;
      if (windowType === "fixed") {
        windowKey = _index2.default.getIndexString(this._windowDuration, timestamp);
      } else if (windowType === "daily") {
        windowKey = _index2.default.getDailyIndexString(timestamp);
      } else if (windowType === "monthly") {
        windowKey = _index2.default.getMonthlyIndexString(timestamp);
      } else if (windowType === "yearly") {
        windowKey = _index2.default.getYearlyIndexString(timestamp);
      } else {
        windowKey = windowType;
      }
      var groupByKey = this._groupBy(event);
      var collectionKey = groupByKey ? windowKey + "::" + groupByKey : windowKey;
      var discard = false;
      if (!_underscore2.default.has(this._collections, collectionKey)) {
        this._collections[collectionKey] = {
          windowKey: windowKey,
          groupByKey: groupByKey,
          collection: new _collection2.default()
        };
        discard = true;
      }
      this._collections[collectionKey].collection = this._collections[collectionKey].collection.addEvent(event);
      var discards = {};
      if (discard && windowType === "fixed") {
        _underscore2.default.each(this._collections, function(c, k) {
          if (windowKey !== c.windowKey) {
            discards[k] = c;
          }
        });
      }
      var emitOn = this._emitOn;
      if (emitOn === "eachEvent") {
        this.emitCollections(this._collections);
      } else if (emitOn === "discard") {
        this.emitCollections(discards);
        _underscore2.default.each((0, _keys2.default)(discards), function(k) {
          delete _this2._collections[k];
        });
      } else if (emitOn === "flush") {} else {
        throw new Error("Unknown emit type supplied to Collector");
      }
    }
  }]);
  return Collector;
}();
exports.default = Collector;
