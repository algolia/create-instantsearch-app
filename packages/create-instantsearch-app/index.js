const CreateInstantSearchApp = require('./createInstantSearchApp');
const build = require('./tasks/build');
const install = require('./tasks/install');

module.exports = function createInstantSearchApp(path, config) {
  return new CreateInstantSearchApp(path, config, {
    build,
    install,
  });
};
