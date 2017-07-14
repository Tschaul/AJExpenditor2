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
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var _elementType = require('prop-types-extra/lib/elementType');
var _elementType2 = _interopRequireDefault(_elementType);
var _bootstrapUtils = require('./utils/bootstrapUtils');
var _StyleConfig = require('./utils/StyleConfig');
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var propTypes = {
  componentClass: _elementType2['default'],
  xs: _propTypes2['default'].number,
  sm: _propTypes2['default'].number,
  md: _propTypes2['default'].number,
  lg: _propTypes2['default'].number,
  xsHidden: _propTypes2['default'].bool,
  smHidden: _propTypes2['default'].bool,
  mdHidden: _propTypes2['default'].bool,
  lgHidden: _propTypes2['default'].bool,
  xsOffset: _propTypes2['default'].number,
  smOffset: _propTypes2['default'].number,
  mdOffset: _propTypes2['default'].number,
  lgOffset: _propTypes2['default'].number,
  xsPush: _propTypes2['default'].number,
  smPush: _propTypes2['default'].number,
  mdPush: _propTypes2['default'].number,
  lgPush: _propTypes2['default'].number,
  xsPull: _propTypes2['default'].number,
  smPull: _propTypes2['default'].number,
  mdPull: _propTypes2['default'].number,
  lgPull: _propTypes2['default'].number
};
var defaultProps = {componentClass: 'div'};
var Col = function(_React$Component) {
  (0, _inherits3['default'])(Col, _React$Component);
  function Col() {
    (0, _classCallCheck3['default'])(this, Col);
    return (0, _possibleConstructorReturn3['default'])(this, _React$Component.apply(this, arguments));
  }
  Col.prototype.render = function render() {
    var _props = this.props,
        Component = _props.componentClass,
        className = _props.className,
        props = (0, _objectWithoutProperties3['default'])(_props, ['componentClass', 'className']);
    var _splitBsProps = (0, _bootstrapUtils.splitBsProps)(props),
        bsProps = _splitBsProps[0],
        elementProps = _splitBsProps[1];
    var classes = [];
    _StyleConfig.DEVICE_SIZES.forEach(function(size) {
      function popProp(propSuffix, modifier) {
        var propName = '' + size + propSuffix;
        var propValue = elementProps[propName];
        if (propValue != null) {
          classes.push((0, _bootstrapUtils.prefix)(bsProps, '' + size + modifier + '-' + propValue));
        }
        delete elementProps[propName];
      }
      popProp('', '');
      popProp('Offset', '-offset');
      popProp('Push', '-push');
      popProp('Pull', '-pull');
      var hiddenPropName = size + 'Hidden';
      if (elementProps[hiddenPropName]) {
        classes.push('hidden-' + size);
      }
      delete elementProps[hiddenPropName];
    });
    return _react2['default'].createElement(Component, (0, _extends3['default'])({}, elementProps, {className: (0, _classnames2['default'])(className, classes)}));
  };
  return Col;
}(_react2['default'].Component);
Col.propTypes = propTypes;
Col.defaultProps = defaultProps;
exports['default'] = (0, _bootstrapUtils.bsClass)('col', Col);
module.exports = exports['default'];
