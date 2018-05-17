const createInstantSearchAppFactory = require('./createInstantSearchApp');

let buildAppSpy;
let installDependenciesSpy;

const createInstantSearchApp = (path, config) => {
  buildAppSpy = jest.fn(() => Promise.resolve());
  installDependenciesSpy = jest.fn();

  return createInstantSearchAppFactory(path, config, {
    buildApp: buildAppSpy,
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

    test('with unvalid name', () => {
      const createApp = () =>
        createInstantSearchApp('/tmp/test-app', {
          name: './WrongNpmName',
          template: 'InstantSearch.js',
        });

      expect(createApp).toThrowErrorMatchingSnapshot();
    });
  });

  describe('buildApp', () => {
    test('gets called', async () => {
      await createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
        libraryVersion: '2.0.0',
      });

      expect(buildAppSpy).toHaveBeenCalledTimes(1);
      expect(buildAppSpy).toHaveBeenCalledWith({
        path: '/tmp/test-app',
        name: 'test-app',
        template: 'InstantSearch.js',
        installation: true,
        libraryVersion: '2.0.0',
        silent: false,
      });

      expect(installDependenciesSpy).toHaveBeenCalledTimes(1);
      expect(installDependenciesSpy).toHaveBeenCalledWith(
        '/tmp/test-app',
        expect.objectContaining({
          silent: false,
        })
      );
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
