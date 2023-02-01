---
title: Wrapping your Head around Eleventy with Vite
description: ...
date: 2023-02-01
---

This is just an example.

```javascript
eleventyConfig.addPlugin(EleventyVitePlugin, {
  viteOptions: {
    build: {
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) =>
            ['.jpeg', '.png', '.avif', '.webp'].includes(path.extname(assetInfo.name))
              ? 'assets/[name].[ext]'
              : 'assets/[name].[hash].[ext]',
        },
      },
    },
  },
});
```
