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
var _merge = require('merge');
var _merge2 = _interopRequireDefault(_merge);
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var _flexboxReact = require('flexbox-react');
var _flexboxReact2 = _interopRequireDefault(_flexboxReact);
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
  symbol: {
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
  },
  label: {
    normal: {
      fontSize: "normal",
      color: "#333"
    },
    highlighted: {
      fontSize: "normal",
      color: "#222"
    },
    selected: {
      fontSize: "normal",
      color: "#333"
    },
    muted: {
      fontSize: "normal",
      color: "#333",
      opacity: 0.4
    }
  },
  value: {
    normal: {
      fontSize: "normal",
      color: "#333"
    },
    highlighted: {
      fontSize: "normal",
      color: "#222"
    },
    selected: {
      fontSize: "normal",
      color: "#333"
    },
    muted: {
      fontSize: "normal",
      color: "#333",
      opacity: 0.4
    }
  }
};
var LegendItem = (function(_React$Component) {
  _inherits(LegendItem, _React$Component);
  function LegendItem() {
    _classCallCheck(this, LegendItem);
    return _possibleConstructorReturn(this, (LegendItem.__proto__ || Object.getPrototypeOf(LegendItem)).apply(this, arguments));
  }
  _createClass(LegendItem, [{
    key: "handleClick",
    value: function handleClick(e, key) {
      e.stopPropagation();
      if (this.props.onSelectionChange) {
        this.props.onSelectionChange(key);
      }
    }
  }, {
    key: "handleHover",
    value: function handleHover(e, key) {
      if (this.props.onHighlightChange) {
        this.props.onHighlightChange(key);
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
    key: "renderLine",
    value: function renderLine(style) {
      var _props = this.props,
          symbolWidth = _props.symbolWidth,
          symbolHeight = _props.symbolHeight;
      return _react2.default.createElement("svg", {
        style: {float: "left"},
        width: symbolWidth,
        height: symbolHeight
      }, _react2.default.createElement("line", {
        style: style,
        x1: 0,
        y1: parseInt(symbolWidth / 2, 10),
        x2: symbolWidth,
        y2: parseInt(symbolWidth / 2, 10),
        stroke: "black",
        strokeWidth: "2"
      }));
    }
  }, {
    key: "renderSwatch",
    value: function renderSwatch(style) {
      var _props2 = this.props,
          symbolWidth = _props2.symbolWidth,
          symbolHeight = _props2.symbolHeight;
      return _react2.default.createElement("svg", {
        style: {float: "left"},
        width: symbolWidth,
        height: symbolHeight
      }, _react2.default.createElement("rect", {
        style: style,
        x: 2,
        y: 2,
        width: symbolWidth - 4,
        height: symbolHeight - 4,
        rx: 2,
        ry: 2
      }));
    }
  }, {
    key: "renderDot",
    value: function renderDot(style) {
      var _props3 = this.props,
          symbolWidth = _props3.symbolWidth,
          symbolHeight = _props3.symbolHeight;
      return _react2.default.createElement("svg", {
        style: {float: "left"},
        width: symbolWidth,
        height: symbolHeight
      }, _react2.default.createElement("ellipse", {
        style: style,
        cx: parseInt(symbolWidth / 2, 10) + 2,
        cy: parseInt(symbolHeight / 2, 10) + 1,
        rx: parseInt(symbolWidth / 2, 10) - 2,
        ry: parseInt(symbolHeight / 2, 10) - 2
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _props4 = this.props,
          symbolStyle = _props4.symbolStyle,
          labelStyle = _props4.labelStyle,
          valueStyle = _props4.valueStyle,
          itemKey = _props4.itemKey;
      var symbol = void 0;
      switch (this.props.type) {
        case "swatch":
          symbol = this.renderSwatch(symbolStyle);
          break;
        case "line":
          symbol = this.renderLine(symbolStyle);
          break;
        case "dot":
          symbol = this.renderDot(symbolStyle);
          break;
        default:
      }
      return _react2.default.createElement(_flexboxReact2.default, {
        flexDirection: "column",
        key: itemKey
      }, _react2.default.createElement("div", {
        onClick: function onClick(e) {
          return _this2.handleClick(e, itemKey);
        },
        onMouseMove: function onMouseMove(e) {
          return _this2.handleHover(e, itemKey);
        },
        onMouseLeave: function onMouseLeave() {
          return _this2.handleHoverLeave();
        }
      }, _react2.default.createElement(_flexboxReact2.default, {flexDirection: "row"}, _react2.default.createElement(_flexboxReact2.default, {width: "20px"}, symbol), _react2.default.createElement(_flexboxReact2.default, {flexDirection: "column"}, _react2.default.createElement(_flexboxReact2.default, null, _react2.default.createElement("div", {style: labelStyle}, this.props.label)), _react2.default.createElement(_flexboxReact2.default, null, _react2.default.createElement("div", {style: valueStyle}, this.props.value))))));
    }
  }]);
  return LegendItem;
})(_react2.default.Component);
var Legend = (function(_React$Component2) {
  _inherits(Legend, _React$Component2);
  function Legend() {
    _classCallCheck(this, Legend);
    return _possibleConstructorReturn(this, (Legend.__proto__ || Object.getPrototypeOf(Legend)).apply(this, arguments));
  }
  _createClass(Legend, [{
    key: "handleClick",
    value: function handleClick(e, key) {
      e.stopPropagation();
      if (this.props.onSelectionChange) {
        this.props.onSelectionChange(key);
      }
    }
  }, {
    key: "handleHover",
    value: function handleHover(e, key) {
      if (this.props.onHighlightChange) {
        this.props.onHighlightChange(key);
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
    key: "providedStyle",
    value: function providedStyle(category) {
      var style = {};
      if (this.props.style) {
        if (this.props.style instanceof _styler.Styler) {
          style = this.props.style.legendStyle(category.key, this.props.type);
        } else if (_underscore2.default.isObject(this.props.style)) {
          style = this.props.style[category.key];
        } else if (_underscore2.default.isFunction(this.props.style)) {
          style = this.props.style(category.key);
        }
      }
      return style;
    }
  }, {
    key: "styleMode",
    value: function styleMode(category) {
      var isHighlighted = this.props.highlight && category.key === this.props.highlight;
      var isSelected = this.props.selection && category.key === this.props.selection;
      var isDisabled = category.disabled;
      var mode = "normal";
      if (this.props.selection) {
        if (isSelected) {
          mode = "selected";
        } else if (isHighlighted) {
          mode = "highlighted";
        } else {
          mode = "muted";
        }
      } else if (isHighlighted) {
        mode = "highlighted";
      } else if (isDisabled) {
        mode = "muted";
      }
      return mode;
    }
  }, {
    key: "symbolStyle",
    value: function symbolStyle(category) {
      var styleMap = this.providedStyle(category, this.props.type);
      var styleMode = this.styleMode(category);
      return (0, _merge2.default)(true, defaultStyle[styleMode], styleMap.symbol[styleMode] ? styleMap.symbol[styleMode] : {});
    }
  }, {
    key: "labelStyle",
    value: function labelStyle(category) {
      var styleMap = this.providedStyle(category);
      var styleMode = this.styleMode(category);
      return (0, _merge2.default)(true, defaultStyle[styleMode], styleMap.label[styleMode] ? styleMap.label[styleMode] : {});
    }
  }, {
    key: "valueStyle",
    value: function valueStyle(category) {
      var styleMap = this.providedStyle(category);
      var styleMode = this.styleMode(category);
      return (0, _merge2.default)(true, defaultStyle[styleMode], styleMap.value[styleMode] ? styleMap.value[styleMode] : {});
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      var _props5 = this.props,
          type = _props5.type,
          symbolWidth = _props5.symbolWidth,
          symbolHeight = _props5.symbolHeight;
      var items = this.props.categories.map(function(category) {
        var key = category.key,
            label = category.label,
            value = category.value;
        var symbolStyle = _this4.symbolStyle(category);
        var labelStyle = _this4.labelStyle(category);
        var valueStyle = _this4.valueStyle(category);
        return _react2.default.createElement(LegendItem, {
          key: key,
          type: type,
          itemKey: key,
          label: label,
          value: value,
          symbolWidth: symbolWidth,
          symbolHeight: symbolHeight,
          symbolStyle: symbolStyle,
          labelStyle: labelStyle,
          valueStyle: valueStyle,
          onSelectionChange: _this4.props.onSelectionChange,
          onHighlightChange: _this4.props.onHighlightChange
        });
      });
      var align = this.props.align === "left" ? "flex-start" : "flex-end";
      return _react2.default.createElement(_flexboxReact2.default, {justifyContent: align}, items);
    }
  }]);
  return Legend;
})(_react2.default.Component);
exports.default = Legend;
Legend.propTypes = {
  type: _propTypes2.default.oneOf(["swatch", "line", "dot"]),
  align: _propTypes2.default.oneOf(["left", "right"]),
  style: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.func, _propTypes2.default.instanceOf(_styler.Styler)]).isRequired,
  categories: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    key: _propTypes2.default.string.isRequired,
    label: _propTypes2.default.string.isRequired,
    disabled: _propTypes2.default.bool,
    style: _propTypes2.default.object,
    labelStyle: _propTypes2.default.object
  })).isRequired,
  symbolWidth: _propTypes2.default.number,
  symbolHeight: _propTypes2.default.number,
  highlight: _propTypes2.default.string,
  selection: _propTypes2.default.string,
  onSelectionChange: _propTypes2.default.func,
  onHighlightChange: _propTypes2.default.func
};
Legend.defaultProps = {
  style: {},
  labelStyle: {},
  type: "swatch",
  align: "left",
  symbolWidth: 16,
  symbolHeight: 16
};
