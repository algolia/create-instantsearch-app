const CreateInstantSearchApp = require('./CreateInstantSearchApp');

let buildSpy;
let installSpy;
let cleanSpy;

const createInstantSearchApp = (path, config) => {
  buildSpy = jest.fn(() => Promise.resolve());
  installSpy = jest.fn(() => Promise.resolve());
  cleanSpy = jest.fn(() => Promise.resolve());

  return new CreateInstantSearchApp(path, config, {
    build: buildSpy,
    install: installSpy,
    clean: cleanSpy,
  });
};

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

  test('with path and template does not throw', () => {
    expect(() => {
      createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
      });
    }).not.toThrow();
  });

  test('with unvalid name', () => {
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
        template: 'InstantSearch.js',
        installation: true,
        libraryVersion: '2.0.0',
        silent: false,
      });

      expect(installSpy).toHaveBeenCalledTimes(1);
      expect(installSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          silent: false,
        }),
        expect.anything()
      );
    });
  });

  describe('install', () => {
    test('with installation set to `undefined` installs the dependencies', async () => {
      expect.assertions(1);

      const app = createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
      });

      await app.create();

      expect(installSpy).toHaveBeenCalledTimes(1);
    });

    test('with installation installs the dependencies gets called', async () => {
      expect.assertions(1);

      const app = createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
        installation: true,
      });

      await app.create();

      expect(installSpy).toHaveBeenCalledTimes(1);
    });

    test('without installation does not install the dependencies', async () => {
      expect.assertions(1);

      const app = createInstantSearchApp('/tmp/test-app', {
        template: 'InstantSearch.js',
        installation: false,
      });

      await app.create();

      expect(installSpy).not.toHaveBeenCalled();
    });
  });
});

describe('Events', () => {
  test('`build:start` is emitted', done => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
    });

    app.on('build:start', () => {
      done();
    });

    app.create();
  });

  test('`build:end` is emitted', done => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
    });

    app.on('build:end', () => {
      done();
    });

    app.create();
  });

  test('`installation:start` is emitted', done => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
    });

    app.on('installation:start', () => {
      done();
    });

    app.create();
  });

  test('`installation:start` is not emitted if no installation', () => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
      installation: false,
    });

    const onInstallStart = jest.fn();

    app.on('installation:start', onInstallStart);

    app.on('build:end', () => {
      expect(onInstallStart).not.toHaveBeenCalled();
    });

    app.create();
  });

  test('`installation:end` is not emitted if no installation', () => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
      installation: false,
    });

    const onInstallEnd = jest.fn();

    app.on('installation:start', onInstallEnd);

    app.on('build:end', () => {
      expect(onInstallEnd).not.toHaveBeenCalled();
    });

    app.create();
  });

  test('`clean:start` is not emitted it does not fail', () => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
      installation: false,
    });

    const onCleanStart = jest.fn();

    app.on('clean:start', onCleanStart);

    app.on('build:end', () => {
      expect(onCleanStart).not.toHaveBeenCalled();
    });

    app.create();
  });

  test('`clean:end` is not emitted it does not fail', () => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
      installation: false,
    });

    const onCleanEnd = jest.fn();

    app.on('clean:end', onCleanEnd);

    app.on('build:end', () => {
      expect(onCleanEnd).not.toHaveBeenCalled();
    });

    app.create();
  });
});
