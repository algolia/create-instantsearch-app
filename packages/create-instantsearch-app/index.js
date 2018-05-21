const CreateInstantSearchApp = require('./CreateInstantSearchApp');
const build = require('./tasks/build');
const install = require('./tasks/install');
const clean = require('./tasks/clean');

module.exports = function createInstantSearchApp(path, config) {
  return new CreateInstantSearchApp(path, config, {
    build,
    install,
    clean,
  });
};
