/* */ 
(function(process) {
  'use strict';
  var _prodInvariant = require('./reactProdInvariant');
  var ReactPropTypesSecret = require('./ReactPropTypesSecret');
  var propTypesFactory = require('prop-types/factory');
  var React = require('react/lib/React');
  var PropTypes = propTypesFactory(React.isValidElement);
  var invariant = require('fbjs/lib/invariant');
  var warning = require('fbjs/lib/warning');
  var hasReadOnlyValue = {
    button: true,
    checkbox: true,
    image: true,
    hidden: true,
    radio: true,
    reset: true,
    submit: true
  };
  function _assertSingleLink(inputProps) {
    !(inputProps.checkedLink == null || inputProps.valueLink == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot provide a checkedLink and a valueLink. If you want to use checkedLink, you probably don\'t want to use valueLink and vice versa.') : _prodInvariant('87') : void 0;
  }
  function _assertValueLink(inputProps) {
    _assertSingleLink(inputProps);
    !(inputProps.value == null && inputProps.onChange == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot provide a valueLink and a value or onChange event. If you want to use value or onChange, you probably don\'t want to use valueLink.') : _prodInvariant('88') : void 0;
  }
  function _assertCheckedLink(inputProps) {
    _assertSingleLink(inputProps);
    !(inputProps.checked == null && inputProps.onChange == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot provide a checkedLink and a checked property or onChange event. If you want to use checked or onChange, you probably don\'t want to use checkedLink') : _prodInvariant('89') : void 0;
  }
  var propTypes = {
    value: function(props, propName, componentName) {
      if (!props[propName] || hasReadOnlyValue[props.type] || props.onChange || props.readOnly || props.disabled) {
        return null;
      }
      return new Error('You provided a `value` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultValue`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
    },
    checked: function(props, propName, componentName) {
      if (!props[propName] || props.onChange || props.readOnly || props.disabled) {
        return null;
      }
      return new Error('You provided a `checked` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultChecked`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
    },
    onChange: PropTypes.func
  };
  var loggedTypeFailures = {};
  function getDeclarationErrorAddendum(owner) {
    if (owner) {
      var name = owner.getName();
      if (name) {
        return ' Check the render method of `' + name + '`.';
      }
    }
    return '';
  }
  var LinkedValueUtils = {
    checkPropTypes: function(tagName, props, owner) {
      for (var propName in propTypes) {
        if (propTypes.hasOwnProperty(propName)) {
          var error = propTypes[propName](props, propName, tagName, 'prop', null, ReactPropTypesSecret);
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          loggedTypeFailures[error.message] = true;
          var addendum = getDeclarationErrorAddendum(owner);
          process.env.NODE_ENV !== 'production' ? warning(false, 'Failed form propType: %s%s', error.message, addendum) : void 0;
        }
      }
    },
    getValue: function(inputProps) {
      if (inputProps.valueLink) {
        _assertValueLink(inputProps);
        return inputProps.valueLink.value;
      }
      return inputProps.value;
    },
    getChecked: function(inputProps) {
      if (inputProps.checkedLink) {
        _assertCheckedLink(inputProps);
        return inputProps.checkedLink.value;
      }
      return inputProps.checked;
    },
    executeOnChange: function(inputProps, event) {
      if (inputProps.valueLink) {
        _assertValueLink(inputProps);
        return inputProps.valueLink.requestChange(event.target.value);
      } else if (inputProps.checkedLink) {
        _assertCheckedLink(inputProps);
        return inputProps.checkedLink.requestChange(event.target.checked);
      } else if (inputProps.onChange) {
        return inputProps.onChange.call(undefined, event);
      }
    }
  };
  module.exports = LinkedValueUtils;
})(require('process'));
