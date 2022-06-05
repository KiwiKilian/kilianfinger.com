const path = require('path');
const Image = require('@11ty/eleventy-img');

module.exports = {
  image: async ({
    src,
    alt = '',
    sizes = '100vw',
    widths = [300, 600],
    sizeType,
    loading = 'lazy',
    class: className = '',
  }) => {
    const extension = path.extname(src).slice(1).toLowerCase();

    let heights;
    if (sizeType) {
      sizes = {
        portrait: '(min-width: 1920px): 496px, (min-width: 664px): 30vw, 60vw',
        projectsCover: '(min-width: 1400px) 600px, (min-width: 664px) 48vw, 98vw',
      }[sizeType];
      widths = {
        portrait: [248, 496, 992],
        projectsCover: [150, 300, 600, 1200],
      }[sizeType];
    }

    let metadata = await Image('./src/assets/images/' + src, {
      widths,
      formats: extension === 'webp' ? ['webp', 'jpeg'] : ['webp', extension],
      urlPath: '/assets/images/',
      outputDir: '_site/assets/images/',
    });

    let imageAttributes = {
      alt,
      sizes,
      loading,
      decoding: 'async',
      ...(className && { class: className }),
    };

    return Image.generateHTML(metadata, imageAttributes);
  },
};
