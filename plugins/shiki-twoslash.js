import { setupForFile, transformAttributesToHTML } from 'remark-shiki-twoslash';

/**
 * @param {*} eleventyConfig
 * @param {import("shiki-twoslash").UserConfigSettings} options
 */
export default async function (eleventyConfig, options = {}) {
  const { highlighters } = await setupForFile(options);

  eleventyConfig.addMarkdownHighlighter((code, lang, fence) => {
    code = code.replace(/\r?\n$/, '').replace(/^\r?\n/, ''); // Strip new lines at beginning/end
    return transformAttributesToHTML(code, [lang, fence].join(' '), highlighters, options);
  });
}
