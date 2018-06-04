const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const { checkAppName, checkAppPath } = require('../shared/utils');

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
      return fs.existsSync(`${input}/.template.js`);
    },
    getErrorMessage() {
      return 'The template must contain a configuration file `.template.js`.';
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

class CreateInstantSearchApp extends EventEmitter {
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
    const noop = () => {};
    const {
      setup = noop,
      build = require('../tasks/common/build'),
      install = noop,
      clean = require('../tasks/common/clean'),
      teardown = noop,
    } = this.tasks;

    try {
      this.emit('setup:start', { config });
      await setup(config);
      this.emit('setup:end', { config });
    } catch (err) {
      this.emit('setup:error', { err, config });

      return;
    }

    try {
      this.emit('build:start', { config });
      await build(config);

      if (config.installation) {
        try {
          this.emit('installation:start', { config });
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
      this.emit('build:end', { config });
    } catch (err) {
      this.emit('build:error', { err, config });

      return;
    }

    try {
      this.emit('teardown:start', { config });
      await teardown(config);
      this.emit('teardown:end', { config });
    } catch (err) {
      this.emit('teardown:error', { err, config });

      return;
    }
  }
}

module.exports = CreateInstantSearchApp;
