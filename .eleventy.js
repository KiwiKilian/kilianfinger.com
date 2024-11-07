import fs from 'node:fs';
import yaml from 'js-yaml';
import NavigationPlugin from '@11ty/eleventy-navigation';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import EleventyPluginOgImage from 'eleventy-plugin-og-image';
import EleventyPluginRss from '@11ty/eleventy-plugin-rss';
import markdownItAnchor from 'markdown-it-anchor';

import PluginShikiTwoslash from './plugins/shiki-twoslash.js';
import PluginDrafts from './plugins/drafts.js';
import * as filters from './utils/filters.js';
import * as shortcodes from './utils/shortcodes.js';
import * as transforms from './utils/transforms.js';
import viteConfig from './vite.config.js';

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/**/*.js');

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: viteConfig,
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

  eleventyConfig.addNunjucksAsyncShortcode('inlineImage', shortcodes.inlineImageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode('image', shortcodes.imageShortcode);

  /** @type { import('eleventy-plugin-og-image').EleventyPluginOgImageOptions } */
  const eleventyPluginOgImageOptions = {
    outputDir: 'assets',
    outputFileSlug: async (ogImage) => `og-image.${await ogImage.hash()}`,
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

  eleventyConfig.addPlugin(NavigationPlugin);
  eleventyConfig.addPlugin(EleventyPluginRss);
  eleventyConfig.addPlugin(PluginShikiTwoslash, {
    themes: ['../../../src/assets/shiki/OneDark-Pro'],
    theme: 'One Dark Pro',
  });
  eleventyConfig.addPlugin(PluginDrafts);

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
}
