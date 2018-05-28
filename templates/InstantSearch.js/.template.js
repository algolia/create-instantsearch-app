const install = require('../../packages/tasks/node/install');
const teardown = require('../../packages/tasks/node/teardown');

module.exports = {
  libraryName: 'instantsearch.js',
  tasks: {
    install,
    teardown,
  },
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
};
