#!/usr/bin/env node

const path = require('path');
const process = require('process');
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const latestSemver = require('latest-semver');
const loadJsonFile = require('load-json-file');

const createInstantSearchApp = require('../create-instantsearch-app');
const {
  checkAppPath,
  checkAppName,
  getAppTemplateConfig,
  fetchLibraryVersions,
  getAllTemplates,
  getTemplatePath,
} = require('../shared/utils');
const { getOptionsFromArguments, isQuestionAsked } = require('./utils');
const { version } = require('../../package.json');

let appPath;
let options = {};

program
  .version(version, '-v, --version')
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .option('--name <name>', 'The name of the application')
  .option('--app-id <appId>', 'The application ID')
  .option('--api-key <apiKey>', 'The Algolia search API key')
  .option('--index-name <indexName>', 'The main index of your search')
  .option(
    '--main-attribute <mainAttribute>',
    'The main searchable attribute of your index'
  )
  .option(
    '--attributes-for-faceting <attributesForFaceting>',
    'The attributes for faceting'
  )
  .option('-t, --template <template>', 'The InstantSearch template to use')
  .option('--library-version <template>', 'The version of the library')
  .option(
    '-c, --config <config>',
    'The configuration file to get the options from'
  )
  .option('--no-installation', 'Ignore dependency installation')
  .action((dest, opts) => {
    appPath = dest;
    options = opts;
  })
  .parse(process.argv);

if (!appPath) {
  console.log('Please specify the project directory:');
  console.log();
  console.log(
    `  ${chalk.cyan('create-instantsearch-app')} ${chalk.green(
      '<project-directory>'
    )}`
  );
  console.log();
  console.log('For example:');
  console.log(
    `  ${chalk.cyan('create-instantsearch-app')} ${chalk.green(
      'my-instantsearch-app'
    )}`
  );
  console.log();
  console.log(
    `Run ${chalk.cyan('create-instantsearch-app --help')} to see all options.`
  );

  process.exit(1);
}

const appName = path.basename(appPath);

try {
  checkAppPath(appPath);
  checkAppName(appName);
} catch (err) {
  console.error(err.message);
  console.log();

  process.exit(1);
}

const optionsFromArguments = getOptionsFromArguments(options.rawArgs);

const questions = [
  {
    type: 'input',
    name: 'appId',
    message: 'Application ID',
  },
  {
    type: 'input',
    name: 'apiKey',
    message: 'Search API key',
  },
  {
    type: 'input',
    name: 'indexName',
    message: 'Index name',
  },
  {
    type: 'input',
    name: 'mainAttribute',
    message: 'Main searchable attribute',
  },
  {
    type: 'list',
    name: 'template',
    message: 'InstantSearch template',
    choices: getAllTemplates(),
    validate(input) {
      return Boolean(input);
    },
  },
  {
    type: 'list',
    name: 'libraryVersion',
    message: answers => `${answers.template} version`,
    choices: async answers => {
      const templatePath = getTemplatePath(answers.template);
      const templateConfig = getAppTemplateConfig(
        `${templatePath}/.template.js`
      );
      const { libraryName } = templateConfig;

      try {
        const versions = await fetchLibraryVersions(libraryName);
        const latestStableVersion = latestSemver(versions);

        return [
          new inquirer.Separator('Latest stable version (recommended)'),
          latestStableVersion,
          new inquirer.Separator('All versions'),
          ...versions,
        ];
      } catch (err) {
        const fallbackLibraryVersion = '1.0.0';

        console.log();
        console.error(
          chalk.red(
            `Cannot fetch versions for library "${chalk.cyan(libraryName)}".`
          )
        );
        console.log();
        console.log(
          `Fallback to ${chalk.cyan(
            fallbackLibraryVersion
          )}, please upgrade the dependency after generating the app.`
        );
        console.log();

        return [
          new inquirer.Separator('Available versions'),
          fallbackLibraryVersion,
        ];
      }
    },
  },
].filter(question => isQuestionAsked({ question, args: optionsFromArguments }));

async function getConfig() {
  let config;

  if (optionsFromArguments.config) {
    // Get config from configuration file given as an argument
    config = await loadJsonFile(optionsFromArguments.config);
  } else {
    // Get config from the arguments and the prompt
    config = {
      ...optionsFromArguments,
      ...(await inquirer.prompt(questions)),
    };
  }

  const templatePath = getTemplatePath(config.template);
  let libraryVersion = config.libraryVersion;

  if (!libraryVersion) {
    const templateConfig = getAppTemplateConfig(`${templatePath}/.template.js`);

    libraryVersion = await fetchLibraryVersions(
      templateConfig.libraryName
    ).then(latestSemver);
  }

  return {
    ...config,
    libraryVersion,
    template: templatePath,
  };
}

async function run() {
  console.log(`Creating a new InstantSearch app in ${chalk.green(appPath)}.`);

  const config = {
    ...(await getConfig()),
    installation: program.installation,
  };

  const templatePath = getTemplatePath(config.template);
  const { tasks } = getAppTemplateConfig(`${templatePath}/.template.js`);
  const app = createInstantSearchApp(appPath, config, tasks);

  app.on('build:end', data => {
    console.log();
    console.log(
      `🎉  Created ${chalk.bold.cyan(data.config.name)} at ${chalk.green(
        data.config.path
      )}.`
    );
    console.log();
  });

  app.on('build:error', data => {
    console.log();
    console.error(chalk.red('🛑  The app generation failed.'));
    console.error(data.err);
    console.log();
  });

  app.on('installation:start', () => {
    console.log();
    console.log('📦  Installing dependencies...');
    console.log();
  });

  app.on('installation:error', data => {
    console.log();
    console.log();
    console.error(chalk.red('📦  Dependencies could not be installed.'));
    console.log(data.err);
    console.log();
    console.log('Try to create the app without installing the dependencies:');
    console.log(
      `  ${chalk.cyan('create-instantsearch-app')} ${process.argv
        .slice(2)
        .join(' ')} --no-installation`
    );

    console.log();
    console.log();
    console.error(chalk.red('🛑  Aborting the app generation.'));
    console.log();
  });

  app.on('clean:start', data => {
    console.log();
    console.log(`✨  Cleaning up ${chalk.green(data.config.path)}.`);
    console.log();
  });

  await app.create();
}

run().catch(err => {
  console.error(err.message);
  console.log();

  process.exit(2);
});

process.on('SIGINT', () => {
  process.exit(3);
});
