import prettierConfig from '@kiwikilian/prettier-config' assert { type: 'json' };

/** @type {import("prettier").Config} */
const config = {
  ...prettierConfig,
  plugins: ['prettier-plugin-jinja-template'],
  overrides: [
    {
      files: ['**/*.njk'],
      options: {
        parser: 'jinja-template',
      },
    },
  ],
};

export default config;
