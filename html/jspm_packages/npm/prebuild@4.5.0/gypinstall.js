/* */ 
var gyp = require('./gyp');
function runGypInstall(opts, version, cb) {
  gyp({
    log: opts.log,
    backend: opts.backend,
    args: ['node', 'index.js', 'install', version]
  }, cb);
}
module.exports = runGypInstall;
