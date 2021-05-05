#!/usr/bin/env node
const path = require('path');
const process = require('process');
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const latestSemver = require('latest-semver');

const createInstantSearchApp = require('../api');
const {
  checkAppPath,
  checkAppName,
  getAppTemplateConfig,
  fetchLibraryVersions,
  getTemplatesByCategory,
  getTemplatePath,
} = require('../utils');
const getOptionsFromArguments = require('./getOptionsFromArguments');
const getAttributesFromIndex = require('./getAttributesFromIndex');
const isQuestionAsked = require('./isQuestionAsked');
const {
  getConfiguration,
  getLibraryVersion,
  createNameAlternatives,
} = require('./getConfiguration');
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
    '--attributes-to-display <attributesToDisplay>',
    'The attributes of your index to display'
  )
  .option(
    '--attributes-for-faceting <attributesForFaceting>',
    'The attributes for faceting'
  )
  .option('--template <template>', 'The InstantSearch template to use')
  .option('--library-version <template>', 'The version of the library')
  .option('--config <config>', 'The configuration file to get the options from')
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

const optionsFromArguments = getOptionsFromArguments(options.rawArgs);
const appName = optionsFromArguments.name || path.basename(appPath);
const attributesToDisplay = (optionsFromArguments.attributesToDisplay || '')
  .split(',')
  .filter(Boolean)
  .map(x => x.trim());

try {
  checkAppPath(appPath);
  checkAppName(appName);
} catch (err) {
  console.error(err.message);
  console.log();

  process.exit(1);
}

const questions = {
  application: [
    {
      type: 'list',
      name: 'libraryVersion',
      message: answers => `${answers.template} version`,
      choices: async answers => {
        const templatePath = getTemplatePath(answers.template);
        const templateConfig = getAppTemplateConfig(templatePath);
        const { libraryName } = templateConfig;

        try {
          const versions = await fetchLibraryVersions(libraryName);
          const latestStableVersion = latestSemver(versions);

          if (!latestStableVersion) {
            return versions;
          }

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
      when: answers => {
        const templatePath = getTemplatePath(answers.template);
        const templateConfig = getAppTemplateConfig(templatePath);

        return Boolean(templateConfig.libraryName);
      },
    },
    {
      type: 'input',
      name: 'appId',
      message: 'Application ID',
      default: 'latency',
    },
    {
      type: 'input',
      name: 'apiKey',
      message: 'Search API key',
      default: '6be0576ff61c053d5f9a3225e2a90f76',
    },
    {
      type: 'input',
      name: 'indexName',
      message: 'Index name',
      default: 'instant_search',
    },
    {
      type: 'checkbox',
      name: 'attributesToDisplay',
      message: 'Attributes to display',
      suffix: `\n  ${chalk.gray(
        'Used to generate the default result template'
      )}`,
      pageSize: 10,
      choices: async answers => [
        {
          name: 'None',
          value: undefined,
        },
        new inquirer.Separator(),
        new inquirer.Separator('From your index'),
        ...(await getAttributesFromIndex(answers)),
      ],
      filter: attributes => attributes.filter(Boolean),
      when: ({ appId, apiKey, indexName }) =>
        !attributesToDisplay.length > 0 && appId && apiKey && indexName,
    },
  ],
  widget: [
    {
      type: 'input',
      name: 'organization',
      message: 'organization (on npm)',
      validate(input) {
        return typeof input === 'string';
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'npm and readme description',
      default() {
        const splitName = appName.split('-').join(' ');

        return `InstantSearch widget that makes a ${splitName}`;
      },
      validate(input) {
        return typeof input === 'string';
      },
    },
  ],
};

async function run() {
  console.log();
  console.log(`Creating a new InstantSearch app in ${chalk.green(appPath)}.`);
  console.log();

  const { template = optionsFromArguments.template } = await inquirer.prompt(
    [
      {
        type: 'list',
        pageSize: 10,
        name: 'template',
        message: 'InstantSearch template',
        choices: () => {
          const templatesByCategory = getTemplatesByCategory();

          return Object.entries(templatesByCategory).reduce(
            (templates, [category, values]) => [
              ...templates,
              new inquirer.Separator(category),
              ...values,
            ],
            []
          );
        },
        validate(input) {
          return Boolean(input);
        },
      },
    ].filter(question =>
      isQuestionAsked({ question, args: optionsFromArguments })
    ),
    optionsFromArguments
  );

  const configuration = await getConfiguration({
    options: {
      ...optionsFromArguments,
      name: appName,
      attributesToDisplay,
    },
    answers: { template },
  });

  const templatePath = getTemplatePath(configuration.template);
  const templateConfig = getAppTemplateConfig(templatePath);

  const implementationType =
    templateConfig.category === 'Web - Widget' ? 'widget' : 'application';

  const answers = await inquirer.prompt(
    questions[implementationType].filter(question =>
      isQuestionAsked({ question, args: optionsFromArguments })
    ),
    optionsFromArguments
  );

  const alternativeNames = createNameAlternatives({
    ...configuration,
    ...answers,
  });

  const libraryVersion = await getLibraryVersion(
    { ...configuration, ...answers },
    templateConfig
  );

  const app = createInstantSearchApp(
    appPath,
    {
      ...configuration,
      ...answers,
      ...alternativeNames,
      libraryVersion,
      template: templatePath,
      installation: program.installation,
    },
    templateConfig.tasks
  );

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
