import algoliasearch from 'algoliasearch';
import autocomplete from 'autocomplete.js';

const client = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76');
const index = client.initIndex('instant_search');

autocomplete('#searchBox input[type=search]', { hint: false }, [
  {
    source: autocomplete.sources.hits(index, { hitsPerPage: 5 }),
    displayKey: 'name',
    templates: {
      suggestion(suggestion) {
        return suggestion._highlightResult.name.value;
      },
    },
  },
]).on('autocomplete:selected', (event, suggestion, dataset) => {
  console.log({ suggestion, dataset });
});
