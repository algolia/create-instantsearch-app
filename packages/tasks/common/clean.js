const util = require('util');
const exec = util.promisify(require('child_process').exec);
const chalk = require('chalk');

module.exports = async function clean(config) {
  const logger = config.silent ? { log() {}, error() {} } : console;

  try {
    logger.log();
    logger.log(`✨  Cleaning up ${chalk.green(config.path)}.`);
    logger.log();
    await exec(`rm -rf ${config.path}`);
  } catch (err) {
    return Promise.reject(err);
  }

  return Promise.resolve();
};
