import * as cheerio from 'cheerio';
import htmlMinifier from 'html-minifier';

const shouldTransformHTML = (outputPath) => outputPath && outputPath.endsWith('.html');

export function htmlMinify(content, outputPath) {
  return shouldTransformHTML(outputPath)
    ? htmlMinifier.minify(content, {
        html5: true,
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      })
    : content;
}

export function externalLinks(content, outputPath) {
  if (shouldTransformHTML(outputPath)) {
    try {
      const $ = cheerio.load(content);

      $('a').each((i, link) => {
        const href = $(link).attr('href');
        if (!/https{0,1}:\/\//.test(href)) return;

        $(link).attr('target', '_blank');
        const rel = $(link).attr('rel');
        $(link).attr('rel', `${rel ? `${rel} ` : ''}noopener`);
        $(link).replaceWith($.html(link));
      });

      return $.html();
    } catch (e) {
      console.log('Error with links', e);
    }
  }

  return content;
}
