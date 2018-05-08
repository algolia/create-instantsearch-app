const fs = require('fs');
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const validateProjectName = require('validate-npm-package-name');

function checkAppName(name) {
  const validationResult = validateProjectName(name);

  if (!validationResult.validForNewPackages) {
    throw new Error(
      `Could not create a project called "${chalk.red(
        name
      )}" because of npm naming restrictions.`
    );
  }
}

function checkAppPath(path) {
  if (fs.existsSync(path)) {
    if (fs.lstatSync(path).isDirectory()) {
      const files = fs.readdirSync(path);

      if (files && files.length > 0) {
        throw new Error(
          `Could not create project in destination folder "${chalk.red(
            path
          )}" because it is not empty.`
        );
      }
    } else {
      throw new Error(
        `Could not create project at path ${chalk.red(
          path
        )} because a file of the same name already exists.`
      );
    }
  }
}

function isYarnAvailable() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (err) {
    return false;
  }
}

function getLatestInstantSearchVersion() {
  // TODO: get from a template package.json
  return '2.7.0';
}

module.exports = {
  checkAppName,
  checkAppPath,
  isYarnAvailable,
  getLatestInstantSearchVersion,
};
