/* */ 
'use strict';
var $export = require('./_export');
var $pad = require('./_string-pad');
$export($export.P, 'String', {padEnd: function padEnd(maxLength) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }});
