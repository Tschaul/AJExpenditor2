/* */ 
(function(process) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');
  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
  var _createClass2 = require('babel-runtime/helpers/createClass');
  var _createClass3 = _interopRequireDefault(_createClass2);
  var _underscore = require('underscore');
  var _underscore2 = _interopRequireDefault(_underscore);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var Observable = function() {
    function Observable() {
      (0, _classCallCheck3.default)(this, Observable);
      this._id = _underscore2.default.uniqueId("id-");
      this._observers = [];
    }
    (0, _createClass3.default)(Observable, [{
      key: "emit",
      value: function emit(event) {
        this._observers.forEach(function(observer) {
          observer.addEvent(event);
        });
      }
    }, {
      key: "flush",
      value: function flush() {
        this._observers.forEach(function(observer) {
          observer.flush();
        });
      }
    }, {
      key: "addObserver",
      value: function addObserver(observer) {
        var shouldAdd = true;
        this._observers.forEach(function(o) {
          if (o === observer) {
            shouldAdd = false;
          }
        });
        if (shouldAdd)
          this._observers.push(observer);
      }
    }, {
      key: "hasObservers",
      value: function hasObservers() {
        return this._observers.length > 0;
      }
    }]);
    return Observable;
  }();
  exports.default = Observable;
})(require('process'));
