const utils = require('./utils');

describe('getOptionsFromArguments', () => {
  test('with a single option', () => {
    expect(
      utils.getOptionsFromArguments('cmd --appId APP_ID'.split(' '))
    ).toEqual({
      appId: 'APP_ID',
    });
  });

  test('with multiple options', () => {
    expect(
      utils.getOptionsFromArguments([
        'cmd',
        '--appId',
        'APP_ID',
        '--apiKey',
        'API_KEY',
        '--indexName',
        'INDEX_NAME',
        '--template',
        'Vue InstantSearch',
      ])
    ).toEqual({
      appId: 'APP_ID',
      apiKey: 'API_KEY',
      indexName: 'INDEX_NAME',
      template: 'Vue InstantSearch',
    });
  });

  test('with different commands', () => {
    expect(
      utils.getOptionsFromArguments(['yarn', 'start', '--appId', 'APP_ID'])
    ).toEqual({
      appId: 'APP_ID',
    });

    expect(
      utils.getOptionsFromArguments(['node', 'index', '--appId', 'APP_ID'])
    ).toEqual({
      appId: 'APP_ID',
    });

    expect(
      utils.getOptionsFromArguments([
        'npm',
        'init',
        'instantsearch-app',
        '--appId',
        'APP_ID',
      ])
    ).toEqual({
      appId: 'APP_ID',
    });

    expect(
      utils.getOptionsFromArguments([
        'yarn',
        'create',
        'instantsearch-app',
        '--appId',
        'APP_ID',
      ])
    ).toEqual({
      appId: 'APP_ID',
    });

    expect(
      utils.getOptionsFromArguments([
        'create-instantsearch-app',
        '--appId',
        'APP_ID',
      ])
    ).toEqual({
      appId: 'APP_ID',
    });
  });
});

describe('getAttributesFromAnswers', () => {
  const algoliasearchSuccessFn = () => ({
    search: jest.fn(() => ({
      hits: [
        {
          _highlightResult: {
            brand: 'brand',
            description: 'description',
            name: 'name',
            title: 'title',
          },
        },
      ],
    })),
  });

  const algoliasearchFailureFn = () => ({
    search: jest.fn(() => {
      throw new Error();
    }),
  });

  test('with search success should fetch attributes', async () => {
    const attributes = await utils.getAttributesFromAnswers({
      appId: 'appId',
      apiKey: 'apiKey',
      indexName: 'indexName',
      algoliasearchFn: algoliasearchSuccessFn,
    });

    expect(attributes).toEqual(['title', 'name', 'description', 'brand']);
  });

  test('with search failure should return default attributes', async () => {
    const attributes = await utils.getAttributesFromAnswers({
      appId: 'appId',
      apiKey: 'apiKey',
      indexName: 'indexName',
      algoliasearchFn: algoliasearchFailureFn,
    });

    expect(attributes).toEqual(['title', 'name', 'description']);
  });
});

test('isQuestionAsked', () => {
  expect(
    utils.isQuestionAsked({
      question: { name: 'appId', validate: input => Boolean(input) },
      args: { appId: undefined },
    })
  ).toBe(true);

  expect(
    utils.isQuestionAsked({
      question: { name: 'appId', validate: input => Boolean(input) },
      args: { appId: 'APP_ID' },
    })
  ).toBe(false);

  expect(
    utils.isQuestionAsked({
      question: {
        name: 'template',
        validate: input => input !== 'InstantSearch.js',
      },
      args: { template: 'InstantSearch.js' },
    })
  ).toBe(true);

  expect(
    utils.isQuestionAsked({
      question: {
        name: 'template',
        validate: input => input === 'InstantSearch.js',
      },
      args: { template: 'InstantSearch.js' },
    })
  ).toBe(false);

  expect(
    utils.isQuestionAsked({
      question: {
        name: 'mainAttribute',
      },
      args: { indexName: 'INDEX_NAME' },
    })
  ).toBe(false);
});

describe('camelCase', () => {
  test('with a single word', () => {
    expect(utils.camelCase('test')).toBe('test');
  });

  test('with a caret-separated word', () => {
    expect(utils.camelCase('app-id')).toBe('appId');
  });

  test('with a twice-caret-separated word', () => {
    expect(utils.camelCase('instant-search-js')).toBe('instantSearchJs');
  });
});
