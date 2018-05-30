const CreateInstantSearchApp = require('./CreateInstantSearchApp');

module.exports = function createInstantSearchApp(
  path,
  config = {},
  tasks = {}
) {
  return new CreateInstantSearchApp(path, config, tasks);
};
