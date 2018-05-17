const { checkAppName, checkAppPath } = require('./utils');

const fs = require('fs');
const path = require('path');

const TEMPLATE_FOLDER = path.join(__dirname, '../templates');
const TEMPLATES_NAMES = fs
  .readdirSync(TEMPLATE_FOLDER)
  .map(name => path.join(TEMPLATE_FOLDER, name))
  .filter(source => fs.lstatSync(source).isDirectory())
  .map(source => path.basename(source));

const OPTIONS = {
  path: {
    validate(input) {
      return Boolean(input) && checkAppPath(input);
    },
  },
  name: {
    validate(input) {
      return Boolean(input) || checkAppName(input);
    },
  },
  template: {
    validate(input) {
      return TEMPLATES_NAMES.includes(input);
    },
  },
  installation: {
    validate(input) {
      return input === true || input === false;
    },
  },
};

module.exports = function createInstantSearchApp(appPath, config, tasks) {
  const { buildApp, installDependencies } = tasks;

  const options = {
    ...config,
    path: appPath,
    name: config.name || path.basename(appPath),
    installation: config.installation === false ? false : true,
    libraryVersion: config.libraryVersion || '1.0.0',
  };

  Object.keys(OPTIONS).forEach(optionName => {
    const isOptionValid = OPTIONS[optionName].validate(options[optionName]);

    if (!isOptionValid) {
      throw new Error(`The option \`${optionName}\` is required.`);
    }
  });

  buildApp(options).then(() => {
    if (options.installation) {
      installDependencies(options.path);
    }
  });
};
