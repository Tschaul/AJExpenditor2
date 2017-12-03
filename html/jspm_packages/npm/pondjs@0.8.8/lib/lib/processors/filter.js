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
  var _processor = require('./processor');
  var _processor2 = _interopRequireDefault(_processor);
  var _pipeline = require('../pipeline');
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var Filter = function(_Processor) {
    (0, _inherits3.default)(Filter, _Processor);
    function Filter(arg1, options) {
      (0, _classCallCheck3.default)(this, Filter);
      var _this = (0, _possibleConstructorReturn3.default)(this, (Filter.__proto__ || (0, _getPrototypeOf2.default)(Filter)).call(this, arg1, options));
      if (arg1 instanceof Filter) {
        var other = arg1;
        _this._op = other._op;
      } else if ((0, _pipeline.isPipeline)(arg1)) {
        _this._op = options.op;
      } else {
        throw new Error("Unknown arg to Filter constructor", arg1);
      }
      return _this;
    }
    (0, _createClass3.default)(Filter, [{
      key: "clone",
      value: function clone() {
        return new Filter(this);
      }
    }, {
      key: "addEvent",
      value: function addEvent(event) {
        if (this.hasObservers()) {
          if (this._op(event)) {
            this.emit(event);
          }
        }
      }
    }]);
    return Filter;
  }(_processor2.default);
  exports.default = Filter;
})(require('process'));
