/* */ 
(function(process) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var _extends2 = require('babel-runtime/helpers/extends');
  var _extends3 = _interopRequireDefault(_extends2);
  var _regenerator = require('babel-runtime/regenerator');
  var _regenerator2 = _interopRequireDefault(_regenerator);
  var _stringify = require('babel-runtime/core-js/json/stringify');
  var _stringify2 = _interopRequireDefault(_stringify);
  var _getIterator2 = require('babel-runtime/core-js/get-iterator');
  var _getIterator3 = _interopRequireDefault(_getIterator2);
  var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');
  var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
  var _toArray2 = require('babel-runtime/helpers/toArray');
  var _toArray3 = _interopRequireDefault(_toArray2);
  var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');
  var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);
  var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');
  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
  var _createClass2 = require('babel-runtime/helpers/createClass');
  var _createClass3 = _interopRequireDefault(_createClass2);
  var _underscore = require('underscore');
  var _underscore2 = _interopRequireDefault(_underscore);
  var _immutable = require('immutable');
  var _immutable2 = _interopRequireDefault(_immutable);
  var _collection = require('./collection');
  var _collection2 = _interopRequireDefault(_collection);
  var _index = require('./index');
  var _index2 = _interopRequireDefault(_index);
  var _event = require('./event');
  var _event2 = _interopRequireDefault(_event);
  var _timeevent = require('./timeevent');
  var _timeevent2 = _interopRequireDefault(_timeevent);
  var _timerangeevent = require('./timerangeevent');
  var _timerangeevent2 = _interopRequireDefault(_timerangeevent);
  var _indexedevent = require('./indexedevent');
  var _indexedevent2 = _interopRequireDefault(_indexedevent);
  var _pipeline = require('./pipeline');
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function buildMetaData(meta) {
    var d = meta ? meta : {};
    d.name = meta.name ? meta.name : "";
    if (meta.index) {
      if (_underscore2.default.isString(meta.index)) {
        d.index = new _index2.default(meta.index);
      } else if (meta.index instanceof _index2.default) {
        d.index = meta.index;
      }
    }
    d.utc = true;
    if (_underscore2.default.isBoolean(meta.utc)) {
      d.utc = meta.utc;
    }
    return new _immutable2.default.Map(d);
  }
  var TimeSeries = function() {
    function TimeSeries(arg) {
      (0, _classCallCheck3.default)(this, TimeSeries);
      this._collection = null;
      this._data = null;
      if (arg instanceof TimeSeries) {
        var other = arg;
        this._data = other._data;
        this._collection = other._collection;
      } else if (_underscore2.default.isObject(arg)) {
        var obj = arg;
        if (_underscore2.default.has(obj, "events")) {
          var events = obj.events,
              meta1 = (0, _objectWithoutProperties3.default)(obj, ["events"]);
          this._collection = new _collection2.default(events);
          this._data = buildMetaData(meta1);
        } else if (_underscore2.default.has(obj, "collection")) {
          var collection = obj.collection,
              meta3 = (0, _objectWithoutProperties3.default)(obj, ["collection"]);
          this._collection = collection;
          this._data = buildMetaData(meta3);
        } else if (_underscore2.default.has(obj, "columns") && _underscore2.default.has(obj, "points")) {
          var columns = obj.columns,
              points = obj.points,
              _obj$utc = obj.utc,
              utc = _obj$utc === undefined ? true : _obj$utc,
              meta2 = (0, _objectWithoutProperties3.default)(obj, ["columns", "points", "utc"]);
          var _columns = (0, _toArray3.default)(columns),
              eventKey = _columns[0],
              eventFields = _columns.slice(1);
          var _events = points.map(function(point) {
            var _point = (0, _toArray3.default)(point),
                t = _point[0],
                eventValues = _point.slice(1);
            var d = _underscore2.default.object(eventFields, eventValues);
            var options = utc;
            switch (eventKey) {
              case "time":
                return new _timeevent2.default(t, d, options);
              case "index":
                return new _indexedevent2.default(t, d, options);
              case "timerange":
                return new _timerangeevent2.default(t, d, options);
              default:
                throw new Error("Unknown event type");
            }
          });
          this._collection = new _collection2.default(_events);
          this._data = buildMetaData(meta2);
        }
        if (!this._collection.isChronological()) {
          throw new Error("TimeSeries was passed non-chronological events");
        }
      }
    }
    (0, _createClass3.default)(TimeSeries, [{
      key: "toJSON",
      value: function toJSON() {
        var e = this.atFirst();
        if (!e) {
          return;
        }
        var columns = void 0;
        if (e instanceof _timeevent2.default) {
          columns = ["time"].concat((0, _toConsumableArray3.default)(this.columns()));
        } else if (e instanceof _timerangeevent2.default) {
          columns = ["timerange"].concat((0, _toConsumableArray3.default)(this.columns()));
        } else if (e instanceof _indexedevent2.default) {
          columns = ["index"].concat((0, _toConsumableArray3.default)(this.columns()));
        }
        var points = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
          for (var _iterator = (0, _getIterator3.default)(this._collection.events()),
              _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _e = _step.value;
            points.push(_e.toPoint());
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
        return _underscore2.default.extend(this._data.toJSON(), {
          columns: columns,
          points: points
        });
      }
    }, {
      key: "toString",
      value: function toString() {
        return (0, _stringify2.default)(this.toJSON());
      }
    }, {
      key: "timerange",
      value: function timerange() {
        return this._collection.range();
      }
    }, {
      key: "range",
      value: function range() {
        return this.timerange();
      }
    }, {
      key: "begin",
      value: function begin() {
        return this.range().begin();
      }
    }, {
      key: "end",
      value: function end() {
        return this.range().end();
      }
    }, {
      key: "at",
      value: function at(pos) {
        return this._collection.at(pos);
      }
    }, {
      key: "atTime",
      value: function atTime(time) {
        var pos = this.bisect(time);
        if (pos >= 0 && pos < this.size()) {
          return this.at(pos);
        }
      }
    }, {
      key: "atFirst",
      value: function atFirst() {
        return this._collection.atFirst();
      }
    }, {
      key: "atLast",
      value: function atLast() {
        return this._collection.atLast();
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
      key: "setCollection",
      value: function setCollection(collection) {
        var isChronological = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (!isChronological && !collection.isChronological()) {
          throw new Error("Collection supplied is not chronological");
        }
        var result = new TimeSeries(this);
        if (collection) {
          result._collection = collection;
        } else {
          result._collection = new _collection2.default();
        }
        return result;
      }
    }, {
      key: "bisect",
      value: function bisect(t, b) {
        var tms = t.getTime();
        var size = this.size();
        var i = b || 0;
        if (!size) {
          return undefined;
        }
        for (; i < size; i++) {
          var ts = this.at(i).timestamp().getTime();
          if (ts > tms) {
            return i - 1 >= 0 ? i - 1 : 0;
          } else if (ts === tms) {
            return i;
          }
        }
        return i - 1;
      }
    }, {
      key: "slice",
      value: function slice(begin, end) {
        var sliced = this._collection.slice(begin, end);
        return this.setCollection(sliced, true);
      }
    }, {
      key: "crop",
      value: function crop(timerange) {
        var beginPos = this.bisect(timerange.begin());
        var endPos = this.bisect(timerange.end(), beginPos);
        return this.slice(beginPos, endPos);
      }
    }, {
      key: "clean",
      value: function clean(fieldSpec) {
        var cleaned = this._collection.clean(fieldSpec);
        return this.setCollection(cleaned, true);
      }
    }, {
      key: "events",
      value: _regenerator2.default.mark(function events() {
        var i;
        return _regenerator2.default.wrap(function events$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                i = 0;
              case 1:
                if (!(i < this.size())) {
                  _context2.next = 7;
                  break;
                }
                _context2.next = 4;
                return this.at(i);
              case 4:
                i++;
                _context2.next = 1;
                break;
              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, events, this);
      })
    }, {
      key: "name",
      value: function name() {
        return this._data.get("name");
      }
    }, {
      key: "setName",
      value: function setName(name) {
        return this.setMeta("name", name);
      }
    }, {
      key: "index",
      value: function index() {
        return this._data.get("index");
      }
    }, {
      key: "indexAsString",
      value: function indexAsString() {
        return this.index() ? this.index().asString() : undefined;
      }
    }, {
      key: "indexAsRange",
      value: function indexAsRange() {
        return this.index() ? this.index().asTimerange() : undefined;
      }
    }, {
      key: "isUTC",
      value: function isUTC() {
        return this._data.get("utc");
      }
    }, {
      key: "columns",
      value: function columns() {
        var c = {};
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;
        try {
          for (var _iterator2 = (0, _getIterator3.default)(this._collection.events()),
              _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var e = _step2.value;
            var d = e.toJSON().data;
            _underscore2.default.each(d, function(val, key) {
              c[key] = true;
            });
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
        return _underscore2.default.keys(c);
      }
    }, {
      key: "collection",
      value: function collection() {
        return this._collection;
      }
    }, {
      key: "meta",
      value: function meta(key) {
        if (!key) {
          return this._data.toJSON();
        } else {
          return this._data.get(key);
        }
      }
    }, {
      key: "setMeta",
      value: function setMeta(key, value) {
        var newTimeSeries = new TimeSeries(this);
        var d = newTimeSeries._data;
        var dd = d.set(key, value);
        newTimeSeries._data = dd;
        return newTimeSeries;
      }
    }, {
      key: "size",
      value: function size() {
        return this._collection ? this._collection.size() : 0;
      }
    }, {
      key: "sizeValid",
      value: function sizeValid(fieldSpec) {
        return this._collection.sizeValid(fieldSpec);
      }
    }, {
      key: "count",
      value: function count() {
        return this.size();
      }
    }, {
      key: "sum",
      value: function sum(fieldPath, filter) {
        return this._collection.sum(fieldPath, filter);
      }
    }, {
      key: "max",
      value: function max(fieldPath, filter) {
        return this._collection.max(fieldPath, filter);
      }
    }, {
      key: "min",
      value: function min(fieldPath, filter) {
        return this._collection.min(fieldPath, filter);
      }
    }, {
      key: "avg",
      value: function avg(fieldPath, filter) {
        return this._collection.avg(fieldPath, filter);
      }
    }, {
      key: "mean",
      value: function mean(fieldPath, filter) {
        return this._collection.mean(fieldPath, filter);
      }
    }, {
      key: "median",
      value: function median(fieldPath, filter) {
        return this._collection.median(fieldPath, filter);
      }
    }, {
      key: "stdev",
      value: function stdev(fieldPath, filter) {
        return this._collection.stdev(fieldPath, filter);
      }
    }, {
      key: "percentile",
      value: function percentile(q, fieldPath) {
        var interp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "linear";
        var filter = arguments[3];
        return this._collection.percentile(q, fieldPath, interp, filter);
      }
    }, {
      key: "aggregate",
      value: function aggregate(func, fieldPath) {
        return this._collection.aggregate(func, fieldPath);
      }
    }, {
      key: "quantile",
      value: function quantile(quantity) {
        var fieldPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "value";
        var interp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "linear";
        return this._collection.quantile(quantity, fieldPath, interp);
      }
    }, {
      key: "pipeline",
      value: function pipeline() {
        return new _pipeline.Pipeline().from(this._collection);
      }
    }, {
      key: "map",
      value: function map(op) {
        var collections = this.pipeline().map(op).toKeyedCollections();
        return this.setCollection(collections["all"], true);
      }
    }, {
      key: "select",
      value: function select(options) {
        var fieldSpec = options.fieldSpec;
        var collections = this.pipeline().select(fieldSpec).toKeyedCollections();
        return this.setCollection(collections["all"], true);
      }
    }, {
      key: "collapse",
      value: function collapse(options) {
        var fieldSpecList = options.fieldSpecList,
            name = options.name,
            reducer = options.reducer,
            append = options.append;
        var collections = this.pipeline().collapse(fieldSpecList, name, reducer, append).toKeyedCollections();
        return this.setCollection(collections["all"], true);
      }
    }, {
      key: "renameColumns",
      value: function renameColumns(options) {
        var renameMap = options.renameMap;
        return this.map(function(event) {
          var eventType = event.type();
          var d = event.data().mapKeys(function(key) {
            return renameMap[key] || key;
          });
          return new eventType(event.key(), d);
        });
      }
    }, {
      key: "fill",
      value: function fill(options) {
        var _options$fieldSpec = options.fieldSpec,
            fieldSpec = _options$fieldSpec === undefined ? null : _options$fieldSpec,
            _options$method = options.method,
            method = _options$method === undefined ? "zero" : _options$method,
            _options$limit = options.limit,
            limit = _options$limit === undefined ? null : _options$limit;
        var pipeline = this.pipeline();
        if (method === "zero" || method === "pad") {
          pipeline = pipeline.fill({
            fieldSpec: fieldSpec,
            method: method,
            limit: limit
          });
        } else if (method === "linear" && _underscore2.default.isArray(fieldSpec)) {
          fieldSpec.forEach(function(fieldPath) {
            pipeline = pipeline.fill({
              fieldSpec: fieldPath,
              method: method,
              limit: limit
            });
          });
        } else {
          throw new Error("Invalid fill method:", method);
        }
        var collections = pipeline.toKeyedCollections();
        return this.setCollection(collections["all"], true);
      }
    }, {
      key: "align",
      value: function align(options) {
        var _options$fieldSpec2 = options.fieldSpec,
            fieldSpec = _options$fieldSpec2 === undefined ? "value" : _options$fieldSpec2,
            _options$period = options.period,
            period = _options$period === undefined ? "5m" : _options$period,
            _options$method2 = options.method,
            method = _options$method2 === undefined ? "linear" : _options$method2,
            _options$limit2 = options.limit,
            limit = _options$limit2 === undefined ? null : _options$limit2;
        var collection = this.pipeline().align(fieldSpec, period, method, limit).toKeyedCollections();
        return this.setCollection(collection["all"], true);
      }
    }, {
      key: "rate",
      value: function rate() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _options$fieldSpec3 = options.fieldSpec,
            fieldSpec = _options$fieldSpec3 === undefined ? "value" : _options$fieldSpec3,
            _options$allowNegativ = options.allowNegative,
            allowNegative = _options$allowNegativ === undefined ? true : _options$allowNegativ;
        var collection = this.pipeline().rate(fieldSpec, allowNegative).toKeyedCollections();
        return this.setCollection(collection["all"], true);
      }
    }, {
      key: "fixedWindowRollup",
      value: function fixedWindowRollup(options) {
        var windowSize = options.windowSize,
            aggregation = options.aggregation,
            _options$toTimeEvents = options.toTimeEvents,
            toTimeEvents = _options$toTimeEvents === undefined ? false : _options$toTimeEvents;
        if (!windowSize) {
          throw new Error("windowSize must be supplied, for example '5m' for five minute rollups");
        }
        if (!aggregation || !_underscore2.default.isObject(aggregation)) {
          throw new Error("aggregation object must be supplied, for example: {value: {value: avg()}}");
        }
        var aggregatorPipeline = this.pipeline().windowBy(windowSize).emitOn("discard").aggregate(aggregation);
        var eventTypePipeline = toTimeEvents ? aggregatorPipeline.asTimeEvents() : aggregatorPipeline;
        var collections = eventTypePipeline.clearWindow().toKeyedCollections();
        return this.setCollection(collections["all"], true);
      }
    }, {
      key: "hourlyRollup",
      value: function hourlyRollup(options) {
        var aggregation = options.aggregation,
            _options$toTimeEvents2 = options.toTimeEvents,
            toTimeEvents = _options$toTimeEvents2 === undefined ? false : _options$toTimeEvents2;
        if (!aggregation || !_underscore2.default.isObject(aggregation)) {
          throw new Error("aggregation object must be supplied, for example: {value: {value: avg()}}");
        }
        return this.fixedWindowRollup("1h", aggregation, toTimeEvents);
      }
    }, {
      key: "dailyRollup",
      value: function dailyRollup(options) {
        var aggregation = options.aggregation,
            _options$toTimeEvents3 = options.toTimeEvents,
            toTimeEvents = _options$toTimeEvents3 === undefined ? false : _options$toTimeEvents3;
        if (!aggregation || !_underscore2.default.isObject(aggregation)) {
          throw new Error("aggregation object must be supplied, for example: {value: {value: avg()}}");
        }
        return this._rollup("daily", aggregation, toTimeEvents);
      }
    }, {
      key: "monthlyRollup",
      value: function monthlyRollup(options) {
        var aggregation = options.aggregation,
            _options$toTimeEvents4 = options.toTimeEvents,
            toTimeEvents = _options$toTimeEvents4 === undefined ? false : _options$toTimeEvents4;
        if (!aggregation || !_underscore2.default.isObject(aggregation)) {
          throw new Error("aggregation object must be supplied, for example: {value: {value: avg()}}");
        }
        return this._rollup("monthly", aggregation, toTimeEvents);
      }
    }, {
      key: "yearlyRollup",
      value: function yearlyRollup(options) {
        var aggregation = options.aggregation,
            _options$toTimeEvents5 = options.toTimeEvents,
            toTimeEvents = _options$toTimeEvents5 === undefined ? false : _options$toTimeEvents5;
        if (!aggregation || !_underscore2.default.isObject(aggregation)) {
          throw new Error("aggregation object must be supplied, for example: {value: {value: avg()}}");
        }
        return this._rollup("yearly", aggregation, toTimeEvents);
      }
    }, {
      key: "_rollup",
      value: function _rollup(type, aggregation) {
        var toTimeEvents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var aggregatorPipeline = this.pipeline().windowBy(type).emitOn("discard").aggregate(aggregation);
        var eventTypePipeline = toTimeEvents ? aggregatorPipeline.asTimeEvents() : aggregatorPipeline;
        var collections = eventTypePipeline.clearWindow().toKeyedCollections();
        return this.setCollection(collections["all"], true);
      }
    }, {
      key: "collectByFixedWindow",
      value: function collectByFixedWindow(_ref) {
        var windowSize = _ref.windowSize;
        return this.pipeline().windowBy(windowSize).emitOn("discard").toKeyedCollections();
      }
    }], [{
      key: "event",
      value: function event(eventKey) {
        switch (eventKey) {
          case "time":
            return _timeevent2.default;
          case "timerange":
            return _timerangeevent2.default;
          case "index":
            return _indexedevent2.default;
          default:
            throw new Error("Unknown event type: " + eventKey);
        }
      }
    }, {
      key: "equal",
      value: function equal(series1, series2) {
        return series1._data === series2._data && series1._collection === series2._collection;
      }
    }, {
      key: "is",
      value: function is(series1, series2) {
        return _immutable2.default.is(series1._data, series2._data) && _collection2.default.is(series1._collection, series2._collection);
      }
    }, {
      key: "timeSeriesListReduce",
      value: function timeSeriesListReduce(options) {
        var fieldSpec = options.fieldSpec,
            reducer = options.reducer,
            data = (0, _objectWithoutProperties3.default)(options, ["fieldSpec", "reducer"]);
        var combiner = _event2.default.combiner(fieldSpec, reducer);
        return TimeSeries.timeSeriesListEventReduce((0, _extends3.default)({
          fieldSpec: fieldSpec,
          reducer: combiner
        }, data));
      }
    }, {
      key: "timeSeriesListMerge",
      value: function timeSeriesListMerge(options) {
        var fieldSpec = options.fieldSpec,
            data = (0, _objectWithoutProperties3.default)(options, ["fieldSpec"]);
        var merger = _event2.default.merger(fieldSpec);
        return TimeSeries.timeSeriesListEventReduce((0, _extends3.default)({
          fieldSpec: fieldSpec,
          reducer: merger
        }, data));
      }
    }, {
      key: "timeSeriesListEventReduce",
      value: function timeSeriesListEventReduce(options) {
        var seriesList = options.seriesList,
            fieldSpec = options.fieldSpec,
            reducer = options.reducer,
            data = (0, _objectWithoutProperties3.default)(options, ["seriesList", "fieldSpec", "reducer"]);
        if (!seriesList || !_underscore2.default.isArray(seriesList)) {
          throw new Error("A list of TimeSeries must be supplied to reduce");
        }
        if (!reducer || !_underscore2.default.isFunction(reducer)) {
          throw new Error("reducer function must be supplied, for example avg()");
        }
        var eventList = [];
        seriesList.forEach(function(series) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;
          try {
            for (var _iterator3 = (0, _getIterator3.default)(series.events()),
                _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var event = _step3.value;
              eventList.push(event);
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
        });
        var events = reducer(eventList, fieldSpec);
        var collection = new _collection2.default(events);
        if (!collection.isChronological()) {
          collection = collection.sortByTime();
        }
        var timeseries = new TimeSeries((0, _extends3.default)({}, data, {collection: collection}));
        return timeseries;
      }
    }]);
    return TimeSeries;
  }();
  exports.default = TimeSeries;
})(require('process'));
