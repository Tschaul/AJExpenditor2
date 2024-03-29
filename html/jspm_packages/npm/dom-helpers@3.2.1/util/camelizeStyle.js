/* */ 
'use strict';
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = camelizeStyleName;
var _camelize = require('./camelize');
var _camelize2 = _interopRequireDefault(_camelize);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
var msPattern = /^-ms-/;
function camelizeStyleName(string) {
  return (0, _camelize2.default)(string.replace(msPattern, 'ms-'));
}
module.exports = exports['default'];
