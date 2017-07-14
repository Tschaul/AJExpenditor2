/* */ 
(function(process) {
  var hyperquest = require('../index');
  hyperquest('http://localhost:8000').pipe(process.stdout);
})(require('process'));
