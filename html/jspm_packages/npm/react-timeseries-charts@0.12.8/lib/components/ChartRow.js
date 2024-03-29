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
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _d3Ease = require('d3-ease');
var _d3Scale = require('d3-scale');
var _Brush = require('./Brush');
var _Brush2 = _interopRequireDefault(_Brush);
var _Charts = require('./Charts');
var _Charts2 = _interopRequireDefault(_Charts);
var _TimeMarker = require('./TimeMarker');
var _TimeMarker2 = _interopRequireDefault(_TimeMarker);
var _YAxis = require('./YAxis');
var _YAxis2 = _interopRequireDefault(_YAxis);
var _interpolators = require('../js/interpolators');
var _interpolators2 = _interopRequireDefault(_interpolators);
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
var AXIS_MARGIN = 5;
function createScale(yaxis, type, min, max, y0, y1) {
  var scale = void 0;
  if (_underscore2.default.isUndefined(min) || _underscore2.default.isUndefined(max)) {
    scale = null;
  } else if (type === "linear") {
    scale = (0, _d3Scale.scaleLinear)().domain([min, max]).range([y0, y1]).nice();
  } else if (type === "log") {
    var base = yaxis.props.logBase || 10;
    scale = (0, _d3Scale.scaleLog)().base(base).domain([min, max]).range([y0, y1]);
  } else if (type === "power") {
    var power = yaxis.props.powerExponent || 2;
    scale = (0, _d3Scale.scalePow)().exponent(power).domain([min, max]).range([y0, y1]);
  }
  return scale;
}
var ChartRow = (function(_React$Component) {
  _inherits(ChartRow, _React$Component);
  function ChartRow(props) {
    _classCallCheck(this, ChartRow);
    var _this = _possibleConstructorReturn(this, (ChartRow.__proto__ || Object.getPrototypeOf(ChartRow)).call(this, props));
    var clipId = _underscore2.default.uniqueId("clip_");
    var clipPathURL = "url(#" + clipId + ")";
    _this.state = {
      clipId: clipId,
      clipPathURL: clipPathURL
    };
    return _this;
  }
  _createClass(ChartRow, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;
      this.scaleMap = {};
      var innerHeight = +this.props.height - AXIS_MARGIN * 2;
      var rangeTop = AXIS_MARGIN;
      var rangeBottom = innerHeight - AXIS_MARGIN;
      _react2.default.Children.forEach(this.props.children, function(child) {
        if ((child.type === _YAxis2.default || _underscore2.default.has(child.props, "min")) && _underscore2.default.has(child.props, "max")) {
          var _child$props = child.props,
              id = _child$props.id,
              max = _child$props.max,
              min = _child$props.min,
              _child$props$transiti = _child$props.transition,
              transition = _child$props$transiti === undefined ? 0 : _child$props$transiti,
              _child$props$type = _child$props.type,
              type = _child$props$type === undefined ? "linear" : _child$props$type;
          var initialScale = createScale(child, type, min, max, rangeBottom, rangeTop);
          _this2.scaleMap[id] = new _interpolators2.default(transition, _d3Ease.easeSinOut, function(s) {
            var yAxisScalerMap = _this2.state.yAxisScalerMap;
            yAxisScalerMap[id] = s;
            _this2.setState(yAxisScalerMap);
          });
          var cacheKey = type + "-" + min + "-" + max + "-" + rangeBottom + "-" + rangeTop;
          _this2.scaleMap[id].setScale(cacheKey, initialScale);
        }
      });
      var scalerMap = {};
      _underscore2.default.forEach(this.scaleMap, function(interpolator, id) {
        scalerMap[id] = interpolator.scaler();
      });
      this.setState({yAxisScalerMap: scalerMap});
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;
      var innerHeight = +nextProps.height - AXIS_MARGIN * 2;
      var rangeTop = AXIS_MARGIN;
      var rangeBottom = innerHeight - AXIS_MARGIN;
      _react2.default.Children.forEach(nextProps.children, function(child) {
        if ((child.type === _YAxis2.default || _underscore2.default.has(child.props, "min")) && _underscore2.default.has(child.props, "max")) {
          var _child$props2 = child.props,
              id = _child$props2.id,
              max = _child$props2.max,
              min = _child$props2.min,
              _child$props2$transit = _child$props2.transition,
              transition = _child$props2$transit === undefined ? 0 : _child$props2$transit,
              _child$props2$type = _child$props2.type,
              type = _child$props2$type === undefined ? "linear" : _child$props2$type;
          var scale = createScale(child, type, min, max, rangeBottom, rangeTop);
          if (!_underscore2.default.has(_this3.scaleMap, id)) {
            _this3.scaleMap[id] = new _interpolators2.default(transition, _d3Ease.easeSinOut, function(s) {
              var yAxisScalerMap = _this3.state.yAxisScalerMap;
              yAxisScalerMap[id] = s;
              _this3.setState(yAxisScalerMap);
            });
          }
          var cacheKey = type + "-" + min + "-" + max + "-" + rangeBottom + "-" + rangeTop;
          _this3.scaleMap[id].setScale(cacheKey, scale);
        }
      });
      var scalerMap = {};
      _underscore2.default.forEach(this.scaleMap, function(interpolator, id) {
        scalerMap[id] = interpolator.scaler();
      });
      this.setState({yAxisScalerMap: scalerMap});
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      var axes = [];
      var chartList = [];
      var innerHeight = +this.props.height - AXIS_MARGIN * 2;
      var yAxisMap = {};
      var leftAxisList = [];
      var rightAxisList = [];
      var alignLeft = true;
      _react2.default.Children.forEach(this.props.children, function(child) {
        if (child.type === _Charts2.default) {
          alignLeft = false;
        } else {
          var _id = child.props.id;
          if ((child.type === _YAxis2.default || _underscore2.default.has(child.props, "min")) && _underscore2.default.has(child.props, "max")) {
            var yaxis = child;
            if (yaxis.props.id) {
              yAxisMap[yaxis.props.id] = yaxis;
            }
            if (alignLeft) {
              leftAxisList.push(_id);
            } else {
              rightAxisList.push(_id);
            }
          }
        }
      });
      leftAxisList.reverse();
      var transform = void 0;
      var id = void 0;
      var props = void 0;
      var axis = void 0;
      var posx = 0;
      var leftWidth = _underscore2.default.reduce(this.props.leftAxisWidths, function(a, b) {
        return a + b;
      }, 0);
      var rightWidth = _underscore2.default.reduce(this.props.rightAxisWidths, function(a, b) {
        return a + b;
      }, 0);
      posx = leftWidth;
      for (var leftColumnIndex = 0; leftColumnIndex < this.props.leftAxisWidths.length; leftColumnIndex += 1) {
        var colWidth = this.props.leftAxisWidths[leftColumnIndex];
        posx -= colWidth;
        if (leftColumnIndex < leftAxisList.length) {
          id = leftAxisList[leftColumnIndex];
          transform = "translate(" + posx + ",0)";
          props = {
            width: colWidth,
            height: innerHeight,
            align: "left",
            scale: this.scaleMap[id].latestScale()
          };
          axis = _react2.default.cloneElement(yAxisMap[id], props);
          axes.push(_react2.default.createElement("g", {
            key: "y-axis-left-" + leftColumnIndex,
            transform: transform
          }, axis));
        }
      }
      posx = this.props.width - rightWidth;
      for (var rightColumnIndex = 0; rightColumnIndex < this.props.rightAxisWidths.length; rightColumnIndex += 1) {
        var _colWidth = this.props.rightAxisWidths[rightColumnIndex];
        if (rightColumnIndex < rightAxisList.length) {
          id = rightAxisList[rightColumnIndex];
          transform = "translate(" + posx + ",0)";
          props = {
            width: _colWidth,
            height: innerHeight,
            align: "right",
            scale: this.scaleMap[id].latestScale()
          };
          axis = _react2.default.cloneElement(yAxisMap[id], props);
          axes.push(_react2.default.createElement("g", {
            key: "y-axis-right-" + rightColumnIndex,
            transform: transform
          }, axis));
        }
        posx += _colWidth;
      }
      var chartWidth = this.props.width - leftWidth - rightWidth;
      var chartTransform = "translate(" + leftWidth + ",0)";
      var keyCount = 0;
      _react2.default.Children.forEach(this.props.children, function(child) {
        if (child.type === _Charts2.default) {
          var _charts = child;
          _react2.default.Children.forEach(_charts.props.children, function(chart) {
            var scale = null;
            if (_underscore2.default.has(_this4.state.yAxisScalerMap, chart.props.axis)) {
              scale = _this4.state.yAxisScalerMap[chart.props.axis];
            }
            var ytransition = null;
            if (_underscore2.default.has(_this4.scaleMap, chart.props.axis)) {
              ytransition = _this4.scaleMap[chart.props.axis];
            }
            var chartProps = {
              key: keyCount,
              width: chartWidth,
              height: innerHeight,
              timeScale: _this4.props.timeScale,
              timeFormat: _this4.props.timeFormat
            };
            if (scale) {
              chartProps.yScale = scale;
            }
            if (ytransition) {
              chartProps.transition = ytransition;
            }
            chartList.push(_react2.default.cloneElement(chart, chartProps));
            keyCount += 1;
          });
        }
      });
      var brushList = [];
      keyCount = 0;
      _react2.default.Children.forEach(this.props.children, function(child) {
        if (child.type === _Brush2.default) {
          var brushProps = {
            key: "brush-" + keyCount,
            width: chartWidth,
            height: innerHeight,
            timeScale: _this4.props.timeScale
          };
          brushList.push(_react2.default.cloneElement(child, brushProps));
        }
        keyCount += 1;
      });
      var charts = _react2.default.createElement("g", {
        transform: chartTransform,
        key: "event-rect-group"
      }, _react2.default.createElement("g", {
        key: "charts",
        clipPath: this.state.clipPathURL
      }, chartList));
      var clipper = _react2.default.createElement("defs", null, _react2.default.createElement("clipPath", {id: this.state.clipId}, _react2.default.createElement("rect", {
        x: "0",
        y: "0",
        width: chartWidth,
        height: innerHeight
      })));
      var brushes = _react2.default.createElement("g", {
        transform: chartTransform,
        key: "brush-group"
      }, brushList);
      var tracker = void 0;
      if (this.props.trackerTime) {
        var timeFormat = this.props.trackerTimeFormat || this.props.timeFormat;
        var timeMarkerProps = {
          timeFormat: timeFormat,
          showLine: false,
          showTime: this.props.trackerShowTime,
          time: this.props.trackerTime,
          timeScale: this.props.timeScale,
          width: chartWidth
        };
        if (this.props.trackerInfoValues) {
          timeMarkerProps.infoWidth = this.props.trackerInfoWidth;
          timeMarkerProps.infoHeight = this.props.trackerInfoHeight;
          timeMarkerProps.infoValues = this.props.trackerInfoValues;
          timeMarkerProps.timeFormat = this.props.trackerTimeFormat;
        }
        var trackerStyle = {pointerEvents: "none"};
        var trackerTransform = "translate(" + leftWidth + ",0)";
        tracker = _react2.default.createElement("g", {
          key: "tracker-group",
          style: trackerStyle,
          transform: trackerTransform
        }, _react2.default.createElement(_TimeMarker2.default, timeMarkerProps));
      }
      return _react2.default.createElement("g", null, clipper, axes, charts, brushes, tracker);
    }
  }]);
  return ChartRow;
})(_react2.default.Component);
exports.default = ChartRow;
ChartRow.defaultProps = {
  trackerTimeFormat: "%b %d %Y %X",
  enablePanZoom: false,
  height: 100
};
ChartRow.propTypes = {
  height: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.node), _propTypes2.default.node]),
  leftAxisWidths: _propTypes2.default.arrayOf(_propTypes2.default.number),
  rightAxisWidths: _propTypes2.default.arrayOf(_propTypes2.default.number),
  width: _propTypes2.default.number,
  timeScale: _propTypes2.default.func,
  trackerTimeFormat: _propTypes2.default.string,
  timeFormat: _propTypes2.default.string,
  trackerTime: _propTypes2.default.instanceOf(Date),
  trackerShowTime: _propTypes2.default.bool,
  trackerInfoWidth: _propTypes2.default.number,
  trackerInfoHeight: _propTypes2.default.number,
  trackerInfoValues: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.shape({
    label: _propTypes2.default.string,
    value: _propTypes2.default.string
  }))])
};
