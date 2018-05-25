const process = require('process');
const { execSync } = require('child_process');
const { isYarnAvailable } = require('../../shared/utils');

module.exports = function install(config) {
  const installCommand = isYarnAvailable() ? 'yarn' : 'npm install';
  const initialDirectory = process.cwd();

  process.chdir(config.path);

  try {
    execSync(`${installCommand}`, {
      stdio: config.silent ? 'ignore' : 'inherit',
    });
  } catch (err) {
    return Promise.reject(err);
  }

  process.chdir(initialDirectory);

  return Promise.resolve({ installCommand });
};
