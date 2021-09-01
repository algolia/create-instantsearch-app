const install = require('../../tasks/node/install');
const teardown = require('../../tasks/node/teardown');

module.exports = {
  category: 'Web',
  libraryName: 'angular-instantsearch',
  templateName: 'angular-instantsearch',
  supportedVersion: '^4.0.0',
  appName: 'angular-instantsearch-app',
  keywords: ['algolia', 'InstantSearch', 'Angular', 'angular-instantsearch'],
  tasks: {
    install,
    teardown,
  },
};
