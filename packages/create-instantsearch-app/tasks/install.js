const process = require('process');
const execSync = require('child_process').execSync;

module.exports = function install(config, info) {
  const initialDirectory = process.cwd();

  process.chdir(config.path);
  execSync(`${info.packageManager} install`, {
    stdio: config.silent ? 'ignore' : 'inherit',
  });
  process.chdir(initialDirectory);
};
