#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const latestSemver = require('latest-semver');
const { fetchLibraryVersions } = require('../packages/shared/utils');

const createInstantSearchApp = require('../');

const TEMPLATES_BRANCH = 'templates';
const BUILD_FOLDER = 'build';

const APP_ID = 'latency';
const API_KEY = '6be0576ff61c053d5f9a3225e2a90f76';
const INDEX_NAME = 'instant_search';

function exitWithError(err) {
  console.log();
  console.log('❎  Canceled template compilation.');

  if (err) {
    console.error(err);
  }

  if (fs.lstatSync(BUILD_FOLDER).isDirectory()) {
    execSync(`rm -rf ${BUILD_FOLDER}`);
  }

  process.exit(1);
}

async function build() {
  // Clone the `templates` branch inside the `build` folder on the current branch
  if (fs.lstatSync(BUILD_FOLDER).isDirectory()) {
    execSync(`rm -rf ${BUILD_FOLDER}`);
  }

  execSync(`mkdir ${BUILD_FOLDER}`);
  execSync(
    `git clone -b ${TEMPLATES_BRANCH} --single-branch https://github.com/algolia/create-instantsearch-app.git ${BUILD_FOLDER}`
  );

  const templatesFolder = path.join(__dirname, '../templates');
  const templates = fs
    .readdirSync(templatesFolder)
    .map(name => path.join(templatesFolder, name))
    .filter(source => fs.lstatSync(source).isDirectory())
    .map(source => path.basename(source));

  console.log('▶︎  Generating templates');

  // Create all demos
  await Promise.all(
    templates.map(async templateTitle => {
      const {
        appName,
        templateName,
        libraryName,
        keywords,
      } = require(`${templatesFolder}/${templateTitle}/.template.js`);
      const appPath = `${BUILD_FOLDER}/${templateName}`;
      execSync(`rm -rf ${appPath}`);

      const app = createInstantSearchApp(appPath, {
        name: appName,
        template: templateTitle,
        libraryVersion: await fetchLibraryVersions(libraryName).then(
          latestSemver
        ),
        appId: APP_ID,
        apiKey: API_KEY,
        indexName: INDEX_NAME,
        mainAttribute: 'name',
        attributesForFaceting: ['brand'],
        installation: false,
        silent: true,
      });

      await app.create();

      const packagePath = `${appPath}/package.json`;
      const packageConfig = JSON.parse(fs.readFileSync(packagePath));
      const packageConfigFilled = {
        ...packageConfig,
        keywords,
      };

      fs.writeFileSync(
        packagePath,
        JSON.stringify(packageConfigFilled, null, 2)
      );
    })
  );

  // Change directory to the build folder to execute Git commands
  process.chdir(BUILD_FOLDER);

  // Stage all new demos to Git
  execSync(`git add -A`);

  // Commit the new demos
  const commitMessage = 'feat(template): Update templates';

  console.log('▶︎  Commiting');
  console.log();
  console.log(`  ${chalk.cyan(commitMessage)}`);

  execSync(`git commit -m "${commitMessage}"`);

  // Push the new demos to the `templates` branch
  console.log();
  console.log(`▶︎  Pushing to branch "${chalk.green(TEMPLATES_BRANCH)}"`);
  execSync(`git push origin ${TEMPLATES_BRANCH}`);

  console.log();
  console.log(
    `✅  Templates have been compiled to the branch "${chalk.green(
      TEMPLATES_BRANCH
    )}".`
  );
  console.log();

  process.chdir('..');

  // Clean the build folder
  execSync(`rm -rf ${BUILD_FOLDER}`);
}

build().catch(exitWithError);
