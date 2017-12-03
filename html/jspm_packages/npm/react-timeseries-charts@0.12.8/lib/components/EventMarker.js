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
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var _merge = require('merge');
var _merge2 = _interopRequireDefault(_merge);
var _pondjs = require('pondjs');
var _d3TimeFormat = require('d3-time-format');
var _Label = require('./Label');
var _Label2 = _interopRequireDefault(_Label);
var _ValueList = require('./ValueList');
var _ValueList2 = _interopRequireDefault(_ValueList);
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
var EventTime = function EventTime(_ref) {
  var time = _ref.time,
      _ref$format = _ref.format,
      format = _ref$format === undefined ? "%m/%d/%y %X" : _ref$format;
  var textStyle = {
    fontSize: 11,
    textAnchor: "left",
    fill: "#bdbdbd",
    pointerEvents: "none"
  };
  var text = void 0;
  if (_underscore2.default.isFunction(format)) {
    text = format(time);
  } else {
    var fmt = (0, _d3TimeFormat.timeFormat)(format);
    text = fmt(time);
  }
  return _react2.default.createElement("text", {
    x: 0,
    y: 0,
    dy: "1.2em",
    style: textStyle
  }, text);
};
EventTime.propTypes = {
  time: _propTypes2.default.instanceOf(Date),
  format: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string])
};
EventTime.defaultProps = {infoTimeFormat: "%m/%d/%y %X"};
var EventTimeRange = function EventTimeRange(_ref2) {
  var timerange = _ref2.timerange,
      _ref2$format = _ref2.format,
      format = _ref2$format === undefined ? "%m/%d/%y %X" : _ref2$format;
  var textStyle = {
    fontSize: 11,
    textAnchor: "left",
    fill: "#bdbdbd",
    pointerEvents: "none"
  };
  var d1 = timerange.begin();
  var d2 = timerange.end();
  var beginText = void 0;
  var endText = void 0;
  if (_underscore2.default.isFunction(format)) {
    beginText = format(d1);
    endText = format(d2);
  } else {
    var fmt = (0, _d3TimeFormat.timeFormat)(format);
    beginText = fmt(d1);
    endText = fmt(d2);
  }
  return _react2.default.createElement("text", {
    x: 0,
    y: 0,
    dy: "1.2em",
    style: textStyle
  }, beginText + " to " + endText);
};
EventTimeRange.propTypes = {
  timerange: _propTypes2.default.instanceOf(_pondjs.TimeRange),
  format: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string])
};
EventTimeRange.defaultProps = {infoTimeFormat: "%m/%d/%y %X"};
var EventIndex = function EventIndex(_ref3) {
  var index = _ref3.index,
      format = _ref3.format;
  var textStyle = {
    fontSize: 11,
    textAnchor: "left",
    fill: "#bdbdbd",
    pointerEvents: "none"
  };
  var text = void 0;
  if (_underscore2.default.isFunction(format)) {
    text = format(index);
  } else if (_underscore2.default.isString(format)) {
    var fmt = (0, _d3TimeFormat.timeFormat)(format);
    text = fmt(index.begin());
  } else {
    text = index.toString();
  }
  return _react2.default.createElement("text", {
    x: 0,
    y: 0,
    dy: "1.2em",
    style: textStyle
  }, text);
};
EventIndex.propTypes = {
  index: _propTypes2.default.instanceOf(_pondjs.Index),
  format: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string])
};
var EventMarker = (function(_React$Component) {
  _inherits(EventMarker, _React$Component);
  function EventMarker() {
    _classCallCheck(this, EventMarker);
    return _possibleConstructorReturn(this, (EventMarker.__proto__ || Object.getPrototypeOf(EventMarker)).apply(this, arguments));
  }
  _createClass(EventMarker, [{
    key: "renderTime",
    value: function renderTime(event) {
      if (event instanceof _pondjs.TimeEvent) {
        return _react2.default.createElement(EventTime, {
          time: event.timestamp(),
          format: this.props.infoTimeFormat
        });
      } else if (event instanceof _pondjs.IndexedEvent) {
        return _react2.default.createElement(EventIndex, {
          index: event.index(),
          format: this.props.infoTimeFormat
        });
      } else if (event instanceof _pondjs.TimeRangeEvent) {
        return _react2.default.createElement(EventTimeRange, {
          timerange: event.timerange(),
          format: this.props.infoTimeFormat
        });
      }
      return _react2.default.createElement("g", null);
    }
  }, {
    key: "renderMarker",
    value: function renderMarker(event, column, info) {
      var t = void 0;
      if (event instanceof _pondjs.TimeEvent) {
        t = event.timestamp();
      } else {
        t = new Date(event.begin().getTime() + (event.end().getTime() - event.begin().getTime()) / 2);
      }
      var value = void 0;
      if (this.props.yValueFunc) {
        value = this.props.yValueFunc(event, column);
      } else {
        value = event.get(column);
      }
      var posx = this.props.timeScale(t) + this.props.offsetX;
      var posy = this.props.yScale(value) - this.props.offsetY;
      var infoBoxProps = {
        align: "left",
        style: this.props.infoStyle,
        width: this.props.infoWidth,
        height: this.props.infoHeight
      };
      var w = this.props.infoWidth;
      var lineBottom = posy - 10;
      var verticalStem = void 0;
      var horizontalStem = void 0;
      var dot = void 0;
      var infoBox = void 0;
      var transform = void 0;
      var label = void 0;
      if (info) {
        if (_underscore2.default.isString(this.props.info)) {
          infoBox = _react2.default.createElement(_Label2.default, _extends({}, infoBoxProps, {label: info}));
        } else {
          infoBox = _react2.default.createElement(_ValueList2.default, _extends({}, infoBoxProps, {values: info}));
        }
      }
      if (this.props.type === "point") {
        var textDefaultStyle = {
          fontSize: 11,
          pointerEvents: "none",
          paintOrder: "stroke",
          fill: "#b0b0b0",
          strokeWidth: 2,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          fontWeight: 800
        };
        var dx = 0;
        var dy = 0;
        switch (this.props.markerLabelAlign) {
          case "left":
            dx = 5;
            textDefaultStyle.textAnchor = "start";
            textDefaultStyle.alignmentBaseline = "central";
            break;
          case "right":
            dx = -5;
            textDefaultStyle.textAnchor = "end";
            textDefaultStyle.alignmentBaseline = "central";
            break;
          case "top":
            dy = -5;
            textDefaultStyle.textAnchor = "middle";
            textDefaultStyle.alignmentBaseline = "bottom";
            break;
          case "bottom":
            dy = 5;
            textDefaultStyle.textAnchor = "middle";
            textDefaultStyle.alignmentBaseline = "hanging";
            break;
          default:
        }
        var tstyle = (0, _merge2.default)(true, textDefaultStyle, this.props.markerLabelStyle);
        dot = _react2.default.createElement("circle", {
          cx: posx,
          cy: posy,
          r: this.props.markerRadius,
          pointerEvents: "none",
          style: this.props.markerStyle
        });
        label = _react2.default.createElement("text", {
          x: posx,
          y: posy,
          dx: dx,
          dy: dy,
          style: tstyle
        }, this.props.markerLabel);
        return _react2.default.createElement("g", null, dot, label);
      } else {
        if (posx + 10 + w < this.props.width * 3 / 4) {
          if (info) {
            verticalStem = _react2.default.createElement("line", {
              pointerEvents: "none",
              style: this.props.stemStyle,
              x1: -10,
              y1: lineBottom,
              x2: -10,
              y2: 20
            });
            horizontalStem = _react2.default.createElement("line", {
              pointerEvents: "none",
              style: this.props.stemStyle,
              x1: -10,
              y1: 20,
              x2: -2,
              y2: 20
            });
          }
          dot = _react2.default.createElement("circle", {
            cx: -10,
            cy: lineBottom,
            r: this.props.markerRadius,
            pointerEvents: "none",
            style: this.props.markerStyle
          });
          transform = "translate(" + (posx + 10) + "," + 10 + ")";
        } else {
          if (info) {
            verticalStem = _react2.default.createElement("line", {
              pointerEvents: "none",
              style: this.props.stemStyle,
              x1: w + 10,
              y1: lineBottom,
              x2: w + 10,
              y2: 20
            });
            horizontalStem = _react2.default.createElement("line", {
              pointerEvents: "none",
              style: this.props.stemStyle,
              x1: w + 10,
              y1: 20,
              x2: w + 2,
              y2: 20
            });
          }
          dot = _react2.default.createElement("circle", {
            cx: w + 10,
            cy: lineBottom,
            r: this.props.markerRadius,
            pointerEvents: "none",
            style: this.props.markerStyle
          });
          transform = "translate(" + (posx - w - 10) + "," + 10 + ")";
        }
        return _react2.default.createElement("g", {transform: transform}, verticalStem, horizontalStem, dot, this.renderTime(event), _react2.default.createElement("g", {transform: "translate(0," + 20 + ")"}, infoBox));
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          event = _props.event,
          column = _props.column,
          info = _props.info;
      if (!event) {
        return _react2.default.createElement("g", null);
      }
      return _react2.default.createElement("g", null, this.renderMarker(event, column, info));
    }
  }]);
  return EventMarker;
})(_react2.default.Component);
exports.default = EventMarker;
EventMarker.propTypes = {
  type: _propTypes2.default.oneOf(["point", "flag"]),
  event: _propTypes2.default.oneOfType([_propTypes2.default.instanceOf(_pondjs.TimeEvent), _propTypes2.default.instanceOf(_pondjs.IndexedEvent), _propTypes2.default.instanceOf(_pondjs.TimeRangeEvent)]),
  column: _propTypes2.default.string,
  info: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.shape({
    label: _propTypes2.default.string,
    value: _propTypes2.default.string
  }))]),
  infoStyle: _propTypes2.default.object,
  infoWidth: _propTypes2.default.number,
  infoHeight: _propTypes2.default.number,
  infoTimeFormat: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
  markerLabelAlign: _propTypes2.default.oneOf(["left", "right", "top", "bottom"]),
  markerRadius: _propTypes2.default.number,
  markerStyle: _propTypes2.default.object,
  yValueFunc: _propTypes2.default.func,
  offsetX: _propTypes2.default.number,
  offsetY: _propTypes2.default.number,
  timeScale: _propTypes2.default.func,
  yScale: _propTypes2.default.func,
  width: _propTypes2.default.number
};
EventMarker.defaultProps = {
  type: "flag",
  column: "value",
  infoWidth: 90,
  infoHeight: 25,
  infoStyle: {
    fill: "white",
    opacity: 0.90,
    stroke: "#999",
    pointerEvents: "none"
  },
  stemStyle: {
    stroke: "#999",
    cursor: "crosshair",
    pointerEvents: "none"
  },
  markerStyle: {fill: "#999"},
  markerRadius: 2,
  markerLabelAlign: "left",
  markerLabelStyle: {fill: "#999"},
  offsetX: 0,
  offsetY: 0
};
