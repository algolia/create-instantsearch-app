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

describe('getTemplateName', () => {
  test('InstantSearch.js', () => {
    expect(utils.getTemplateName('InstantSearch.js')).toBe('instantsearchjs');
  });

  test('Vue InstantSearch', () => {
    expect(utils.getTemplateName('Vue InstantSearch')).toBe(
      'vue-instantsearch'
    );
  });

  test('React InstantSearch', () => {
    expect(utils.getTemplateName('React InstantSearch')).toBe(
      'react-instantsearch'
    );
  });

  test('Angular InstantSearch', () => {
    expect(utils.getTemplateName('Angular InstantSearch')).toBe(
      'angular-instantsearch'
    );
  });
});
