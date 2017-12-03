/* */ 
(function(process) {
  'use strict';
  exports.__esModule = true;
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
  var _parse = require('./parse');
  var _parse2 = _interopRequireDefault(_parse);
  var _root = require('./root');
  var _root2 = _interopRequireDefault(_root);
  var _rule = require('./rule');
  var _rule2 = _interopRequireDefault(_rule);
  var _atRule = require('./at-rule');
  var _atRule2 = _interopRequireDefault(_atRule);
  var _declaration = require('./declaration');
  var _declaration2 = _interopRequireDefault(_declaration);
  var _warnOnce = require('./warn-once');
  var _warnOnce2 = _interopRequireDefault(_warnOnce);
  var _comment = require('./comment');
  var _comment2 = _interopRequireDefault(_comment);
  var _node = require('./node');
  var _node2 = _interopRequireDefault(_node);
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
  function cleanSource(nodes) {
    return nodes.map(function(i) {
      if (i.nodes)
        i.nodes = cleanSource(i.nodes);
      delete i.source;
      return i;
    });
  }
  var Container = function(_Node) {
    _inherits(Container, _Node);
    function Container() {
      _classCallCheck(this, Container);
      return _possibleConstructorReturn(this, _Node.apply(this, arguments));
    }
    Container.prototype.push = function push(child) {
      child.parent = this;
      this.nodes.push(child);
      return this;
    };
    Container.prototype.each = function each(callback) {
      if (!this.lastEach)
        this.lastEach = 0;
      if (!this.indexes)
        this.indexes = {};
      this.lastEach += 1;
      var id = this.lastEach;
      this.indexes[id] = 0;
      if (!this.nodes)
        return undefined;
      var index = void 0,
          result = void 0;
      while (this.indexes[id] < this.nodes.length) {
        index = this.indexes[id];
        result = callback(this.nodes[index], index);
        if (result === false)
          break;
        this.indexes[id] += 1;
      }
      delete this.indexes[id];
      return result;
    };
    Container.prototype.walk = function walk(callback) {
      return this.each(function(child, i) {
        var result = callback(child, i);
        if (result !== false && child.walk) {
          result = child.walk(callback);
        }
        return result;
      });
    };
    Container.prototype.walkDecls = function walkDecls(prop, callback) {
      if (!callback) {
        callback = prop;
        return this.walk(function(child, i) {
          if (child.type === 'decl') {
            return callback(child, i);
          }
        });
      } else if (prop instanceof RegExp) {
        return this.walk(function(child, i) {
          if (child.type === 'decl' && prop.test(child.prop)) {
            return callback(child, i);
          }
        });
      } else {
        return this.walk(function(child, i) {
          if (child.type === 'decl' && child.prop === prop) {
            return callback(child, i);
          }
        });
      }
    };
    Container.prototype.walkRules = function walkRules(selector, callback) {
      if (!callback) {
        callback = selector;
        return this.walk(function(child, i) {
          if (child.type === 'rule') {
            return callback(child, i);
          }
        });
      } else if (selector instanceof RegExp) {
        return this.walk(function(child, i) {
          if (child.type === 'rule' && selector.test(child.selector)) {
            return callback(child, i);
          }
        });
      } else {
        return this.walk(function(child, i) {
          if (child.type === 'rule' && child.selector === selector) {
            return callback(child, i);
          }
        });
      }
    };
    Container.prototype.walkAtRules = function walkAtRules(name, callback) {
      if (!callback) {
        callback = name;
        return this.walk(function(child, i) {
          if (child.type === 'atrule') {
            return callback(child, i);
          }
        });
      } else if (name instanceof RegExp) {
        return this.walk(function(child, i) {
          if (child.type === 'atrule' && name.test(child.name)) {
            return callback(child, i);
          }
        });
      } else {
        return this.walk(function(child, i) {
          if (child.type === 'atrule' && child.name === name) {
            return callback(child, i);
          }
        });
      }
    };
    Container.prototype.walkComments = function walkComments(callback) {
      return this.walk(function(child, i) {
        if (child.type === 'comment') {
          return callback(child, i);
        }
      });
    };
    Container.prototype.append = function append() {
      var _this2 = this;
      for (var _len = arguments.length,
          children = Array(_len),
          _key = 0; _key < _len; _key++) {
        children[_key] = arguments[_key];
      }
      children.forEach(function(child) {
        var nodes = _this2.normalize(child, _this2.last);
        nodes.forEach(function(node) {
          return _this2.nodes.push(node);
        });
      });
      return this;
    };
    Container.prototype.prepend = function prepend() {
      var _this3 = this;
      for (var _len2 = arguments.length,
          children = Array(_len2),
          _key2 = 0; _key2 < _len2; _key2++) {
        children[_key2] = arguments[_key2];
      }
      children = children.reverse();
      children.forEach(function(child) {
        var nodes = _this3.normalize(child, _this3.first, 'prepend').reverse();
        nodes.forEach(function(node) {
          return _this3.nodes.unshift(node);
        });
        for (var id in _this3.indexes) {
          _this3.indexes[id] = _this3.indexes[id] + nodes.length;
        }
      });
      return this;
    };
    Container.prototype.cleanRaws = function cleanRaws(keepBetween) {
      _Node.prototype.cleanRaws.call(this, keepBetween);
      if (this.nodes) {
        this.nodes.forEach(function(node) {
          return node.cleanRaws(keepBetween);
        });
      }
    };
    Container.prototype.insertBefore = function insertBefore(exist, add) {
      var _this4 = this;
      exist = this.index(exist);
      var type = exist === 0 ? 'prepend' : false;
      var nodes = this.normalize(add, this.nodes[exist], type).reverse();
      nodes.forEach(function(node) {
        return _this4.nodes.splice(exist, 0, node);
      });
      var index = void 0;
      for (var id in this.indexes) {
        index = this.indexes[id];
        if (exist <= index) {
          this.indexes[id] = index + nodes.length;
        }
      }
      return this;
    };
    Container.prototype.insertAfter = function insertAfter(exist, add) {
      var _this5 = this;
      exist = this.index(exist);
      var nodes = this.normalize(add, this.nodes[exist]).reverse();
      nodes.forEach(function(node) {
        return _this5.nodes.splice(exist + 1, 0, node);
      });
      var index = void 0;
      for (var id in this.indexes) {
        index = this.indexes[id];
        if (exist < index) {
          this.indexes[id] = index + nodes.length;
        }
      }
      return this;
    };
    Container.prototype.remove = function remove(child) {
      if (typeof child !== 'undefined') {
        (0, _warnOnce2.default)('Container#remove is deprecated. ' + 'Use Container#removeChild');
        this.removeChild(child);
      } else {
        _Node.prototype.remove.call(this);
      }
      return this;
    };
    Container.prototype.removeChild = function removeChild(child) {
      child = this.index(child);
      this.nodes[child].parent = undefined;
      this.nodes.splice(child, 1);
      var index = void 0;
      for (var id in this.indexes) {
        index = this.indexes[id];
        if (index >= child) {
          this.indexes[id] = index - 1;
        }
      }
      return this;
    };
    Container.prototype.removeAll = function removeAll() {
      this.nodes.forEach(function(node) {
        return node.parent = undefined;
      });
      this.nodes = [];
      return this;
    };
    Container.prototype.replaceValues = function replaceValues(pattern, opts, callback) {
      if (!callback) {
        callback = opts;
        opts = {};
      }
      this.walkDecls(function(decl) {
        if (opts.props && opts.props.indexOf(decl.prop) === -1)
          return;
        if (opts.fast && decl.value.indexOf(opts.fast) === -1)
          return;
        decl.value = decl.value.replace(pattern, callback);
      });
      return this;
    };
    Container.prototype.every = function every(condition) {
      return this.nodes.every(condition);
    };
    Container.prototype.some = function some(condition) {
      return this.nodes.some(condition);
    };
    Container.prototype.index = function index(child) {
      if (typeof child === 'number') {
        return child;
      } else {
        return this.nodes.indexOf(child);
      }
    };
    Container.prototype.normalize = function normalize(nodes, sample) {
      var _this6 = this;
      if (typeof nodes === 'string') {
        nodes = cleanSource((0, _parse2.default)(nodes).nodes);
      } else if (!Array.isArray(nodes)) {
        if (nodes.type === 'root') {
          nodes = nodes.nodes;
        } else if (nodes.type) {
          nodes = [nodes];
        } else if (nodes.prop) {
          if (typeof nodes.value === 'undefined') {
            throw new Error('Value field is missed in node creation');
          } else if (typeof nodes.value !== 'string') {
            nodes.value = String(nodes.value);
          }
          nodes = [new _declaration2.default(nodes)];
        } else if (nodes.selector) {
          nodes = [new _rule2.default(nodes)];
        } else if (nodes.name) {
          nodes = [new _atRule2.default(nodes)];
        } else if (nodes.text) {
          nodes = [new _comment2.default(nodes)];
        } else {
          throw new Error('Unknown node type in node creation');
        }
      }
      var processed = nodes.map(function(i) {
        if (typeof i.raws === 'undefined')
          i = _this6.rebuild(i);
        if (i.parent)
          i = i.clone();
        if (typeof i.raws.before === 'undefined') {
          if (sample && typeof sample.raws.before !== 'undefined') {
            i.raws.before = sample.raws.before.replace(/[^\s]/g, '');
          }
        }
        i.parent = _this6;
        return i;
      });
      return processed;
    };
    Container.prototype.rebuild = function rebuild(node, parent) {
      var _this7 = this;
      var fix = void 0;
      if (node.type === 'root') {
        fix = new _root2.default();
      } else if (node.type === 'atrule') {
        fix = new _atRule2.default();
      } else if (node.type === 'rule') {
        fix = new _rule2.default();
      } else if (node.type === 'decl') {
        fix = new _declaration2.default();
      } else if (node.type === 'comment') {
        fix = new _comment2.default();
      }
      for (var i in node) {
        if (i === 'nodes') {
          fix.nodes = node.nodes.map(function(j) {
            return _this7.rebuild(j, fix);
          });
        } else if (i === 'parent' && parent) {
          fix.parent = parent;
        } else if (node.hasOwnProperty(i)) {
          fix[i] = node[i];
        }
      }
      return fix;
    };
    Container.prototype.eachInside = function eachInside(callback) {
      (0, _warnOnce2.default)('Container#eachInside is deprecated. ' + 'Use Container#walk instead.');
      return this.walk(callback);
    };
    Container.prototype.eachDecl = function eachDecl(prop, callback) {
      (0, _warnOnce2.default)('Container#eachDecl is deprecated. ' + 'Use Container#walkDecls instead.');
      return this.walkDecls(prop, callback);
    };
    Container.prototype.eachRule = function eachRule(selector, callback) {
      (0, _warnOnce2.default)('Container#eachRule is deprecated. ' + 'Use Container#walkRules instead.');
      return this.walkRules(selector, callback);
    };
    Container.prototype.eachAtRule = function eachAtRule(name, callback) {
      (0, _warnOnce2.default)('Container#eachAtRule is deprecated. ' + 'Use Container#walkAtRules instead.');
      return this.walkAtRules(name, callback);
    };
    Container.prototype.eachComment = function eachComment(callback) {
      (0, _warnOnce2.default)('Container#eachComment is deprecated. ' + 'Use Container#walkComments instead.');
      return this.walkComments(callback);
    };
    _createClass(Container, [{
      key: 'first',
      get: function get() {
        if (!this.nodes)
          return undefined;
        return this.nodes[0];
      }
    }, {
      key: 'last',
      get: function get() {
        if (!this.nodes)
          return undefined;
        return this.nodes[this.nodes.length - 1];
      }
    }, {
      key: 'semicolon',
      get: function get() {
        (0, _warnOnce2.default)('Node#semicolon is deprecated. Use Node#raws.semicolon');
        return this.raws.semicolon;
      },
      set: function set(val) {
        (0, _warnOnce2.default)('Node#semicolon is deprecated. Use Node#raws.semicolon');
        this.raws.semicolon = val;
      }
    }, {
      key: 'after',
      get: function get() {
        (0, _warnOnce2.default)('Node#after is deprecated. Use Node#raws.after');
        return this.raws.after;
      },
      set: function set(val) {
        (0, _warnOnce2.default)('Node#after is deprecated. Use Node#raws.after');
        this.raws.after = val;
      }
    }]);
    return Container;
  }(_node2.default);
  exports.default = Container;
  module.exports = exports['default'];
})(require('process'));
