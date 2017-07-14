/* */ 
(function(process) {
  var util = require('./util');
  function strip(file, cb) {
    var platform = util.platform();
    if (platform === 'win32')
      return process.nextTick(cb);
    util.spawn('strip', stripArgs(platform, file), cb);
  }
  function stripArgs(platform, file) {
    if (platform === 'darwin')
      return [file, '-Sx'];
    if (platform === 'linux')
      return [file, '--strip-all'];
    return [];
  }
  module.exports = strip;
})(require('process'));
