/* */ 
'use strict';
exports.__esModule = true;
var _tokenize = require('./tokenize');
var _tokenize2 = _interopRequireDefault(_tokenize);
var _input = require('./input');
var _input2 = _interopRequireDefault(_input);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
var HIGHLIGHT_THEME = {
  'brackets': [36, 39],
  'string': [31, 39],
  'at-word': [31, 39],
  'comment': [90, 39],
  '{': [32, 39],
  '}': [32, 39],
  ':': [1, 22],
  ';': [1, 22],
  '(': [1, 22],
  ')': [1, 22]
};
function code(color) {
  return '\x1B[' + color + 'm';
}
function terminalHighlight(css) {
  var tokens = (0, _tokenize2.default)(new _input2.default(css), {ignoreErrors: true});
  var result = [];
  tokens.forEach(function(token) {
    var color = HIGHLIGHT_THEME[token[0]];
    if (color) {
      result.push(token[1].split(/\r?\n/).map(function(i) {
        return code(color[0]) + i + code(color[1]);
      }).join('\n'));
    } else {
      result.push(token[1]);
    }
  });
  return result.join('');
}
exports.default = terminalHighlight;
module.exports = exports['default'];
