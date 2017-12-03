/* */ 
(function(process) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');
  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
  var _createClass2 = require('babel-runtime/helpers/createClass');
  var _createClass3 = _interopRequireDefault(_createClass2);
  var _util = require('./base/util');
  var _util2 = _interopRequireDefault(_util);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var Index = function() {
    function Index(s) {
      var utc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      (0, _classCallCheck3.default)(this, Index);
      this._utc = utc;
      this._string = s;
      this._timerange = _util2.default.rangeFromIndexString(s, this._utc);
    }
    (0, _createClass3.default)(Index, [{
      key: "toJSON",
      value: function toJSON() {
        return this._string;
      }
    }, {
      key: "toString",
      value: function toString() {
        return this._string;
      }
    }, {
      key: "toNiceString",
      value: function toNiceString(format) {
        return _util2.default.niceIndexString(this._string, format);
      }
    }, {
      key: "asString",
      value: function asString() {
        return this.toString();
      }
    }, {
      key: "asTimerange",
      value: function asTimerange() {
        return this._timerange;
      }
    }, {
      key: "begin",
      value: function begin() {
        return this._timerange.begin();
      }
    }, {
      key: "end",
      value: function end() {
        return this._timerange.end();
      }
    }], [{
      key: "getIndexString",
      value: function getIndexString(win, date) {
        var pos = _util2.default.windowPositionFromDate(win, date);
        return win + "-" + pos;
      }
    }, {
      key: "getIndexStringList",
      value: function getIndexStringList(win, timerange) {
        var pos1 = _util2.default.windowPositionFromDate(win, timerange.begin());
        var pos2 = _util2.default.windowPositionFromDate(win, timerange.end());
        var indexList = [];
        if (pos1 <= pos2) {
          for (var pos = pos1; pos <= pos2; pos++) {
            indexList.push(win + "-" + pos);
          }
        }
        return indexList;
      }
    }, {
      key: "getDailyIndexString",
      value: function getDailyIndexString(date) {
        var utc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var day = _util2.default.leftPad(utc ? date.getUTCDate() : date.getDate());
        var month = _util2.default.leftPad(utc ? date.getUTCMonth() + 1 : date.getMonth() + 1);
        var year = utc ? date.getUTCFullYear() : date.getFullYear();
        return year + "-" + month + "-" + day;
      }
    }, {
      key: "getMonthlyIndexString",
      value: function getMonthlyIndexString(date) {
        var utc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var month = _util2.default.leftPad(utc ? date.getUTCMonth() + 1 : date.getMonth() + 1);
        var year = utc ? date.getUTCFullYear() : date.getFullYear();
        return year + "-" + month;
      }
    }, {
      key: "getYearlyIndexString",
      value: function getYearlyIndexString(date) {
        var utc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var year = utc ? date.getUTCFullYear() : date.getFullYear();
        return "" + year;
      }
    }]);
    return Index;
  }();
  exports.default = Index;
})(require('process'));
