const chalk = require('chalk');

module.exports = function teardown(config) {
  if (!config.silent) {
    try {
      console.log();
      console.log(
        `🎉  Created ${chalk.bold.cyan(config.name)} at ${chalk.green(
          config.path
        )}.`
      );
      console.log();

      console.log(`Begin by open the \`${chalk.green('xcworkspace')}\` file.`);
      console.log();
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
