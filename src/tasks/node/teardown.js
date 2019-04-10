const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const { isYarnAvailable } = require('../../utils');

module.exports = function teardown(config) {
  const hasYarn = isYarnAvailable();
  const currentDirectory = process.cwd();
  const cdPath =
    path.join(currentDirectory, config.name) === config.path
      ? config.name
      : config.path;

  try {
    const command = hasYarn ? 'yarn' : 'npx';

    execSync(
      `${command} prettier "${cdPath}/src/**/*.{json,html,css,js,vue,ts,tsx}" --write --config "${cdPath}/.prettierrc"`,
      {
        stdio: 'ignore',
      }
    );
  } catch (error) {
    // Prettier doesn't seem to be installed in Create InstantSearch App.
  }

  if (!config.silent) {
    try {
      const command = hasYarn ? 'yarn' : 'npm';
      const installCommand = `${command} install`;
      const startCommand = `${command} start`;

      console.log();
      console.log(
        `🎉  Created ${chalk.bold.cyan(config.name)} at ${chalk.green(cdPath)}.`
      );
      console.log();

      console.log('Begin by typing:');
      console.log();
      console.log(`  ${chalk.cyan('cd')} ${cdPath}`);

      if (config.installation === false) {
        console.log(`  ${chalk.cyan(`${installCommand}`)}`);
      }

      console.log(`  ${chalk.cyan(`${startCommand}`)}`);
      console.log();
      console.log('⚡️  Start building something awesome!');
    } catch (err) {
      console.log();
      console.error(chalk.red('🛑  The app generation failed.'));
      console.error(err);
      console.log();

      return Promise.reject(err);
    }
  }

  return Promise.resolve();
};
