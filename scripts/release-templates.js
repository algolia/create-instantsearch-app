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
  console.log('❎  Cancelled template compilation.');

  if (err) {
    console.error(err);
  }

  process.exit(1);
}

async function build() {
  // const initialBranch = execSync('git rev-parse --abbrev-ref HEAD')
  //   .toString()
  //   .trim();

  // Allow template build only from `master` branch
  // if (initialBranch !== 'master') {
  //   console.error(
  //     `You cannot compile the templates from the branch "${chalk.red(
  //       initialBranch
  //     )}". Please change to "${chalk.cyan('master')}".`
  //   );
  //   console.log();
  //   console.log(`  ${chalk.cyan('git checkout master')}`);

  //   exitWithError();
  // }

  const templateBranch = execSync(`git branch --list ${TEMPLATES_BRANCH}`)
    .toString()
    .trim();

  // Create the `templates` orphan branch if doesn't exist
  if (!templateBranch) {
    execSync(`git checkout --orphan ${TEMPLATES_BRANCH}`);
    // execSync(`git push origin ${TEMPLATES_BRANCH}`);
  } else {
    execSync(`git checkout ${TEMPLATES_BRANCH}`);
  }

  // Clone the `templates` branch inside the `build` folder on the current branch
  execSync(`mkdir ${BUILD_FOLDER}`);
  execSync(`cd ${BUILD_FOLDER}`);
  execSync(`git clone -b ${TEMPLATES_BRANCH} --single-branch .`);

  const templatesFolder = path.join(__dirname, '../tmp/templates');
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
  execSync(`cd ${BUILD_FOLDER}`);

  // Stage all new demos to Git
  execSync(`git add -A`);

  // Commit the new demos
  const commitMessage = `feat(template): Update templates`;

  //   const commitMessage = `feat(template): Update templates

  // ${templates
  //     .map(templateTitle => `* Update "${templateTitle}" template`)
  //     .join('\n')}`;

  console.log('▶︎  Commiting');
  console.log();
  console.log(`  ${chalk.cyan(commitMessage)}`);

  execSync(`git commit -m "${commitMessage}"`);

  // Push new demos to `templates` branch
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

  // Clean the build folder
  execSync(`rm -rf ${BUILD_FOLDER}`);
}

build().catch(exitWithError);
