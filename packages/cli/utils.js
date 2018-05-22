const algoliasearch = require('algoliasearch');

function camelCase(string) {
  return string.replace(/-([a-z])/g, str => str[1].toUpperCase());
}

function getOptionsFromArguments(rawArgs) {
  let argIndex = 0;

  return rawArgs.reduce((allArgs, currentArg) => {
    argIndex++;

    if (!currentArg.startsWith('--') || currentArg.startsWith('--no-')) {
      return allArgs;
    }

    const argumentName = camelCase(currentArg.split('--')[1]);
    const argumentValue = rawArgs[argIndex];

    return {
      ...allArgs,
      [argumentName]: argumentValue,
    };
  }, {});
}

function isQuestionAsked({ question, args }) {
  for (const optionName in args) {
    if (question.name === optionName) {
      // Skip if the arg in the command is valid
      if (question.validate && question.validate(args[optionName])) {
        return false;
      }
    } else if (!question.validate) {
      // Skip if the question is optional and not given in the command
      return false;
    }
  }

  return true;
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
  camelCase,
  getOptionsFromArguments,
  isQuestionAsked,
  fetchLibraryVersions,
};
