const path = require('path');
const createInstantSearchAppFactory = require('./CreateInstantSearchApp');

let setupSpy;
let buildSpy;
let installSpy;
let cleanSpy;
let teardownSpy;

function createInstantSearchApp(appPath, config) {
  setupSpy = jest.fn(() => Promise.resolve());
  buildSpy = jest.fn(() => Promise.resolve());
  installSpy = jest.fn(() => Promise.resolve());
  cleanSpy = jest.fn(() => Promise.resolve());
  teardownSpy = jest.fn(() => Promise.resolve());

  return createInstantSearchAppFactory(appPath, config, {
    setup: setupSpy,
    build: buildSpy,
    install: installSpy,
    clean: cleanSpy,
    teardown: teardownSpy,
  });
}

describe('Options', () => {
  test('without path throws', () => {
    expect(() => {
      createInstantSearchApp('', {});
    }).toThrowErrorMatchingSnapshot();
  });

  test('without template throws', () => {
    expect(() => {
      createInstantSearchApp('/tmp/test-app', {});
    }).toThrowErrorMatchingSnapshot();
  });

  test('with unknown template throws', () => {
    expect(() => {
      createInstantSearchApp('/tmp/test-app', {
        template: 'UnknownTemplate',
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('with correct template does not throw', () => {
    expect(() => {
      createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
      });
    }).not.toThrow();
  });

  test('with correct template path does not throw', () => {
    expect(() => {
      createInstantSearchApp('/tmp/test-app', {
        template: path.resolve('./templates/InstantSearch.js'),
      });
    }).not.toThrow();
  });

  test('with wrong template path throws', () => {
    expect(() => {
      createInstantSearchApp('/tmp/test-app', {
        template: path.resolve('./templates'),
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test('with unvalid name throws', () => {
    expect(() => {
      createInstantSearchApp('/tmp/test-app', {
        name: './WrongNpmName',
        template: 'InstantSearch.js',
      });
    }).toThrowErrorMatchingSnapshot();
  });
});

describe('Tasks', () => {
  describe('build', () => {
    test('gets called', async () => {
      expect.assertions(4);

      const app = createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
        libraryVersion: '2.0.0',
      });

      await app.create();

      expect(buildSpy).toHaveBeenCalledTimes(1);
      expect(buildSpy).toHaveBeenCalledWith({
        path: '/tmp/test-app',
        name: 'test-app',
        template: path.resolve('./templates/InstantSearch.js'),
        installation: true,
        libraryVersion: '2.0.0',
        silent: false,
      });

      expect(installSpy).toHaveBeenCalledTimes(1);
      expect(installSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          silent: false,
        })
      );
    });
  });

  describe('install', () => {
    test('with installation set to `undefined` calls the `install` task', async () => {
      expect.assertions(1);

      const app = createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
      });

      await app.create();

      expect(installSpy).toHaveBeenCalledTimes(1);
    });

    test('with installation calls the `install` task', async () => {
      expect.assertions(1);

      const app = createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
        installation: true,
      });

      await app.create();

      expect(installSpy).toHaveBeenCalledTimes(1);
    });

    test('without installation does not call the `install` task', async () => {
      expect.assertions(1);

      const app = createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
        installation: false,
      });

      await app.create();

      expect(installSpy).toHaveBeenCalledTimes(0);
    });
  });
});
