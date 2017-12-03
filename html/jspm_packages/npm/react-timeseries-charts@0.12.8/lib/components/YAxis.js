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
require('d3-transition');
var _merge = require('merge');
var _merge2 = _interopRequireDefault(_merge);
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactDom = require('react-dom');
var _reactDom2 = _interopRequireDefault(_reactDom);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var _d3Axis = require('d3-axis');
var _d3Ease = require('d3-ease');
var _d3Format = require('d3-format');
var _d3Selection = require('d3-selection');
var _util = require('../js/util');
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
var MARGIN = 0;
var defaultStyle = {
  labels: {
    labelColor: "#8B7E7E",
    labelWeight: 100,
    labelSize: 11
  },
  axis: {axisColor: "#C0C0C0"}
};
var YAxis = (function(_React$Component) {
  _inherits(YAxis, _React$Component);
  function YAxis() {
    _classCallCheck(this, YAxis);
    return _possibleConstructorReturn(this, (YAxis.__proto__ || Object.getPrototypeOf(YAxis)).apply(this, arguments));
  }
  _createClass(YAxis, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.renderAxis(this.props.align, this.props.scale, +this.props.width, this.props.absolute, this.props.format);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var scale = nextProps.scale;
      var align = nextProps.align;
      var width = nextProps.width;
      var absolute = nextProps.absolute;
      var fmt = nextProps.format;
      var type = nextProps.type;
      if ((0, _util.scaleAsString)(this.props.scale) !== (0, _util.scaleAsString)(scale) || this.props.type !== nextProps.type) {
        this.updateAxis(align, scale, width, absolute, type, fmt);
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate() {
      return false;
    }
  }, {
    key: "updateAxis",
    value: function updateAxis(align, scale, width, absolute, type, fmt) {
      var yformat = (0, _d3Format.format)(fmt);
      var axis = align === "left" ? _d3Axis.axisLeft : _d3Axis.axisRight;
      var axisStyle = (0, _merge2.default)(true, defaultStyle.axis, this.props.style.axis ? this.props.style.axis : {});
      var axisColor = axisStyle.axisColor;
      var axisGenerator = void 0;
      if (type === "linear" || type === "power") {
        if (this.props.height <= 200) {
          axisGenerator = axis(scale).ticks(5).tickFormat(function(d) {
            if (absolute) {
              return yformat(Math.abs(d));
            }
            return yformat(d);
          });
        } else {
          axisGenerator = axis(scale).tickFormat(function(d) {
            if (absolute) {
              return yformat(Math.abs(d));
            }
            return yformat(d);
          });
        }
      } else if (type === "log") {
        axisGenerator = axis(scale).ticks(10, ".2s");
      }
      (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).select(".yaxis").transition().duration(this.props.transition).ease(_d3Ease.easeSinOut).call(axisGenerator);
      (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).select("g").selectAll(".tick").select("text").style("fill", axisColor).style("stroke", "none");
      (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).select("g").selectAll(".tick").select("line").style("stroke", axisColor);
    }
  }, {
    key: "renderAxis",
    value: function renderAxis(align, scale, width, absolute, fmt) {
      var yformat = (0, _d3Format.format)(fmt);
      var axisGenerator = void 0;
      var axis = align === "left" ? _d3Axis.axisLeft : _d3Axis.axisRight;
      if (this.props.type === "linear" || this.props.type === "power") {
        if (this.props.height <= 200) {
          if (this.props.tickCount > 0) {
            axisGenerator = axis(scale).ticks(this.props.tickCount).tickFormat(function(d) {
              if (absolute) {
                return yformat(Math.abs(d));
              }
              return yformat(d);
            }).tickSizeOuter(0);
          } else {
            axisGenerator = axis(scale).ticks(5).tickFormat(function(d) {
              if (absolute) {
                return yformat(Math.abs(d));
              }
              return yformat(d);
            }).tickSizeOuter(0);
          }
        } else {
          axisGenerator = axis(scale).tickFormat(function(d) {
            if (absolute) {
              return yformat(Math.abs(d));
            }
            return yformat(d);
          }).tickSizeOuter(0);
        }
      } else if (this.props.type === "log") {
        axisGenerator = axis().scale(scale).ticks(10, ".2s").tickSizeOuter(0);
      }
      (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).selectAll("*").remove();
      var x = align === "left" ? width - MARGIN : 0;
      var labelOffset = align === "left" ? this.props.labelOffset - 50 : 40 + this.props.labelOffset;
      var labelStyle = (0, _merge2.default)(true, defaultStyle.labels, this.props.style.labels ? this.props.style.labels : {});
      var axisStyle = (0, _merge2.default)(true, defaultStyle.axis, this.props.style.axis ? this.props.style.axis : {});
      var axisColor = axisStyle.axisColor;
      var labelColor = labelStyle.labelColor,
          labelWeight = labelStyle.labelWeight,
          labelSize = labelStyle.labelSize;
      this.axis = (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).append("g").attr("transform", "translate(" + x + ",0)").style("stroke", "none").attr("class", "yaxis").style("fill", labelColor).style("font-weight", labelWeight).style("font-size", labelSize).call(axisGenerator).append("text").text(this.props.label).attr("transform", "rotate(-90)").attr("y", labelOffset).attr("dy", ".71em").attr("text-anchor", "end").style("fill", this.props.style.labelColor).style("font-family", this.props.style.labelFont || '"Goudy Bookletter 1911", sans-serif"').style("font-weight", this.props.style.labelWeight || 100).style("font-size", this.props.style.labelSize ? this.props.style.width + "px" : "12px");
      (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).select("g").selectAll(".tick").select("text").style("fill", axisColor).style("stroke", "none");
      (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).select("g").selectAll(".tick").select("line").style("stroke", axisColor);
      (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).select("g").select("path").style("fill", "none").style("stroke", axisColor);
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement("g", null);
    }
  }]);
  return YAxis;
})(_react2.default.Component);
exports.default = YAxis;
YAxis.defaultProps = {
  id: "yaxis",
  align: "left",
  min: 0,
  max: 1,
  type: "linear",
  absolute: false,
  format: ".2s",
  labelOffset: 0,
  transition: 100,
  width: 80,
  style: defaultStyle
};
YAxis.propTypes = {
  id: _propTypes2.default.string.isRequired,
  label: _propTypes2.default.string,
  type: _propTypes2.default.oneOf(["linear", "power", "log"]),
  min: _propTypes2.default.number.isRequired,
  max: _propTypes2.default.number.isRequired,
  absolute: _propTypes2.default.bool,
  style: _propTypes2.default.shape({
    labels: _propTypes2.default.object,
    axis: _propTypes2.default.object,
    labelColor: _propTypes2.default.string,
    labelFont: _propTypes2.default.string,
    labelWeight: _propTypes2.default.string,
    labelSize: _propTypes2.default.string,
    width: _propTypes2.default.number
  }),
  transition: _propTypes2.default.number,
  width: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  labelOffset: _propTypes2.default.number,
  format: _propTypes2.default.string,
  align: _propTypes2.default.string,
  scale: _propTypes2.default.func,
  height: _propTypes2.default.number,
  tickCount: _propTypes2.default.number
};
