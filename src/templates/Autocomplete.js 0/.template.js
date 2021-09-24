const install = require('../../tasks/node/install');
const teardown = require('../../tasks/node/teardown');

module.exports = {
  libraryName: 'autocomplete.js',
  templateName: 'autocomplete.js-0.x',
  appName: 'autocomplete.js-app',
  keywords: ['algolia', 'Autocomplete', 'autocomplete.js'],
  tasks: {
    install,
    teardown,
  },
};
