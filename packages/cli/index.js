#!/usr/bin/env node

const fs = require('fs');
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
  getOptionsFromArguments,
  isQuestionAsked,
  getLibraryName,
  fetchLibraryVersions,
} = require('../shared/utils');
const { version } = require('../../package.json');

const fallbackLibraryVersion = '1.0.0';
let appPath;
let options = {};

program
  .version(version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .option('--app-id <appId>', 'The application ID')
  .option('--api-key <apiKey>', 'The Algolia search API key')
  .option('--index-name <indexName>', 'The main index of your search')
  .option(
    '--main-attribute <mainAttribute>',
    'The main searchable attribute of your index'
  )
  .option('--facets <facets>', 'The attributes for faceting')
  .option('-t, --template <template>', 'The InstantSearch template to use')
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

const templatesFolder = path.join(__dirname, '../../templates');
const templates = fs
  .readdirSync(templatesFolder)
  .map(name => path.join(templatesFolder, name))
  .filter(source => fs.lstatSync(source).isDirectory())
  .map(source => path.basename(source));
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
    suffix: ` ${chalk.whiteBright('(optional)')}`,
  },
  {
    type: 'input',
    name: 'facets',
    message: 'Attributes for faceting',
    suffix: ` ${chalk.whiteBright('(optional)')}`,
    transformer: attributesForFaceting =>
      `[ ${attributesForFaceting
        .split(',')
        .map(x => x.trim())
        .join(', ')} ]`,
  },
  {
    type: 'list',
    name: 'template',
    message: 'InstantSearch template',
    choices: templates,
    validate(input) {
      return templates.includes(input);
    },
  },
  {
    type: 'list',
    name: 'libraryVersion',
    message: answers => `${answers.template} version`,
    choices: async answers => {
      const libraryName = getLibraryName(answers.template);

      try {
        const versions = await fetchLibraryVersions(libraryName);
        const latestStableVersion = latestSemver(versions);

        return [
          new inquirer.Separator('Latest stable version'),
          latestStableVersion,
          new inquirer.Separator('All versions'),
          ...versions,
        ];
      } catch (err) {
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

async function run() {
  console.log(`Creating a new InstantSearch app in ${chalk.green(appPath)}.`);
  console.log();

  const config = {
    ...(optionsFromArguments.config
      ? await loadJsonFile(optionsFromArguments.config)
      : {
          ...optionsFromArguments,
          ...(await inquirer.prompt(questions)),
        }),
    installation: program.installation,
  };

  const app = createInstantSearchApp(path.resolve(appPath), config);

  app.on('build:end', data => {
    const installCommand =
      data.info.packageManager === 'yarn' ? 'yarn' : 'npm install';

    console.log();
    console.log(
      `🎉  Created ${chalk.bold.cyan(data.config.name)} at ${chalk.green(
        data.config.path
      )}.`
    );
    console.log();
    console.log('Begin by typing:');
    console.log();
    console.log(`  ${chalk.cyan('cd')} ${appPath}`);

    if (program.installation === false) {
      console.log(`  ${chalk.cyan(`${installCommand}`)}`);
    }

    console.log(`  ${chalk.cyan(`${data.info.packageManager} start`)}`);
    console.log();
    console.log('⚡️  Start building something awesome!');
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

  app.on('installation:error', () => {
    console.log();
    console.log();
    console.error(chalk.red('📦  Dependencies could not be installed.'));
    console.log();
    console.log('Try to create the app without installing the dependencies:');
    console.log(
      `  ${chalk.cyan('create-instantsearch-app')} ${chalk.green(
        '<project-directory>'
      )} --no-installation`
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
}

run().catch(err => {
  console.error(err.message);
  console.log();

  process.exit(2);
});
