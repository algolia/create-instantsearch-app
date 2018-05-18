const execSync = require('child_process').execSync;

module.exports = function clean(config) {
  execSync(`rm -rf ${config.path}`);
};
