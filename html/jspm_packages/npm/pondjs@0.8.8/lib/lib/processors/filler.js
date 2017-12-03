/* */ 
(function(process) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');
  var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
  var _getIterator2 = require('babel-runtime/core-js/get-iterator');
  var _getIterator3 = _interopRequireDefault(_getIterator2);
  var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');
  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
  var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');
  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
  var _createClass2 = require('babel-runtime/helpers/createClass');
  var _createClass3 = _interopRequireDefault(_createClass2);
  var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');
  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
  var _get2 = require('babel-runtime/helpers/get');
  var _get3 = _interopRequireDefault(_get2);
  var _inherits2 = require('babel-runtime/helpers/inherits');
  var _inherits3 = _interopRequireDefault(_inherits2);
  var _underscore = require('underscore');
  var _underscore2 = _interopRequireDefault(_underscore);
  var _processor = require('./processor');
  var _processor2 = _interopRequireDefault(_processor);
  var _pipeline = require('../pipeline');
  var _util = require('../base/util');
  var _util2 = _interopRequireDefault(_util);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var Filler = function(_Processor) {
    (0, _inherits3.default)(Filler, _Processor);
    function Filler(arg1, options) {
      (0, _classCallCheck3.default)(this, Filler);
      var _this = (0, _possibleConstructorReturn3.default)(this, (Filler.__proto__ || (0, _getPrototypeOf2.default)(Filler)).call(this, arg1, options));
      if (arg1 instanceof Filler) {
        var other = arg1;
        _this._fieldSpec = other._fieldSpec;
        _this._method = other._method;
        _this._limit = other._limit;
      } else if ((0, _pipeline.isPipeline)(arg1)) {
        var _options$fieldSpec = options.fieldSpec,
            fieldSpec = _options$fieldSpec === undefined ? null : _options$fieldSpec,
            _options$method = options.method,
            method = _options$method === undefined ? "zero" : _options$method,
            _options$limit = options.limit,
            limit = _options$limit === undefined ? null : _options$limit;
        _this._fieldSpec = fieldSpec;
        _this._method = method;
        _this._limit = limit;
      } else {
        throw new Error("Unknown arg to Filler constructor", arg1);
      }
      _this._previousEvent = null;
      _this._keyCount = {};
      _this._lastGoodLinear = null;
      _this._linearFillCache = [];
      if (!_underscore2.default.contains(["zero", "pad", "linear"], _this._method)) {
        throw new Error("Unknown method " + _this._method + " passed to Filler");
      }
      if (_this._limit && !_underscore2.default.isNumber(_this._limit)) {
        throw new Error("Limit supplied to fill() should be a number");
      }
      if (_underscore2.default.isString(_this._fieldSpec)) {
        _this._fieldSpec = [_this._fieldSpec];
      } else if (_underscore2.default.isNull(_this._fieldSpec)) {
        _this._fieldSpec = ["value"];
      }
      if (_this._method === "linear" && _this._fieldSpec.length > 1) {
        throw new Error("Linear fill takes a path to a single column");
      }
      return _this;
    }
    (0, _createClass3.default)(Filler, [{
      key: "clone",
      value: function clone() {
        return new Filler(this);
      }
    }, {
      key: "constFill",
      value: function constFill(data) {
        var newData = data;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
          for (var _iterator = (0, _getIterator3.default)(this._fieldSpec),
              _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var path = _step.value;
            var fieldPath = _util2.default.fieldPathToArray(path);
            var pathKey = fieldPath.join(":");
            if (!_underscore2.default.has(this._keyCount, pathKey)) {
              this._keyCount[pathKey] = 0;
            }
            if (!newData.hasIn(fieldPath)) {
              continue;
            }
            var val = newData.getIn(fieldPath);
            if (_util2.default.isMissing(val)) {
              if (this._limit && this._keyCount[pathKey] >= this._limit) {
                continue;
              }
              if (this._method === "zero") {
                newData = newData.setIn(fieldPath, 0);
                this._keyCount[pathKey]++;
              } else if (this._method === "pad") {
                if (!_underscore2.default.isNull(this._previousEvent)) {
                  var prevVal = this._previousEvent.data().getIn(fieldPath);
                  if (!_util2.default.isMissing(prevVal)) {
                    newData = newData.setIn(fieldPath, prevVal);
                    this._keyCount[pathKey]++;
                  }
                }
              } else if (this._method === "linear") {}
            } else {
              this._keyCount[pathKey] = 0;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
        return newData;
      }
    }, {
      key: "isValidLinearEvent",
      value: function isValidLinearEvent(event) {
        var valid = true;
        var fieldPath = _util2.default.fieldPathToArray(this._fieldSpec[0]);
        if (!event.data().hasIn(fieldPath)) {
          console.warn("path does not exist: " + fieldPath);
          return valid;
        }
        var val = event.data().getIn(fieldPath);
        if (_util2.default.isMissing(val) || !_underscore2.default.isNumber(val)) {
          valid = false;
        }
        return valid;
      }
    }, {
      key: "linearFill",
      value: function linearFill(event) {
        var _this2 = this;
        var isValidEvent = this.isValidLinearEvent(event);
        var events = [];
        if (isValidEvent && !this._linearFillCache.length) {
          this._lastGoodLinear = event;
          events.push(event);
        } else if (!isValidEvent && !_underscore2.default.isNull(this._lastGoodLinear)) {
          this._linearFillCache.push(event);
          if (!_underscore2.default.isNull(this._limit) && this._linearFillCache.length >= this._limit) {
            this._linearFillCache.forEach(function(e) {
              _this2.emit(e);
            });
            this._linearFillCache = [];
            this._lastGoodLinear = null;
          }
        } else if (!isValidEvent && _underscore2.default.isNull(this._lastGoodLinear)) {
          events.push(event);
        } else if (isValidEvent && this._linearFillCache) {
          var eventList = [this._lastGoodLinear].concat((0, _toConsumableArray3.default)(this._linearFillCache), [event]);
          var interpolatedEvents = this.interpolateEventList(eventList);
          interpolatedEvents.slice(1).forEach(function(e) {
            events.push(e);
          });
          this._linearFillCache = [];
          this._lastGoodLinear = event;
        }
        return events;
      }
    }, {
      key: "interpolateEventList",
      value: function interpolateEventList(events) {
        var prevValue = void 0;
        var prevTime = void 0;
        var newEvents = [];
        var fieldPath = _util2.default.fieldPathToArray(this._fieldSpec[0]);
        for (var i = 0; i < events.length; i++) {
          var e = events[i];
          if (i === 0) {
            prevValue = e.get(fieldPath);
            prevTime = e.timestamp().getTime();
            newEvents.push(e);
            continue;
          }
          if (i === events.length - 1) {
            newEvents.push(e);
            continue;
          }
          if (!_util2.default.isMissing(e.get(fieldPath)) && !_underscore2.default.isNumber(e.get(fieldPath))) {
            console.warn("linear requires numeric values - skipping this field_spec");
            return events;
          }
          if (_util2.default.isMissing(e.get(fieldPath))) {
            var ii = i + 1;
            var nextValue = null;
            var nextTime = null;
            while (_underscore2.default.isNull(nextValue) && ii < events.length) {
              var val = events[ii].get(fieldPath);
              if (!_util2.default.isMissing(val)) {
                nextValue = val;
                nextTime = events[ii].timestamp().getTime();
              }
              ii++;
            }
            if (!_underscore2.default.isNull(prevValue) && ~_underscore2.default.isNull(nextValue)) {
              var currentTime = e.timestamp().getTime();
              if (nextTime === prevTime) {
                var newValue = (prevValue + nextValue) / 2;
                newEvents.push(e.setData(newValue));
              } else {
                var f = (currentTime - prevTime) / (nextTime - prevTime);
                var _newValue = prevValue + f * (nextValue - prevValue);
                var d = e.data().setIn(fieldPath, _newValue);
                newEvents.push(e.setData(d));
              }
            } else {
              newEvents.push(e);
            }
          } else {
            newEvents.push(e);
          }
        }
        return newEvents;
      }
    }, {
      key: "addEvent",
      value: function addEvent(event) {
        if (this.hasObservers()) {
          var emitList = [];
          var d = event.data();
          if (this._method === "zero" || this._method === "pad") {
            var dd = this.constFill(d);
            var e = event.setData(dd);
            emitList.push(e);
            this._previousEvent = e;
          } else if (this._method === "linear") {
            this.linearFill(event).forEach(function(e) {
              emitList.push(e);
            });
          }
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;
          try {
            for (var _iterator2 = (0, _getIterator3.default)(emitList),
                _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _event = _step2.value;
              this.emit(_event);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      }
    }, {
      key: "flush",
      value: function flush() {
        if (this.hasObservers() && this._method == "linear") {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;
          try {
            for (var _iterator3 = (0, _getIterator3.default)(this._linearFillCache),
                _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var event = _step3.value;
              this.emit(event);
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
        (0, _get3.default)(Filler.prototype.__proto__ || (0, _getPrototypeOf2.default)(Filler.prototype), "flush", this).call(this);
      }
    }]);
    return Filler;
  }(_processor2.default);
  exports.default = Filler;
})(require('process'));
