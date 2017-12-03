/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
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
var _invariant = require('invariant');
var _invariant2 = _interopRequireDefault(_invariant);
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var _d3Scale = require('d3-scale');
var _pondjs = require('pondjs');
var _Brush = require('./Brush');
var _Brush2 = _interopRequireDefault(_Brush);
var _ChartRow = require('./ChartRow');
var _ChartRow2 = _interopRequireDefault(_ChartRow);
var _Charts = require('./Charts');
var _Charts2 = _interopRequireDefault(_Charts);
var _EventHandler = require('./EventHandler');
var _EventHandler2 = _interopRequireDefault(_EventHandler);
var _TimeAxis = require('./TimeAxis');
var _TimeAxis2 = _interopRequireDefault(_TimeAxis);
var _TimeMarker = require('./TimeMarker');
var _TimeMarker2 = _interopRequireDefault(_TimeMarker);
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
var defaultTimeAxisStyle = {
  labels: {
    labelColor: "#8B7E7E",
    labelWeight: 100,
    labelSize: 11
  },
  axis: {
    axisColor: "#C0C0C0",
    axisWidth: 1
  }
};
var ChartContainer = (function(_React$Component) {
  _inherits(ChartContainer, _React$Component);
  function ChartContainer() {
    _classCallCheck(this, ChartContainer);
    return _possibleConstructorReturn(this, (ChartContainer.__proto__ || Object.getPrototypeOf(ChartContainer)).apply(this, arguments));
  }
  _createClass(ChartContainer, [{
    key: "handleTrackerChanged",
    value: function handleTrackerChanged(t) {
      if (this.props.onTrackerChanged) {
        this.props.onTrackerChanged(t);
      }
    }
  }, {
    key: "handleTimeRangeChanged",
    value: function handleTimeRangeChanged(timerange) {
      if (this.props.onTimeRangeChanged) {
        this.props.onTimeRangeChanged(timerange);
      }
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(t) {
      if (this.props.onTrackerChanged) {
        this.props.onTrackerChanged(t);
      }
    }
  }, {
    key: "handleMouseOut",
    value: function handleMouseOut() {
      if (this.props.onTrackerChanged) {
        this.props.onTrackerChanged(null);
      }
    }
  }, {
    key: "handleBackgroundClick",
    value: function handleBackgroundClick() {
      if (this.props.onBackgroundClick) {
        this.props.onBackgroundClick();
      }
    }
  }, {
    key: "handleZoom",
    value: function handleZoom(timerange) {
      if (this.props.onTimeRangeChanged) {
        this.props.onTimeRangeChanged(timerange);
      }
    }
  }, {
    key: "handleResize",
    value: function handleResize(width, height) {
      if (this.props.onChartResize) {
        this.props.onChartResize(width, height);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var chartRows = [];
      var leftAxisWidths = [];
      var rightAxisWidths = [];
      _react2.default.Children.forEach(this.props.children, function(childRow) {
        if (childRow.type === _ChartRow2.default) {
          var countLeft = 0;
          var countCharts = 0;
          var align = "left";
          _react2.default.Children.forEach(childRow.props.children, function(child) {
            if (child.type === _Charts2.default) {
              countCharts += 1;
              align = "right";
            } else if (child.type !== _Brush2.default) {
              if (align === "left") {
                countLeft += 1;
              }
            }
          });
          if (countCharts !== 1) {
            var msg = "ChartRow should have one and only one <Charts> tag within it";
            (0, _invariant2.default)(false, msg, childRow.constructor.name);
          }
          align = "left";
          var pos = countLeft - 1;
          _react2.default.Children.forEach(childRow.props.children, function(child) {
            if (child.type === _Charts2.default || child.type === _Brush2.default) {
              if (child.type === _Charts2.default) {
                align = "right";
                pos = 0;
              }
            } else {
              var width = Number(child.props.width) || 40;
              if (align === "left") {
                leftAxisWidths[pos] = leftAxisWidths[pos] ? Math.max(width, leftAxisWidths[pos]) : width;
                pos -= 1;
              } else if (align === "right") {
                rightAxisWidths[pos] = rightAxisWidths[pos] ? Math.max(width, rightAxisWidths[pos]) : width;
                pos += 1;
              }
            }
          });
        }
      });
      var leftWidth = _underscore2.default.reduce(leftAxisWidths, function(a, b) {
        return a + b;
      }, 0);
      var rightWidth = _underscore2.default.reduce(rightAxisWidths, function(a, b) {
        return a + b;
      }, 0);
      var timeAxisHeight = 35;
      var timeAxisWidth = this.props.width - leftWidth - rightWidth;
      if (!this.props.timeRange) {
        throw Error("Invalid timerange passed to ChartContainer");
      }
      var timeScale = this.props.utc ? (0, _d3Scale.scaleUtc)().domain(this.props.timeRange.toJSON()).range([0, timeAxisWidth]) : (0, _d3Scale.scaleTime)().domain(this.props.timeRange.toJSON()).range([0, timeAxisWidth]);
      var i = 0;
      var yPosition = 0;
      _react2.default.Children.forEach(this.props.children, function(child) {
        if (child.type === _ChartRow2.default) {
          var chartRow = child;
          var rowKey = "chart-row-row-" + i;
          var firstRow = i === 0;
          var props = {
            timeScale: timeScale,
            leftAxisWidths: leftAxisWidths,
            rightAxisWidths: rightAxisWidths,
            width: _this2.props.width,
            minTime: _this2.props.minTime,
            maxTime: _this2.props.maxTime,
            transition: _this2.props.transition,
            enablePanZoom: _this2.props.enablePanZoom,
            minDuration: _this2.props.minDuration,
            timeFormat: _this2.props.format,
            trackerShowTime: firstRow,
            trackerTime: _this2.props.trackerPosition,
            trackerTimeFormat: _this2.props.format,
            onTimeRangeChanged: function onTimeRangeChanged(tr) {
              return _this2.handleTimeRangeChanged(tr);
            },
            onTrackerChanged: function onTrackerChanged(t) {
              return _this2.handleTrackerChanged(t);
            }
          };
          var transform = "translate(" + -leftWidth + "," + yPosition + ")";
          chartRows.push(_react2.default.createElement("g", {
            transform: transform,
            key: rowKey
          }, _react2.default.cloneElement(chartRow, props)));
          yPosition += parseInt(child.props.height, 10);
        }
        i += 1;
      });
      var chartsHeight = yPosition;
      var chartsWidth = this.props.width - leftWidth - rightWidth;
      var tracker = void 0;
      if (this.props.trackerPosition && this.props.timeRange.contains(this.props.trackerPosition)) {
        tracker = _react2.default.createElement("g", {
          key: "tracker-group",
          style: {pointerEvents: "none"},
          transform: "translate(" + leftWidth + ",0)"
        }, _react2.default.createElement(_TimeMarker2.default, {
          width: chartsWidth,
          height: chartsHeight,
          showInfoBox: false,
          time: this.props.trackerPosition,
          timeScale: timeScale,
          timeFormat: this.props.format,
          infoWidth: this.props.trackerHintWidth,
          infoHeight: this.props.trackerHintHeight,
          info: this.props.trackerValues
        }));
      }
      var xStyle = {
        stroke: this.props.timeAxisStyle.axis.axisColor,
        strokeWidth: this.props.timeAxisStyle.axis.axisWidth,
        fill: "none",
        pointerEvents: "none"
      };
      var timeAxis = _react2.default.createElement("g", {transform: "translate(" + leftWidth + "," + chartsHeight + ")"}, _react2.default.createElement("line", {
        x1: -leftWidth,
        y1: 0.5,
        x2: this.props.width,
        y2: 0.5,
        style: xStyle
      }), _react2.default.createElement(_TimeAxis2.default, {
        scale: timeScale,
        utc: this.props.utc,
        style: this.props.timeAxisStyle,
        format: this.props.format,
        showGrid: this.props.showGrid,
        gridHeight: chartsHeight
      }));
      var rows = _react2.default.createElement("g", {transform: "translate(" + leftWidth + "," + 0 + ")"}, _react2.default.createElement(_EventHandler2.default, {
        key: "event-handler",
        width: chartsWidth,
        height: chartsHeight + timeAxisHeight,
        scale: timeScale,
        enablePanZoom: this.props.enablePanZoom,
        minDuration: this.props.minDuration,
        minTime: this.props.minTime,
        maxTime: this.props.maxTime,
        onMouseOut: function onMouseOut(e) {
          return _this2.handleMouseOut(e);
        },
        onMouseMove: function onMouseMove(e) {
          return _this2.handleMouseMove(e);
        },
        onMouseClick: function onMouseClick(e) {
          return _this2.handleBackgroundClick(e);
        },
        onZoom: function onZoom(tr) {
          return _this2.handleZoom(tr);
        },
        onResize: function onResize(width, height) {
          return _this2.handleResize(width, height);
        }
      }, chartRows));
      var svgWidth = this.props.width;
      var svgHeight = yPosition + timeAxisHeight;
      return this.props.showGridPosition === "over" ? _react2.default.createElement("svg", {
        width: svgWidth,
        height: svgHeight,
        style: {display: "block"}
      }, rows, tracker, timeAxis) : _react2.default.createElement("svg", {
        width: svgWidth,
        height: svgHeight,
        style: {display: "block"}
      }, timeAxis, rows, tracker);
    }
  }]);
  return ChartContainer;
})(_react2.default.Component);
exports.default = ChartContainer;
ChartContainer.propTypes = {
  timeRange: _propTypes2.default.instanceOf(_pondjs.TimeRange).isRequired,
  utc: _propTypes2.default.bool,
  children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.element), _propTypes2.default.element]).isRequired,
  width: _propTypes2.default.number,
  minTime: _propTypes2.default.instanceOf(Date),
  maxTime: _propTypes2.default.instanceOf(Date),
  enablePanZoom: _propTypes2.default.bool,
  minDuration: _propTypes2.default.number,
  format: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  transition: _propTypes2.default.number,
  showGrid: _propTypes2.default.bool,
  showGridPosition: _propTypes2.default.oneOf(["over", "under"]),
  timeAxisStyle: _propTypes2.default.shape({
    labels: _propTypes2.default.object,
    axis: _propTypes2.default.object
  }),
  trackerHintWidth: _propTypes2.default.number,
  trackerHintHeight: _propTypes2.default.number,
  trackerValues: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.shape({
    label: _propTypes2.default.string,
    value: _propTypes2.default.string
  }))]),
  trackerPosition: _propTypes2.default.instanceOf(Date),
  onTrackerChanged: _propTypes2.default.func,
  onTimeRangeChanged: _propTypes2.default.func,
  onChartResize: _propTypes2.default.func,
  onBackgroundClick: _propTypes2.default.func
};
ChartContainer.defaultProps = {
  width: 800,
  padding: 0,
  enablePanZoom: false,
  utc: false,
  showGrid: false,
  showGridPosition: "over",
  timeAxisStyle: defaultTimeAxisStyle
};
