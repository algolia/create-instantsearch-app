#! /usr/bin/env node

const process = require('process');
const path = require('path');
const program = require('commander');
const prompt = require('prompt');
const colors = require('colors');
const algoliasearch = require('algoliasearch');

const version = require('../package.json').version;
const createProject = require('../lib/createProject.js');
const { algolia } = require('../config');

const client = algoliasearch(algolia.appId, algolia.apiKey);
const index = client.initIndex(algolia.indexName);

(async function() {
  let latestVersion;
  let allVersions;

  try {
    const content = await index.search('instantsearch.js');
    const library = content.hits[0];
    latestVersion = library.version;
    allVersions = Object.keys(library.versions);
  } catch (err) {
    // `AlgoliaSearchNetworkError` can occur if offline.
    // Defaults to the latest major version.
    latestVersion = '2';
    allVersions = [latestVersion];
  }

  let opts = {};
  let targetFolderName;

  program
    .version(version)
    .arguments('<destination_folder>')
    .option('--app-id <appId>', 'The application ID')
    .option('--api-key <apiKey>', 'The Algolia search API key')
    .option('--index-name <indexName>', 'The main index of your search')
    .option(
      '--main-attribute <attributeName>',
      'The main searchable attribute of your index'
    )
    .option('--lib-version <libVersion>', 'The InstantSearch.js library version')
    .action(function(dest, options) {
      opts = options;
      targetFolderName = dest;
    })
    .parse(process.argv);

  if (!targetFolderName) {
    console.log(
      'The folder name for the new instantsearch project was not provided 😲'
        .red
    );
    program.help();
  }

  console.log(
    `Creating your new instantsearch app: ${targetFolderName.bold}`.green
  );

  let prompts = [
    {
      name: 'appId',
      description: 'Application ID'.blue,
      required: true,
    },
    {
      name: 'apiKey',
      description: 'Search API key'.blue,
      required: true,
    },
    {
      name: 'indexName',
      description: 'Index name'.blue,
      required: true,
    },
    {
      name: 'libVersion',
      description: `InstantSearch version`.blue,
      default: latestVersion,
      required: false,
      conform: value => allVersions.includes(value),
      message:
        "This version of InstantSearch.js doesn't exist (see https://yarnpkg.com/en/package/instantsearch.js)",
    },
    {
      name: 'attributeName',
      description: 'Main searchable attribute'.blue,
      required: false,
    },
  ];

  prompt.message = '';
  prompt.override = opts;

  prompt.start();
  prompt.get(prompts, function(err, config) {
    if (err) {
      console.log('\nProject creation cancelled 😢'.red);
      process.exit(0);
    } else {
      config.name = targetFolderName;
      config.targetFolderName = path.join(process.cwd(), targetFolderName);
      createProject(config);
      console.log('Project successfully created 🚀'.green.bold);
    }
  });
})();
