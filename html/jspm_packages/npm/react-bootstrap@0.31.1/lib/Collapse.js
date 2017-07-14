/* */ 
'use strict';
exports.__esModule = true;
var _extends2 = require('babel-runtime/helpers/extends');
var _extends3 = _interopRequireDefault(_extends2);
var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');
var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
var _inherits2 = require('babel-runtime/helpers/inherits');
var _inherits3 = _interopRequireDefault(_inherits2);
var _classnames = require('classnames');
var _classnames2 = _interopRequireDefault(_classnames);
var _style = require('dom-helpers/style');
var _style2 = _interopRequireDefault(_style);
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var _Transition = require('react-overlays/lib/Transition');
var _Transition2 = _interopRequireDefault(_Transition);
var _capitalize = require('./utils/capitalize');
var _capitalize2 = _interopRequireDefault(_capitalize);
var _createChainedFunction = require('./utils/createChainedFunction');
var _createChainedFunction2 = _interopRequireDefault(_createChainedFunction);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var MARGINS = {
  height: ['marginTop', 'marginBottom'],
  width: ['marginLeft', 'marginRight']
};
function triggerBrowserReflow(node) {
  node.offsetHeight;
}
function getDimensionValue(dimension, elem) {
  var value = elem['offset' + (0, _capitalize2['default'])(dimension)];
  var margins = MARGINS[dimension];
  return value + parseInt((0, _style2['default'])(elem, margins[0]), 10) + parseInt((0, _style2['default'])(elem, margins[1]), 10);
}
var propTypes = {
  'in': _propTypes2['default'].bool,
  mountOnEnter: _propTypes2['default'].bool,
  unmountOnExit: _propTypes2['default'].bool,
  transitionAppear: _propTypes2['default'].bool,
  timeout: _propTypes2['default'].number,
  onEnter: _propTypes2['default'].func,
  onEntering: _propTypes2['default'].func,
  onEntered: _propTypes2['default'].func,
  onExit: _propTypes2['default'].func,
  onExiting: _propTypes2['default'].func,
  onExited: _propTypes2['default'].func,
  dimension: _propTypes2['default'].oneOfType([_propTypes2['default'].oneOf(['height', 'width']), _propTypes2['default'].func]),
  getDimensionValue: _propTypes2['default'].func,
  role: _propTypes2['default'].string
};
var defaultProps = {
  'in': false,
  timeout: 300,
  mountOnEnter: false,
  unmountOnExit: false,
  transitionAppear: false,
  dimension: 'height',
  getDimensionValue: getDimensionValue
};
var Collapse = function(_React$Component) {
  (0, _inherits3['default'])(Collapse, _React$Component);
  function Collapse(props, context) {
    (0, _classCallCheck3['default'])(this, Collapse);
    var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props, context));
    _this.handleEnter = _this.handleEnter.bind(_this);
    _this.handleEntering = _this.handleEntering.bind(_this);
    _this.handleEntered = _this.handleEntered.bind(_this);
    _this.handleExit = _this.handleExit.bind(_this);
    _this.handleExiting = _this.handleExiting.bind(_this);
    return _this;
  }
  Collapse.prototype.handleEnter = function handleEnter(elem) {
    var dimension = this._dimension();
    elem.style[dimension] = '0';
  };
  Collapse.prototype.handleEntering = function handleEntering(elem) {
    var dimension = this._dimension();
    elem.style[dimension] = this._getScrollDimensionValue(elem, dimension);
  };
  Collapse.prototype.handleEntered = function handleEntered(elem) {
    var dimension = this._dimension();
    elem.style[dimension] = null;
  };
  Collapse.prototype.handleExit = function handleExit(elem) {
    var dimension = this._dimension();
    elem.style[dimension] = this.props.getDimensionValue(dimension, elem) + 'px';
    triggerBrowserReflow(elem);
  };
  Collapse.prototype.handleExiting = function handleExiting(elem) {
    var dimension = this._dimension();
    elem.style[dimension] = '0';
  };
  Collapse.prototype._dimension = function _dimension() {
    return typeof this.props.dimension === 'function' ? this.props.dimension() : this.props.dimension;
  };
  Collapse.prototype._getScrollDimensionValue = function _getScrollDimensionValue(elem, dimension) {
    return elem['scroll' + (0, _capitalize2['default'])(dimension)] + 'px';
  };
  Collapse.prototype.render = function render() {
    var _props = this.props,
        onEnter = _props.onEnter,
        onEntering = _props.onEntering,
        onEntered = _props.onEntered,
        onExit = _props.onExit,
        onExiting = _props.onExiting,
        className = _props.className,
        props = (0, _objectWithoutProperties3['default'])(_props, ['onEnter', 'onEntering', 'onEntered', 'onExit', 'onExiting', 'className']);
    delete props.dimension;
    delete props.getDimensionValue;
    var handleEnter = (0, _createChainedFunction2['default'])(this.handleEnter, onEnter);
    var handleEntering = (0, _createChainedFunction2['default'])(this.handleEntering, onEntering);
    var handleEntered = (0, _createChainedFunction2['default'])(this.handleEntered, onEntered);
    var handleExit = (0, _createChainedFunction2['default'])(this.handleExit, onExit);
    var handleExiting = (0, _createChainedFunction2['default'])(this.handleExiting, onExiting);
    var classes = {width: this._dimension() === 'width'};
    return _react2['default'].createElement(_Transition2['default'], (0, _extends3['default'])({}, props, {
      'aria-expanded': props.role ? props['in'] : null,
      className: (0, _classnames2['default'])(className, classes),
      exitedClassName: 'collapse',
      exitingClassName: 'collapsing',
      enteredClassName: 'collapse in',
      enteringClassName: 'collapsing',
      onEnter: handleEnter,
      onEntering: handleEntering,
      onEntered: handleEntered,
      onExit: handleExit,
      onExiting: handleExiting
    }));
  };
  return Collapse;
}(_react2['default'].Component);
Collapse.propTypes = propTypes;
Collapse.defaultProps = defaultProps;
exports['default'] = Collapse;
module.exports = exports['default'];
