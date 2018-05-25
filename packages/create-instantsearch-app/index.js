const CreateInstantSearchApp = require('./CreateInstantSearchApp');
const setup = require('./tasks/setup');
const build = require('./tasks/build');
const install = require('./tasks/install');
const clean = require('./tasks/clean');
const teardown = require('./tasks/teardown');

module.exports = function createInstantSearchApp(path, config) {
  return new CreateInstantSearchApp(path, config, {
    setup,
    build,
    install,
    clean,
    teardown,
  });
};
