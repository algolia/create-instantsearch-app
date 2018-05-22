const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const walkSync = require('walk-sync');
const { getTemplateName } = require('../packages/shared/utils');

const templatesFolder = path.join(__dirname, '../templates');
const templates = fs
  .readdirSync(templatesFolder)
  .map(name => path.join(templatesFolder, name))
  .filter(source => fs.lstatSync(source).isDirectory());

describe('Installation', () => {
  let temporaryDirectory;
  let appPath;

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

  beforeEach(() => {
    appPath = `${temporaryDirectory}/test-app`;
    execSync(`mkdir ${appPath}`);
  });

  afterEach(() => {
    execSync(`rm -rf "${appPath}"`);
  });

  describe('Dependencies', () => {
    test('get installed by default', () => {
      execSync(
        `yarn start ${appPath} \
          --template "InstantSearch.js"`,
        { stdio: 'ignore' }
      );

      expect(fs.lstatSync(`${appPath}/node_modules`).isDirectory()).toBe(true);
    });

    test('get skipped with the `no-installation` flag', () => {
      execSync(
        `yarn start ${appPath} \
          --template "InstantSearch.js" \
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
          --template "InstantSearch.js" \
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
          --template "InstantSearch.js" \
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
          --template "InstantSearch.js" \
          --no-installation`,
          { stdio: 'ignore' }
        );
      }).toThrow();

      expect(fs.existsSync(`${appPath}/file`)).toBe(true);
    });
  });
});

describe('Snapshots', () => {
  templates.forEach(templatePath => {
    const templateName = path.basename(templatePath);

    describe(templateName, () => {
      let temporaryDirectory;
      let appPath;
      let configFilePath;
      let generatedFiles;

      beforeAll(() => {
        temporaryDirectory = execSync(
          'mktemp -d 2>/dev/null || mktemp -d -t "appPath"'
        )
          .toString()
          .trim();

        appPath = `${temporaryDirectory}/${getTemplateName(templateName)}`;

        const config = {
          name: `${getTemplateName(templateName)}-app`,
          template: templateName,
          libraryVersion: '1.0.0',
          appId: 'appId',
          apiKey: 'apiKey',
          indexName: 'indexName',
          searchPlaceholder: 'Search placeholder',
          mainAttribute: 'mainAttribute',
          attributesForFaceting: ['facet1', 'facet2'],
        };

        configFilePath = `${temporaryDirectory}/${getTemplateName(
          templateName
        )}.config.json`;

        fs.writeFileSync(configFilePath, JSON.stringify(config));

        execSync(
          `yarn start ${appPath} \
              --config ${configFilePath} \
              --no-installation`,
          { stdio: 'ignore' }
        );

        const ignoredFiles = fs
          .readFileSync(`${appPath}/.gitignore`)
          .toString()
          .split('\n')
          .filter(line => !line.startsWith('#'))
          .filter(Boolean)
          .concat('.DS_Store');

        generatedFiles = walkSync(appPath, {
          directories: false,
          ignore: ignoredFiles,
        });
      });

      afterAll(() => {
        execSync(`rm -rf "${temporaryDirectory}"`);
      });

      test('Folder structure', () => {
        expect(generatedFiles).toMatchSnapshot();
      });

      test('File content', () => {
        generatedFiles.forEach(filePath => {
          const fileContent = fs
            .readFileSync(`${appPath}/${filePath}`)
            .toString()
            .trim();

          expect(fileContent).toMatchSnapshot(filePath);
        });
      });
    });
  });
});
