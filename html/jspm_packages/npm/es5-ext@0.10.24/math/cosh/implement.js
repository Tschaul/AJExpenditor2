/* */ 
"use strict";
if (!require('./is-implemented')()) {
  Object.defineProperty(Math, "cosh", {
    value: require('./shim'),
    configurable: true,
    enumerable: false,
    writable: true
  });
}
