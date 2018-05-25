const process = require('process');
const { execSync } = require('child_process');

module.exports = function install(config, info) {
  const initialDirectory = process.cwd();

  process.chdir(config.path);

  try {
    execSync(`${info.packageManager} install`, {
      stdio: config.silent ? 'ignore' : 'inherit',
    });
  } catch (err) {
    return Promise.reject(err);
  }

  process.chdir(initialDirectory);

  return Promise.resolve();
};
