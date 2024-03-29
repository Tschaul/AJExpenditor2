/* */ 
'use strict';
Object.defineProperty(exports, "__esModule", {value: true});
var _extends = Object.assign || function(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
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
var _classnames = require('classnames');
var _classnames2 = _interopRequireDefault(_classnames);
var _height = require('dom-helpers/query/height');
var _height2 = _interopRequireDefault(_height);
var _offset = require('dom-helpers/query/offset');
var _offset2 = _interopRequireDefault(_offset);
var _offsetParent = require('dom-helpers/query/offsetParent');
var _offsetParent2 = _interopRequireDefault(_offsetParent);
var _scrollTop = require('dom-helpers/query/scrollTop');
var _scrollTop2 = _interopRequireDefault(_scrollTop);
var _requestAnimationFrame = require('dom-helpers/util/requestAnimationFrame');
var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactDom = require('react-dom');
var _reactDom2 = _interopRequireDefault(_reactDom);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var _addEventListener = require('./utils/addEventListener');
var _addEventListener2 = _interopRequireDefault(_addEventListener);
var _getDocumentHeight = require('./utils/getDocumentHeight');
var _getDocumentHeight2 = _interopRequireDefault(_getDocumentHeight);
var _ownerDocument = require('./utils/ownerDocument');
var _ownerDocument2 = _interopRequireDefault(_ownerDocument);
var _ownerWindow = require('./utils/ownerWindow');
var _ownerWindow2 = _interopRequireDefault(_ownerWindow);
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
var Affix = function(_React$Component) {
  _inherits(Affix, _React$Component);
  function Affix(props, context) {
    _classCallCheck(this, Affix);
    var _this = _possibleConstructorReturn(this, (Affix.__proto__ || Object.getPrototypeOf(Affix)).call(this, props, context));
    _this.onWindowScroll = function() {
      _this.onUpdate();
    };
    _this.onDocumentClick = function() {
      (0, _requestAnimationFrame2.default)(function() {
        return _this.onUpdate();
      });
    };
    _this.onUpdate = function() {
      if (!_this._isMounted) {
        return;
      }
      var _this$props = _this.props;
      var offsetTop = _this$props.offsetTop;
      var viewportOffsetTop = _this$props.viewportOffsetTop;
      var scrollTop = (0, _scrollTop2.default)((0, _ownerWindow2.default)(_this));
      var positionTopMin = scrollTop + (viewportOffsetTop || 0);
      if (positionTopMin <= offsetTop) {
        _this.updateState('top', null, null);
        return;
      }
      if (positionTopMin > _this.getPositionTopMax()) {
        if (_this.state.affixed === 'bottom') {
          _this.updateStateAtBottom();
        } else {
          _this.setState({
            affixed: 'bottom',
            position: 'absolute',
            top: null
          }, function() {
            if (!_this._isMounted) {
              return;
            }
            _this.updateStateAtBottom();
          });
        }
        return;
      }
      _this.updateState('affix', 'fixed', viewportOffsetTop);
    };
    _this.getPositionTopMax = function() {
      var documentHeight = (0, _getDocumentHeight2.default)((0, _ownerDocument2.default)(_this));
      var height = (0, _height2.default)(_reactDom2.default.findDOMNode(_this));
      return documentHeight - height - _this.props.offsetBottom;
    };
    _this.updateState = function(affixed, position, top) {
      if (affixed === _this.state.affixed && position === _this.state.position && top === _this.state.top) {
        return;
      }
      var upperName = affixed === 'affix' ? '' : affixed.charAt(0).toUpperCase() + affixed.substr(1);
      if (_this.props['onAffix' + upperName]) {
        _this.props['onAffix' + upperName]();
      }
      _this.setState({
        affixed: affixed,
        position: position,
        top: top
      }, function() {
        if (_this.props['onAffixed' + upperName]) {
          _this.props['onAffixed' + upperName]();
        }
      });
    };
    _this.updateStateAtBottom = function() {
      var positionTopMax = _this.getPositionTopMax();
      var offsetParent = (0, _offsetParent2.default)(_reactDom2.default.findDOMNode(_this));
      var parentTop = (0, _offset2.default)(offsetParent).top;
      _this.updateState('bottom', 'absolute', positionTopMax - parentTop);
    };
    _this.state = {
      affixed: 'top',
      position: null,
      top: null
    };
    _this._needPositionUpdate = false;
    return _this;
  }
  _createClass(Affix, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;
      this._isMounted = true;
      this._windowScrollListener = (0, _addEventListener2.default)((0, _ownerWindow2.default)(this), 'scroll', function() {
        return _this2.onWindowScroll();
      });
      this._documentClickListener = (0, _addEventListener2.default)((0, _ownerDocument2.default)(this), 'click', function() {
        return _this2.onDocumentClick();
      });
      this.onUpdate();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      this._needPositionUpdate = true;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this._needPositionUpdate) {
        this._needPositionUpdate = false;
        this.onUpdate();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._isMounted = false;
      if (this._windowScrollListener) {
        this._windowScrollListener.remove();
      }
      if (this._documentClickListener) {
        this._documentClickListener.remove();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var child = _react2.default.Children.only(this.props.children);
      var _child$props = child.props;
      var className = _child$props.className;
      var style = _child$props.style;
      var _state = this.state;
      var affixed = _state.affixed;
      var position = _state.position;
      var top = _state.top;
      var positionStyle = {
        position: position,
        top: top
      };
      var affixClassName = void 0;
      var affixStyle = void 0;
      if (affixed === 'top') {
        affixClassName = this.props.topClassName;
        affixStyle = this.props.topStyle;
      } else if (affixed === 'bottom') {
        affixClassName = this.props.bottomClassName;
        affixStyle = this.props.bottomStyle;
      } else {
        affixClassName = this.props.affixClassName;
        affixStyle = this.props.affixStyle;
      }
      return _react2.default.cloneElement(child, {
        className: (0, _classnames2.default)(affixClassName, className),
        style: _extends({}, positionStyle, affixStyle, style)
      });
    }
  }]);
  return Affix;
}(_react2.default.Component);
Affix.propTypes = {
  offsetTop: _propTypes2.default.number,
  viewportOffsetTop: _propTypes2.default.number,
  offsetBottom: _propTypes2.default.number,
  topClassName: _propTypes2.default.string,
  topStyle: _propTypes2.default.object,
  affixClassName: _propTypes2.default.string,
  affixStyle: _propTypes2.default.object,
  bottomClassName: _propTypes2.default.string,
  bottomStyle: _propTypes2.default.object,
  onAffix: _propTypes2.default.func,
  onAffixed: _propTypes2.default.func,
  onAffixTop: _propTypes2.default.func,
  onAffixedTop: _propTypes2.default.func,
  onAffixBottom: _propTypes2.default.func,
  onAffixedBottom: _propTypes2.default.func
};
Affix.defaultProps = {
  offsetTop: 0,
  viewportOffsetTop: null,
  offsetBottom: 0
};
exports.default = Affix;
module.exports = exports['default'];
