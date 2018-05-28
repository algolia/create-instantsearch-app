const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async function clean(config) {
  await exec(`rm -rf ${config.path}`);
};
