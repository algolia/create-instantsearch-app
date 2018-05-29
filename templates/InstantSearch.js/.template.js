const install = require('../../packages/tasks/node/install');
const teardown = require('../../packages/tasks/node/teardown');

module.exports = {
  libraryName: 'instantsearch.js',
  templateName: 'instantsearch.js',
  appName: 'instantsearch.js-app',
  keywords: [
    'algolia',
    'search',
    'template',
    'example',
    'fiddle',
    'InstantSearch',
    'InstantSearch.js',
    'instantsearch',
  ],
  tasks: {
    install,
    teardown,
  },
};
