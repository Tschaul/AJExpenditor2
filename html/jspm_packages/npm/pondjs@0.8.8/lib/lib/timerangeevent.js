/* */ 
(function(process) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
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
  var TimeRangeEvent = function(_Event) {
    (0, _inherits3.default)(TimeRangeEvent, _Event);
    function TimeRangeEvent(arg1, arg2) {
      (0, _classCallCheck3.default)(this, TimeRangeEvent);
      var _this = (0, _possibleConstructorReturn3.default)(this, (TimeRangeEvent.__proto__ || (0, _getPrototypeOf2.default)(TimeRangeEvent)).call(this));
      if (arg1 instanceof TimeRangeEvent) {
        var other = arg1;
        _this._d = other._d;
        return (0, _possibleConstructorReturn3.default)(_this);
      } else if (arg1 instanceof _immutable2.default.Map) {
        _this._d = arg1;
        return (0, _possibleConstructorReturn3.default)(_this);
      }
      var range = _util2.default.timeRangeFromArg(arg1);
      var data = _util2.default.dataFromArg(arg2);
      _this._d = new _immutable2.default.Map({
        range: range,
        data: data
      });
      return _this;
    }
    (0, _createClass3.default)(TimeRangeEvent, [{
      key: "key",
      value: function key() {
        return +this.timerange().begin() + "," + +this.timerange().end();
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          timerange: this.timerange().toJSON(),
          data: this.data().toJSON()
        };
      }
    }, {
      key: "toPoint",
      value: function toPoint() {
        return [this.timerange().toJSON()].concat((0, _toConsumableArray3.default)(_underscore2.default.values(this.data().toJSON())));
      }
    }, {
      key: "timerange",
      value: function timerange() {
        return this._d.get("range");
      }
    }, {
      key: "timerangeAsUTCString",
      value: function timerangeAsUTCString() {
        return this.timerange().toUTCString();
      }
    }, {
      key: "timerangeAsLocalString",
      value: function timerangeAsLocalString() {
        return this.timerange().toLocalString();
      }
    }, {
      key: "begin",
      value: function begin() {
        return this.timerange().begin();
      }
    }, {
      key: "end",
      value: function end() {
        return this.timerange().end();
      }
    }, {
      key: "timestamp",
      value: function timestamp() {
        return this.begin();
      }
    }, {
      key: "humanizeDuration",
      value: function humanizeDuration() {
        return this.timerange().humanizeDuration();
      }
    }]);
    return TimeRangeEvent;
  }(_event2.default);
  exports.default = TimeRangeEvent;
})(require('process'));
