const process = require('process');
const execSync = require('child_process').execSync;

module.exports = function installDependencies({
  appPath,
  initialDirectory,
  installCommand,
}) {
  process.chdir(appPath);
  execSync(installCommand, { stdio: 'inherit' });
  process.chdir(initialDirectory);
};
