/* */ 
(function(process) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
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
  var _processor = require('./processor');
  var _processor2 = _interopRequireDefault(_processor);
  var _indexedevent = require('../indexedevent');
  var _indexedevent2 = _interopRequireDefault(_indexedevent);
  var _timerangeevent = require('../timerangeevent');
  var _timerangeevent2 = _interopRequireDefault(_timerangeevent);
  var _pipeline = require('../pipeline');
  var _util = require('../base/util');
  var _util2 = _interopRequireDefault(_util);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var Derivator = function(_Processor) {
    (0, _inherits3.default)(Derivator, _Processor);
    function Derivator(arg1, options) {
      (0, _classCallCheck3.default)(this, Derivator);
      var _this = (0, _possibleConstructorReturn3.default)(this, (Derivator.__proto__ || (0, _getPrototypeOf2.default)(Derivator)).call(this, arg1, options));
      if (arg1 instanceof Derivator) {
        var other = arg1;
        _this._fieldSpec = other._fieldSpec;
        _this._allowNegative = other._allowNegative;
      } else if ((0, _pipeline.isPipeline)(arg1)) {
        var fieldSpec = options.fieldSpec,
            allowNegative = options.allowNegative;
        _this._fieldSpec = fieldSpec;
        _this._allowNegative = allowNegative;
      } else {
        throw new Error("Unknown arg to Derivator constructor", arg1);
      }
      _this._previous = null;
      if (_underscore2.default.isString(_this._fieldSpec)) {
        _this._fieldSpec = [_this._fieldSpec];
      } else if (!_this._fieldSpec) {
        _this._fieldSpec = ["value"];
      }
      return _this;
    }
    (0, _createClass3.default)(Derivator, [{
      key: "clone",
      value: function clone() {
        return new Derivator(this);
      }
    }, {
      key: "getRate",
      value: function getRate(event) {
        var _this2 = this;
        var d = new _immutable2.default.Map();
        var previousTime = this._previous.timestamp().getTime();
        var currentTime = event.timestamp().getTime();
        var deltaTime = (currentTime - previousTime) / 1000;
        this._fieldSpec.forEach(function(path) {
          var fieldPath = _util2.default.fieldPathToArray(path);
          var ratePath = fieldPath.slice();
          ratePath[ratePath.length - 1] += "_rate";
          var previousVal = _this2._previous.get(fieldPath);
          var currentVal = event.get(fieldPath);
          var rate = null;
          if (!_underscore2.default.isNumber(previousVal) || !_underscore2.default.isNumber(currentVal)) {
            console.warn("Path " + fieldPath + " contains a non-numeric value or does not exist");
          } else {
            rate = (currentVal - previousVal) / deltaTime;
          }
          if (_this2._allowNegative === false && rate < 0) {
            d = d.setIn(ratePath, null);
          } else {
            d = d.setIn(ratePath, rate);
          }
        });
        return new _timerangeevent2.default([previousTime, currentTime], d);
      }
    }, {
      key: "addEvent",
      value: function addEvent(event) {
        if (event instanceof _timerangeevent2.default || event instanceof _indexedevent2.default) {
          throw new Error("TimeRangeEvent and IndexedEvent series can not be aligned.");
        }
        if (this.hasObservers()) {
          if (!this._previous) {
            this._previous = event;
            return;
          }
          var outputEvent = this.getRate(event);
          this.emit(outputEvent);
          this._previous = event;
        }
      }
    }]);
    return Derivator;
  }(_processor2.default);
  exports.default = Derivator;
})(require('process'));
