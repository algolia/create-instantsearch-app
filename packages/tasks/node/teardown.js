const chalk = require('chalk');
const { isYarnAvailable } = require('../../shared/utils');

module.exports = function teardown(config) {
  if (!config.silent) {
    const hasYarn = isYarnAvailable();
    const installCommand = hasYarn ? 'yarn' : 'npm install';
    const startCommand = hasYarn ? 'yarn start' : 'npm start';

    console.log('Begin by typing:');
    console.log();
    console.log(`  ${chalk.cyan('cd')} ${config.path}`);

    if (config.installation === false) {
      console.log(`  ${chalk.cyan(`${installCommand}`)}`);
    }

    console.log(`  ${chalk.cyan(`${startCommand}`)}`);
    console.log();
    console.log('⚡️  Start building something awesome!');
  }
};
