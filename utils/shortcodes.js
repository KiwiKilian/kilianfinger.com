const fs = require('fs');
const path = require('path');
const Image = require('@11ty/eleventy-img');
const OUTPUT_DIR = '_site/assets';
const URL_PATH = '/assets/';
const FILENAME_FORMAT = (id, src, width, format) => `${path.parse(src).name}@${width}.${id}.${format}`;

module.exports = {
  inlineImage: function (path) {
    const file = fs.readFileSync(path);

    return `data:image/jpeg;base64,${file.toString('base64')}`;
  },

  image: async function ({ src, alt = '', sizeType, class: className = '', loading = 'lazy', decoding = 'async' }) {
    const extension = path.extname(src).slice(1).toLowerCase();

    const { widths, sizes } = {
      portrait: {
        widths: [256, 560, 810, 992, 1120],
        sizes: '(min-width: 2060px) 560px, (min-width: 680px) calc(23.09vw + 89px), 65vw',
      },
      projectsCover: {
        widths: [256, 572, 940, 1200],
        sizes: '(min-width: 1440px) 614px, (min-width: 680px) calc(45.54vw - 28px), calc(98.89vw - 43px)',
      },
      projectsMockup: {
        widths: [256, 870, 1200, 1460, 1680, 1870, 2048],
        sizes: 'calc(97.52vw - 54px)',
      },
      marple: {
        widths: [160, 320],
        sizes: '(min-width: 580px) 160px, calc(26.92vw + 9px)',
      },
    }[sizeType];

    let metadata = await Image('./src/assets/images/' + src, {
      widths,
      formats: ['avif', 'webp', extension],
      filenameFormat: FILENAME_FORMAT,
      urlPath: URL_PATH,
      outputDir: OUTPUT_DIR,
    });

    let imgData = metadata.jpeg ? metadata.jpeg[metadata.jpeg.length - 1] : metadata.png[metadata.png.length - 1];

    return `<picture>
                ${Object.values(metadata)
                  .map(
                    (formatMetadata) =>
                      `<source 
                         type="${formatMetadata[0].sourceType}"
                         srcset="${formatMetadata.map(({ srcset }) => srcset).join(', ')}"
                         sizes="${sizes}"
                       >`,
                  )
                  .join('')}
                <img
                  class="${className}"
                  src="${imgData.url}"
                  width="${imgData.width}"
                  height="${imgData.height}"
                  loading="${loading}"
                  decoding="${decoding}"
                  alt="${alt}" 
                >
            </picture>`;
  },
};
