const createInstantSearchApp = require('./src');

module.exports = createInstantSearchApp;

createInstantSearchApp('/tmp/app-new', { template: 'InstantSearch.js' });
