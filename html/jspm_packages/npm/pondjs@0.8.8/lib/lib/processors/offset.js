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
  var _processor = require('./processor');
  var _processor2 = _interopRequireDefault(_processor);
  var _event = require('../event');
  var _event2 = _interopRequireDefault(_event);
  var _pipeline = require('../pipeline');
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var Offset = function(_Processor) {
    (0, _inherits3.default)(Offset, _Processor);
    function Offset(arg1, options) {
      (0, _classCallCheck3.default)(this, Offset);
      var _this = (0, _possibleConstructorReturn3.default)(this, (Offset.__proto__ || (0, _getPrototypeOf2.default)(Offset)).call(this, arg1, options));
      if (arg1 instanceof Offset) {
        var other = arg1;
        _this._by = other._by;
        _this._fieldSpec = other._fieldSpec;
      } else if ((0, _pipeline.isPipeline)(arg1)) {
        _this._by = options.by || 1;
        _this._fieldSpec = options.fieldSpec;
      } else {
        throw new Error("Unknown arg to Offset constructor", arg1);
      }
      return _this;
    }
    (0, _createClass3.default)(Offset, [{
      key: "clone",
      value: function clone() {
        return new Offset(this);
      }
    }, {
      key: "addEvent",
      value: function addEvent(event) {
        var _this2 = this;
        if (this.hasObservers()) {
          var selected = _event2.default.selector(event, this._fieldSpec);
          var data = {};
          _underscore2.default.each(selected.data().toJSON(), function(value, key) {
            var offsetValue = value + _this2._by;
            data[key] = offsetValue;
          });
          var outputEvent = event.setData(data);
          this.emit(outputEvent);
        }
      }
    }]);
    return Offset;
  }(_processor2.default);
  exports.default = Offset;
})(require('process'));
