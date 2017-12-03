/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var _stringify = require('babel-runtime/core-js/json/stringify');
var _stringify2 = _interopRequireDefault(_stringify);
var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');
var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');
var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
var _createClass2 = require('babel-runtime/helpers/createClass');
var _createClass3 = _interopRequireDefault(_createClass2);
var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
var _inherits2 = require('babel-runtime/helpers/inherits');
var _inherits3 = _interopRequireDefault(_inherits2);
var _underscore = require('underscore');
var _underscore2 = _interopRequireDefault(_underscore);
var _immutable = require('immutable');
var _immutable2 = _interopRequireDefault(_immutable);
var _event = require('./event');
var _event2 = _interopRequireDefault(_event);
var _util = require('./base/util');
var _util2 = _interopRequireDefault(_util);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
var TimeEvent = function(_Event) {
  (0, _inherits3.default)(TimeEvent, _Event);
  function TimeEvent(arg1, arg2) {
    (0, _classCallCheck3.default)(this, TimeEvent);
    var _this = (0, _possibleConstructorReturn3.default)(this, (TimeEvent.__proto__ || (0, _getPrototypeOf2.default)(TimeEvent)).call(this));
    if (arg1 instanceof TimeEvent) {
      var other = arg1;
      _this._d = other._d;
      return (0, _possibleConstructorReturn3.default)(_this);
    } else if (arg1 instanceof _immutable2.default.Map && arg1.has("time") && arg1.has("data")) {
      _this._d = arg1;
      return (0, _possibleConstructorReturn3.default)(_this);
    }
    var time = _util2.default.timestampFromArg(arg1);
    var data = _util2.default.dataFromArg(arg2);
    _this._d = new _immutable2.default.Map({
      time: time,
      data: data
    });
    return _this;
  }
  (0, _createClass3.default)(TimeEvent, [{
    key: "key",
    value: function key() {
      return this.timestamp().getTime();
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        time: this.timestamp().getTime(),
        data: this.data().toJSON()
      };
    }
  }, {
    key: "toPoint",
    value: function toPoint() {
      return [this.timestamp().getTime()].concat((0, _toConsumableArray3.default)(_underscore2.default.values(this.data().toJSON())));
    }
  }, {
    key: "timestampAsUTCString",
    value: function timestampAsUTCString() {
      return this.timestamp().toUTCString();
    }
  }, {
    key: "timestampAsLocalString",
    value: function timestampAsLocalString() {
      return this.timestamp().toString();
    }
  }, {
    key: "timestamp",
    value: function timestamp() {
      return this._d.get("time");
    }
  }, {
    key: "begin",
    value: function begin() {
      return this.timestamp();
    }
  }, {
    key: "end",
    value: function end() {
      return this.timestamp();
    }
  }, {
    key: "stringify",
    value: function stringify() {
      return (0, _stringify2.default)(this.data());
    }
  }]);
  return TimeEvent;
}(_event2.default);
exports.default = TimeEvent;
