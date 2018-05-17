const Emittery = require('emittery');
const emitter = new Emittery();

const createInstantSearchAppFactory = require('./createInstantSearchApp');
const buildApp = require('./tasks/buildApp');
const installDependencies = require('./tasks/installDependencies');

module.exports = function createInstantSearchApp(path, config) {
  return createInstantSearchAppFactory(path, config, {
    buildApp,
    installDependencies,
    emitter,
  });
};
