const install = require('../../packages/tasks/ios/install');
const teardown = require('../../packages/tasks/ios/teardown');

module.exports = {
  libraryName: 'instantsearch.js',
  templateName: 'instantsearch-ios',
  appName: 'instantsearch-ios-app',
  keywords: ['algolia', 'InstantSearch', 'iOS', 'instantsearch-ios'],
  tasks: {
    install,
    teardown,
  },
};
