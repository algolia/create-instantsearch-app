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

```js
import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch/lite';
import { {{ camelCaseName }} } from '{{ packageName }}';

const searchClient = algoliasearch('appId', 'apiKey');

const search = instantsearch({
  indexName: 'indexName',
  searchClient,
});

search.addWidgets([
  {{ camelCaseName }}({
    // widget parameters
  }),
]);

search.start();
```

### Options

| Option | Type | Required | Default | Description |
| :-- | :-- | :-- | :-- | --- |
| [`container`](#container) | `string` or `HTMLElement` | true | - | The element to insert the widget into. |
| [`option1`](#option1) | `...` | true | - | REPLACE WITH THE DESCRIPTION FOR THIS OPTION |

#### container

> `string | Element` | **required**

The element to insert the widget into.

This can be either a valid CSS Selector:

```js
{{ camelCaseName }}({
  container: '#{{ name }}',
  // ...
});
```

or an `HTMLElement`:

```js
{{ camelCaseName }}({
  container: document.querySelector('#{{ name }}'),
  // ...
});
```
```

#### option1

> `...` | **required**

REPLACE WITH THE DESCRIPTION FOR THIS OPTION

```js
{{ camelCaseName }}({
  option1: 'value',
  // ...
});
```


## Connector

### Usage

```js
import { connect{{ pascalCaseName }} } from '{{ packageName }}';

// 1. Create a render function
const render{{ pascalCaseName }} = (renderOptions, isFirstRender) => {
  // Rendering logic
};

// 2. Create the custom widget
const custom{{ pascalCaseName }} = connect{{ pascalCaseName }}(
  render{{ pascalCaseName }}
);

// 3. Instantiate
search.addWidgets([
  custom{{ pascalCaseName }}({
    // instance params
  }),
]);
```

### Options

#### option1

> `...`

REPLACE WITH THE DESCRIPTION FOR THIS RENDERING ITEM


```js
const render{{ pascalCaseName }} = (renderOptions, isFirstRender) => {
  // show how to use this render option
};

const custom{{ pascalCaseName }} = connect{{ pascalCaseName }}(
  render{{ pascalCaseName }},
);

search.addWidgets([
  custom{{pascalCaseName }}({
    // ...
  }),
]);
```

#### widgetParams

> `object`

All original widget options forwarded to the render function.

```js
const render{{ pascalCaseName }} = (renderOptions, isFirstRender) => {
  const { widgetParams } = renderOptions;
  widgetParams.container.innerHTML = '...';
};

const custom{{ pascalCaseName }} = connect{{ pascalCaseName }}(
  render{{ pascalCaseName }},
);

search.addWidgets([
  custom{{ pascalCaseName }}({
    container: document.querySelector('#{{ name }}'),
    // ...
  }),
]);
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
