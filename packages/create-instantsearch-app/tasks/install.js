const process = require('process');
const execSync = require('child_process').execSync;

module.exports = function install(appPath, options) {
  const installCommand =
    options.packageManager === 'yarn' ? 'yarn' : 'npm install';
  const initialDirectory = process.cwd();

  process.chdir(appPath);
  execSync(installCommand, { stdio: options.silent ? 'ignore' : 'inherit' });
  process.chdir(initialDirectory);
};
