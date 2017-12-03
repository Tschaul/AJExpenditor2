/* */ 
'use strict';
exports.__esModule = true;
exports.COMPONENTS_PER_TAG = undefined;
var _extractCompsFromCSS = require('../utils/extractCompsFromCSS');
var _extractCompsFromCSS2 = _interopRequireDefault(_extractCompsFromCSS);
var _nonce = require('../utils/nonce');
var _nonce2 = _interopRequireDefault(_nonce);
var _StyleSheet = require('./StyleSheet');
var _StyleSheet2 = _interopRequireDefault(_StyleSheet);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var babelPluginFlowReactPropTypes_proptype_Tag = require('./StyleSheet').babelPluginFlowReactPropTypes_proptype_Tag || require('prop-types').any;
var COMPONENTS_PER_TAG = exports.COMPONENTS_PER_TAG = 40;
var BrowserTag = function() {
  function BrowserTag(el, isLocal) {
    var existingSource = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    _classCallCheck(this, BrowserTag);
    this.el = el;
    this.isLocal = isLocal;
    this.ready = false;
    var extractedComps = (0, _extractCompsFromCSS2.default)(existingSource);
    this.size = extractedComps.length;
    this.components = extractedComps.reduce(function(acc, obj) {
      acc[obj.componentId] = obj;
      return acc;
    }, {});
  }
  BrowserTag.prototype.isFull = function isFull() {
    return this.size >= COMPONENTS_PER_TAG;
  };
  BrowserTag.prototype.addComponent = function addComponent(componentId) {
    if (!this.ready)
      this.replaceElement();
    if (this.components[componentId])
      throw new Error('Trying to add Component \'' + componentId + '\' twice!');
    var comp = {
      componentId: componentId,
      textNode: document.createTextNode('')
    };
    this.el.appendChild(comp.textNode);
    this.size += 1;
    this.components[componentId] = comp;
  };
  BrowserTag.prototype.inject = function inject(componentId, css, name) {
    if (!this.ready)
      this.replaceElement();
    var comp = this.components[componentId];
    if (!comp)
      throw new Error('Must add a new component before you can inject css into it');
    if (comp.textNode.data === '')
      comp.textNode.appendData('\n/* sc-component-id: ' + componentId + ' */\n');
    comp.textNode.appendData(css);
    if (name) {
      var existingNames = this.el.getAttribute(_StyleSheet.SC_ATTR);
      this.el.setAttribute(_StyleSheet.SC_ATTR, existingNames ? existingNames + ' ' + name : name);
    }
    var nonce = (0, _nonce2.default)();
    if (nonce) {
      this.el.setAttribute('nonce', nonce);
    }
  };
  BrowserTag.prototype.toHTML = function toHTML() {
    return this.el.outerHTML;
  };
  BrowserTag.prototype.toReactElement = function toReactElement() {
    throw new Error('BrowserTag doesn\'t implement toReactElement!');
  };
  BrowserTag.prototype.clone = function clone() {
    throw new Error('BrowserTag cannot be cloned!');
  };
  BrowserTag.prototype.replaceElement = function replaceElement() {
    var _this = this;
    this.ready = true;
    if (this.size === 0)
      return;
    var newEl = this.el.cloneNode();
    newEl.appendChild(document.createTextNode('\n'));
    Object.keys(this.components).forEach(function(key) {
      var comp = _this.components[key];
      comp.textNode = document.createTextNode(comp.cssFromDOM);
      newEl.appendChild(comp.textNode);
    });
    if (!this.el.parentNode)
      throw new Error("Trying to replace an element that wasn't mounted!");
    this.el.parentNode.replaceChild(newEl, this.el);
    this.el = newEl;
  };
  return BrowserTag;
}();
exports.default = {create: function create() {
    var tags = [];
    var names = {};
    var nodes = document.querySelectorAll('[' + _StyleSheet.SC_ATTR + ']');
    var nodesLength = nodes.length;
    for (var i = 0; i < nodesLength; i += 1) {
      var el = nodes[i];
      tags.push(new BrowserTag(el, el.getAttribute(_StyleSheet.LOCAL_ATTR) === 'true', el.innerHTML));
      var attr = el.getAttribute(_StyleSheet.SC_ATTR);
      if (attr) {
        attr.trim().split(/\s+/).forEach(function(name) {
          names[name] = true;
        });
      }
    }
    var tagConstructor = function tagConstructor(isLocal) {
      var el = document.createElement('style');
      el.type = 'text/css';
      el.setAttribute(_StyleSheet.SC_ATTR, '');
      el.setAttribute(_StyleSheet.LOCAL_ATTR, isLocal ? 'true' : 'false');
      if (!document.head)
        throw new Error('Missing document <head>');
      document.head.appendChild(el);
      return new BrowserTag(el, isLocal);
    };
    return new _StyleSheet2.default(tagConstructor, tags, names);
  }};
