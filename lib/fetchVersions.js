const algoliasearch = require('algoliasearch');

const { algolia } = require('../config');

const client = algoliasearch(algolia.appId, algolia.apiKey);
const index = client.initIndex(algolia.indexName);

const fetchLatestVersion = async () => {
  let libVersion;

  try {
    const results = await index.search('instantsearch.js');
    const library = results.hits[0];
    libVersion = library.version;
  } catch (err) {
    // `AlgoliaSearchNetworkError` can occur if offline.
    // Defaults to the latest major version.
    libVersion = '2';

    console.warn(
      "⚠️ We couldn't fetch the latest instantsearch.js version as you seem to be offline.\n" +
        'instantsearch.js@2 has been added to your project.\n' +
        "Make sure to explicitely set the latest version when you're back online: https://yarnpkg.com/en/package/instantsearch.js"
    );
  }

  return libVersion;
};

module.exports = {
  fetchLatestVersion,
};
