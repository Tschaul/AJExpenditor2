/* */ 
'use strict';
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
var _createClass = function() {
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
}();
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var _Portal = require('./Portal');
var _Portal2 = _interopRequireDefault(_Portal);
var _Position = require('./Position');
var _Position2 = _interopRequireDefault(_Position);
var _RootCloseWrapper = require('./RootCloseWrapper');
var _RootCloseWrapper2 = _interopRequireDefault(_RootCloseWrapper);
var _elementType = require('react-prop-types/lib/elementType');
var _elementType2 = _interopRequireDefault(_elementType);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0)
      continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i))
      continue;
    target[i] = obj[i];
  }
  return target;
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
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var Overlay = function(_React$Component) {
  _inherits(Overlay, _React$Component);
  function Overlay(props, context) {
    _classCallCheck(this, Overlay);
    var _this = _possibleConstructorReturn(this, (Overlay.__proto__ || Object.getPrototypeOf(Overlay)).call(this, props, context));
    _this.handleHidden = function() {
      _this.setState({exited: true});
      if (_this.props.onExited) {
        var _this$props;
        (_this$props = _this.props).onExited.apply(_this$props, arguments);
      }
    };
    _this.state = {exited: !props.show};
    _this.onHiddenListener = _this.handleHidden.bind(_this);
    return _this;
  }
  _createClass(Overlay, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.show) {
        this.setState({exited: false});
      } else if (!nextProps.transition) {
        this.setState({exited: true});
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var container = _props.container;
      var containerPadding = _props.containerPadding;
      var target = _props.target;
      var placement = _props.placement;
      var shouldUpdatePosition = _props.shouldUpdatePosition;
      var rootClose = _props.rootClose;
      var children = _props.children;
      var Transition = _props.transition;
      var props = _objectWithoutProperties(_props, ['container', 'containerPadding', 'target', 'placement', 'shouldUpdatePosition', 'rootClose', 'children', 'transition']);
      var mountOverlay = props.show || Transition && !this.state.exited;
      if (!mountOverlay) {
        return null;
      }
      var child = children;
      child = _react2.default.createElement(_Position2.default, {
        container: container,
        containerPadding: containerPadding,
        target: target,
        placement: placement,
        shouldUpdatePosition: shouldUpdatePosition
      }, child);
      if (Transition) {
        var onExit = props.onExit;
        var onExiting = props.onExiting;
        var onEnter = props.onEnter;
        var onEntering = props.onEntering;
        var onEntered = props.onEntered;
        child = _react2.default.createElement(Transition, {
          'in': props.show,
          transitionAppear: true,
          onExit: onExit,
          onExiting: onExiting,
          onExited: this.onHiddenListener,
          onEnter: onEnter,
          onEntering: onEntering,
          onEntered: onEntered
        }, child);
      }
      if (rootClose) {
        child = _react2.default.createElement(_RootCloseWrapper2.default, {onRootClose: props.onHide}, child);
      }
      return _react2.default.createElement(_Portal2.default, {container: container}, child);
    }
  }]);
  return Overlay;
}(_react2.default.Component);
Overlay.propTypes = _extends({}, _Portal2.default.propTypes, _Position2.default.propTypes, {
  show: _propTypes2.default.bool,
  rootClose: _propTypes2.default.bool,
  onHide: function onHide(props) {
    var propType = _propTypes2.default.func;
    if (props.rootClose) {
      propType = propType.isRequired;
    }
    for (var _len = arguments.length,
        args = Array(_len > 1 ? _len - 1 : 0),
        _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return propType.apply(undefined, [props].concat(args));
  },
  transition: _elementType2.default,
  onEnter: _propTypes2.default.func,
  onEntering: _propTypes2.default.func,
  onEntered: _propTypes2.default.func,
  onExit: _propTypes2.default.func,
  onExiting: _propTypes2.default.func,
  onExited: _propTypes2.default.func
});
exports.default = Overlay;
module.exports = exports['default'];
