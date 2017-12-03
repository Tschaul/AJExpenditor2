/* */ 
(function(process) {
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
  var _merge = require('merge');
  var _merge2 = _interopRequireDefault(_merge);
  var _react = require('react');
  var _react2 = _interopRequireDefault(_react);
  var _propTypes = require('prop-types');
  var _propTypes2 = _interopRequireDefault(_propTypes);
  var _pondjs = require('pondjs');
  var _EventMarker = require('./EventMarker');
  var _EventMarker2 = _interopRequireDefault(_EventMarker);
  var _styler = require('../js/styler');
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
      fill: "steelblue",
      opacity: 0.8
    },
    highlighted: {
      fill: "steelblue",
      opacity: 1.0
    },
    selected: {
      fill: "steelblue",
      opacity: 1.0
    },
    muted: {
      fill: "steelblue",
      opacity: 0.4
    }
  };
  var BarChart = (function(_React$Component) {
    _inherits(BarChart, _React$Component);
    function BarChart() {
      _classCallCheck(this, BarChart);
      return _possibleConstructorReturn(this, (BarChart.__proto__ || Object.getPrototypeOf(BarChart)).apply(this, arguments));
    }
    _createClass(BarChart, [{
      key: "handleHover",
      value: function handleHover(e, event, column) {
        var bar = {
          event: event,
          column: column
        };
        if (this.props.onHighlightChange) {
          this.props.onHighlightChange(bar);
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
      value: function handleClick(e, event, column) {
        var bar = {
          event: event,
          column: column
        };
        if (this.props.onSelectionChange) {
          this.props.onSelectionChange(bar);
        }
        e.stopPropagation();
      }
    }, {
      key: "providedStyleMap",
      value: function providedStyleMap(column) {
        var style = {};
        if (this.props.style) {
          if (this.props.style instanceof _styler.Styler) {
            style = this.props.style.barChartStyle()[column];
          } else if (_underscore2.default.isFunction(this.props.style)) {
            style = this.props.style(column);
          } else if (_underscore2.default.isObject(this.props.style)) {
            style = this.props.style ? this.props.style[column] : defaultStyle;
          }
        }
        return style;
      }
    }, {
      key: "style",
      value: function style(column, event) {
        var style = void 0;
        var styleMap = this.providedStyleMap(column);
        var isHighlighted = this.props.highlighted && column === this.props.highlighted.column && _pondjs.Event.is(this.props.highlighted.event, event);
        var isSelected = this.props.selected && column === this.props.selected.column && _pondjs.Event.is(this.props.selected.event, event);
        if (this.props.selected) {
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
          style = (0, _merge2.default)(true, defaultStyle.normal, styleMap.normal ? styleMap.normal : {});
        }
        return style;
      }
    }, {
      key: "renderBars",
      value: function renderBars() {
        var _this2 = this;
        var spacing = +this.props.spacing;
        var offset = +this.props.offset;
        var series = this.props.series;
        var timeScale = this.props.timeScale;
        var yScale = this.props.yScale;
        var columns = this.props.columns || ["value"];
        var bars = [];
        var eventMarker = void 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
          var _loop = function _loop() {
            var event = _step.value;
            var begin = event.begin();
            var end = event.end();
            var beginPos = timeScale(begin) + spacing;
            var endPos = timeScale(end) - spacing;
            var width = void 0;
            if (_this2.props.size) {
              width = _this2.props.size;
            } else {
              width = endPos - beginPos;
            }
            if (width < 1) {
              width = 1;
            }
            var x = void 0;
            if (_this2.props.size) {
              var center = timeScale(begin) + (timeScale(end) - timeScale(begin)) / 2;
              x = center - _this2.props.size / 2 + offset;
            } else {
              x = timeScale(begin) + spacing + offset;
            }
            var yBase = yScale(0);
            var yposPositive = yBase;
            var yposNegative = yBase;
            if (columns) {
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;
              try {
                var _loop2 = function _loop2() {
                  var column = _step2.value;
                  var index = event.index();
                  var key = series.name() + "-" + index + "-" + column;
                  var value = event.get(column);
                  var style = _this2.style(column, event);
                  var height = yScale(0) - yScale(value);
                  var positiveBar = height >= 0;
                  height = Math.max(Math.abs(height), 1);
                  var y = positiveBar ? yposPositive - height : yposNegative;
                  var isHighlighted = _this2.props.highlighted && column === _this2.props.highlighted.column && _pondjs.Event.is(_this2.props.highlighted.event, event);
                  if (isHighlighted && _this2.props.info) {
                    eventMarker = _react2.default.createElement(_EventMarker2.default, _extends({}, _this2.props, {
                      event: event,
                      column: column,
                      offsetX: offset,
                      offsetY: yBase - (positiveBar ? yposPositive : yposNegative)
                    }));
                  }
                  var box = {
                    x: x,
                    y: y,
                    width: width,
                    height: height
                  };
                  var barProps = _extends({key: key}, box, {style: style});
                  if (_this2.props.onSelectionChange) {
                    barProps.onClick = function(e) {
                      return _this2.handleClick(e, event, column);
                    };
                  }
                  if (_this2.props.onHighlightChange) {
                    barProps.onMouseMove = function(e) {
                      return _this2.handleHover(e, event, column);
                    };
                    barProps.onMouseLeave = function() {
                      return _this2.handleHoverLeave();
                    };
                  }
                  bars.push(_react2.default.createElement("rect", barProps));
                  if (positiveBar) {
                    yposPositive -= height;
                  } else {
                    yposNegative += height;
                  }
                };
                for (var _iterator2 = columns[Symbol.iterator](),
                    _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  _loop2();
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
            }
          };
          for (var _iterator = series.events()[Symbol.iterator](),
              _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
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
        return _react2.default.createElement("g", null, bars, eventMarker);
      }
    }, {
      key: "render",
      value: function render() {
        return _react2.default.createElement("g", null, this.renderBars());
      }
    }]);
    return BarChart;
  })(_react2.default.Component);
  exports.default = BarChart;
  BarChart.propTypes = {
    series: _propTypes2.default.instanceOf(_pondjs.TimeSeries).isRequired,
    spacing: _propTypes2.default.number,
    offset: _propTypes2.default.number,
    columns: _propTypes2.default.arrayOf(_propTypes2.default.string),
    style: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.func, _propTypes2.default.instanceOf(_styler.Styler)]),
    info: _propTypes2.default.arrayOf(_propTypes2.default.shape({
      label: _propTypes2.default.string,
      value: _propTypes2.default.string
    })),
    infoStyle: _propTypes2.default.object,
    infoWidth: _propTypes2.default.number,
    infoHeight: _propTypes2.default.number,
    infoTimeFormat: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
    markerRadius: _propTypes2.default.number,
    markerStyle: _propTypes2.default.object,
    size: _propTypes2.default.number,
    selected: _propTypes2.default.shape({
      event: _propTypes2.default.instanceOf(_pondjs.IndexedEvent),
      column: _propTypes2.default.string
    }),
    onSelectionChange: _propTypes2.default.func,
    highlighted: _propTypes2.default.shape({
      event: _propTypes2.default.instanceOf(_pondjs.IndexedEvent),
      column: _propTypes2.default.string
    }),
    onHighlightChange: _propTypes2.default.func,
    timeScale: _propTypes2.default.func,
    yScale: _propTypes2.default.func
  };
  BarChart.defaultProps = {
    columns: ["value"],
    spacing: 1.0,
    offset: 0,
    infoStyle: {
      stroke: "#999",
      fill: "white",
      opacity: 0.90,
      pointerEvents: "none"
    },
    stemStyle: {
      stroke: "#999",
      cursor: "crosshair",
      pointerEvents: "none"
    },
    markerStyle: {fill: "#999"},
    markerRadius: 2,
    infoWidth: 90,
    infoHeight: 30
  };
})(require('process'));
