/* */ 
'use strict';
exports.__esModule = true;
var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');
var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
var _inherits2 = require('babel-runtime/helpers/inherits');
var _inherits3 = _interopRequireDefault(_inherits2);
var _extends2 = require('babel-runtime/helpers/extends');
var _extends3 = _interopRequireDefault(_extends2);
var _classnames = require('classnames');
var _classnames2 = _interopRequireDefault(_classnames);
var _events = require('dom-helpers/events');
var _events2 = _interopRequireDefault(_events);
var _ownerDocument = require('dom-helpers/ownerDocument');
var _ownerDocument2 = _interopRequireDefault(_ownerDocument);
var _inDOM = require('dom-helpers/util/inDOM');
var _inDOM2 = _interopRequireDefault(_inDOM);
var _scrollbarSize = require('dom-helpers/util/scrollbarSize');
var _scrollbarSize2 = _interopRequireDefault(_scrollbarSize);
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var _reactDom = require('react-dom');
var _reactDom2 = _interopRequireDefault(_reactDom);
var _Modal = require('react-overlays/lib/Modal');
var _Modal2 = _interopRequireDefault(_Modal);
var _isOverflowing = require('react-overlays/lib/utils/isOverflowing');
var _isOverflowing2 = _interopRequireDefault(_isOverflowing);
var _elementType = require('prop-types-extra/lib/elementType');
var _elementType2 = _interopRequireDefault(_elementType);
var _Fade = require('./Fade');
var _Fade2 = _interopRequireDefault(_Fade);
var _ModalBody = require('./ModalBody');
var _ModalBody2 = _interopRequireDefault(_ModalBody);
var _ModalDialog = require('./ModalDialog');
var _ModalDialog2 = _interopRequireDefault(_ModalDialog);
var _ModalFooter = require('./ModalFooter');
var _ModalFooter2 = _interopRequireDefault(_ModalFooter);
var _ModalHeader = require('./ModalHeader');
var _ModalHeader2 = _interopRequireDefault(_ModalHeader);
var _ModalTitle = require('./ModalTitle');
var _ModalTitle2 = _interopRequireDefault(_ModalTitle);
var _bootstrapUtils = require('./utils/bootstrapUtils');
var _createChainedFunction = require('./utils/createChainedFunction');
var _createChainedFunction2 = _interopRequireDefault(_createChainedFunction);
var _splitComponentProps2 = require('./utils/splitComponentProps');
var _splitComponentProps3 = _interopRequireDefault(_splitComponentProps2);
var _StyleConfig = require('./utils/StyleConfig');
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var propTypes = (0, _extends3['default'])({}, _Modal2['default'].propTypes, _ModalDialog2['default'].propTypes, {
  backdrop: _propTypes2['default'].oneOf(['static', true, false]),
  keyboard: _propTypes2['default'].bool,
  animation: _propTypes2['default'].bool,
  dialogComponentClass: _elementType2['default'],
  autoFocus: _propTypes2['default'].bool,
  enforceFocus: _propTypes2['default'].bool,
  restoreFocus: _propTypes2['default'].bool,
  show: _propTypes2['default'].bool,
  onHide: _propTypes2['default'].func,
  onEnter: _propTypes2['default'].func,
  onEntering: _propTypes2['default'].func,
  onEntered: _propTypes2['default'].func,
  onExit: _propTypes2['default'].func,
  onExiting: _propTypes2['default'].func,
  onExited: _propTypes2['default'].func,
  container: _Modal2['default'].propTypes.container
});
var defaultProps = (0, _extends3['default'])({}, _Modal2['default'].defaultProps, {
  animation: true,
  dialogComponentClass: _ModalDialog2['default']
});
var childContextTypes = {$bs_modal: _propTypes2['default'].shape({onHide: _propTypes2['default'].func})};
var Modal = function(_React$Component) {
  (0, _inherits3['default'])(Modal, _React$Component);
  function Modal(props, context) {
    (0, _classCallCheck3['default'])(this, Modal);
    var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props, context));
    _this.handleEntering = _this.handleEntering.bind(_this);
    _this.handleExited = _this.handleExited.bind(_this);
    _this.handleWindowResize = _this.handleWindowResize.bind(_this);
    _this.handleDialogClick = _this.handleDialogClick.bind(_this);
    _this.state = {style: {}};
    return _this;
  }
  Modal.prototype.getChildContext = function getChildContext() {
    return {$bs_modal: {onHide: this.props.onHide}};
  };
  Modal.prototype.componentWillUnmount = function componentWillUnmount() {
    this.handleExited();
  };
  Modal.prototype.handleEntering = function handleEntering() {
    _events2['default'].on(window, 'resize', this.handleWindowResize);
    this.updateStyle();
  };
  Modal.prototype.handleExited = function handleExited() {
    _events2['default'].off(window, 'resize', this.handleWindowResize);
  };
  Modal.prototype.handleWindowResize = function handleWindowResize() {
    this.updateStyle();
  };
  Modal.prototype.handleDialogClick = function handleDialogClick(e) {
    if (e.target !== e.currentTarget) {
      return;
    }
    this.props.onHide();
  };
  Modal.prototype.updateStyle = function updateStyle() {
    if (!_inDOM2['default']) {
      return;
    }
    var dialogNode = this._modal.getDialogElement();
    var dialogHeight = dialogNode.scrollHeight;
    var document = (0, _ownerDocument2['default'])(dialogNode);
    var bodyIsOverflowing = (0, _isOverflowing2['default'])(_reactDom2['default'].findDOMNode(this.props.container || document.body));
    var modalIsOverflowing = dialogHeight > document.documentElement.clientHeight;
    this.setState({style: {
        paddingRight: bodyIsOverflowing && !modalIsOverflowing ? (0, _scrollbarSize2['default'])() : undefined,
        paddingLeft: !bodyIsOverflowing && modalIsOverflowing ? (0, _scrollbarSize2['default'])() : undefined
      }});
  };
  Modal.prototype.render = function render() {
    var _this2 = this;
    var _props = this.props,
        backdrop = _props.backdrop,
        animation = _props.animation,
        show = _props.show,
        Dialog = _props.dialogComponentClass,
        className = _props.className,
        style = _props.style,
        children = _props.children,
        onEntering = _props.onEntering,
        onExited = _props.onExited,
        props = (0, _objectWithoutProperties3['default'])(_props, ['backdrop', 'animation', 'show', 'dialogComponentClass', 'className', 'style', 'children', 'onEntering', 'onExited']);
    var _splitComponentProps = (0, _splitComponentProps3['default'])(props, _Modal2['default']),
        baseModalProps = _splitComponentProps[0],
        dialogProps = _splitComponentProps[1];
    var inClassName = show && !animation && 'in';
    return _react2['default'].createElement(_Modal2['default'], (0, _extends3['default'])({}, baseModalProps, {
      ref: function ref(c) {
        _this2._modal = c;
      },
      show: show,
      onEntering: (0, _createChainedFunction2['default'])(onEntering, this.handleEntering),
      onExited: (0, _createChainedFunction2['default'])(onExited, this.handleExited),
      backdrop: backdrop,
      backdropClassName: (0, _classnames2['default'])((0, _bootstrapUtils.prefix)(props, 'backdrop'), inClassName),
      containerClassName: (0, _bootstrapUtils.prefix)(props, 'open'),
      transition: animation ? _Fade2['default'] : undefined,
      dialogTransitionTimeout: Modal.TRANSITION_DURATION,
      backdropTransitionTimeout: Modal.BACKDROP_TRANSITION_DURATION
    }), _react2['default'].createElement(Dialog, (0, _extends3['default'])({}, dialogProps, {
      style: (0, _extends3['default'])({}, this.state.style, style),
      className: (0, _classnames2['default'])(className, inClassName),
      onClick: backdrop === true ? this.handleDialogClick : null
    }), children));
  };
  return Modal;
}(_react2['default'].Component);
Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;
Modal.childContextTypes = childContextTypes;
Modal.Body = _ModalBody2['default'];
Modal.Header = _ModalHeader2['default'];
Modal.Title = _ModalTitle2['default'];
Modal.Footer = _ModalFooter2['default'];
Modal.Dialog = _ModalDialog2['default'];
Modal.TRANSITION_DURATION = 300;
Modal.BACKDROP_TRANSITION_DURATION = 150;
exports['default'] = (0, _bootstrapUtils.bsClass)('modal', (0, _bootstrapUtils.bsSizes)([_StyleConfig.Size.LARGE, _StyleConfig.Size.SMALL], Modal));
module.exports = exports['default'];
