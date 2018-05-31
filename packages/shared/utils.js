const fs = require('fs');
const { execSync } = require('child_process');
const chalk = require('chalk');
const validateProjectName = require('validate-npm-package-name');
const algoliasearch = require('algoliasearch');

function checkAppName(name) {
  const validationResult = validateProjectName(name);

  if (!validationResult.validForNewPackages) {
    let errorMessage = `Could not create a project called "${chalk.red(
      name
    )}" because of npm naming restrictions.`;

    (validationResult.errors || []).forEach(error => {
      errorMessage += `\n  - ${error}`;
    });

    throw new Error(errorMessage);
  }

  return true;
}

function checkAppPath(path) {
  if (fs.existsSync(path)) {
    if (fs.lstatSync(path).isDirectory()) {
      const files = fs.readdirSync(path);

      if (files && files.length > 0) {
        throw new Error(
          `Could not create project in destination folder "${chalk.red(
            path
          )}" because it is not empty.`
        );
      }
    } else {
      throw new Error(
        `Could not create project at path ${chalk.red(
          path
        )} because a file of the same name already exists.`
      );
    }
  }

  return true;
}

function checkAppTemplateConfig(templateConfig) {
  if (!templateConfig.libraryName) {
    throw new Error(
      'The key `libraryName` is required in the template configuration.'
    );
  }
}

function isYarnAvailable() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (err) {
    return false;
  }
}

const algoliaConfig = {
  appId: 'OFCNCOG2CU',
  apiKey: 'f54e21fa3a2a0160595bb058179bfb1e',
  indexName: 'npm-search',
};

const client = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);
const index = client.initIndex(algoliaConfig.indexName);

async function fetchLibraryVersions(libraryName) {
  const library = await index.getObject(libraryName);

  return Object.keys(library.versions).reverse();
}

module.exports = {
  checkAppName,
  checkAppPath,
  checkAppTemplateConfig,
  isYarnAvailable,
  fetchLibraryVersions,
};
