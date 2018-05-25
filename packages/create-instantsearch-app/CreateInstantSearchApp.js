const fs = require('fs');
const path = require('path');
const Emittery = require('emittery');

const { checkAppName, checkAppPath } = require('../shared/utils');

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

function checkConfig(config) {
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

class CreateInstantSearchApp extends Emittery {
  constructor(appPath, options, tasks) {
    super();

    this.config = {
      ...options,
      name: options.name || path.basename(appPath),
      installation: options.installation !== false,
      silent: options.silent === true,
      path: appPath ? path.resolve(appPath) : '',
    };
    this.tasks = tasks;

    checkConfig(this.config);
  }

  async create() {
    const config = this.config;
    const { setup, build, install, clean, teardown } = this.tasks;

    try {
      this.emit('setup:start', { config });
      await setup(config);
      this.emit('setup:end', { config });
    } catch (err) {
      this.emit('setup:error', { err, config });
    }

    this.emit('build:start', { config });
    await build(config);

    if (config.installation) {
      this.emit('installation:start', { config });

      try {
        await install(config);
        this.emit('installation:end', { config });
      } catch (err) {
        this.emit('installation:error', { err, config });

        this.emit('clean:start', { config });
        await clean(config);
        this.emit('clean:end', { config });

        return;
      }
    }

    let commands = {};

    try {
      this.emit('teardown:start', { config });
      commands = ((await teardown()) || {}).commands;
      this.emit('teardown:end', { config });
    } catch (err) {
      this.emit('teardown:error', { err, config });
    }

    try {
      this.emit('build:end', {
        config,
        commands,
      });
    } catch (err) {
      this.emit('build:error', { err, config });

      return;
    }
  }
}

module.exports = CreateInstantSearchApp;
