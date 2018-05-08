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

function getOptionsFromArguments(rawArgs) {
  let argIndex = 0;

  return rawArgs.reduce((allArgs, currentArg) => {
    argIndex++;

    const argumentName = currentArg.split('--')[1];
    const argumentValue = rawArgs[argIndex];

    return {
      ...allArgs,
      ...(currentArg.startsWith('--') && {
        [argumentName]: argumentValue,
      }),
    };
  }, {});
}

function isQuestionAsked({ question, args }) {
  for (const optionName in args) {
    if (question.name === optionName) {
      // Skip if the arg in the command is valid
      if (question.validate && question.validate(args[optionName])) {
        return false;
      }
    } else {
      // Skip if the question is optional and not given in the command
      if (!question.validate) {
        return false;
      }
    }
  }

  return true;
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
  getOptionsFromArguments,
  isQuestionAsked,
  isYarnAvailable,
  getLatestInstantSearchVersion,
};
