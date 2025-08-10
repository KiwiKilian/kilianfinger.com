import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  build: {
    modulePreload: { polyfill: false },
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: (chunkInfo) => {
          return ['.jpeg', '.png', '.avif', '.webp'].includes(path.extname(chunkInfo.names[0]))
            ? 'assets/[name].[ext]'
            : 'assets/[name].[hash].[ext]';
        },
      },
    },
  },
});
