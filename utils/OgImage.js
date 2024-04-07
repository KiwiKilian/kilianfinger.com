import { OgImage as BaseOgImage } from 'eleventy-plugin-og-image/og-image';

export class OgImage extends BaseOgImage {
  async cacheFilePath() {
    return (await this.outputFilePath()).replace('/public', '');
  }
}
