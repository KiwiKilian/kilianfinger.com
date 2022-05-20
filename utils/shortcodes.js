const path = require('path');
const Image = require('@11ty/eleventy-img');

module.exports = {
  image: async ({ src, alt = '', sizes = '90vw', widths = [1920, 1280, 640, 320], class: className = '' }) => {
    const extension = path.extname(src).slice(1).toLowerCase();

    let metadata = await Image('./src/assets/images/' + src, {
      widths,
      formats: extension === 'webp' ? ['webp', 'jpeg'] : ['webp', extension],
      urlPath: '/assets/images/',
      outputDir: '_site/assets/images/',
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: 'lazy',
      decoding: 'async',
      ...(className && { class: className }),
    };

    return Image.generateHTML(metadata, imageAttributes);
  },
};
