# {{name}}

_This project was generated with [create-instantsearch-app](https://github.com/algolia/create-instantsearch-app) by [Algolia](https://algolia.com)._

{{ description }}

## Install

```bash
npm install {{ packageName }}
# or
yarn add {{ packageName }}

## Widget

### Usage

```js
import { {{ camelCaseName }} } from '{{ packageName }}';

const search = instantsearch({
  indexName: 'indexName',
  searchClient: algoliasearch('appId', 'apiKey'),
});

search.addWidgets([
  {{ camelCaseName }}({
    // widget parameters
  }),
]);

search.start();
```

### Options

#### container

type: string | Element

required: true

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

type: ...

required: true

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

type: ...

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

type: object

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
