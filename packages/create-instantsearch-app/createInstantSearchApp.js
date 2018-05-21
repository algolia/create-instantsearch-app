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

    const config = this.getConfig({
      ...rawConfig,
      path: appPath ? path.resolve(appPath) : '',
    });

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
    const { build, install, clean } = tasks;

    const packageManager = isYarnAvailable() ? 'yarn' : 'npm';

    await this.emit('build:start', { config });
    await build(config);

    if (config.installation) {
      await this.emit('installation:start', { config });

      try {
        install(config, { packageManager });
        await this.emit('installation:end', { config });
      } catch (err) {
        await this.emit('installation:error', { err, config });

        await this.emit('clean:start', { config });
        clean(config);
        await this.emit('clean:end', { config });

        return;
      }
    }

    try {
      await this.emit('build:end', {
        config,
        info: {
          packageManager,
        },
      });
    } catch (err) {
      await this.emit('build:error', { err, config });

      return;
    }
  }
}

module.exports = CreateInstantSearchApp;
