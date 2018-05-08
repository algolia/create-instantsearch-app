const mockExistsSync = jest.fn();
const mockLstatSync = jest.fn();
const mockReaddirSync = jest.fn();

jest.mock('fs', () => ({
  existsSync: mockExistsSync,
  lstatSync: mockLstatSync,
  readdirSync: mockReaddirSync,
}));

const utils = require('./utils');

describe('checkAppName', () => {
  test('does not throw when valid', () => {
    expect(() => utils.checkAppName('project-name')).not.toThrow();
  });

  test('throws with correct error message', () => {
    expect(() =>
      utils.checkAppName('./project-name')
    ).toThrowErrorMatchingSnapshot();
  });
});

describe('checkAppPath', () => {
  describe('with non existant directory as path', () => {
    beforeAll(() => {
      mockExistsSync.mockImplementation(() => false);
    });

    test('should not throw', () => {
      expect(() => utils.checkAppPath('path')).not.toThrow();
    });

    afterAll(() => {
      mockExistsSync.mockReset();
    });
  });

  describe('with non empty directory as path', () => {
    beforeAll(() => {
      mockExistsSync.mockImplementation(() => true);
      mockLstatSync.mockImplementation(() => ({ isDirectory: () => true }));
      mockReaddirSync.mockImplementation(() => ['file1', 'file2']);
    });

    test('should throw with correct error', () => {
      expect(() => utils.checkAppPath('path')).toThrowErrorMatchingSnapshot();
    });

    afterAll(() => {
      mockExistsSync.mockReset();
      mockLstatSync.mockReset();
      mockReaddirSync.mockReset();
    });
  });

  describe('with existing file as path', () => {
    beforeAll(() => {
      mockExistsSync.mockImplementation(() => true);
      mockLstatSync.mockImplementation(() => ({
        isDirectory: () => false,
      }));
    });

    test('should throw with correct error', () => {
      expect(() => utils.checkAppPath('path')).toThrowErrorMatchingSnapshot();
    });

    afterAll(() => {
      mockExistsSync.mockReset();
      mockLstatSync.mockReset();
    });
  });
});

describe('getOptionsFromArguments', () => {
  test('with a single command', () => {
    expect(
      utils.getOptionsFromArguments('cmd --appId APP_ID'.split(' '))
    ).toEqual({
      appId: 'APP_ID',
    });
  });

  test('with a multiple commands', () => {
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
        'create-instantsearch-app',
        '--appId',
        'APP_ID',
      ])
    ).toEqual({
      appId: 'APP_ID',
    });
  });
});

describe('isQuestionAsked', () => {
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
