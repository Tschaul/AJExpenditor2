/* */ 
(function(process) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.isPipeline = exports.Pipeline = undefined;
  var _extends2 = require('babel-runtime/helpers/extends');
  var _extends3 = _interopRequireDefault(_extends2);
  var _getIterator2 = require('babel-runtime/core-js/get-iterator');
  var _getIterator3 = _interopRequireDefault(_getIterator2);
  var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');
  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
  var _createClass2 = require('babel-runtime/helpers/createClass');
  var _createClass3 = _interopRequireDefault(_createClass2);
  var _immutable = require('immutable');
  var _immutable2 = _interopRequireDefault(_immutable);
  var _underscore = require('underscore');
  var _underscore2 = _interopRequireDefault(_underscore);
  var _timeevent = require('./timeevent');
  var _timeevent2 = _interopRequireDefault(_timeevent);
  var _indexedevent = require('./indexedevent');
  var _indexedevent2 = _interopRequireDefault(_indexedevent);
  var _timerangeevent = require('./timerangeevent');
  var _timerangeevent2 = _interopRequireDefault(_timerangeevent);
  var _timeseries = require('./timeseries');
  var _timeseries2 = _interopRequireDefault(_timeseries);
  var _bounded = require('./io/bounded');
  var _bounded2 = _interopRequireDefault(_bounded);
  var _collectionout = require('./io/collectionout');
  var _collectionout2 = _interopRequireDefault(_collectionout);
  var _eventout = require('./io/eventout');
  var _eventout2 = _interopRequireDefault(_eventout);
  var _stream = require('./io/stream');
  var _stream2 = _interopRequireDefault(_stream);
  var _aggregator = require('./processors/aggregator');
  var _aggregator2 = _interopRequireDefault(_aggregator);
  var _aligner = require('./processors/aligner');
  var _aligner2 = _interopRequireDefault(_aligner);
  var _collapser = require('./processors/collapser');
  var _collapser2 = _interopRequireDefault(_collapser);
  var _converter = require('./processors/converter');
  var _converter2 = _interopRequireDefault(_converter);
  var _derivator = require('./processors/derivator');
  var _derivator2 = _interopRequireDefault(_derivator);
  var _filler = require('./processors/filler');
  var _filler2 = _interopRequireDefault(_filler);
  var _filter = require('./processors/filter');
  var _filter2 = _interopRequireDefault(_filter);
  var _mapper = require('./processors/mapper');
  var _mapper2 = _interopRequireDefault(_mapper);
  var _offset = require('./processors/offset');
  var _offset2 = _interopRequireDefault(_offset);
  var _processor = require('./processors/processor');
  var _processor2 = _interopRequireDefault(_processor);
  var _selector = require('./processors/selector');
  var _selector2 = _interopRequireDefault(_selector);
  var _taker = require('./processors/taker');
  var _taker2 = _interopRequireDefault(_taker);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var Runner = function() {
    function Runner(pipeline, output) {
      var _this = this;
      (0, _classCallCheck3.default)(this, Runner);
      this._output = output;
      this._pipeline = pipeline;
      var processChain = [];
      if (pipeline.last()) {
        processChain = pipeline.last().chain();
        this._input = processChain[0].pipeline().in();
      } else {
        this._input = pipeline.in();
      }
      this._executionChain = [this._output];
      var prev = this._output;
      processChain.forEach(function(p) {
        if (p instanceof _processor2.default) {
          var processor = p.clone();
          if (prev)
            processor.addObserver(prev);
          _this._executionChain.push(processor);
          prev = processor;
        }
      });
    }
    (0, _createClass3.default)(Runner, [{
      key: "start",
      value: function start() {
        var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        this._pipeline.clearResults();
        var head = this._executionChain.pop();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
          for (var _iterator = (0, _getIterator3.default)(this._input.events()),
              _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var e = _step.value;
            head.addEvent(e);
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
        if (force) {
          head.flush();
        }
      }
    }]);
    return Runner;
  }();
  var Pipeline = function() {
    function Pipeline(arg) {
      (0, _classCallCheck3.default)(this, Pipeline);
      if (arg instanceof Pipeline) {
        var other = arg;
        this._d = other._d;
      } else if (arg instanceof _immutable2.default.Map) {
        this._d = arg;
      } else {
        this._d = new _immutable2.default.Map({
          type: null,
          in: null,
          first: null,
          last: null,
          groupBy: function groupBy() {
            return "";
          },
          windowType: "global",
          windowDuration: null,
          emitOn: "eachEvent"
        });
      }
      this._results = [];
    }
    (0, _createClass3.default)(Pipeline, [{
      key: "in",
      value: function _in() {
        return this._d.get("in");
      }
    }, {
      key: "mode",
      value: function mode() {
        return this._d.get("mode");
      }
    }, {
      key: "first",
      value: function first() {
        return this._d.get("first");
      }
    }, {
      key: "last",
      value: function last() {
        return this._d.get("last");
      }
    }, {
      key: "getWindowType",
      value: function getWindowType() {
        return this._d.get("windowType");
      }
    }, {
      key: "getWindowDuration",
      value: function getWindowDuration() {
        return this._d.get("windowDuration");
      }
    }, {
      key: "getGroupBy",
      value: function getGroupBy() {
        return this._d.get("groupBy");
      }
    }, {
      key: "getEmitOn",
      value: function getEmitOn() {
        return this._d.get("emitOn");
      }
    }, {
      key: "clearResults",
      value: function clearResults() {
        this._resultsDone = false;
        this._results = null;
      }
    }, {
      key: "addResult",
      value: function addResult(arg1, arg2) {
        if (!this._results) {
          if (_underscore2.default.isString(arg1) && arg2) {
            this._results = {};
          } else {
            this._results = [];
          }
        }
        if (_underscore2.default.isString(arg1) && arg2) {
          this._results[arg1] = arg2;
        } else {
          this._results.push(arg1);
        }
        this._resultsDone = false;
      }
    }, {
      key: "resultsDone",
      value: function resultsDone() {
        this._resultsDone = true;
      }
    }, {
      key: "_setIn",
      value: function _setIn(input) {
        var mode = void 0;
        var source = input;
        if (input instanceof _timeseries2.default) {
          mode = "batch";
          source = input.collection();
        } else if (input instanceof _bounded2.default) {
          mode = "batch";
        } else if (input instanceof _stream2.default) {
          mode = "stream";
        } else {
          throw new Error("Unknown input type", input);
        }
        var d = this._d.withMutations(function(map) {
          map.set("in", source).set("mode", mode);
        });
        return new Pipeline(d);
      }
    }, {
      key: "_setFirst",
      value: function _setFirst(n) {
        var d = this._d.set("first", n);
        return new Pipeline(d);
      }
    }, {
      key: "_setLast",
      value: function _setLast(n) {
        var d = this._d.set("last", n);
        return new Pipeline(d);
      }
    }, {
      key: "_append",
      value: function _append(processor) {
        var first = this.first();
        var last = this.last();
        if (!first)
          first = processor;
        if (last)
          last.addObserver(processor);
        last = processor;
        var d = this._d.withMutations(function(map) {
          map.set("first", first).set("last", last);
        });
        return new Pipeline(d);
      }
    }, {
      key: "_chainPrev",
      value: function _chainPrev() {
        return this.last() || this;
      }
    }, {
      key: "windowBy",
      value: function windowBy(w) {
        var type = void 0,
            duration = void 0;
        if (_underscore2.default.isString(w)) {
          if (w === "daily" || w === "monthly" || w === "yearly") {
            type = w;
          } else {
            type = "fixed";
            duration = w;
          }
        } else if (_underscore2.default.isObject(w)) {
          type = w.type;
          duration = w.duration;
        } else {
          type = "global";
          duration = null;
        }
        var d = this._d.withMutations(function(map) {
          map.set("windowType", type).set("windowDuration", duration);
        });
        return new Pipeline(d);
      }
    }, {
      key: "clearWindow",
      value: function clearWindow() {
        return this.windowBy();
      }
    }, {
      key: "groupBy",
      value: function groupBy(k) {
        var grp = void 0;
        var groupBy = k || "value";
        if (_underscore2.default.isFunction(groupBy)) {
          grp = groupBy;
        } else if (_underscore2.default.isArray(groupBy)) {
          grp = function grp(e) {
            return _underscore2.default.map(groupBy, function(c) {
              return "" + e.get(c);
            }).join("::");
          };
        } else if (_underscore2.default.isString(groupBy)) {
          grp = function grp(e) {
            return "" + e.get(groupBy);
          };
        } else {
          grp = function grp() {
            return "";
          };
        }
        var d = this._d.withMutations(function(map) {
          map.set("groupBy", grp);
        });
        return new Pipeline(d);
      }
    }, {
      key: "clearGroupBy",
      value: function clearGroupBy() {
        return this.groupBy();
      }
    }, {
      key: "emitOn",
      value: function emitOn(trigger) {
        var d = this._d.set("emitOn", trigger);
        return new Pipeline(d);
      }
    }, {
      key: "from",
      value: function from(src) {
        return this._setIn(src);
      }
    }, {
      key: "toEventList",
      value: function toEventList() {
        return this.to(_eventout2.default);
      }
    }, {
      key: "toKeyedCollections",
      value: function toKeyedCollections() {
        var result = this.to(_collectionout2.default);
        if (result) {
          return result;
        } else {
          return {};
        }
      }
    }, {
      key: "to",
      value: function to(arg1, arg2, arg3) {
        var Out = arg1;
        var observer = void 0;
        var options = {};
        if (_underscore2.default.isFunction(arg2)) {
          observer = arg2;
        } else if (_underscore2.default.isObject(arg2)) {
          options = arg2;
          observer = arg3;
        }
        if (!this.in()) {
          throw new Error("Tried to eval pipeline without a In. Missing from() in chain?");
        }
        var out = new Out(this, options, observer);
        if (this.mode() === "batch") {
          var runner = new Runner(this, out);
          runner.start(true);
          if (this._resultsDone && !observer) {
            return this._results;
          }
        } else if (this.mode() === "stream") {
          var _out = new Out(this, options, observer);
          if (this.first()) {
            this.in().addObserver(this.first());
          }
          if (this.last()) {
            this.last().addObserver(_out);
          } else {
            this.in().addObserver(_out);
          }
        }
        return this;
      }
    }, {
      key: "count",
      value: function count(observer) {
        var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        return this.to(_collectionout2.default, function(collection, windowKey, groupByKey) {
          observer(collection.size(), windowKey, groupByKey);
        }, force);
      }
    }, {
      key: "offsetBy",
      value: function offsetBy(by, fieldSpec) {
        var p = new _offset2.default(this, {
          by: by,
          fieldSpec: fieldSpec,
          prev: this._chainPrev()
        });
        return this._append(p);
      }
    }, {
      key: "aggregate",
      value: function aggregate(fields) {
        var p = new _aggregator2.default(this, {
          fields: fields,
          prev: this._chainPrev()
        });
        return this._append(p);
      }
    }, {
      key: "asTimeEvents",
      value: function asTimeEvents(options) {
        var type = _timeevent2.default;
        var p = new _converter2.default(this, (0, _extends3.default)({type: type}, options, {prev: this._chainPrev()}));
        return this._append(p);
      }
    }, {
      key: "map",
      value: function map(op) {
        var p = new _mapper2.default(this, {
          op: op,
          prev: this._chainPrev()
        });
        return this._append(p);
      }
    }, {
      key: "filter",
      value: function filter(op) {
        var p = new _filter2.default(this, {
          op: op,
          prev: this._chainPrev()
        });
        return this._append(p);
      }
    }, {
      key: "select",
      value: function select(fieldSpec) {
        var p = new _selector2.default(this, {
          fieldSpec: fieldSpec,
          prev: this._chainPrev()
        });
        return this._append(p);
      }
    }, {
      key: "collapse",
      value: function collapse(fieldSpecList, name, reducer, append) {
        var p = new _collapser2.default(this, {
          fieldSpecList: fieldSpecList,
          name: name,
          reducer: reducer,
          append: append,
          prev: this._chainPrev()
        });
        return this._append(p);
      }
    }, {
      key: "fill",
      value: function fill(_ref) {
        var _ref$fieldSpec = _ref.fieldSpec,
            fieldSpec = _ref$fieldSpec === undefined ? null : _ref$fieldSpec,
            _ref$method = _ref.method,
            method = _ref$method === undefined ? "linear" : _ref$method,
            _ref$limit = _ref.limit,
            limit = _ref$limit === undefined ? null : _ref$limit;
        var prev = this._chainPrev();
        return this._append(new _filler2.default(this, {
          fieldSpec: fieldSpec,
          method: method,
          limit: limit,
          prev: prev
        }));
      }
    }, {
      key: "align",
      value: function align(fieldSpec, window, method, limit) {
        var prev = this._chainPrev();
        return this._append(new _aligner2.default(this, {
          fieldSpec: fieldSpec,
          window: window,
          method: method,
          limit: limit,
          prev: prev
        }));
      }
    }, {
      key: "rate",
      value: function rate(fieldSpec) {
        var allowNegative = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var p = new _derivator2.default(this, {
          fieldSpec: fieldSpec,
          allowNegative: allowNegative,
          prev: this._chainPrev()
        });
        return this._append(p);
      }
    }, {
      key: "take",
      value: function take(limit) {
        var p = new _taker2.default(this, {
          limit: limit,
          prev: this._chainPrev()
        });
        return this._append(p);
      }
    }, {
      key: "asTimeRangeEvents",
      value: function asTimeRangeEvents(options) {
        var type = _timerangeevent2.default;
        var p = new _converter2.default(this, (0, _extends3.default)({type: type}, options, {prev: this._chainPrev()}));
        return this._append(p);
      }
    }, {
      key: "asIndexedEvents",
      value: function asIndexedEvents(options) {
        var type = _indexedevent2.default;
        var p = new _converter2.default(this, (0, _extends3.default)({type: type}, options, {prev: this._chainPrev()}));
        return this._append(p);
      }
    }]);
    return Pipeline;
  }();
  function pipeline(args) {
    return new Pipeline(args);
  }
  function is(p) {
    return p instanceof Pipeline;
  }
  exports.Pipeline = pipeline;
  exports.isPipeline = is;
})(require('process'));
