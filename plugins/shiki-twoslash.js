import { transformerTwoslash } from '@shikijs/twoslash';
import { createHighlighter } from 'shiki/bundle/full';

/**
 * @param {*} eleventyConfig
 */
export default async function (eleventyConfig) {
  const highlighter = await createHighlighter({
    themes: ['one-dark-pro', 'one-light'],
    langs: ['shell', 'html', 'twig', 'javascript'],
  });

  eleventyConfig.addMarkdownHighlighter((code, lang) =>
    highlighter.codeToHtml(
      code
        .replace(/\r?\n$/, '')
        .replace(/^\r?\n/, '')
        .replace(/&quot;/g, '"'),
      {
        themes: {
          dark: 'one-dark-pro',
          light: 'one-light',
        },
        lang,
        ...(['javascript', 'typescript', 'jsx', 'tsx', 'json'].includes(lang) && {
          transformers: [transformerTwoslash()],
        }),
      },
    ),
  );
}
