#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const process = require('process');
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const latestSemver = require('latest-semver');

const createInstantSearchApp = require('./src');
const {
  checkAppPath,
  checkAppName,
  getOptionsFromArguments,
  isQuestionAsked,
  getLibraryName,
  fetchLibraryVersions,
} = require('./src/utils');
const { version } = require('./package.json');

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
  .option('--template <template>', 'The InstantSearch template to use')
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
  console.error(err);
  process.exit(1);
}

const templatesFolder = path.join(__dirname, './templates');
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

(async function() {
  console.log(`Creating a new InstantSearch app in ${chalk.green(appPath)}.`);
  console.log();

  const promptAnswers = await inquirer.prompt(questions);
  const config = { ...optionsFromArguments, ...promptAnswers };

  if (program.installation) {
    console.log();
    console.log('📦  Installing dependencies...');
    console.log();
  }

  const app = await createInstantSearchApp(path.resolve(appPath), config).catch(
    err => {
      console.error(err);
      process.exit(1);
    }
  );

  if (!app.info.hasInstalledDependencies) {
    console.log();
    console.log();
    console.warn(
      '⚠️  Dependencies could not have been installed. Please follow the commands below to proceed.'
    );
  }

  const installCommand =
    app.info.packageManager === 'yarn' ? 'yarn' : 'npm install';

  console.log();
  console.log(
    `🎉  Created ${chalk.bold.cyan(app.config.name)} at ${chalk.green(
      app.config.path
    )}.`
  );
  console.log();
  console.log('Begin by typing:');
  console.log();
  console.log(`  ${chalk.cyan('cd')} ${appPath}`);

  if (app.info.hasInstalledDependencies === false) {
    console.log(`  ${chalk.cyan(`${installCommand}`)}`);
  }

  console.log(`  ${chalk.cyan(`${app.info.packageManager} start`)}`);
  console.log();
  console.log('⚡️  Start building something awesome!');
})();
