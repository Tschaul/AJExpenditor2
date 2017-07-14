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
var _warning = require('warning');
var _warning2 = _interopRequireDefault(_warning);
var _componentOrElement = require('react-prop-types/lib/componentOrElement');
var _componentOrElement2 = _interopRequireDefault(_componentOrElement);
var _elementType = require('react-prop-types/lib/elementType');
var _elementType2 = _interopRequireDefault(_elementType);
var _Portal = require('./Portal');
var _Portal2 = _interopRequireDefault(_Portal);
var _ModalManager = require('./ModalManager');
var _ModalManager2 = _interopRequireDefault(_ModalManager);
var _ownerDocument = require('./utils/ownerDocument');
var _ownerDocument2 = _interopRequireDefault(_ownerDocument);
var _addEventListener = require('./utils/addEventListener');
var _addEventListener2 = _interopRequireDefault(_addEventListener);
var _addFocusListener = require('./utils/addFocusListener');
var _addFocusListener2 = _interopRequireDefault(_addFocusListener);
var _inDOM = require('dom-helpers/util/inDOM');
var _inDOM2 = _interopRequireDefault(_inDOM);
var _activeElement = require('dom-helpers/activeElement');
var _activeElement2 = _interopRequireDefault(_activeElement);
var _contains = require('dom-helpers/query/contains');
var _contains2 = _interopRequireDefault(_contains);
var _getContainer = require('./utils/getContainer');
var _getContainer2 = _interopRequireDefault(_getContainer);
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
var modalManager = new _ModalManager2.default();
var Modal = function(_React$Component) {
  _inherits(Modal, _React$Component);
  function Modal() {
    var _ref;
    var _temp,
        _this,
        _ret;
    _classCallCheck(this, Modal);
    for (var _len = arguments.length,
        args = Array(_len),
        _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Modal.__proto__ || Object.getPrototypeOf(Modal)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }
  _createClass(Modal, [{
    key: 'omitProps',
    value: function omitProps(props, propTypes) {
      var keys = Object.keys(props);
      var newProps = {};
      keys.map(function(prop) {
        if (!Object.prototype.hasOwnProperty.call(propTypes, prop)) {
          newProps[prop] = props[prop];
        }
      });
      return newProps;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var show = _props.show;
      var container = _props.container;
      var children = _props.children;
      var Transition = _props.transition;
      var backdrop = _props.backdrop;
      var dialogTransitionTimeout = _props.dialogTransitionTimeout;
      var className = _props.className;
      var style = _props.style;
      var onExit = _props.onExit;
      var onExiting = _props.onExiting;
      var onEnter = _props.onEnter;
      var onEntering = _props.onEntering;
      var onEntered = _props.onEntered;
      var dialog = _react2.default.Children.only(children);
      var filteredProps = this.omitProps(this.props, Modal.propTypes);
      var mountModal = show || Transition && !this.state.exited;
      if (!mountModal) {
        return null;
      }
      var _dialog$props = dialog.props;
      var role = _dialog$props.role;
      var tabIndex = _dialog$props.tabIndex;
      if (role === undefined || tabIndex === undefined) {
        dialog = (0, _react.cloneElement)(dialog, {
          role: role === undefined ? 'document' : role,
          tabIndex: tabIndex == null ? '-1' : tabIndex
        });
      }
      if (Transition) {
        dialog = _react2.default.createElement(Transition, {
          transitionAppear: true,
          unmountOnExit: true,
          'in': show,
          timeout: dialogTransitionTimeout,
          onExit: onExit,
          onExiting: onExiting,
          onExited: this.handleHidden,
          onEnter: onEnter,
          onEntering: onEntering,
          onEntered: onEntered
        }, dialog);
      }
      return _react2.default.createElement(_Portal2.default, {
        ref: this.setMountNode,
        container: container
      }, _react2.default.createElement('div', _extends({
        ref: this.setModalNode,
        role: role || 'dialog'
      }, filteredProps, {
        style: style,
        className: className
      }), backdrop && this.renderBackdrop(), dialog));
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.show) {
        this.setState({exited: false});
      } else if (!nextProps.transition) {
        this.setState({exited: true});
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      if (!this.props.show && nextProps.show) {
        this.checkForFocus();
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._isMounted = true;
      if (this.props.show) {
        this.onShow();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var transition = this.props.transition;
      if (prevProps.show && !this.props.show && !transition) {
        this.onHide();
      } else if (!prevProps.show && this.props.show) {
        this.onShow();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _props2 = this.props;
      var show = _props2.show;
      var transition = _props2.transition;
      this._isMounted = false;
      if (show || transition && !this.state.exited) {
        this.onHide();
      }
    }
  }]);
  return Modal;
}(_react2.default.Component);
Modal.propTypes = _extends({}, _Portal2.default.propTypes, {
  show: _propTypes2.default.bool,
  container: _propTypes2.default.oneOfType([_componentOrElement2.default, _propTypes2.default.func]),
  onShow: _propTypes2.default.func,
  onHide: _propTypes2.default.func,
  backdrop: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.oneOf(['static'])]),
  renderBackdrop: _propTypes2.default.func,
  onEscapeKeyUp: _propTypes2.default.func,
  onBackdropClick: _propTypes2.default.func,
  backdropStyle: _propTypes2.default.object,
  backdropClassName: _propTypes2.default.string,
  containerClassName: _propTypes2.default.string,
  keyboard: _propTypes2.default.bool,
  transition: _elementType2.default,
  dialogTransitionTimeout: _propTypes2.default.number,
  backdropTransitionTimeout: _propTypes2.default.number,
  autoFocus: _propTypes2.default.bool,
  enforceFocus: _propTypes2.default.bool,
  restoreFocus: _propTypes2.default.bool,
  onEnter: _propTypes2.default.func,
  onEntering: _propTypes2.default.func,
  onEntered: _propTypes2.default.func,
  onExit: _propTypes2.default.func,
  onExiting: _propTypes2.default.func,
  onExited: _propTypes2.default.func,
  manager: _propTypes2.default.object.isRequired
});
Modal.defaultProps = {
  show: false,
  backdrop: true,
  keyboard: true,
  autoFocus: true,
  enforceFocus: true,
  restoreFocus: true,
  onHide: function onHide() {},
  manager: modalManager,
  renderBackdrop: function renderBackdrop(props) {
    return _react2.default.createElement('div', props);
  }
};
var _initialiseProps = function _initialiseProps() {
  var _this2 = this;
  this.state = {exited: !this.props.show};
  this.renderBackdrop = function() {
    var _props3 = _this2.props;
    var backdropStyle = _props3.backdropStyle;
    var backdropClassName = _props3.backdropClassName;
    var renderBackdrop = _props3.renderBackdrop;
    var Transition = _props3.transition;
    var backdropTransitionTimeout = _props3.backdropTransitionTimeout;
    var backdropRef = function backdropRef(ref) {
      return _this2.backdrop = ref;
    };
    var backdrop = renderBackdrop({
      ref: backdropRef,
      style: backdropStyle,
      className: backdropClassName,
      onClick: _this2.handleBackdropClick
    });
    if (Transition) {
      backdrop = _react2.default.createElement(Transition, {
        transitionAppear: true,
        'in': _this2.props.show,
        timeout: backdropTransitionTimeout
      }, backdrop);
    }
    return backdrop;
  };
  this.onShow = function() {
    var doc = (0, _ownerDocument2.default)(_this2);
    var container = (0, _getContainer2.default)(_this2.props.container, doc.body);
    _this2.props.manager.add(_this2, container, _this2.props.containerClassName);
    _this2._onDocumentKeyupListener = (0, _addEventListener2.default)(doc, 'keyup', _this2.handleDocumentKeyUp);
    _this2._onFocusinListener = (0, _addFocusListener2.default)(_this2.enforceFocus);
    _this2.focus();
    if (_this2.props.onShow) {
      _this2.props.onShow();
    }
  };
  this.onHide = function() {
    _this2.props.manager.remove(_this2);
    _this2._onDocumentKeyupListener.remove();
    _this2._onFocusinListener.remove();
    if (_this2.props.restoreFocus) {
      _this2.restoreLastFocus();
    }
  };
  this.setMountNode = function(ref) {
    _this2.mountNode = ref ? ref.getMountNode() : ref;
  };
  this.setModalNode = function(ref) {
    _this2.modalNode = ref;
  };
  this.handleHidden = function() {
    _this2.setState({exited: true});
    _this2.onHide();
    if (_this2.props.onExited) {
      var _props4;
      (_props4 = _this2.props).onExited.apply(_props4, arguments);
    }
  };
  this.handleBackdropClick = function(e) {
    if (e.target !== e.currentTarget) {
      return;
    }
    if (_this2.props.onBackdropClick) {
      _this2.props.onBackdropClick(e);
    }
    if (_this2.props.backdrop === true) {
      _this2.props.onHide();
    }
  };
  this.handleDocumentKeyUp = function(e) {
    if (_this2.props.keyboard && e.keyCode === 27 && _this2.isTopModal()) {
      if (_this2.props.onEscapeKeyUp) {
        _this2.props.onEscapeKeyUp(e);
      }
      _this2.props.onHide();
    }
  };
  this.checkForFocus = function() {
    if (_inDOM2.default) {
      _this2.lastFocus = (0, _activeElement2.default)();
    }
  };
  this.focus = function() {
    var autoFocus = _this2.props.autoFocus;
    var modalContent = _this2.getDialogElement();
    var current = (0, _activeElement2.default)((0, _ownerDocument2.default)(_this2));
    var focusInModal = current && (0, _contains2.default)(modalContent, current);
    if (modalContent && autoFocus && !focusInModal) {
      _this2.lastFocus = current;
      if (!modalContent.hasAttribute('tabIndex')) {
        modalContent.setAttribute('tabIndex', -1);
        (0, _warning2.default)(false, 'The modal content node does not accept focus. ' + 'For the benefit of assistive technologies, the tabIndex of the node is being set to "-1".');
      }
      modalContent.focus();
    }
  };
  this.restoreLastFocus = function() {
    if (_this2.lastFocus && _this2.lastFocus.focus) {
      _this2.lastFocus.focus();
      _this2.lastFocus = null;
    }
  };
  this.enforceFocus = function() {
    var enforceFocus = _this2.props.enforceFocus;
    if (!enforceFocus || !_this2._isMounted || !_this2.isTopModal()) {
      return;
    }
    var active = (0, _activeElement2.default)((0, _ownerDocument2.default)(_this2));
    var modal = _this2.getDialogElement();
    if (modal && modal !== active && !(0, _contains2.default)(modal, active)) {
      modal.focus();
    }
  };
  this.getDialogElement = function() {
    var node = _this2.modalNode;
    return node && node.lastChild;
  };
  this.isTopModal = function() {
    return _this2.props.manager.isTopModal(_this2);
  };
};
Modal.Manager = _ModalManager2.default;
exports.default = Modal;
module.exports = exports['default'];
