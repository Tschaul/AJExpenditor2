/* */ 
(function(process) {
  'use strict';
  exports.__esModule = true;
  require('./rule');
  var _container = require('./container');
  var _container2 = _interopRequireDefault(_container);
  var _lazyResult = require('./lazy-result');
  var _lazyResult2 = _interopRequireDefault(_lazyResult);
  var _processor = require('./processor');
  var _processor2 = _interopRequireDefault(_processor);
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
  var Root = function(_Container) {
    _inherits(Root, _Container);
    function Root(defaults) {
      _classCallCheck(this, Root);
      var _this = _possibleConstructorReturn(this, _Container.call(this, defaults));
      _this.type = 'root';
      if (!_this.nodes)
        _this.nodes = [];
      return _this;
    }
    Root.prototype.removeChild = function removeChild(child) {
      child = this.index(child);
      if (child === 0 && this.nodes.length > 1) {
        this.nodes[1].raws.before = this.nodes[child].raws.before;
      }
      return _Container.prototype.removeChild.call(this, child);
    };
    Root.prototype.normalize = function normalize(child, sample, type) {
      var nodes = _Container.prototype.normalize.call(this, child);
      if (sample) {
        if (type === 'prepend') {
          if (this.nodes.length > 1) {
            sample.raws.before = this.nodes[1].raws.before;
          } else {
            delete sample.raws.before;
          }
        } else if (this.first !== sample) {
          nodes.forEach(function(node) {
            node.raws.before = sample.raws.before;
          });
        }
      }
      return nodes;
    };
    Root.prototype.toResult = function toResult() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var lazy = new _lazyResult2.default(new _processor2.default(), this, opts);
      return lazy.stringify();
    };
    Root.prototype.remove = function remove(child) {
      (0, _warnOnce2.default)('Root#remove is deprecated. Use Root#removeChild');
      this.removeChild(child);
    };
    Root.prototype.prevMap = function prevMap() {
      (0, _warnOnce2.default)('Root#prevMap is deprecated. Use Root#source.input.map');
      return this.source.input.map;
    };
    return Root;
  }(_container2.default);
  exports.default = Root;
  module.exports = exports['default'];
})(require('process'));
