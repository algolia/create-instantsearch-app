/* global instantsearch */

const search = instantsearch({
  appId: 'latency',
  apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  indexName: 'instant_search',
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#searchBox',
  })
);

search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: '<div class="hit">{{{_highlightResult.name.value}}}</div>',
    },
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attributeName: 'brand',
  })
);


search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
  })
);

search.start();
