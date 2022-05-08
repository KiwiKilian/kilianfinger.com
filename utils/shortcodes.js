const path = require('path');
const { outdent } = require('outdent');
const Image = require('@11ty/eleventy-img');

const defaultSizes = '90vw';
const defaultImagesSizes = [1920, 1280, 640, 320];

const isFullUrl = (url) => {
  try {
    return !!new URL(url);
  } catch {
    return false;
  }
};

module.exports = {
  // Allow embedding responsive images
  // {% image "image.jpeg", "Image alt", "Image title", "my-class" %}
  // {% image [100,100], "image.jpeg", "Image alt", "Image title", "my-class" %}
  image: async (...args) => {
    let fallbackWidth, fallbackHeight;

    if (Array.isArray(args[0])) {
      [fallbackWidth, fallbackHeight] = args.shift();
    }

    const src = args[0];
    const alt = args[1];
    const title = args[2];
    const className = args[3];
    const lazy = args[4] ?? true;
    const sizes = args[5] ?? defaultSizes;

    const extension = path.extname(src).slice(1).toLowerCase();
    const fullSrc = isFullUrl(src) ? src : `./src/assets/images/${src}`;

    let stats;
    try {
      stats = await Image(fullSrc, {
        widths: defaultImagesSizes,
        formats: extension === 'webp' ? ['webp', 'jpeg'] : ['webp', extension],
        urlPath: '/assets/images/',
        outputDir: '_site/assets/images/',
      });
    } catch (e) {
      console.log('\n\x1b[31mERROR\x1b[0m creating image:');
      console.log(`> (${fullSrc})`);
      console.log(`  ${e}\n`);
      return '';
    }

    const fallback = stats[extension].reverse()[0];
    const picture = outdent({ newline: '' })`
    <picture>
      ${Object.values(stats)
        .map(
          (image) =>
            `<source type="image/${image[0].format}" srcset="${image
              .map((entry) => `${entry.url} ${entry.width}w`)
              .join(', ')}" sizes="${sizes}">`,
        )
        .join('')}
      <img
        class="${className ? className : ''}"
        loading="${lazy ? 'lazy' : 'eager'}"
        src="${fallback.url}"
        width="${fallbackWidth ?? fallback.width}"
        height="${fallbackHeight ?? fallback.height}" alt="${alt}">
    </picture>`;
    return title
      ? outdent({ newline: '' })`
      <figure class="${className ? `fig-${className}` : ''}">
        ${picture}
        <figcaption>${title}</figcaption>
      </figure>`
      : picture;
  },
};
