/* */ 
var $export = require('./_export');
var exp = Math.exp;
$export($export.S, 'Math', {cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }});
