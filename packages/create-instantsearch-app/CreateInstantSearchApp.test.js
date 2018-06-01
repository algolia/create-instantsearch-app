const CreateInstantSearchApp = require('./CreateInstantSearchApp');

let setupSpy;
let buildSpy;
let installSpy;
let cleanSpy;
let teardownSpy;

const createInstantSearchApp = (path, config) => {
  setupSpy = jest.fn(() => Promise.resolve());
  buildSpy = jest.fn(() => Promise.resolve());
  installSpy = jest.fn(() => Promise.resolve());
  cleanSpy = jest.fn(() => Promise.resolve());
  teardownSpy = jest.fn(() => Promise.resolve());

  return new CreateInstantSearchApp(path, config, {
    setup: setupSpy,
    build: buildSpy,
    install: installSpy,
    clean: cleanSpy,
    teardown: teardownSpy,
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
        template: 'InstantSearch.js',
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

describe('Events', () => {
  test('`setup:start` is emitted', done => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
    });

    app.on('setup:start', () => {
      done();
    });

    app.create();
  });

  test('`setup:end` is emitted', done => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
    });

    app.on('setup:end', () => {
      done();
    });

    app.create();
  });

  test('`teardown:start` is emitted', done => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
    });

    app.on('teardown:start', () => {
      done();
    });

    app.create();
  });

  test('`teardown:end` is emitted', done => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
    });

    app.on('teardown:end', () => {
      done();
    });

    app.create();
  });

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

  test('`installation:start` is not emitted if `installation` set to false', () => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
      installation: false,
    });

    app.on('installation:start', installSpy);

    app.on('build:end', () => {
      expect(installSpy).toHaveBeenCalledTimes(0);
    });

    app.create();
  });

  test('`installation:end` is not emitted if `installation` set to false', () => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
      installation: false,
    });

    app.on('installation:start', installSpy);

    app.on('build:end', () => {
      expect(installSpy).toHaveBeenCalledTimes(0);
    });

    app.create();
  });

  test('`clean:start` is not emitted if does not fail', () => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
      installation: false,
    });

    app.on('clean:start', cleanSpy);

    app.on('build:end', () => {
      expect(cleanSpy).toHaveBeenCalledTimes(0);
    });

    app.create();
  });

  test('`clean:end` is not emitted it does not fail', () => {
    const app = createInstantSearchApp('/tmp/test-app', {
      template: 'InstantSearch.js',
      installation: false,
    });

    app.on('clean:end', cleanSpy);

    app.on('build:end', () => {
      expect(cleanSpy).toHaveBeenCalledTimes(0);
    });

    app.create();
  });
});
