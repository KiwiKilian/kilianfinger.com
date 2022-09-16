const fs = require('fs');
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

    if (sizeType) {
      sizes = {
        portrait: '(min-width: 1920px): 496px, (min-width: 664px): 30vw, 60vw',
        projectsCover: '(min-width: 1400px) 600px, (min-width: 664px) 48vw, 98vw',
        projectsMockup: '(min-width: 2048px) 1920px, (min-width: 664px) 93vw, 85vw',
      }[sizeType];
      widths = {
        portrait: [248, 496, 992],
        projectsCover: [150, 300, 600, 1200],
        projectsMockup: [768, 1024, 1440, 1920],
      }[sizeType];
    }

    let metadata = await Image('./src/assets/images/' + src, {
      widths,
      formats: ['webp', extension],
      urlPath: '/assets/images/',
      outputDir: '_site/assets/images/',
    });

    let imgData = metadata.jpeg ? metadata.jpeg[metadata.jpeg.length - 1] : metadata.png[metadata.png.length - 1];

    const lqip = await Image('./src/assets/images/' + src, {
      widths: [16],
      formats: ['png'],
      urlPath: '/assets/images/',
      outputDir: '_site/assets/images/',
    });
    const lqipFile = fs.readFileSync(lqip.png[0].outputPath);
    const lqipBase64 = 'data:image/png;base64,' + new Buffer(lqipFile).toString('base64');

    return `<picture>
                ${Object.values(metadata)
                  .map(
                    (formatMetadata) =>
                      `<source 
                          type="${formatMetadata[0].sourceType}"
                          data-srcset="${formatMetadata.map(({ srcset }) => srcset).join(', ')}"
                          sizes="${sizes}"
                       >`,
                  )
                  .join('')}
                <img
                  class="${className} lazyload-image lazyload"
                  src="${lqipBase64}"
                  data-src="${imgData.url}"
                  width="${imgData.width}"
                  height="${imgData.height}"
                  alt="${alt}" 
                  loading="${loading}" 
                  decoding="async"
                >
            </picture>`;
  },
};
