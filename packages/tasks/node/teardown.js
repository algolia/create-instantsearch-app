const { isYarnAvailable } = require('../../shared/utils');

module.exports = function teardown() {
  const hasYarn = isYarnAvailable();
  const install = hasYarn ? 'yarn' : 'npm install';
  const start = hasYarn ? 'yarn start' : 'npm start';

  return Promise.resolve({
    commands: {
      start,
      install,
    },
  });
};
