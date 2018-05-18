const CreateInstantSearchApp = require('./createInstantSearchApp');

let buildSpy;
let installSpy;
let cleanSpy;

const createInstantSearchApp = (path, config) => {
  buildSpy = jest.fn(() => Promise.resolve());
  installSpy = jest.fn();
  cleanSpy = jest.fn();

  return new CreateInstantSearchApp(path, config, {
    build: buildSpy,
    install: installSpy,
    clean: cleanSpy,
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

  describe('build', () => {
    test('gets called', () => {
      expect.assertions(4);

      createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
        libraryVersion: '2.0.0',
      });

      expect(buildSpy).toHaveBeenCalledTimes(1);
      expect(buildSpy).toHaveBeenCalledWith({
        path: '/tmp/test-app',
        name: 'test-app',
        template: 'InstantSearch.js',
        installation: true,
        libraryVersion: '2.0.0',
        silent: false,
      });

      expect(installSpy).toHaveBeenCalledTimes(1);
      expect(installSpy).toHaveBeenCalledWith(
        '/tmp/test-app',
        expect.objectContaining({
          silent: false,
        })
      );
    });
  });

  describe('install', () => {
    test('with installation set to `undefined` installs the dependencies', () => {
      expect.assertions(1);

      createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
      });

      expect(installSpy).toHaveBeenCalledTimes(1);
    });

    test('with installation installs the dependencies gets called', () => {
      expect.assertions(1);

      createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
        installation: true,
      });

      expect(installSpy).toHaveBeenCalledTimes(1);
    });

    test('without installation does not install the dependencies', () => {
      expect.assertions(1);

      createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
        installation: false,
      });

      expect(installSpy).not.toHaveBeenCalled();
    });
  });
});
