# {{name}}

{{ description }}

---

[![MIT](https://img.shields.io/npm/l/{{ packageName }})](./LICENSE) [![NPM version](http://img.shields.io/npm/v/{{ packageName }}.svg)](https://npmjs.org/package/{{ packageName }})

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

### Options

| Option | Type | Required | Default | Description |
| :-- | :-- | :-- | :-- | --- |
| [`option1`](#option1) | `string` | true | - | REPLACE WITH THE DESCRIPTION FOR THIS OPTION |

#### option1

> `string` | **required**

REPLACE WITH THE DESCRIPTION FOR THIS OPTION

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

## Test

```bash
npm test
# or
yarn test
```

## Build

```bash
npm run build
# or
yarn build
```

## Release

```bash
npm run release
# or
yarn release
```

### First Release

```bash
npm run release -- --first-release
# or
yarn release --first-release
```

This will tag a release without bumping the version.

When you are ready, push the git tag and run `npm publish`.

If you want to publish it as a public scoped package, run `npm publish --access public` the first time.

[To know more about `standard-version`, read this →](https://github.com/conventional-changelog/standard-version#cli-usage)

---

_This project was generated with [create-instantsearch-app](https://github.com/algolia/create-instantsearch-app) by [Algolia](https://algolia.com)._
