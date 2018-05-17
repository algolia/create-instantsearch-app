const fs = require('fs');
const path = require('path');

const {
  checkAppName,
  checkAppPath,
  isYarnAvailable,
} = require('../shared/utils');

const TEMPLATE_FOLDER = path.join(__dirname, '../../templates');
const TEMPLATES_NAMES = fs
  .readdirSync(TEMPLATE_FOLDER)
  .map(name => path.join(TEMPLATE_FOLDER, name))
  .filter(source => fs.lstatSync(source).isDirectory())
  .map(source => path.basename(source));

const OPTIONS = {
  path: {
    validate(input) {
      // Side effect: `checkAppPath()` can throw
      return Boolean(input) && checkAppPath(input);
    },
  },
  name: {
    validate(input) {
      // Side effect: `checkAppName()` can throw
      return checkAppName(input);
    },
  },
  template: {
    validate(input) {
      return TEMPLATES_NAMES.includes(input);
    },
    getErrorMessage() {
      return `The option \`template\` must be one of these: ${TEMPLATES_NAMES.join(
        ', '
      )}.`;
    },
  },
  installation: {
    validate(input) {
      return input === true || input === false;
    },
  },
};

module.exports = function createInstantSearchApp(
  appPath,
  rawConfig,
  dependencies
) {
  const { buildApp, installDependencies, emitter } = dependencies;

  const config = {
    ...rawConfig,
    path: appPath,
    name: rawConfig.name || path.basename(appPath),
    installation: rawConfig.installation !== false,
    silent: rawConfig.silent === true,
  };

  Object.keys(OPTIONS).forEach(optionName => {
    const isOptionValid = OPTIONS[optionName].validate(config[optionName]);

    if (!isOptionValid) {
      const errorMessage = OPTIONS[optionName].getErrorMessage
        ? OPTIONS[optionName].getErrorMessage(config[optionName])
        : `The option \`${optionName}\` is required.`;

      throw new Error(errorMessage);
    }
  });

  const packageManager = isYarnAvailable() ? 'yarn' : 'npm';
  let hasInstalledDependencies = false;

  buildApp(config)
    .then(() => {
      if (config.installation) {
        return emitter
          .emit('installation:start')
          .then(() => {
            installDependencies(config.path, {
              packageManager,
              silent: config.silent,
            });

            hasInstalledDependencies = true;
          })
          .catch(() => {
            emitter.emit('installation:error');
          });
      } else {
        return Promise.resolve();
      }
    })
    .then(() =>
      emitter.emit('build:success', {
        config,
        info: {
          packageManager,
          hasInstalledDependencies,
        },
      })
    )
    .catch(() => {
      emitter.emit('build:error');
    });

  return emitter;
};
