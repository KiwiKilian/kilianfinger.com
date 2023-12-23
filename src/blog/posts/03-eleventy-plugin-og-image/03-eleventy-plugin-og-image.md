---
title: Generating OG Images in Eleventy
subTitle: Leveraging HTML and CSS without harming a headless browser
description: ...
date: 2023-03-20
draft: true
---

Open Graph (OG) Images represent your content on the web when being shared. They are those little preview images
displayed next to your link on social media, messengers or your journaling app.

If you're not keen to create an OG Image manually for each of your pages on your Eleventy site, there are mainly two
approaches to generate them:

1. Create a HTML template, style with CSS and take a screenshot with a headless browser
2. Create a SVG template, render it to a bitmap

First approach is easy to style but hard to render. Managing a headless browser can be a hassle at times. Second
approach might be a bit harder to style, depending on your level of SVG knowledge, but is much more consistent to
render.

Combining the best of both worlds I would like to
introduce [`eleventy-plugin-og-image`](https://github.com/KiwiKilian/eleventy-plugin-og-image) – it's a shameless plug
of my very first open source project. It allows to create OG images from HTML (or any template language supported by
Eleventy) and CSS. Instead of using a headless browser, [`satori`](https://github.com/vercel/satori) is used to
transform your HTML to SVG allowing a simple rendering to bitmap afterward. The complete flow is seen in
the [following diagram](#flow):

<figure id="flow" class="monodraw">
<pre class="monodraw__pre"><div class="monodraw__scroll-container"><code class="monodraw__code">┌──────────┐
│ Template │─────────┐
├──────────┤         │
│   Data   │─────Eleventy─────┬─────┐
├──────────┤         │        │     │
│  Styles  │─────────┘        ▼     ▼
└──────────┘              ┌──────┬─────┐
                          │ HTML │ CSS │
                          └──────┴─────┘
                              │     │
┌────────┐           ┌─────┐  │     │
│ Bitmap │◀─resvg-js─│ SVG │◀─satori┘
└────────┘           └─────┘
</code>
</div>
</pre>
<figcaption class="monodraw__caption">Flow of OG image generation</figcaption>
</figure>

## How to setup [`eleventy-plugin-og-image`](https://github.com/KiwiKilian/eleventy-plugin-og-image)

First we install the package:

```bash
npm install eleventy-plugin-og-image --save-dev
```

Afterward we add the plugin to our `.eleventy.js`. You need to load all fonts, which you are using in your
OG-image-templates:

```js
import EleventyPluginOgImage from 'eleventy-plugin-og-image';

/** @param { import('@11ty/eleventy/src/UserConfig').default } eleventyConfig */
export default async function (eleventyConfig) {
    eleventyConfig.addPlugin(EleventyPluginOgImage, {
        satoriOptions: {
            fonts: [
                {
                    name: 'Inter',
                    data: fs.readFileSync('../path/to/font-file/inter.woff'),
                    weight: 700,
                    style: 'normal',
                },
            ],
        },
    });
};
```

Now we create an OG-image-template `og-image.og.njk`. It's easiest to place the CSS in a `<style>` tag directly in your
template:

```twig
<style>
    .root {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: linear-gradient(135deg, #ef629f, #eecda3);
    }

    .title {
        color: white;
        font-size: 80px;
        margin: auto 0;
    }
</style>

<div class="root">
    <h1 class="title">{{ '{{ title }}' }}</h1>
</div>
```

The styles will be inlined on the HTML tags by the plugin. You can use remote images, which will be fetched during
rendering. This template expects to get a `title` attribute provided as data.

Now it's only left to call the `ogImage` shortcode inside the `<head>` in a page template or layout. The first argument
is the filePath of the OG-image-template (required), second argument is for data (optional). This is how it looks in
a `example-page.njk`:

```twig
{{ '{% ogImage "./og-image.og.njk", { title: "Hello World!" } %}' }}
```

This will create a bitmap `_site/og-images/s0m3h4sh.png` in your output path, which is a rendering of this previously
created SVG:

<svg viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><pattern id="a" height="1" width="1"><path d="m0 0h1200v630h-1200z" fill="url(#b)"/></pattern><linearGradient id="b" x1="0" x2="1.195492" y1="0" y2=".627634"><stop offset="0" stop-color="#ef629f"/><stop offset="1" stop-color="#eecda3"/></linearGradient><path d="m0 0h1200v630h-1200z" fill="url(#a)"/><path d="m376.4 345.8h-12.3v-58.2h12.3v24.1h24.9v-24.1h12.3v58.2h-12.3v-24h-24.9zm67 .9q-6.7 0-11.6-2.8-4.8-2.7-7.4-7.7-2.6-5.1-2.6-12 0-6.7 2.6-11.8 2.6-5.1 7.3-7.9 4.8-2.9 11.2-2.9 4.3 0 8.1 1.4 3.7 1.4 6.5 4.1 2.8 2.8 4.4 7 1.5 4.1 1.5 9.7v3.3h-29.7q0 3.3 1.2 5.6 1.2 2.4 3.4 3.7 2.3 1.2 5.3 1.2 2 0 3.7-.5 1.7-.6 2.9-1.7 1.2-1.2 1.8-2.8l11.2.7q-.9 4.1-3.5 7.1-2.6 3-6.8 4.6-4.1 1.7-9.5 1.7zm-9.7-27.1h18.3q0-2.6-1.1-4.6-1.1-2-3.1-3.2-2-1.1-4.7-1.1-2.7 0-4.9 1.2-2.1 1.3-3.3 3.4-1.1 2-1.2 4.3zm37.6-32h12.1v58.2h-12.1zm21.8 0h12.1v58.2h-12.1zm41.5 59.1q-6.7 0-11.5-2.8-4.8-2.9-7.4-7.9-2.6-5.1-2.6-11.8 0-6.8 2.6-11.9 2.6-5 7.4-7.8 4.8-2.9 11.5-2.9 6.6 0 11.4 2.9 4.8 2.8 7.4 7.8 2.6 5.1 2.6 11.9 0 6.7-2.6 11.8-2.6 5-7.4 7.9-4.8 2.8-11.4 2.8zm0-9.4q3 0 5.1-1.7 2-1.7 3-4.7 1-3 1-6.8 0-3.8-1-6.8-1-3-3-4.7-2.1-1.7-5.1-1.7-3 0-5.1 1.7-2 1.7-3.1 4.7-1 3-1 6.8 0 3.8 1 6.8 1.1 3 3.1 4.7 2.1 1.7 5.1 1.7zm73.2 8.5h-12l-16.6-58.2h13.4l9.6 40.5h.5l10.6-40.5h11.6l10.5 40.6h.6l9.6-40.6h13.4l-16.6 58.2h-12l-11.1-38h-.4zm77.3.9q-6.6 0-11.5-2.8-4.8-2.9-7.4-7.9-2.6-5.1-2.6-11.8 0-6.8 2.6-11.9 2.6-5 7.4-7.8 4.9-2.9 11.5-2.9 6.6 0 11.4 2.9 4.8 2.8 7.4 7.8 2.7 5.1 2.7 11.9 0 6.7-2.7 11.8-2.6 5-7.4 7.9-4.8 2.8-11.4 2.8zm0-9.4q3 0 5.1-1.7 2-1.7 3-4.7 1.1-3 1.1-6.8 0-3.8-1.1-6.8-1-3-3-4.7-2.1-1.7-5.1-1.7-3 0-5.1 1.7-2 1.7-3.1 4.7-1 3-1 6.8 0 3.8 1 6.8 1.1 3 3.1 4.7 2.1 1.7 5.1 1.7zm41.5 8.5h-12.1v-43.6h11.7v7.6h.4q1.2-4.1 4-6.1 2.9-2.1 6.5-2.1.9 0 2 .1 1 .1 1.8.3v10.7q-.8-.2-2.3-.4-1.5-.2-2.8-.2-2.7 0-4.7 1.1-2.1 1.2-3.3 3.2-1.2 2.1-1.2 4.7zm20.6-58.2h12.1v58.2h-12.1zm37.8 58.9q-5 0-9-2.5-4-2.6-6.4-7.6-2.3-5-2.3-12.3 0-7.5 2.4-12.5 2.4-5 6.4-7.5 4.1-2.5 8.9-2.5 3.6 0 6.1 1.3 2.4 1.2 4 3 1.5 1.9 2.3 3.6h.4v-21.9h12v58.2h-11.9v-7h-.5q-.9 1.9-2.4 3.6-1.6 1.8-4 3-2.5 1.1-6 1.1zm3.8-9.6q3 0 5-1.6 2-1.6 3.1-4.5 1.1-2.9 1.1-6.8 0-3.9-1.1-6.7-1.1-2.9-3.1-4.5-2-1.5-5-1.5-3 0-5 1.6-2 1.6-3.1 4.5-1 2.8-1 6.6 0 3.8 1 6.7 1.1 2.9 3.1 4.6 2 1.6 5 1.6zm32.8-49.3h12.6l-1.1 40.8h-10.4zm6.3 59q-2.8 0-4.8-2-2.1-2-2-4.8-.1-2.8 2-4.8 2-2 4.8-2 2.7 0 4.7 2 2.1 2 2.1 4.8 0 1.8-1 3.4-.9 1.5-2.5 2.4-1.5 1-3.3 1z" fill="#fff"/></svg>

The `ogImage` shortcode generates the following HTML into the compiled `_site/example-page/index.html` to actually embed
your OG image:

```html
<meta property="og:image" content="/og-images/s0m3h4sh.png"/>
```

For more configuration and usage options see
the [docs](https://github.com/KiwiKilian/eleventy-plugin-og-image?tab=readme-ov-file#readme). I'm happy to hear your
[feedback in the repository](https://github.com/KiwiKilian/eleventy-plugin-og-image/discussions)!
