const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const NavigationPlugin = require('@11ty/eleventy-navigation');
const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite');
const EleventyPluginOgImage = require('eleventy-plugin-og-image');
const EleventyPluginNavigation = require('@11ty/eleventy-navigation');
const EleventyPluginRss = require('@11ty/eleventy-plugin-rss');
const EleventyPluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const markdownItAnchor = require('markdown-it-anchor');

const filters = require('./utils/filters');
const shortcodes = require('./utils/shortcodes');
const transforms = require('./utils/transforms');

/** @param { import('@11ty/eleventy/src/UserConfig') } eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy('src/public/!(*.njk)');
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/**/*.js');

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      build: {
        polyfillModulePreload: false,
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

  eleventyConfig.addNunjucksShortcode('inlineImage', shortcodes.inlineImage);
  eleventyConfig.addNunjucksAsyncShortcode('image', shortcodes.image);

  /** @type { import('eleventy-plugin-og-image').EleventyPluginOgImageOptions } */
  const eleventyPluginOgImageOptions = {
    outputDir: '_site/public/og-images',

    satoriOptions: {
      fonts: [
        {
          name: 'Gilroy',
          data: fs.readFileSync('src/assets/fonts/gilroy/gilroy-extrabold-webfont.woff'),
          weight: 900,
          style: 'normal',
        },
        {
          name: 'Silka',
          data: fs.readFileSync('src/assets/fonts/silka/silka-regular-webfont.woff'),
          weight: 400,
          style: 'normal',
        },
      ],
    },
  };
  eleventyConfig.addPlugin(EleventyPluginOgImage, eleventyPluginOgImageOptions);

  eleventyConfig.addPlugin(EleventyPluginNavigation);
  eleventyConfig.addPlugin(EleventyPluginRss);
  eleventyConfig.addPlugin(EleventyPluginSyntaxHighlight);
  eleventyConfig.addPlugin(require('./.eleventy.drafts.js'));

  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(markdownItAnchor, {
      // permalink: markdownItAnchor.permalink.ariaHidden({
      //   placement: "after",
      //   class: "header-anchor",
      //   symbol: "#",
      //   ariaHidden: false,
      // }),
      // level: [1,2,3,4],
      slugify: eleventyConfig.getFilter('slugify'),
    });
  });

  return {
    dir: { input: 'src' },
    templateFormats: ['njk', 'md'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
};
