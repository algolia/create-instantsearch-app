const fs = require('fs');
const path = require('path');
const Emittery = require('emittery');

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

class CreateInstantSearchApp extends Emittery {
  constructor(appPath, rawConfig, tasks) {
    super();

    const config = this.getConfig({ ...rawConfig, path: appPath });

    this.checkConfig(config);
    this.create(config, tasks);
  }

  getConfig(options) {
    return {
      ...options,
      name: options.name || path.basename(options.path),
      installation: options.installation !== false,
      silent: options.silent === true,
    };
  }

  checkConfig(config) {
    Object.keys(OPTIONS).forEach(optionName => {
      const isOptionValid = OPTIONS[optionName].validate(config[optionName]);

      if (!isOptionValid) {
        const errorMessage = OPTIONS[optionName].getErrorMessage
          ? OPTIONS[optionName].getErrorMessage(config[optionName])
          : `The option \`${optionName}\` is required.`;

        throw new Error(errorMessage);
      }
    });
  }

  async create(config, tasks) {
    const { build, install } = tasks;

    const packageManager = isYarnAvailable() ? 'yarn' : 'npm';
    let hasInstalledDependencies = false;

    await build(config);

    if (config.installation) {
      await this.emit('installation:start');

      try {
        install(config.path, {
          packageManager,
          silent: config.silent,
        });
        hasInstalledDependencies = true;
      } catch (err) {
        hasInstalledDependencies = false;
        this.emit('installation:error');
      }
    }

    try {
      await this.emit('build:success', {
        config,
        info: {
          packageManager,
          hasInstalledDependencies,
        },
      });
    } catch (err) {
      this.emit('build:error');
    }
  }
}

module.exports = CreateInstantSearchApp;
