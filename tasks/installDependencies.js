const process = require('process');
const execSync = require('child_process').execSync;
const { isYarnAvailable } = require('../src/utils');

module.exports = function installDependencies(appPath) {
  const packageManager = isYarnAvailable() ? 'yarn' : 'npm';
  const installCommand = packageManager === 'yarn' ? 'yarn' : 'npm install';
  const initialDirectory = process.cwd();

  process.chdir(appPath);
  execSync(installCommand, { stdio: 'inherit' });
  process.chdir(initialDirectory);
};
