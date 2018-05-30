# Create InstantSearch App

> Build InstantSearch apps at the speed of thoughts ⚡️

[![Build Status][travis-svg]][travis-url] [![Version][version-svg]][package-url] [![License][license-image]][license-url]

`create-instantsearch-app` is a command line utility that helps you quick start your InstantSearch app using any [Algolia][algolia-website] InstantSearch flavor ([InstantSearch.js][instantsearchjs-github], [React InstantSearch][react-instantsearch-github], [Vue InstantSearch][vue-instantsearch-github] and [Angular InstantSearch][angular-instantsearch-github]).

## Get started

_The tool requires Node ≥ 8._

```
npx create-instantsearch-app my-app
cd my-app
npm start
```

> [`npx`](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) is a tool introduced in `npm@5.2.0` that makes it possible to run CLI tools hosted on the npm registry.

Open http://localhost:3000 to see you app.

---

Alternatively, you can use [Yarn](https://http://yarnpkg.com):

```
yarn create instantsearch-app my-app
cd my-app
yarn start
```

## Usage

This package comes with the module `createInstantSearchApp(path, options?, tasks?)` and the command-line tool `create-instantsearch-app`.

```
$ create-instantsearch-app --help

  Usage: create-instantsearch-app <project-directory> [options]

  Options:

    -v, --version                                      output the version number
    --name <name>                                      The name of the application
    --app-id <appId>                                   The application ID
    --api-key <apiKey>                                 The Algolia search API key
    --index-name <indexName>                           The main index of your search
    --main-attribute <mainAttribute>                   The main searchable attribute of your index
    --attributes-for-faceting <attributesForFaceting>  The attributes for faceting
    -t, --template <template>                          The InstantSearch template to use
    --library-version <template>                       The version of the library
    -c, --config <config>                              The configuration file to get the options from
    --no-installation                                  Ignore dependency installation
    -h, --help                                         output usage information
```

### Options documentation

#### `--template`

Supported templates are:

- [`InstantSearch.js`][instantsearchjs-github]
- [`React InstantSearch`][react-instantsearch-github]
- [`Vue InstantSearch`][vue-instantsearch-github]
- [`Angular InstantSearch`][angular-instantsearch-github]

#### `--config`

The `config` flag is handy to automate app generations.

<h6 align="center">`config.json`</h6>

```json
{
  "name": "my-app",
  "template": "InstantSearch JS",
  "libraryVersion": "2.8.0",
  "appId": "MY_APP_ID",
  "apiKey": "MY_API_KEY",
  "indexName": "MY_INDEX_NAME",
  "searchPlaceholder": "Search",
  "mainAttribute": "name",
  "attributesForFaceting": ["brand", "location"]
}
```

Create the app based on this configuration:

```
create-instantsearch-app my-app --config config.json
```

## API

`create-instantsearch-app` is based on the module `createInstantSearchApp(path, options?, tasks?)`.

```javascript
const createInstantSearchApp = require('create-instantsearch-app');

// Initialize the app
const app = createInstantSearchApp('~/lab/my-app', {
  template: 'InstantSearch.js',
  libraryVersion: '2.0.0',
  mainAttribute: 'name',
  attributesForFaceting: ['keywords'],
});

// Track the progress
app.on('build:end', () => {
  console.log('⚡️ App built');
});

// Create the app
app.create();
```

### Tasks

The app generation follows this lifecycle:

1. **Setup**
2. **Build**
3. **Install**
4. (**Clean**) *if the project generation fails*
5. **Teardown**

Each task can be plugged to the third argument of the call `createInstantSearchApp(path, options?, tasks?)`.

<h6 align="center">Example</h6>

```javascript
const app = createInstantSearchApp('my-app', { template: 'InstantSearch.js' }, {
  setup() {
    // Check the project requirements
  },
  teardown() {
    // Go to the project folder
  },
});

app.create();
```

### Events

#### Setup

- `setup:start` at the start of the app setup
- `setup:end` at the end of the app setup
- `setup:error` if an error occurs during the app setup

#### Build

- `build:start` at the start of the app build
- `build:end` at the end of the app build
- `build:error` if an error occurs during the app build

#### Installation

- `installation:start` at the start of the app installation
- `installation:end` at the end of the app installation
- `installation:error` if an error occurs during the app installation

#### Clean

- `clean:start` at the start of the app clean up if case the app creation is aborted
- `clean:end` at the end of the app clean up if case the app creation is aborted

#### Teardown

- `teardown:start` at the start of the app teardown
- `teardown:end` at the end of the app teardown
- `teardown:error` if an error occurs during the app teardown

## License

Create InstantSearch App is [MIT licensed](LICENSE.md).

<!-- Badges -->

[version-svg]: https://img.shields.io/npm/v/create-instantsearch-app.svg?style=flat-square
[package-url]: https://npmjs.org/package/create-instantsearch-app
[travis-svg]: https://img.shields.io/travis/algolia/create-instantsearch-app/develop.svg?style=flat-square
[travis-url]: https://travis-ci.org/algolia/create-instantsearch-app
[license-image]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE

<!-- Links -->

[algolia-website]: https://www.algolia.com/?utm_medium=social-owned&utm_source=GitHub&utm_campaign=create-instantsearch-app%20repository
[instantsearchjs-github]: https://github.com/algolia/instantsearch.js
[react-instantsearch-github]: https://github.com/algolia/react-instantsearch
[vue-instantsearch-github]: https://github.com/algolia/vue-instantsearch
[angular-instantsearch-github]: https://github.com/algolia/angular-instantsearch
