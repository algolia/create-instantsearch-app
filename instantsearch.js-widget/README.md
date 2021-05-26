# instantsearch.js-app

_This project was generated with [create-instantsearch-app](https://github.com/algolia/create-instantsearch-app) by [Algolia](https://algolia.com)._



## Install

```bash
npm install 
# or
yarn add 
```

## Widget

### Usage

```js
import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch/lite';
import {  } from '';

const searchClient = algoliasearch('appId', 'apiKey');

const search = instantsearch({
  indexName: 'indexName',
  searchClient,
});

search.addWidgets([
  ({
    // widget parameters
  }),
]);

search.start();
```

### Options

#### container

> `string | Element` | **required**

The element to insert the widget into.

This can be either a valid CSS Selector:

```js
({
  container: '#instantsearch.js-app',
  // ...
});
```

or an `HTMLElement`:

```js
({
  container: document.querySelector('#instantsearch.js-app'),
  // ...
});
```
```

#### option1

> `...` | **required**

REPLACE WITH THE DESCRIPTION FOR THIS OPTION

```js
({
  option1: 'value',
  // ...
});
```


## Connector

### Usage

```js
import { connect } from '';

// 1. Create a render function
const render = (renderOptions, isFirstRender) => {
  // Rendering logic
};

// 2. Create the custom widget
const custom = connect(
  render
);

// 3. Instantiate
search.addWidgets([
  custom({
    // instance params
  }),
]);
```

### Options

#### option1

> `...`

REPLACE WITH THE DESCRIPTION FOR THIS RENDERING ITEM


```js
const render = (renderOptions, isFirstRender) => {
  // show how to use this render option
};

const custom = connect(
  render,
);

search.addWidgets([
  custom({
    // ...
  }),
]);
```

#### widgetParams

> `object`

All original widget options forwarded to the render function.

```js
const render = (renderOptions, isFirstRender) => {
  const { widgetParams } = renderOptions;
  widgetParams.container.innerHTML = '...';
};

const custom = connect(
  render,
);

search.addWidgets([
  custom({
    container: document.querySelector('#instantsearch.js-app'),
    // ...
  }),
]);
```
