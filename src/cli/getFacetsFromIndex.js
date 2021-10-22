const algoliasearch = require('algoliasearch');

module.exports = async function getFacetsFromIndex({
  appId,
  apiKey,
  indexName,
} = {}) {
  const client = algoliasearch(appId, apiKey);
  const index = client.initIndex(indexName);

  try {
    const { facets } = await index.search({ hitsPerPage: 0, facets: '*' });
    return Object.keys(facets);
  } catch (err) {
    return [];
  }
};
