/* */ 
'use strict';
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = hyphenateStyleName;
var _hyphenate = require('./hyphenate');
var _hyphenate2 = _interopRequireDefault(_hyphenate);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
var msPattern = /^ms-/;
function hyphenateStyleName(string) {
  return (0, _hyphenate2.default)(string).replace(msPattern, '-ms-');
}
module.exports = exports['default'];
