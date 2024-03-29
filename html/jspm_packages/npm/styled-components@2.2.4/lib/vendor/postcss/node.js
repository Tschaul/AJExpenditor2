/* */ 
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
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
  return typeof obj;
} : function(obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};
var _cssSyntaxError = require('./css-syntax-error');
var _cssSyntaxError2 = _interopRequireDefault(_cssSyntaxError);
var _stringifier = require('./stringifier');
var _stringifier2 = _interopRequireDefault(_stringifier);
var _stringify = require('./stringify');
var _stringify2 = _interopRequireDefault(_stringify);
var _warnOnce = require('./warn-once');
var _warnOnce2 = _interopRequireDefault(_warnOnce);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var cloneNode = function cloneNode(obj, parent) {
  var cloned = new obj.constructor();
  for (var i in obj) {
    if (!obj.hasOwnProperty(i))
      continue;
    var value = obj[i];
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    if (i === 'parent' && type === 'object') {
      if (parent)
        cloned[i] = parent;
    } else if (i === 'source') {
      cloned[i] = value;
    } else if (value instanceof Array) {
      cloned[i] = value.map(function(j) {
        return cloneNode(j, cloned);
      });
    } else if (i !== 'before' && i !== 'after' && i !== 'between' && i !== 'semicolon') {
      if (type === 'object' && value !== null)
        value = cloneNode(value);
      cloned[i] = value;
    }
  }
  return cloned;
};
var Node = function() {
  function Node() {
    var defaults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Node);
    this.raws = {};
    for (var name in defaults) {
      this[name] = defaults[name];
    }
  }
  Node.prototype.error = function error(message) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (this.source) {
      var pos = this.positionBy(opts);
      return this.source.input.error(message, pos.line, pos.column, opts);
    } else {
      return new _cssSyntaxError2.default(message);
    }
  };
  Node.prototype.warn = function warn(result, text, opts) {
    var data = {node: this};
    for (var i in opts) {
      data[i] = opts[i];
    }
    return result.warn(text, data);
  };
  Node.prototype.remove = function remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this.parent = undefined;
    return this;
  };
  Node.prototype.toString = function toString() {
    var stringifier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _stringify2.default;
    if (stringifier.stringify)
      stringifier = stringifier.stringify;
    var result = '';
    stringifier(this, function(i) {
      result += i;
    });
    return result;
  };
  Node.prototype.clone = function clone() {
    var overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var cloned = cloneNode(this);
    for (var name in overrides) {
      cloned[name] = overrides[name];
    }
    return cloned;
  };
  Node.prototype.cloneBefore = function cloneBefore() {
    var overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var cloned = this.clone(overrides);
    this.parent.insertBefore(this, cloned);
    return cloned;
  };
  Node.prototype.cloneAfter = function cloneAfter() {
    var overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var cloned = this.clone(overrides);
    this.parent.insertAfter(this, cloned);
    return cloned;
  };
  Node.prototype.replaceWith = function replaceWith() {
    var _this = this;
    if (this.parent) {
      for (var _len = arguments.length,
          nodes = Array(_len),
          _key = 0; _key < _len; _key++) {
        nodes[_key] = arguments[_key];
      }
      nodes.forEach(function(node) {
        _this.parent.insertBefore(_this, node);
      });
      this.remove();
    }
    return this;
  };
  Node.prototype.moveTo = function moveTo(newParent) {
    this.cleanRaws(this.root() === newParent.root());
    this.remove();
    newParent.append(this);
    return this;
  };
  Node.prototype.moveBefore = function moveBefore(otherNode) {
    this.cleanRaws(this.root() === otherNode.root());
    this.remove();
    otherNode.parent.insertBefore(otherNode, this);
    return this;
  };
  Node.prototype.moveAfter = function moveAfter(otherNode) {
    this.cleanRaws(this.root() === otherNode.root());
    this.remove();
    otherNode.parent.insertAfter(otherNode, this);
    return this;
  };
  Node.prototype.next = function next() {
    var index = this.parent.index(this);
    return this.parent.nodes[index + 1];
  };
  Node.prototype.prev = function prev() {
    var index = this.parent.index(this);
    return this.parent.nodes[index - 1];
  };
  Node.prototype.toJSON = function toJSON() {
    var fixed = {};
    for (var name in this) {
      if (!this.hasOwnProperty(name))
        continue;
      if (name === 'parent')
        continue;
      var value = this[name];
      if (value instanceof Array) {
        fixed[name] = value.map(function(i) {
          if ((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === 'object' && i.toJSON) {
            return i.toJSON();
          } else {
            return i;
          }
        });
      } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.toJSON) {
        fixed[name] = value.toJSON();
      } else {
        fixed[name] = value;
      }
    }
    return fixed;
  };
  Node.prototype.raw = function raw(prop, defaultType) {
    var str = new _stringifier2.default();
    return str.raw(this, prop, defaultType);
  };
  Node.prototype.root = function root() {
    var result = this;
    while (result.parent) {
      result = result.parent;
    }
    return result;
  };
  Node.prototype.cleanRaws = function cleanRaws(keepBetween) {
    delete this.raws.before;
    delete this.raws.after;
    if (!keepBetween)
      delete this.raws.between;
  };
  Node.prototype.positionInside = function positionInside(index) {
    var string = this.toString();
    var column = this.source.start.column;
    var line = this.source.start.line;
    for (var i = 0; i < index; i++) {
      if (string[i] === '\n') {
        column = 1;
        line += 1;
      } else {
        column += 1;
      }
    }
    return {
      line: line,
      column: column
    };
  };
  Node.prototype.positionBy = function positionBy(opts) {
    var pos = this.source.start;
    if (opts.index) {
      pos = this.positionInside(opts.index);
    } else if (opts.word) {
      var index = this.toString().indexOf(opts.word);
      if (index !== -1)
        pos = this.positionInside(index);
    }
    return pos;
  };
  Node.prototype.removeSelf = function removeSelf() {
    (0, _warnOnce2.default)('Node#removeSelf is deprecated. Use Node#remove.');
    return this.remove();
  };
  Node.prototype.replace = function replace(nodes) {
    (0, _warnOnce2.default)('Node#replace is deprecated. Use Node#replaceWith');
    return this.replaceWith(nodes);
  };
  Node.prototype.style = function style(own, detect) {
    (0, _warnOnce2.default)('Node#style() is deprecated. Use Node#raw()');
    return this.raw(own, detect);
  };
  Node.prototype.cleanStyles = function cleanStyles(keepBetween) {
    (0, _warnOnce2.default)('Node#cleanStyles() is deprecated. Use Node#cleanRaws()');
    return this.cleanRaws(keepBetween);
  };
  _createClass(Node, [{
    key: 'before',
    get: function get() {
      (0, _warnOnce2.default)('Node#before is deprecated. Use Node#raws.before');
      return this.raws.before;
    },
    set: function set(val) {
      (0, _warnOnce2.default)('Node#before is deprecated. Use Node#raws.before');
      this.raws.before = val;
    }
  }, {
    key: 'between',
    get: function get() {
      (0, _warnOnce2.default)('Node#between is deprecated. Use Node#raws.between');
      return this.raws.between;
    },
    set: function set(val) {
      (0, _warnOnce2.default)('Node#between is deprecated. Use Node#raws.between');
      this.raws.between = val;
    }
  }]);
  return Node;
}();
exports.default = Node;
module.exports = exports['default'];
