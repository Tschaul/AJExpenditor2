/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var _stringify = require('babel-runtime/core-js/json/stringify');
var _stringify2 = _interopRequireDefault(_stringify);
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
var _createClass2 = require('babel-runtime/helpers/createClass');
var _createClass3 = _interopRequireDefault(_createClass2);
var _underscore = require('underscore');
var _underscore2 = _interopRequireDefault(_underscore);
var _immutable = require('immutable');
var _immutable2 = _interopRequireDefault(_immutable);
var _util = require('./base/util');
var _util2 = _interopRequireDefault(_util);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
var Event = function() {
  function Event() {
    (0, _classCallCheck3.default)(this, Event);
    if (this.constructor.name === "Event") {
      throw new TypeError("Cannot construct Event instances directly");
    }
  }
  (0, _createClass3.default)(Event, [{
    key: "toString",
    value: function toString() {
      if (this.toJSON === undefined) {
        throw new TypeError("Must implement toJSON()");
      }
      return (0, _stringify2.default)(this.toJSON());
    }
  }, {
    key: "type",
    value: function type() {
      return this.constructor;
    }
  }, {
    key: "setData",
    value: function setData(data) {
      var eventType = this.type();
      var d = this._d.set("data", _util2.default.dataFromArg(data));
      return new eventType(d);
    }
  }, {
    key: "data",
    value: function data() {
      return this._d.get("data");
    }
  }, {
    key: "get",
    value: function get() {
      var fieldSpec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ["value"];
      var v = void 0;
      if (_underscore2.default.isArray(fieldSpec)) {
        v = this.data().getIn(fieldSpec);
      } else if (_underscore2.default.isString(fieldSpec)) {
        var searchKeyPath = fieldSpec.split(".");
        v = this.data().getIn(searchKeyPath);
      }
      if (v instanceof _immutable2.default.Map || v instanceof _immutable2.default.List) {
        return v.toJS();
      }
      return v;
    }
  }, {
    key: "value",
    value: function value() {
      var fieldSpec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ["value"];
      return this.get(fieldSpec);
    }
  }, {
    key: "collapse",
    value: function collapse(fieldSpecList, name, reducer) {
      var _this = this;
      var append = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var data = append ? this.data().toJS() : {};
      var d = fieldSpecList.map(function(fs) {
        return _this.get(fs);
      });
      data[name] = reducer(d);
      return this.setData(data);
    }
  }], [{
    key: "is",
    value: function is(event1, event2) {
      return event1.key() === event2.key() && _immutable2.default.is(event1._d.get("data"), event2._d.get("data"));
    }
  }, {
    key: "isDuplicate",
    value: function isDuplicate(event1, event2) {
      var ignoreValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      if (ignoreValues) {
        return event1.type() === event2.type() && event1.key() === event2.key();
      } else {
        return event1.type() === event2.type() && Event.is(event1, event2);
      }
    }
  }, {
    key: "isValidValue",
    value: function isValidValue(event, fieldPath) {
      var v = event.value(fieldPath);
      var invalid = _underscore2.default.isUndefined(v) || _underscore2.default.isNaN(v) || _underscore2.default.isNull(v);
      return !invalid;
    }
  }, {
    key: "selector",
    value: function selector(event, fieldPath) {
      var data = {};
      if (_underscore2.default.isString(fieldPath)) {
        var fieldName = fieldPath;
        var value = event.get(fieldName);
        data[fieldName] = value;
      } else if (_underscore2.default.isArray(fieldPath)) {
        _underscore2.default.each(fieldPath, function(fieldName) {
          var value = event.get(fieldName);
          data[fieldName] = value;
        });
      } else {
        return event;
      }
      return event.setData(data);
    }
  }, {
    key: "merge",
    value: function merge(events, deep) {
      if (events instanceof _immutable2.default.List && events.size === 0 || _underscore2.default.isArray(events) && events.length === 0) {
        return [];
      }
      var eventMap = {};
      var typeMap = {};
      events.forEach(function(e) {
        var type = e.type();
        var key = e.key();
        if (!_underscore2.default.has(eventMap, key)) {
          eventMap[key] = [];
        }
        eventMap[key].push(e);
        if (!_underscore2.default.has(typeMap, key)) {
          typeMap[key] = type;
        } else {
          if (typeMap[key] !== type) {
            throw new Error("Events for time " + key + " are not homogeneous");
          }
        }
      });
      var outEvents = [];
      _underscore2.default.each(eventMap, function(events, key) {
        var data = _immutable2.default.Map();
        events.forEach(function(event) {
          data = deep ? data.mergeDeep(event.data()) : data.merge(event.data());
        });
        var type = typeMap[key];
        outEvents.push(new type(key, data));
      });
      if (events instanceof _immutable2.default.List) {
        return _immutable2.default.List(outEvents);
      }
      return outEvents;
    }
  }, {
    key: "combine",
    value: function combine(events, reducer, fieldSpec) {
      if (events instanceof _immutable2.default.List && events.size === 0 || _underscore2.default.isArray(events) && events.length === 0) {
        return [];
      }
      var fieldNames = void 0;
      if (_underscore2.default.isString(fieldSpec)) {
        fieldNames = [fieldSpec];
      } else if (_underscore2.default.isArray(fieldSpec)) {
        fieldNames = fieldSpec;
      }
      var eventMap = {};
      var typeMap = {};
      events.forEach(function(e) {
        var type = e.type();
        var key = e.key();
        if (!_underscore2.default.has(eventMap, key)) {
          eventMap[key] = [];
        }
        eventMap[key].push(e);
        if (!_underscore2.default.has(typeMap, key)) {
          typeMap[key] = type;
        } else {
          if (typeMap[key] !== type) {
            throw new Error("Events for time " + key + " are not homogeneous");
          }
        }
      });
      var outEvents = [];
      _underscore2.default.each(eventMap, function(events, key) {
        var mapEvent = {};
        events.forEach(function(event) {
          var fields = fieldNames;
          if (!fieldNames) {
            fields = _underscore2.default.map(event.data().toJSON(), function(value, fieldName) {
              return fieldName;
            });
          }
          fields.forEach(function(fieldName) {
            if (!mapEvent[fieldName]) {
              mapEvent[fieldName] = [];
            }
            mapEvent[fieldName].push(event.data().get(fieldName));
          });
        });
        var data = {};
        _underscore2.default.map(mapEvent, function(values, fieldName) {
          data[fieldName] = reducer(values);
        });
        var type = typeMap[key];
        outEvents.push(new type(key, data));
      });
      if (events instanceof _immutable2.default.List) {
        return _immutable2.default.List(outEvents);
      }
      return outEvents;
    }
  }, {
    key: "combiner",
    value: function combiner(fieldSpec, reducer) {
      return function(events) {
        return Event.combine(events, reducer, fieldSpec);
      };
    }
  }, {
    key: "merger",
    value: function merger(fieldSpec) {
      return function(events) {
        return Event.merge(events, fieldSpec);
      };
    }
  }, {
    key: "map",
    value: function map(evts) {
      var multiFieldSpec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "value";
      var result = {};
      var events = void 0;
      if (evts instanceof _immutable2.default.List) {
        events = evts;
      } else if (_underscore2.default.isArray(evts)) {
        events = new _immutable2.default.List(evts);
      } else {
        throw new Error("Unknown event list type. Should be an array or Immutable List");
      }
      if (_underscore2.default.isString(multiFieldSpec)) {
        var fieldSpec = multiFieldSpec;
        events.forEach(function(event) {
          if (!_underscore2.default.has(result, fieldSpec)) {
            result[fieldSpec] = [];
          }
          var value = event.get(fieldSpec);
          result[fieldSpec].push(value);
        });
      } else if (_underscore2.default.isArray(multiFieldSpec)) {
        _underscore2.default.each(multiFieldSpec, function(fieldSpec) {
          events.forEach(function(event) {
            if (!_underscore2.default.has(result, fieldSpec)) {
              result[fieldSpec] = [];
            }
            result[fieldSpec].push(event.get(fieldSpec));
          });
        });
      } else if (_underscore2.default.isFunction(multiFieldSpec)) {
        events.forEach(function(event) {
          var pair = multiFieldSpec(event);
          _underscore2.default.each(pair, function(value, key) {
            if (!_underscore2.default.has(result, key)) {
              result[key] = [];
            }
            result[key].push(value);
          });
        });
      } else {
        events.forEach(function(event) {
          _underscore2.default.each(event.data().toJSON(), function(value, key) {
            if (!_underscore2.default.has(result, key)) {
              result[key] = [];
            }
            result[key].push(value);
          });
        });
      }
      return result;
    }
  }, {
    key: "reduce",
    value: function reduce(mapped, reducer) {
      var result = {};
      _underscore2.default.each(mapped, function(valueList, key) {
        result[key] = reducer(valueList);
      });
      return result;
    }
  }, {
    key: "mapReduce",
    value: function mapReduce(events, multiFieldSpec, reducer) {
      return Event.reduce(this.map(events, multiFieldSpec), reducer);
    }
  }]);
  return Event;
}();
exports.default = Event;
