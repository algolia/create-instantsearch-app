const build = require('../../packages/tasks/common/build');
const clean = require('../../packages/tasks/common/clean');
const install = require('../../packages/tasks/node/install');
const teardown = require('../../packages/tasks/node/teardown');

module.exports = {
  libraryName: 'instantsearch.js',
  tasks: {
    setup: () => Promise.resolve(),
    build,
    install,
    clean,
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
