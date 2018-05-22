const { execSync } = require('child_process');

module.exports = function clean(config) {
  execSync(`rm -rf ${config.path}`);
};
