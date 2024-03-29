/* */ 
(function(process) {
  'use strict';
  exports.__esModule = true;
  var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');
  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
  var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');
  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
  var _inherits2 = require('babel-runtime/helpers/inherits');
  var _inherits3 = _interopRequireDefault(_inherits2);
  var _react = require('react');
  var _react2 = _interopRequireDefault(_react);
  var _propTypes = require('prop-types');
  var _propTypes2 = _interopRequireDefault(_propTypes);
  var _invariant = require('invariant');
  var _invariant2 = _interopRequireDefault(_invariant);
  var _uncontrollable = require('uncontrollable');
  var _uncontrollable2 = _interopRequireDefault(_uncontrollable);
  var _createChainedFunction = require('./utils/createChainedFunction');
  var _createChainedFunction2 = _interopRequireDefault(_createChainedFunction);
  var _ValidComponentChildren = require('./utils/ValidComponentChildren');
  var _ValidComponentChildren2 = _interopRequireDefault(_ValidComponentChildren);
  var _ButtonGroup = require('./ButtonGroup');
  var _ButtonGroup2 = _interopRequireDefault(_ButtonGroup);
  var _ToggleButton = require('./ToggleButton');
  var _ToggleButton2 = _interopRequireDefault(_ToggleButton);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {'default': obj};
  }
  var propTypes = {
    name: _propTypes2['default'].string,
    value: _propTypes2['default'].any,
    onChange: _propTypes2['default'].func,
    type: _propTypes2['default'].oneOf(['checkbox', 'radio']).isRequired
  };
  var defaultProps = {type: 'radio'};
  var ToggleButtonGroup = function(_React$Component) {
    (0, _inherits3['default'])(ToggleButtonGroup, _React$Component);
    function ToggleButtonGroup() {
      (0, _classCallCheck3['default'])(this, ToggleButtonGroup);
      return (0, _possibleConstructorReturn3['default'])(this, _React$Component.apply(this, arguments));
    }
    ToggleButtonGroup.prototype.getValues = function getValues() {
      var value = this.props.value;
      return value == null ? [] : [].concat(value);
    };
    ToggleButtonGroup.prototype.handleToggle = function handleToggle(value) {
      var _props = this.props,
          type = _props.type,
          onChange = _props.onChange;
      var values = this.getValues();
      var isActive = values.includes(value);
      if (type === 'radio') {
        if (!isActive) {
          onChange(value);
        }
        return;
      }
      if (isActive) {
        onChange(values.filter(function(n) {
          return n !== value;
        }));
      } else {
        onChange([].concat(values, [value]));
      }
    };
    ToggleButtonGroup.prototype.render = function render() {
      var _this2 = this;
      var _props2 = this.props,
          children = _props2.children,
          type = _props2.type,
          name = _props2.name;
      var values = this.getValues();
      !(type !== 'radio' || !!name) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2['default'])(false, 'A `name` is required to group the toggle buttons when the `type` ' + 'is set to "radio"') : (0, _invariant2['default'])(false) : void 0;
      return _react2['default'].createElement(_ButtonGroup2['default'], {'data-toggle': 'buttons'}, _ValidComponentChildren2['default'].map(children, function(child) {
        var _child$props = child.props,
            value = _child$props.value,
            onChange = _child$props.onChange;
        var handler = function handler() {
          return _this2.handleToggle(value);
        };
        return _react2['default'].cloneElement(child, {
          type: type,
          name: child.name || name,
          checked: values.includes(value),
          onChange: (0, _createChainedFunction2['default'])(onChange, handler)
        });
      }));
    };
    return ToggleButtonGroup;
  }(_react2['default'].Component);
  ToggleButtonGroup.propTypes = propTypes;
  ToggleButtonGroup.defaultProps = defaultProps;
  var UncontrolledToggleButtonGroup = (0, _uncontrollable2['default'])(ToggleButtonGroup, {value: 'onChange'});
  UncontrolledToggleButtonGroup.Button = _ToggleButton2['default'];
  exports['default'] = UncontrolledToggleButtonGroup;
  module.exports = exports['default'];
})(require('process'));
