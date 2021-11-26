const fs = require('fs');
const { execSync } = require('child_process');
const { getEarliestLibraryVersion } = require('../src/utils');

describe('Installation', () => {
  let temporaryDirectory;
  let appPath;
  let configFilePath;
  const appName = 'test-app';

  beforeAll(() => {
    temporaryDirectory = execSync(
      'mktemp -d 2>/dev/null || mktemp -d -t "appPath"'
    )
      .toString()
      .trim();
  });

  afterAll(() => {
    execSync(`rm -rf "${temporaryDirectory}"`);
  });

  beforeEach(async () => {
    appPath = `${temporaryDirectory}/${appName}`;
    execSync(`mkdir ${appPath}`);

    const templateConfig = require('../src/templates/InstantSearch.js/.template.js');

    const config = {
      template: 'InstantSearch.js',
      // We fetch the earliest supported version in order to not change
      // the test output every time we release a new version of a library.
      libraryVersion: await getEarliestLibraryVersion({
        libraryName: templateConfig.libraryName,
        supportedVersion: templateConfig.supportedVersion,
      }),
      appId: 'appId',
      apiKey: 'apiKey',
      indexName: 'indexName',
      searchPlaceholder: 'Search placeholder',
      attributesToDisplay: ['attribute1', 'attribute2'],
      attributesForFaceting: ['facet1', 'facet2'],
      organization: 'algolia',
    };

    configFilePath = `${temporaryDirectory}/config.json`;

    fs.writeFileSync(configFilePath, JSON.stringify(config));
  });

  afterEach(() => {
    execSync(`rm -rf "${appPath}"`);
    execSync(`rm -f "${configFilePath}"`);
  });

  describe('Dependencies', () => {
    test('get skipped with the `no-installation` flag', () => {
      execSync(
        `yarn start ${appPath} \
          --name ${appName} \
          --config ${configFilePath} \
          --no-installation`,
        { stdio: 'ignore' }
      );

      expect(fs.existsSync(`${appPath}/node_modules`)).toBe(false);
    });
  });

  describe('Path', () => {
    test('without conflict generates files', () => {
      execSync(
        `yarn start ${appPath} \
          --name ${appName} \
          --config ${configFilePath} \
          --no-installation`,
        { stdio: 'ignore' }
      );

      expect(fs.existsSync(`${appPath}/package.json`)).toBe(true);
    });

    test('with conflict with a non-empty folder cancels generation', () => {
      execSync(`echo 'hello' > ${appPath}/README.md`);

      expect(() => {
        execSync(
          `yarn start ${appPath} \
          --name ${appName} \
          --config ${configFilePath} \
          --no-installation`,
          { stdio: 'ignore' }
        );
      }).toThrow();

      expect(
        execSync(`grep "hello" ${appPath}/README.md`)
          .toString()
          .trim()
      ).toBe('hello');
    });

    test('with conflict with an existing file cancels generation', () => {
      execSync(`touch ${appPath}/file`);

      expect(() => {
        execSync(
          `yarn start ${appPath}/file \
          --name ${appName} \
          --config ${configFilePath} \
          --no-installation`,
          { stdio: 'ignore' }
        );
      }).toThrow();

      expect(fs.existsSync(`${appPath}/file`)).toBe(true);
    });
  });
});
