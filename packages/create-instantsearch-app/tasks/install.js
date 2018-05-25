const process = require('process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async function install(config, info) {
  const initialDirectory = process.cwd();

  process.chdir(config.path);
  await exec(`${info.packageManager} install`, {
    stdio: config.silent ? 'ignore' : 'inherit',
  });
  process.chdir(initialDirectory);
};
