const CreateInstantSearchApp = require('./createInstantSearchApp');
const buildApp = require('./tasks/buildApp');
const installDependencies = require('./tasks/installDependencies');

module.exports = function createInstantSearchApp(path, config) {
  return new CreateInstantSearchApp(path, config, {
    buildApp,
    installDependencies,
  });
};
