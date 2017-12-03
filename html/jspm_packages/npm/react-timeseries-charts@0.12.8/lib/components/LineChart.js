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
var _d3Shape = require('d3-shape');
var _merge = require('merge');
var _merge2 = _interopRequireDefault(_merge);
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var _pondjs = require('pondjs');
var _styler = require('../js/styler');
var _util = require('../js/util');
var _curve = require('../js/curve');
var _curve2 = _interopRequireDefault(_curve);
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
var defaultStyle = {
  normal: {
    stroke: "steelblue",
    fill: "none",
    strokeWidth: 1
  },
  highlighted: {
    stroke: "#5a98cb",
    fill: "none",
    strokeWidth: 1
  },
  selected: {
    stroke: "steelblue",
    fill: "none",
    strokeWidth: 2
  },
  muted: {
    stroke: "steelblue",
    fill: "none",
    opacity: 0.4,
    strokeWidth: 1
  }
};
var LineChart = (function(_React$Component) {
  _inherits(LineChart, _React$Component);
  function LineChart() {
    _classCallCheck(this, LineChart);
    return _possibleConstructorReturn(this, (LineChart.__proto__ || Object.getPrototypeOf(LineChart)).apply(this, arguments));
  }
  _createClass(LineChart, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var newSeries = nextProps.series;
      var oldSeries = this.props.series;
      var width = nextProps.width;
      var timeScale = nextProps.timeScale;
      var yScale = nextProps.yScale;
      var interpolation = nextProps.interpolation;
      var highlight = nextProps.highlight;
      var selection = nextProps.selection;
      var columns = nextProps.columns;
      var widthChanged = this.props.width !== width;
      var timeScaleChanged = (0, _util.scaleAsString)(this.props.timeScale) !== (0, _util.scaleAsString)(timeScale);
      var yAxisScaleChanged = this.props.yScale !== yScale;
      var interpolationChanged = this.props.interpolation !== interpolation;
      var highlightChanged = this.props.highlight !== highlight;
      var selectionChanged = this.props.selection !== selection;
      var columnsChanged = this.props.columns !== columns;
      var seriesChanged = false;
      if (oldSeries.length !== newSeries.length) {
        seriesChanged = true;
      } else {
        seriesChanged = !_pondjs.TimeSeries.is(oldSeries, newSeries);
      }
      return widthChanged || seriesChanged || timeScaleChanged || yAxisScaleChanged || interpolationChanged || highlightChanged || selectionChanged || columnsChanged;
    }
  }, {
    key: "handleHover",
    value: function handleHover(e, column) {
      if (this.props.onHighlightChange) {
        this.props.onHighlightChange(column);
      }
    }
  }, {
    key: "handleHoverLeave",
    value: function handleHoverLeave() {
      if (this.props.onHighlightChange) {
        this.props.onHighlightChange(null);
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(e, column) {
      e.stopPropagation();
      if (this.props.onSelectionChange) {
        this.props.onSelectionChange(column);
      }
    }
  }, {
    key: "providedPathStyleMap",
    value: function providedPathStyleMap(column) {
      var style = {};
      if (this.props.style) {
        if (this.props.style instanceof _styler.Styler) {
          style = this.props.style.lineChartStyle()[column];
        } else if (_underscore2.default.isObject(this.props.style)) {
          style = this.props.style[column];
        } else if (_underscore2.default.isFunction(this.props.style)) {
          style = this.props.style(column);
        }
      }
      return style;
    }
  }, {
    key: "pathStyle",
    value: function pathStyle(column) {
      var style = void 0;
      var styleMap = this.providedPathStyleMap(column);
      var isHighlighted = this.props.highlight && column === this.props.highlight;
      var isSelected = this.props.selection && column === this.props.selection;
      if (this.props.selection) {
        if (isSelected) {
          style = (0, _merge2.default)(true, defaultStyle.selected, styleMap.selected ? styleMap.selected : {});
        } else if (isHighlighted) {
          style = (0, _merge2.default)(true, defaultStyle.highlighted, styleMap.highlighted ? styleMap.highlighted : {});
        } else {
          style = (0, _merge2.default)(true, defaultStyle.muted, styleMap.muted ? styleMap.muted : {});
        }
      } else if (isHighlighted) {
        style = (0, _merge2.default)(true, defaultStyle.highlighted, styleMap.highlighted ? styleMap.highlighted : {});
      } else {
        style = (0, _merge2.default)(true, defaultStyle.normal, styleMap.normal);
      }
      style.pointerEvents = "none";
      return style;
    }
  }, {
    key: "renderPath",
    value: function renderPath(data, column, key) {
      var _this2 = this;
      var hitStyle = {
        stroke: "white",
        fill: "none",
        opacity: 0.0,
        strokeWidth: 7,
        cursor: "crosshair",
        pointerEvents: "stroke"
      };
      var path = (0, _d3Shape.line)().curve(_curve2.default[this.props.interpolation]).x(function(d) {
        return _this2.props.timeScale(d.x);
      }).y(function(d) {
        return _this2.props.yScale(d.y);
      })(data);
      return _react2.default.createElement("g", {key: key}, _react2.default.createElement("path", {
        d: path,
        style: this.pathStyle(column)
      }), _react2.default.createElement("path", {
        d: path,
        style: hitStyle,
        onClick: function onClick(e) {
          return _this2.handleClick(e, column);
        },
        onMouseLeave: function onMouseLeave() {
          return _this2.handleHoverLeave();
        },
        onMouseMove: function onMouseMove(e) {
          return _this2.handleHover(e, column);
        }
      }));
    }
  }, {
    key: "renderLines",
    value: function renderLines() {
      var _this3 = this;
      return _underscore2.default.map(this.props.columns, function(column) {
        return _this3.renderLine(column);
      });
    }
  }, {
    key: "renderLine",
    value: function renderLine(column) {
      var pathLines = [];
      var count = 1;
      if (this.props.breakLine) {
        var currentPoints = null;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
          for (var _iterator = this.props.series.events()[Symbol.iterator](),
              _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var d = _step.value;
            var timestamp = new Date(d.begin().getTime() + (d.end().getTime() - d.begin().getTime()) / 2);
            var value = d.get(column);
            var badPoint = _underscore2.default.isNull(value) || _underscore2.default.isNaN(value) || !_underscore2.default.isFinite(value);
            if (!badPoint) {
              if (!currentPoints)
                currentPoints = [];
              currentPoints.push({
                x: timestamp,
                y: value
              });
            } else if (currentPoints) {
              if (currentPoints.length > 1) {
                pathLines.push(this.renderPath(currentPoints, column, count));
                count += 1;
              }
              currentPoints = null;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
        if (currentPoints && currentPoints.length > 1) {
          pathLines.push(this.renderPath(currentPoints, column, count));
          count += 1;
        }
      } else {
        var cleanedPoints = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;
        try {
          for (var _iterator2 = this.props.series.events()[Symbol.iterator](),
              _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _d = _step2.value;
            var _timestamp = new Date(_d.begin().getTime() + (_d.end().getTime() - _d.begin().getTime()) / 2);
            var _value = _d.get(column);
            var _badPoint = _underscore2.default.isNull(_value) || _underscore2.default.isNaN(_value) || !_underscore2.default.isFinite(_value);
            if (!_badPoint) {
              cleanedPoints.push({
                x: _timestamp,
                y: _value
              });
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
        pathLines.push(this.renderPath(cleanedPoints, column, count));
        count += 1;
      }
      return _react2.default.createElement("g", {key: column}, pathLines);
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement("g", null, this.renderLines());
    }
  }]);
  return LineChart;
})(_react2.default.Component);
exports.default = LineChart;
LineChart.propTypes = {
  series: _propTypes2.default.instanceOf(_pondjs.TimeSeries).isRequired,
  axis: _propTypes2.default.string.isRequired,
  columns: _propTypes2.default.arrayOf(_propTypes2.default.string),
  style: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.func, _propTypes2.default.instanceOf(_styler.Styler)]),
  interpolation: _propTypes2.default.oneOf(["curveBasis", "curveBasisOpen", "curveBundle", "curveCardinal", "curveCardinalOpen", "curveCatmullRom", "curveCatmullRomOpen", "curveLinear", "curveMonotoneX", "curveMonotoneY", "curveNatural", "curveRadial", "curveStep", "curveStepAfter", "curveStepBefore"]),
  breakLine: _propTypes2.default.bool,
  selection: _propTypes2.default.string,
  onSelectionChange: _propTypes2.default.func,
  highlight: _propTypes2.default.string,
  onHighlightChange: _propTypes2.default.func,
  timeScale: _propTypes2.default.func,
  yScale: _propTypes2.default.func,
  width: _propTypes2.default.number
};
LineChart.defaultProps = {
  columns: ["value"],
  smooth: true,
  interpolation: "curveLinear",
  breakLine: true
};
