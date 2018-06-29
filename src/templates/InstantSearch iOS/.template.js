const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

module.exports = {
  templateName: 'instantsearch-ios',
  appName: 'instantsearch-ios-app',
  tasks: {
    setup(config) {
      const logger = config.silent ? { log() {}, error() {} } : console;

      try {
        execSync('pod --version', { stdio: 'ignore' });
      } catch (err) {
        logger.log();
        logger.error(
          chalk.red('You must install CocoaPods to create an iOS project.')
        );
        logger.log('See: https://cocoapods.org');
        logger.log();

        process.exit(1);
      }
    },
    install(config) {
      const initialDirectory = process.cwd();
      process.chdir(config.path);

      execSync('pod install', {
        stdio: config.silent ? 'ignore' : 'inherit',
      });

      process.chdir(initialDirectory);
    },
    teardown(config) {
      if (!config.silent) {
        const currentDirectory = process.cwd();
        const cdPath =
          path.join(currentDirectory, config.name) === config.path
            ? config.name
            : config.path;

        console.log();
        console.log(
          `🎉  Created ${chalk.bold.cyan(config.name)} at ${chalk.green(
            cdPath
          )}.`
        );
        console.log();
        console.log('Begin by opening your project.');
        console.log();
        console.log('⚡️  Start building something awesome!');
      }
    },
  },
};
