/* */ 
(function(process) {
  'use strict';
  exports.__esModule = true;
  var _hash = require('../vendor/glamor/hash');
  var _hash2 = _interopRequireDefault(_hash);
  var _StyleSheet = require('./StyleSheet');
  var _StyleSheet2 = _interopRequireDefault(_StyleSheet);
  var _isStyledComponent = require('../utils/isStyledComponent');
  var _isStyledComponent2 = _interopRequireDefault(_isStyledComponent);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  var babelPluginFlowReactPropTypes_proptype_Stringifier = require('../types').babelPluginFlowReactPropTypes_proptype_Stringifier || require('prop-types').any;
  var babelPluginFlowReactPropTypes_proptype_Flattener = require('../types').babelPluginFlowReactPropTypes_proptype_Flattener || require('prop-types').any;
  var babelPluginFlowReactPropTypes_proptype_NameGenerator = require('../types').babelPluginFlowReactPropTypes_proptype_NameGenerator || require('prop-types').any;
  var babelPluginFlowReactPropTypes_proptype_RuleSet = require('../types').babelPluginFlowReactPropTypes_proptype_RuleSet || require('prop-types').any;
  var isStaticRules = function isStaticRules(rules, attrs) {
    for (var i = 0; i < rules.length; i += 1) {
      var rule = rules[i];
      if (Array.isArray(rule) && !isStaticRules(rule)) {
        return false;
      } else if (typeof rule === 'function' && !(0, _isStyledComponent2.default)(rule)) {
        return false;
      }
    }
    if (attrs !== undefined) {
      for (var key in attrs) {
        var value = attrs[key];
        if (typeof value === 'function') {
          return false;
        }
      }
    }
    return true;
  };
  var isHRMEnabled = typeof module !== 'undefined' && module.hot && process.env.NODE_ENV !== 'production';
  exports.default = function(nameGenerator, flatten, stringifyRules) {
    var ComponentStyle = function() {
      function ComponentStyle(rules, attrs, componentId) {
        _classCallCheck(this, ComponentStyle);
        this.rules = rules;
        this.isStatic = !isHRMEnabled && isStaticRules(rules, attrs);
        this.componentId = componentId;
        if (!_StyleSheet2.default.instance.hasInjectedComponent(this.componentId)) {
          var placeholder = process.env.NODE_ENV !== 'production' ? '.' + componentId + ' {}' : '';
          _StyleSheet2.default.instance.deferredInject(componentId, true, placeholder);
        }
      }
      ComponentStyle.prototype.generateAndInjectStyles = function generateAndInjectStyles(executionContext, styleSheet) {
        var isStatic = this.isStatic,
            lastClassName = this.lastClassName;
        if (isStatic && lastClassName !== undefined) {
          return lastClassName;
        }
        var flatCSS = flatten(this.rules, executionContext);
        var hash = (0, _hash2.default)(this.componentId + flatCSS.join(''));
        var existingName = styleSheet.getName(hash);
        if (existingName !== undefined) {
          if (styleSheet.stylesCacheable) {
            this.lastClassName = existingName;
          }
          return existingName;
        }
        var name = nameGenerator(hash);
        if (styleSheet.stylesCacheable) {
          this.lastClassName = existingName;
        }
        if (styleSheet.alreadyInjected(hash, name)) {
          return name;
        }
        var css = '\n' + stringifyRules(flatCSS, '.' + name);
        styleSheet.inject(this.componentId, true, css, hash, name);
        return name;
      };
      ComponentStyle.generateName = function generateName(str) {
        return nameGenerator((0, _hash2.default)(str));
      };
      return ComponentStyle;
    }();
    return ComponentStyle;
  };
  module.exports = exports['default'];
})(require('process'));
