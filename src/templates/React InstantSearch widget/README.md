# {{name}}

_This project was generated with [create-instantsearch-app](https://github.com/algolia/create-instantsearch-app) by [Algolia](https://algolia.com)._

{{ description }}

## Install

```bash
npm install {{ packageName }}
# or
yarn add {{ packageName }}
```

## Widget

### Usage

```jsx
import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch/lite';
import { {{ pascalCaseName }} } from '{{ packageName }}';

const searchClient = algoliasearch('appId', 'apiKey');

const App = () => (
  <InstantSearch searchClient={searchClient} indexName="indexName">
    <{{ pascalCaseName }} />
  </InstantSearch>
);
```

## Connector

### Usage

```jsx
import { connect{{ pascalCaseName }} } from '{{ packageName }}';

// 1. Create a render function
const Render{{ pascalCaseName }} = (renderOptions, isFirstRender) => {
  // Rendering logic
};

// 2. Create the custom widget
const Custom{{ pascalCaseName }} = connect{{ pascalCaseName }}(
  Render{{ pascalCaseName }}
);

// 3. Instantiate
const App = () => (
  <InstantSearch searchClient={searchClient} indexName="indexName">
    <Custom{{ pascalCaseName }} />
  </InstantSearch>
);
```
