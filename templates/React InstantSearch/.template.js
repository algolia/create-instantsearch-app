const install = require('../../packages/tasks/node/install');
const teardown = require('../../packages/tasks/node/teardown');

module.exports = {
  libraryName: 'react-instantsearch',
  templateName: 'react-instantsearch',
  appName: 'react-instantsearch-app',
  keywords: [
    'algolia',
    'template',
    'example',
    'fiddle',
    'InstantSearch',
    'React',
    'react-instantsearch',
  ],
  tasks: {
    install,
    teardown,
  },
};
