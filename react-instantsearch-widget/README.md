# react-instantsearch-app

_This project was generated with [create-instantsearch-app](https://github.com/algolia/create-instantsearch-app) by [Algolia](https://algolia.com)._



## Install

```bash
npm install 
# or
yarn add 
```

## Widget

### Usage

```jsx
import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch/lite';
import {  } from '';

const searchClient = algoliasearch('appId', 'apiKey');

const App = () => (
  <InstantSearch searchClient={searchClient} indexName="indexName">
    < />
  </InstantSearch>
);
```

## Connector

### Usage

```jsx
import { connect } from '';

// 1. Create a render function
const Render = (renderOptions, isFirstRender) => {
  // Rendering logic
};

// 2. Create the custom widget
const Custom = connect(
  Render
);

// 3. Instantiate
const App = () => (
  <InstantSearch searchClient={searchClient} indexName="indexName">
    <Custom />
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
