/* */ 
(function(process) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var _regenerator = require('babel-runtime/regenerator');
  var _regenerator2 = _interopRequireDefault(_regenerator);
  var _getIterator2 = require('babel-runtime/core-js/get-iterator');
  var _getIterator3 = _interopRequireDefault(_getIterator2);
  var _stringify = require('babel-runtime/core-js/json/stringify');
  var _stringify2 = _interopRequireDefault(_stringify);
  var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');
  var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
  var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');
  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
  var _createClass2 = require('babel-runtime/helpers/createClass');
  var _createClass3 = _interopRequireDefault(_createClass2);
  var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');
  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
  var _inherits2 = require('babel-runtime/helpers/inherits');
  var _inherits3 = _interopRequireDefault(_inherits2);
  var _underscore = require('underscore');
  var _underscore2 = _interopRequireDefault(_underscore);
  var _immutable = require('immutable');
  var _immutable2 = _interopRequireDefault(_immutable);
  var _bounded = require('./io/bounded');
  var _bounded2 = _interopRequireDefault(_bounded);
  var _event = require('./event');
  var _event2 = _interopRequireDefault(_event);
  var _timerange = require('./timerange');
  var _timerange2 = _interopRequireDefault(_timerange);
  var _util = require('./base/util');
  var _util2 = _interopRequireDefault(_util);
  var _functions = require('./base/functions');
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var Collection = function(_Bounded) {
    (0, _inherits3.default)(Collection, _Bounded);
    function Collection(arg1, arg2) {
      (0, _classCallCheck3.default)(this, Collection);
      var _this = (0, _possibleConstructorReturn3.default)(this, (Collection.__proto__ || (0, _getPrototypeOf2.default)(Collection)).call(this));
      _this._id = _underscore2.default.uniqueId("collection-");
      _this._eventList = null;
      _this._type = null;
      if (!arg1) {
        _this._eventList = new _immutable2.default.List();
      } else if (arg1 instanceof Collection) {
        var other = arg1;
        var copyEvents = arg2 || true;
        if (_underscore2.default.isUndefined(copyEvents) || copyEvents === true) {
          _this._eventList = other._eventList;
          _this._type = other._type;
        } else {
          _this._eventList = new _immutable2.default.List();
        }
      } else if (_underscore2.default.isArray(arg1)) {
        var events = [];
        arg1.forEach(function(e) {
          _this._check(e);
          events.push(e._d);
        });
        _this._eventList = new _immutable2.default.List(events);
      } else if (_immutable2.default.List.isList(arg1)) {
        var type = arg2;
        if (!type) {
          throw new Error("No type supplied to Collection constructor");
        }
        _this._type = type;
        _this._eventList = arg1;
      }
      return _this;
    }
    (0, _createClass3.default)(Collection, [{
      key: "toJSON",
      value: function toJSON() {
        return this._eventList.toJS();
      }
    }, {
      key: "toString",
      value: function toString() {
        return (0, _stringify2.default)(this.toJSON());
      }
    }, {
      key: "type",
      value: function type() {
        return this._type;
      }
    }, {
      key: "size",
      value: function size() {
        return this._eventList.size;
      }
    }, {
      key: "sizeValid",
      value: function sizeValid() {
        var fieldPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "value";
        var count = 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
          for (var _iterator = (0, _getIterator3.default)(this.events()),
              _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var e = _step.value;
            if (_event2.default.isValidValue(e, fieldPath))
              count++;
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
        return count;
      }
    }, {
      key: "at",
      value: function at(pos) {
        if (this._eventList.size > 0) {
          var event = new this._type(this._eventList.get(pos));
          return event;
        }
      }
    }, {
      key: "atKey",
      value: function atKey(k) {
        var result = [];
        var key = void 0;
        if (k instanceof Date) {
          key = k.getTime();
        } else if (_underscore2.default.isString(k)) {
          key = k;
        } else if (k instanceof _timerange2.default) {
          key = this.timerange().begin() + "," + this.timerange().end();
        }
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;
        try {
          for (var _iterator2 = (0, _getIterator3.default)(this.events()),
              _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var e = _step2.value;
            if (e.key() === key) {
              result.push(e);
            }
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
        return result;
      }
    }, {
      key: "atFirst",
      value: function atFirst() {
        if (this.size()) {
          return this.at(0);
        }
      }
    }, {
      key: "atLast",
      value: function atLast() {
        if (this.size()) {
          return this.at(this.size() - 1);
        }
      }
    }, {
      key: "events",
      value: _regenerator2.default.mark(function events() {
        var i;
        return _regenerator2.default.wrap(function events$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                i = 0;
              case 1:
                if (!(i < this.size())) {
                  _context.next = 7;
                  break;
                }
                _context.next = 4;
                return this.at(i);
              case 4:
                i++;
                _context.next = 1;
                break;
              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, events, this);
      })
    }, {
      key: "setEvents",
      value: function setEvents(events) {
        var result = new Collection(this);
        result._eventList = events;
        return result;
      }
    }, {
      key: "eventList",
      value: function eventList() {
        return this._eventList;
      }
    }, {
      key: "eventListAsArray",
      value: function eventListAsArray() {
        var events = [];
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;
        try {
          for (var _iterator3 = (0, _getIterator3.default)(this.events()),
              _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var e = _step3.value;
            events.push(e);
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
        return events;
      }
    }, {
      key: "eventListAsMap",
      value: function eventListAsMap() {
        var events = {};
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;
        try {
          for (var _iterator4 = (0, _getIterator3.default)(this.events()),
              _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var e = _step4.value;
            var key = e.key();
            if (!_underscore2.default.has(events, key)) {
              events[key] = [];
            }
            events[key].push(e);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
        return events;
      }
    }, {
      key: "dedup",
      value: function dedup() {
        var events = _event2.default.merge(this.eventListAsArray());
        return new Collection(events);
      }
    }, {
      key: "sortByTime",
      value: function sortByTime() {
        var _this2 = this;
        var sorted = this._eventList.sortBy(function(event) {
          var e = new _this2._type(event);
          return e.timestamp().getTime();
        });
        return this.setEvents(sorted);
      }
    }, {
      key: "sort",
      value: function sort(fieldPath) {
        var _this3 = this;
        var fs = _util2.default.fieldPathToArray(fieldPath);
        var sorted = this._eventList.sortBy(function(event) {
          var e = new _this3._type(event);
          return e.get(fs);
        });
        return this.setEvents(sorted);
      }
    }, {
      key: "range",
      value: function range() {
        var min = void 0;
        var max = void 0;
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;
        try {
          for (var _iterator5 = (0, _getIterator3.default)(this.events()),
              _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var e = _step5.value;
            if (!min || e.begin() < min)
              min = e.begin();
            if (!max || e.end() > max)
              max = e.end();
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
        if (min && max)
          return new _timerange2.default(min, max);
      }
    }, {
      key: "addEvent",
      value: function addEvent(event) {
        this._check(event);
        var result = new Collection(this);
        result._eventList = this._eventList.push(event._d);
        return result;
      }
    }, {
      key: "slice",
      value: function slice(begin, end) {
        return new Collection(this._eventList.slice(begin, end), this._type);
      }
    }, {
      key: "filter",
      value: function filter(filterFunc) {
        var filteredEventList = [];
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;
        try {
          for (var _iterator6 = (0, _getIterator3.default)(this.events()),
              _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var e = _step6.value;
            if (filterFunc(e)) {
              filteredEventList.push(e);
            }
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }
        return new Collection(filteredEventList);
      }
    }, {
      key: "map",
      value: function map(mapFunc) {
        var result = [];
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;
        try {
          for (var _iterator7 = (0, _getIterator3.default)(this.events()),
              _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var e = _step7.value;
            result.push(mapFunc(e));
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }
        return new Collection(result);
      }
    }, {
      key: "clean",
      value: function clean(fieldPath) {
        var fs = _util2.default.fieldPathToArray(fieldPath);
        var filteredEvents = [];
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;
        try {
          for (var _iterator8 = (0, _getIterator3.default)(this.events()),
              _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var e = _step8.value;
            if (_event2.default.isValidValue(e, fs)) {
              filteredEvents.push(e);
            }
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }
        return new Collection(filteredEvents);
      }
    }, {
      key: "count",
      value: function count() {
        return this.size();
      }
    }, {
      key: "first",
      value: function first(fieldPath, filter) {
        return this.aggregate((0, _functions.first)(filter), fieldPath);
      }
    }, {
      key: "last",
      value: function last(fieldPath, filter) {
        return this.aggregate((0, _functions.last)(filter), fieldPath);
      }
    }, {
      key: "sum",
      value: function sum(fieldPath, filter) {
        return this.aggregate((0, _functions.sum)(filter), fieldPath);
      }
    }, {
      key: "avg",
      value: function avg(fieldPath, filter) {
        return this.aggregate((0, _functions.avg)(filter), fieldPath);
      }
    }, {
      key: "max",
      value: function max(fieldPath, filter) {
        return this.aggregate((0, _functions.max)(filter), fieldPath);
      }
    }, {
      key: "min",
      value: function min(fieldPath, filter) {
        return this.aggregate((0, _functions.min)(filter), fieldPath);
      }
    }, {
      key: "mean",
      value: function mean(fieldPath, filter) {
        return this.avg(fieldPath, filter);
      }
    }, {
      key: "median",
      value: function median(fieldPath, filter) {
        return this.aggregate((0, _functions.median)(filter), fieldPath);
      }
    }, {
      key: "stdev",
      value: function stdev(fieldPath, filter) {
        return this.aggregate((0, _functions.stdev)(filter), fieldPath);
      }
    }, {
      key: "percentile",
      value: function percentile(q, fieldPath) {
        var interp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "linear";
        var filter = arguments[3];
        return this.aggregate((0, _functions.percentile)(q, interp, filter), fieldPath);
      }
    }, {
      key: "aggregate",
      value: function aggregate(func, fieldPath) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var fpath = void 0;
        if (!_underscore2.default.isFunction(func)) {
          throw new Error("First arg to aggregate() must be a function");
        }
        if (_underscore2.default.isString(fieldPath)) {
          fpath = fieldPath;
        } else if (_underscore2.default.isArray(fieldPath)) {
          fpath = fieldPath.split(".");
        } else if (_underscore2.default.isUndefined(fieldPath)) {
          fpath = "value";
        } else {
          throw new Error("Collection.aggregate() takes a string/array fieldPath");
        }
        var result = _event2.default.mapReduce(this.eventListAsArray(), fpath, func, options);
        return result[fpath];
      }
    }, {
      key: "quantile",
      value: function quantile(n) {
        var column = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "value";
        var interp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "linear";
        var results = [];
        var sorted = this.sort(column);
        var subsets = 1.0 / n;
        if (n > this.length) {
          throw new Error("Subset n is greater than the Collection length");
        }
        for (var i = subsets; i < 1; i += subsets) {
          var index = Math.floor((sorted.size() - 1) * i);
          if (index < sorted.size() - 1) {
            var fraction = (sorted.size() - 1) * i - index;
            var v0 = sorted.at(index).get(column);
            var v1 = sorted.at(index + 1).get(column);
            var v = void 0;
            if (interp === "lower" || fraction === 0) {
              v = v0;
            } else if (interp === "linear") {
              v = v0 + (v1 - v0) * fraction;
            } else if (interp === "higher") {
              v = v1;
            } else if (interp === "nearest") {
              v = fraction < 0.5 ? v0 : v1;
            } else if (interp === "midpoint") {
              v = (v0 + v1) / 2;
            }
            results.push(v);
          }
        }
        return results;
      }
    }, {
      key: "isChronological",
      value: function isChronological() {
        var result = true;
        var t = void 0;
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;
        try {
          for (var _iterator9 = (0, _getIterator3.default)(this.events()),
              _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var e = _step9.value;
            if (!t) {
              t = e.timestamp().getTime();
            } else {
              if (e.timestamp() < t) {
                result = false;
              }
              t = e.timestamp();
            }
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9.return) {
              _iterator9.return();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
            }
          }
        }
        return result;
      }
    }], [{
      key: "equal",
      value: function equal(collection1, collection2) {
        return collection1._type === collection2._type && collection1._eventList === collection2._eventList;
      }
    }, {
      key: "is",
      value: function is(collection1, collection2) {
        return collection1._type === collection2._type && _immutable2.default.is(collection1._eventList, collection2._eventList);
      }
    }]);
    return Collection;
  }(_bounded2.default);
  exports.default = Collection;
})(require('process'));
