import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  build: {
    modulePreload: { polyfill: false },
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 0,
        assetFileNames: (assetInfo) =>
          ['.jpeg', '.png', '.avif', '.webp'].includes(path.extname(assetInfo.name))
            ? 'assets/[name].[ext]'
            : 'assets/[name].[hash].[ext]',
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
