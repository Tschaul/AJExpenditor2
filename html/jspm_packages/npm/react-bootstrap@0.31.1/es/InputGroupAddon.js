/* */ 
"format cjs";
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import classNames from 'classnames';
import React from 'react';

import { bsClass, getClassSet, splitBsProps } from './utils/bootstrapUtils';

var InputGroupAddon = function (_React$Component) {
  _inherits(InputGroupAddon, _React$Component);

  function InputGroupAddon() {
    _classCallCheck(this, InputGroupAddon);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  InputGroupAddon.prototype.render = function render() {
    var _props = this.props,
        className = _props.className,
        props = _objectWithoutProperties(_props, ['className']);

    var _splitBsProps = splitBsProps(props),
        bsProps = _splitBsProps[0],
        elementProps = _splitBsProps[1];

    var classes = getClassSet(bsProps);

    return React.createElement('span', _extends({}, elementProps, {
      className: classNames(className, classes)
    }));
  };

  return InputGroupAddon;
}(React.Component);

export default bsClass('input-group-addon', InputGroupAddon);