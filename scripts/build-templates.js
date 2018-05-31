#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const chalk = require('chalk');

const createInstantSearchApp = require('../');

const TEMPLATES_BRANCH = 'templates';

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
  const initialBranch = await exec('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim();

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

  const templateBranch = await exec(`git branch --list ${TEMPLATES_BRANCH}`)
    .toString()
    .trim();

  // Create `templates` branch if doesn't exist
  if (!templateBranch) {
    await exec(`git checkout -b ${TEMPLATES_BRANCH}`);
  } else {
    await exec(`git checkout ${TEMPLATES_BRANCH}`);
  }

  // Delete all content on the `templates` branch except the `templates` folder
  // await exec('shopt -s extglob');
  // await exec('rm -rf !("templates")');

  const templatesFolder = path.join(__dirname, '../templates');
  const templates = fs
    .readdirSync(templatesFolder)
    .map(name => path.join(templatesFolder, name))
    .filter(source => fs.lstatSync(source).isDirectory())
    .map(source => path.basename(source));

  console.log('▶︎  Generating templates');

  // Create all demos
  await templates.forEach(async templateTitle => {
    const {
      appName,
      keywords,
    } = require(`${templatesFolder}/${templateTitle}/.template.js`);
    const appPath = appName;

    const app = createInstantSearchApp(appPath, {
      name: appName,
      template: templateTitle,
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

    fs.writeFileSync(packagePath, JSON.stringify(packageConfigFilled, null, 2));
  });

  // Delete the `templates` folder which is not useful anymore
  // await exec('rm -rf templates');

  // Stage all new demos to Git
  await exec(`git add -A`);

  // Commit the new demos
  const commitMessage = `feat(template): Update templates`;

  //   const commitMessage = `feat(template): Update templates

  // ${templates
  //     .map(templateTitle => `* Update "${templateTitle}" template`)
  //     .join('\n')}`;

  console.log('▶︎  Commiting');
  console.log();
  console.log(`  ${chalk.cyan(commitMessage)}`);

  await exec(`git commit -m "${commitMessage}"`);

  // Push new demos to `templates` branch
  console.log();
  console.log(`▶︎  Pushing to branch "${chalk.green(TEMPLATES_BRANCH)}"`);
  // await exec(`git push origin ${TEMPLATES_BRANCH}`);

  console.log();
  console.log(
    `✅  Templates have been compiled to the branch "${chalk.green(
      TEMPLATES_BRANCH
    )}".`
  );
  console.log();

  // Move back to the initial branch
  await exec(`git checkout ${initialBranch}`);
}

build().catch(exitWithError);
