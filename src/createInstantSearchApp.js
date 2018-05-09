#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const process = require('process');
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

const buildApp = require('../tasks/buildApp');
const installDependencies = require('../tasks/installDependencies');
const {
  checkAppName,
  checkAppPath,
  getOptionsFromArguments,
  isQuestionAsked,
  isYarnAvailable,
  getLatestInstantSearchVersion,
} = require('./utils');
const { version } = require('../package.json');

let cdPath;
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
  .option('--template <template>', 'The InstantSearch template to use')
  .option('--no-installation', 'Ignore dependency installation')
  .action((dest, opts) => {
    cdPath = dest;
    options = opts;
    appPath = path.resolve(dest);
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

const templatesFolder = path.join(__dirname, '../templates');
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
    validate(input) {
      return Boolean(input);
    },
  },
  {
    type: 'input',
    name: 'apiKey',
    message: 'Search API key',
    validate(input) {
      return Boolean(input);
    },
  },
  {
    type: 'input',
    name: 'indexName',
    message: 'Index name',
    validate(input) {
      return Boolean(input);
    },
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
    choices: templates,
    validate(input) {
      return templates.includes(input);
    },
  },
].filter(question => isQuestionAsked({ question, args: optionsFromArguments }));

const appName = path.basename(appPath);
const packageManager = isYarnAvailable() ? 'yarn' : 'npm';

try {
  checkAppName(appName);
  checkAppPath(appPath);
} catch (err) {
  console.log(err.message);
  process.exit(1);
}

(async function() {
  console.log(`Creating a new InstantSearch app in ${chalk.green(cdPath)}.`);
  console.log();

  const promptAnswers = await inquirer.prompt(questions);
  const answers = { ...optionsFromArguments, ...promptAnswers };

  const config = {
    ...answers,
    appName,
    appPath,
    template: answers.template,
    instantsearchVersion: getLatestInstantSearchVersion(),
    mainAttribute: answers.mainAttribute,
  };

  await buildApp(config);

  const initialDirectory = process.cwd();
  const installCommand = packageManager === 'yarn' ? 'yarn' : 'npm install';
  let hasInstalledDependencies = false;

  if (program.installation) {
    try {
      console.log();
      console.log('📦  Installing dependencies...');
      console.log();

      installDependencies({ appPath, initialDirectory, installCommand });

      hasInstalledDependencies = true;
    } catch (err) {
      console.warn(
        '⚠️  Dependencies could not have been installed. Please follow the commands below to proceed.'
      );
    }
  }

  console.log();
  console.log(
    `🎉  Created ${chalk.bold.cyan(appName)} at ${chalk.green(cdPath)}.`
  );
  console.log();
  console.log('Begin by typing:');
  console.log();
  console.log(`  ${chalk.cyan('cd')} ${cdPath}`);

  if (hasInstalledDependencies === false) {
    console.log(`  ${chalk.cyan(`${installCommand}`)}`);
  }

  console.log(`  ${chalk.cyan(`${packageManager} start`)}`);
  console.log();
  console.log('Start building something awesome ⚡️');
})();
