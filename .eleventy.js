const yaml = require('js-yaml');
const path = require('path');
const NavigationPlugin = require('@11ty/eleventy-navigation');
const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite');

const filters = require('./utils/filters');
const shortcodes = require('./utils/shortcodes');
const transforms = require('./utils/transforms');

/** @param { import('@11ty/eleventy/src/UserConfig') } eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.setServerPassthroughCopyBehavior('copy');
  eleventyConfig.addPassthroughCopy('src/public/!(*.njk)');
  eleventyConfig.addPassthroughCopy('src/assets');

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      build: {
        assetsInlineLimit: 0,
        rollupOptions: {
          output: {
            assetFileNames: (assetInfo) =>
              ['.jpeg', '.png', '.avif', '.webp'].includes(path.extname(assetInfo.name))
                ? 'assets/[name].[ext]'
                : 'assets/[name].[hash].[ext]',
          },
        },
      },

      resolve: {
        alias: [
          {
            // SCSS Modules
            find: /^~(.*)$/,
            replacement: '$1',
          },
        ],
      },
    },
  });

  eleventyConfig.addPlugin(NavigationPlugin);
  eleventyConfig.addDataExtension('yml', (contents) => yaml.load(contents));

  Object.keys(filters).forEach((key) => {
    eleventyConfig.addFilter(key, filters[key]);
  });
  Object.keys(transforms).forEach((key) => {
    eleventyConfig.addTransform(key, transforms[key]);
  });

  eleventyConfig.setNunjucksEnvironmentOptions({
    lstripBlocks: true,
    trimBlocks: true,
  });

  eleventyConfig.addNunjucksAsyncShortcode('image', shortcodes.image);

  return {
    dir: { input: 'src', output: '_site', includes: 'includes', data: 'data' },
    templateFormats: ['njk'],
    htmlTemplateEngine: 'njk',
  };
};
