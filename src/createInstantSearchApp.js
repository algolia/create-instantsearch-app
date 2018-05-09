#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const process = require('process');
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const latestSemver = require('latest-semver');

const buildApp = require('../tasks/buildApp');
const installDependencies = require('../tasks/installDependencies');
const fetchLibraryVersions = require('../tasks/fetchLibraryVersions');
const {
  checkAppName,
  checkAppPath,
  getOptionsFromArguments,
  isQuestionAsked,
  isYarnAvailable,
  getLibraryName,
} = require('./utils');
const { version } = require('../package.json');

const fallbackLibraryVersion = '1.0.0';
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
    suffix: ` ${chalk.whiteBright('(optional)')}`,
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

const appName = path.basename(appPath);
const packageManager = isYarnAvailable() ? 'yarn' : 'npm';

try {
  checkAppName(appName);
  checkAppPath(appPath);
} catch (err) {
  console.log(err.message);
  process.exit(1);
}

async function getDefaultLibraryVersion(libraryName) {
  try {
    const versions = await fetchLibraryVersions(libraryName);
    const latestStableVersion = latestSemver(versions);

    return latestStableVersion;
  } catch (err) {
    return fallbackLibraryVersion;
  }
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
    libraryVersion:
      answers.libraryVersion ||
      (await getDefaultLibraryVersion(getLibraryName(answers.template))),
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
      console.log();
      console.log();
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
  console.log('⚡️  Start building something awesome!');
})();
