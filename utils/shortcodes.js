const fs = require('fs');
const path = require('path');
const Image = require('@11ty/eleventy-img');

const OUTPUT_DIR = '_site/assets';
const URL_PATH = '/assets/';
const FILENAME_FORMAT = (id, src, width, format) => `${path.parse(src).name}@${width}.${id}.${format}`;

module.exports = {
  image: async function ({ src, alt = '', sizeType, class: className = '' }) {
    const extension = path.extname(src).slice(1).toLowerCase();

    const widths = {
      portrait: [248, 496, 992],
      projectsCover: [150, 300, 600, 1200],
      projectsMockup: [768, 1024, 1440, 1920],
      marple: [160, 320],
    }[sizeType];

    let metadata = await Image('./src/assets/images/' + src, {
      widths,
      formats: ['avif', 'webp', extension],
      filenameFormat: FILENAME_FORMAT,
      urlPath: URL_PATH,
      outputDir: OUTPUT_DIR,
    });

    let imgData = metadata.jpeg ? metadata.jpeg[metadata.jpeg.length - 1] : metadata.png[metadata.png.length - 1];

    const lqipMetadata = await Image(`./src/assets/images/${src}`, {
      widths: [16],
      formats: ['webp'],
      filenameFormat: FILENAME_FORMAT,
      urlPath: URL_PATH,
      outputDir: OUTPUT_DIR,
    });
    const lqipFile = fs.readFileSync(lqipMetadata.webp[0].outputPath);
    const lqipBase64 = `data:image/webp;base64,${new Buffer.from(lqipFile).toString('base64')}`;

    return `<picture>
                ${Object.values(metadata)
                  .map(
                    (formatMetadata) =>
                      `<source 
                          type="${formatMetadata[0].sourceType}"
                          data-srcset="${formatMetadata.map(({ srcset }) => srcset).join(', ')}"
                       >`,
                  )
                  .join('')}
                <img
                  class="${className} lazyload-image lazyload"
                  src="${lqipBase64}"
                  data-src="${imgData.url}"
                  data-sizes="auto"
                  width="${imgData.width}"
                  height="${imgData.height}"
                  alt="${alt}" 
                >
            </picture>`;
  },
};
