const algoliasearch = require('algoliasearch');

const algoliaConfig = {
  appId: 'OFCNCOG2CU',
  apiKey: 'f54e21fa3a2a0160595bb058179bfb1e',
  indexName: 'npm-search',
};

const client = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);
const index = client.initIndex(algoliaConfig.indexName);

module.exports = async function fetchLibraryVersions(libraryName) {
  const library = await index.getObject(libraryName);

  return Object.keys(library.versions).reverse();
};
