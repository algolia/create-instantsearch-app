const latestSemver = require('latest-semver');
const loadJsonFile = require('load-json-file');
const camelCase = require('lodash.camelcase');

const {
  getAppTemplateConfig,
  fetchLibraryVersions,
  getTemplatePath,
} = require('../utils');

function capitalize(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function createNameAlternatives({ organization, name }) {
  return {
    packageName: `@${organization}/${name}`,
    widgetType: `${organization}.${name}`,
    camelCaseName: camelCase(name),
    pascalCaseName: capitalize(camelCase(name)),
  };
}

module.exports = async function getConfiguration({
  options = {},
  answers = {},
} = {}) {
  const config = options.config
    ? await loadJsonFile(options.config) // From configuration file given as an argument
    : { ...options, ...answers }; // From the arguments and the prompt

  if (!config.template) {
    throw new Error('The template is required in the config.');
  }

  const templatePath = getTemplatePath(config.template);
  const templateConfig = getAppTemplateConfig(templatePath);
  let { libraryVersion } = config;

  if (templateConfig.libraryName && !libraryVersion) {
    libraryVersion = await fetchLibraryVersions(
      templateConfig.libraryName
    ).then(
      versions =>
        // Return the latest available version when
        // the stable version is not available
        latestSemver(versions) || versions[0]
    );
  }

  return {
    ...config,
    ...createNameAlternatives(config),
    libraryVersion,
    template: templatePath,
  };
};
