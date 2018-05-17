const createInstantSearchAppFactory = require('./createInstantSearchApp');

let buildAppSpy;
let fetchLibraryVersionsSpy;
let installDependenciesSpy;

const createInstantSearchApp = (path, config) => {
  buildAppSpy = jest.fn(() => Promise.resolve());
  fetchLibraryVersionsSpy = jest.fn();
  installDependenciesSpy = jest.fn();

  return createInstantSearchAppFactory(path, config, {
    buildApp: buildAppSpy,
    fetchLibraryVersions: fetchLibraryVersionsSpy,
    installDependencies: installDependenciesSpy,
  });
};

describe('Config', () => {
  describe('required', () => {
    test('without path throws', () => {
      const createApp = () => createInstantSearchApp('', {});

      expect(createApp).toThrowErrorMatchingSnapshot();
    });

    test('without template throws', () => {
      const createApp = () => createInstantSearchApp('/tmp/test-app', {});

      expect(createApp).toThrowErrorMatchingSnapshot();
    });

    test('with unknown template throws', () => {
      const createApp = () =>
        createInstantSearchApp('/tmp/test-app', {
          template: 'UnknownTemplate',
        });

      expect(createApp).toThrowErrorMatchingSnapshot();
    });

    test('with correct template does not throw', () => {
      const createApp = () =>
        createInstantSearchApp('/tmp/test-app', {
          template: 'InstantSearch.js',
        });

      expect(createApp).not.toThrow();
    });

    test('with path and template does not throw', () => {
      const createApp = () =>
        createInstantSearchApp('/tmp/test-app', {
          template: 'InstantSearch.js',
        });

      expect(createApp).not.toThrow();
    });
  });

  describe('buildApp', () => {
    test('gets called', () => {
      createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
      });

      expect(buildAppSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('installDependencies', () => {
    test('with installation undefined installs the dependencies gets called', async () => {
      expect.assertions(1);

      await createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
      });

      expect(installDependenciesSpy).toHaveBeenCalledTimes(1);
    });

    test('with installation installs the dependencies gets called', async () => {
      expect.assertions(1);

      await createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
        installation: true,
      });

      expect(installDependenciesSpy).toHaveBeenCalledTimes(1);
    });

    test('without installation does not install the dependencies gets called', async () => {
      expect.assertions(1);

      await createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
        installation: false,
      });

      expect(installDependenciesSpy).not.toHaveBeenCalled();
    });
  });
});
