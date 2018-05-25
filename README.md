# Create InstantSearch App

> Build InstantSearch apps at the speed of thoughts ⚡️

`create-instantsearch-app` is a command line utility that helps you quick start your InstantSearch app using any [Algolia](https://algolia.com) InstantSearch flavor ([InstantSearch.js](https://github.com/algolia/instantsearch.js), [React InstantSearch](https://github.com/algolia/react-instantsearch), [Vue InstantSearch](https://github.com/algolia/vue-instantsearch) and [Angular InstantSearch](https://github.com/algolia/angular-instantsearch)).

## Get started

_The tool requires Node ≥ 8._

```sh
npx create-instantsearch-app my-app
cd my-app
npm start
```

> [`npx`](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) is a tool introduced in `npm@5.2.0` that makes it possible to run CLI tools hosted on the npm registry.

Open http://localhost:3000 to see you app.

---

Alternatively, you can use [Yarn](https://http://yarnpkg.com):

```sh
yarn create instantsearch-app my-app
cd my-app
yarn start
```

## Usage

This package comes with the module `createInstantSearchApp(path, options?)` and the command-line tool `create-instantsearch-app`.

```sh
$ create-instantsearch-app --help

  Usage: create-instantsearch-app <project-directory> [options]

  Options:

    -V, --version                                      output the version number
    --app-id <appId>                                   The application ID
    --api-key <apiKey>                                 The Algolia search API key
    --index-name <indexName>                           The main index of your search
    --main-attribute <mainAttribute>                   The main searchable attribute of your index
    --attributes-for-faceting <attributesForFaceting>  The attributes for faceting
    -t, --template <template>                          The InstantSearch template to use
    -c, --config <config>                              The configuration file to get the options from
    --no-installation                                  Ignore dependency installation
    -h, --help                                         output usage information
```

## API

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

### Events

#### `build:start`

Fired at the start of the app build

#### `build:end`

Fired at the end of the app build

#### `build:error`

Fired if an error occurs during the app build

#### `installation:start`

Fired at the start of the app installation

#### `installation:end`

Fired at the end of the app installation

#### `installation:error`

Fired if an error occurs during the app installation

#### `clean:start`

Fired at the start of the app clean up if case the app creation is aborted

#### `clean:end`

Fired at the end of the app clean up if case the app creation is aborted
