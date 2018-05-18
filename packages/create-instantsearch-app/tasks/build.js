const path = require('path');
const metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const rename = require('metalsmith-rename');

module.exports = function build(config) {
  const templateFolder = path.join(__dirname, '../../../templates');
  const templatePath = path.join(templateFolder, config.template);

  return new Promise((resolve, reject) => {
    metalsmith(__dirname)
      .source(templatePath)
      .destination(config.path)
      .metadata(config)
      .use(
        // Add the `.hbs` extension to any templating files that need
        // their placeholders to get filled with `metalsmith-in-place`
        rename([
          [/\.html$/, '.html.hbs'],
          [/\.css$/, '.css.hbs'],
          [/\.js$/, '.js.hbs'],
          [/\.md$/, '.md.hbs'],
          [/\.json$/, '.json.hbs'],
          [/\.webmanifest$/, '.webmanifest.hbs'],
        ])
      )
      .use(inPlace())
      .build(err => {
        if (err) {
          reject(err);
        }

        resolve();
      });
  });
};
