/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var _extends = Object.assign || function(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps)
      defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();
var _underscore = require('underscore');
var _underscore2 = _interopRequireDefault(_underscore);
var _moment = require('moment');
var _moment2 = _interopRequireDefault(_moment);
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var _d3TimeFormat = require('d3-time-format');
require('moment-duration-format');
var _ValueList = require('./ValueList');
var _ValueList2 = _interopRequireDefault(_ValueList);
var _Label = require('./Label');
var _Label2 = _interopRequireDefault(_Label);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }});
  if (superClass)
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : (subClass.__proto__ = superClass);
}
var TimeMarker = (function(_React$Component) {
  _inherits(TimeMarker, _React$Component);
  function TimeMarker() {
    _classCallCheck(this, TimeMarker);
    return _possibleConstructorReturn(this, (TimeMarker.__proto__ || Object.getPrototypeOf(TimeMarker)).apply(this, arguments));
  }
  _createClass(TimeMarker, [{
    key: "renderLine",
    value: function renderLine(posx) {
      return _react2.default.createElement("line", {
        style: this.props.infoStyle.line,
        x1: posx,
        y1: 0,
        x2: posx,
        y2: this.props.height
      });
    }
  }, {
    key: "renderTimeMarker",
    value: function renderTimeMarker(d) {
      var textStyle = {
        fontSize: 11,
        textAnchor: "left",
        fill: "#bdbdbd"
      };
      var dateStr = "" + d;
      if (this.props.timeFormat === "day") {
        var formatter = (0, _d3TimeFormat.timeFormat)("%d");
        dateStr = formatter(d);
      } else if (this.props.timeFormat === "month") {
        var _formatter = (0, _d3TimeFormat.timeFormat)("%B");
        dateStr = _formatter(d);
      } else if (this.props.timeFormat === "year") {
        var _formatter2 = (0, _d3TimeFormat.timeFormat)("%Y");
        dateStr = _formatter2(d);
      } else if (this.props.timeFormat === "relative") {
        dateStr = _moment2.default.duration(+d).format();
      } else if (_underscore2.default.isString(this.props.timeFormat)) {
        var _formatter3 = (0, _d3TimeFormat.timeFormat)(this.props.timeFormat);
        dateStr = _formatter3(d);
      } else if (_underscore2.default.isFunction(this.props.timeFormat)) {
        dateStr = this.props.timeFormat(d);
      }
      return _react2.default.createElement("text", {
        x: 0,
        y: 0,
        dy: "1.2em",
        style: textStyle
      }, dateStr);
    }
  }, {
    key: "renderInfoBox",
    value: function renderInfoBox(posx) {
      var w = this.props.infoWidth;
      var infoBoxProps = {
        align: "left",
        style: this.props.infoStyle.box,
        width: this.props.infoWidth,
        height: this.props.infoHeight
      };
      if (this.props.infoValues) {
        var infoBox = _underscore2.default.isString(this.props.infoValues) ? _react2.default.createElement(_Label2.default, _extends({}, infoBoxProps, {label: this.props.infoValues})) : _react2.default.createElement(_ValueList2.default, _extends({}, infoBoxProps, {values: this.props.infoValues}));
        if (posx + 10 + w < this.props.width - 50) {
          return _react2.default.createElement("g", {transform: "translate(" + (posx + 10) + "," + 5 + ")"}, this.props.showTime ? this.renderTimeMarker(this.props.time) : null, _react2.default.createElement("g", {transform: "translate(0," + (this.props.showTime ? 20 : 0) + ")"}, infoBox));
        }
        return _react2.default.createElement("g", {transform: "translate(" + (posx - w - 10) + "," + 5 + ")"}, this.props.showTime ? this.renderTimeMarker(this.props.time) : null, _react2.default.createElement("g", {transform: "translate(0," + (this.props.showTime ? 20 : 0) + ")"}, infoBox));
      }
      return _react2.default.createElement("g", null);
    }
  }, {
    key: "render",
    value: function render() {
      var posx = this.props.timeScale(this.props.time);
      if (posx) {
        return _react2.default.createElement("g", null, this.props.showLine ? this.renderLine(posx) : null, this.props.showInfoBox ? this.renderInfoBox(posx) : null);
      }
      return null;
    }
  }]);
  return TimeMarker;
})(_react2.default.Component);
exports.default = TimeMarker;
TimeMarker.propTypes = {
  time: _propTypes2.default.instanceOf(Date),
  infoValues: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.shape({
    label: _propTypes2.default.string,
    value: _propTypes2.default.string
  }))]),
  infoStyle: _propTypes2.default.shape({
    line: _propTypes2.default.object,
    box: _propTypes2.default.object,
    dot: _propTypes2.default.object
  }),
  infoWidth: _propTypes2.default.number,
  infoHeight: _propTypes2.default.number,
  showInfoBox: _propTypes2.default.bool,
  showLine: _propTypes2.default.bool,
  showTime: _propTypes2.default.bool,
  timeFormat: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  timeScale: _propTypes2.default.func,
  width: _propTypes2.default.number,
  height: _propTypes2.default.number
};
TimeMarker.defaultProps = {
  showInfoBox: true,
  showLine: true,
  showTime: true,
  infoStyle: {
    line: {
      stroke: "#999",
      cursor: "crosshair",
      pointerEvents: "none"
    },
    box: {
      fill: "white",
      opacity: 0.9,
      stroke: "#999",
      pointerEvents: "none"
    },
    dot: {fill: "#999"}
  },
  infoWidth: 90,
  infoHeight: 25
};
