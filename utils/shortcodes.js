import { promises as fs } from 'node:fs';
import path from 'node:path';
import Image from '@11ty/eleventy-img';

const OUTPUT_DIR = '_site/assets';
const URL_PATH = '/assets/';
const FILENAME_FORMAT = (id, src, width, format) => `${path.parse(src).name}@${width}.${id}.${format}`;

export async function inlineImageShortcode(path) {
  const base64Image = await fs.readFile(path, 'base64');

  return `data:image/jpeg;base64,${base64Image}`;
}

export async function imageShortcode({
  src,
  alt = '',
  sizeType = 'custom',
  widths: customWidths,
  sizes: customSizes,
  class: className = '',
  loading = 'lazy',
  decoding = 'async',
}) {
  const extension = path.extname(src).slice(1).toLowerCase();

  const { widths, sizes } = {
    portrait: {
      widths: [256, 560, 890, 1120],
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
    custom: {
      widths: customWidths,
      sizes: customSizes,
    },
  }[sizeType];

  let metadata = await Image('./src/assets/images/' + src, {
    widths,
    formats: ['avif', 'webp', extension],
    filenameFormat: FILENAME_FORMAT,
    urlPath: URL_PATH,
    outputDir: OUTPUT_DIR,
  });

  let imgData = metadata.jpeg || metadata.png;

  return `<picture>
              ${Object.values(metadata)
                .filter((formatMetadata) => !['image/jpeg', 'image/png'].includes(formatMetadata[0].sourceType))
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
                  src="${imgData[imgData.length - 1].url}"
                  srcset="${imgData.map(({ srcset }) => srcset).join(', ')}"
                  sizes="${sizes}"
                  width="${imgData[imgData.length - 1].width}"
                  height="${imgData[imgData.length - 1].height}"
                  loading="${loading}"
                  decoding="${decoding}"
                  alt="${alt}" 
                >
            </picture>`;
}
