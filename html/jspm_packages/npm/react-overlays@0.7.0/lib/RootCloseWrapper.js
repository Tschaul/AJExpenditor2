/* */ 
'use strict';
Object.defineProperty(exports, "__esModule", {value: true});
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
var _contains = require('dom-helpers/query/contains');
var _contains2 = _interopRequireDefault(_contains);
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var _reactDom = require('react-dom');
var _reactDom2 = _interopRequireDefault(_reactDom);
var _addEventListener = require('./utils/addEventListener');
var _addEventListener2 = _interopRequireDefault(_addEventListener);
var _ownerDocument = require('./utils/ownerDocument');
var _ownerDocument2 = _interopRequireDefault(_ownerDocument);
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
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var escapeKeyCode = 27;
function isLeftClickEvent(event) {
  return event.button === 0;
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
var RootCloseWrapper = function(_React$Component) {
  _inherits(RootCloseWrapper, _React$Component);
  function RootCloseWrapper(props, context) {
    _classCallCheck(this, RootCloseWrapper);
    var _this = _possibleConstructorReturn(this, (RootCloseWrapper.__proto__ || Object.getPrototypeOf(RootCloseWrapper)).call(this, props, context));
    _this.addEventListeners = function() {
      var event = _this.props.event;
      var doc = (0, _ownerDocument2.default)(_this);
      _this.documentMouseCaptureListener = (0, _addEventListener2.default)(doc, event, _this.handleMouseCapture, true);
      _this.documentMouseListener = (0, _addEventListener2.default)(doc, event, _this.handleMouse);
      _this.documentKeyupListener = (0, _addEventListener2.default)(doc, 'keyup', _this.handleKeyUp);
    };
    _this.removeEventListeners = function() {
      if (_this.documentMouseCaptureListener) {
        _this.documentMouseCaptureListener.remove();
      }
      if (_this.documentMouseListener) {
        _this.documentMouseListener.remove();
      }
      if (_this.documentKeyupListener) {
        _this.documentKeyupListener.remove();
      }
    };
    _this.handleMouseCapture = function(e) {
      _this.preventMouseRootClose = isModifiedEvent(e) || !isLeftClickEvent(e) || (0, _contains2.default)(_reactDom2.default.findDOMNode(_this), e.target);
    };
    _this.handleMouse = function(e) {
      if (!_this.preventMouseRootClose && _this.props.onRootClose) {
        _this.props.onRootClose(e);
      }
    };
    _this.handleKeyUp = function(e) {
      if (e.keyCode === escapeKeyCode && _this.props.onRootClose) {
        _this.props.onRootClose(e);
      }
    };
    _this.preventMouseRootClose = false;
    return _this;
  }
  _createClass(RootCloseWrapper, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.props.disabled) {
        this.addEventListeners();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (!this.props.disabled && prevProps.disabled) {
        this.addEventListeners();
      } else if (this.props.disabled && !prevProps.disabled) {
        this.removeEventListeners();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (!this.props.disabled) {
        this.removeEventListeners();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);
  return RootCloseWrapper;
}(_react2.default.Component);
RootCloseWrapper.displayName = 'RootCloseWrapper';
RootCloseWrapper.propTypes = {
  onRootClose: _propTypes2.default.func,
  children: _propTypes2.default.element,
  disabled: _propTypes2.default.bool,
  event: _propTypes2.default.oneOf(['click', 'mousedown'])
};
RootCloseWrapper.defaultProps = {event: 'click'};
exports.default = RootCloseWrapper;
module.exports = exports['default'];
