---
title: Generating OG Images in Eleventy
subTitle: Leveraging HTML and CSS without harming a headless browser
draft: true
description: Creating OG images for your Eleventy page is really easy with eleventy-plugin-og-image. I show you how!
date: 2023-12-23
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
└────────┘           └─────┘</code>
</div>
</pre>
<figcaption class="monodraw__caption">Flow of OG image generation</figcaption>
</figure>

## How to setup [`eleventy-plugin-og-image`](https://github.com/KiwiKilian/eleventy-plugin-og-image)

First we'll install the package:

```bash
npm install eleventy-plugin-og-image --save-dev
```

Afterward we add the plugin to our `.eleventy.js`. Note, this example config already uses ESM
with `@11ty/eleventy@3.0.0`. You need to load all fonts, which you are using in your
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

The styles will be inlined as `style=""` attributes by the plugin. You can use remote images, which will be fetched
during rendering. This template expects to get a `title` attribute provided as data.

Now it's only left to call the `ogImage` shortcode inside your `<head>` of a page template or layout. The first argument
of the shortcode is the filePath of the OG-image-template (required), second argument is for data (optional). This is
how it looks in a `example-page.njk`:

```twig
{{ '{% ogImage "./og-image.og.njk", { title: "Hello World!" } %}' }}
```

This will create a bitmap `_site/og-images/s0m3h4sh.png` in your output path:

<figure>
<img alt="Resulting OG image" src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIwMCA2MzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXR0ZXJuIGlkPSJhIiBoZWlnaHQ9IjEiIHdpZHRoPSIxIj48cGF0aCBkPSJtMCAwaDEyMDB2NjMwaC0xMjAweiIgZmlsbD0idXJsKCNiKSIvPjwvcGF0dGVybj48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwIiB4Mj0iMS4xOTU0OTIiIHkxPSIwIiB5Mj0iLjYyNzYzNCI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZWY2MjlmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZWVjZGEzIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBkPSJtMCAwaDEyMDB2NjMwaC0xMjAweiIgZmlsbD0idXJsKCNhKSIvPjxwYXRoIGQ9Im0zNzYuNCAzNDUuOGgtMTIuM3YtNTguMmgxMi4zdjI0LjFoMjQuOXYtMjQuMWgxMi4zdjU4LjJoLTEyLjN2LTI0aC0yNC45em02NyAuOXEtNi43IDAtMTEuNi0yLjgtNC44LTIuNy03LjQtNy43LTIuNi01LjEtMi42LTEyIDAtNi43IDIuNi0xMS44IDIuNi01LjEgNy4zLTcuOSA0LjgtMi45IDExLjItMi45IDQuMyAwIDguMSAxLjQgMy43IDEuNCA2LjUgNC4xIDIuOCAyLjggNC40IDcgMS41IDQuMSAxLjUgOS43djMuM2gtMjkuN3EwIDMuMyAxLjIgNS42IDEuMiAyLjQgMy40IDMuNyAyLjMgMS4yIDUuMyAxLjIgMiAwIDMuNy0uNSAxLjctLjYgMi45LTEuNyAxLjItMS4yIDEuOC0yLjhsMTEuMi43cS0uOSA0LjEtMy41IDcuMS0yLjYgMy02LjggNC42LTQuMSAxLjctOS41IDEuN3ptLTkuNy0yNy4xaDE4LjNxMC0yLjYtMS4xLTQuNi0xLjEtMi0zLjEtMy4yLTItMS4xLTQuNy0xLjEtMi43IDAtNC45IDEuMi0yLjEgMS4zLTMuMyAzLjQtMS4xIDItMS4yIDQuM3ptMzcuNi0zMmgxMi4xdjU4LjJoLTEyLjF6bTIxLjggMGgxMi4xdjU4LjJoLTEyLjF6bTQxLjUgNTkuMXEtNi43IDAtMTEuNS0yLjgtNC44LTIuOS03LjQtNy45LTIuNi01LjEtMi42LTExLjggMC02LjggMi42LTExLjkgMi42LTUgNy40LTcuOCA0LjgtMi45IDExLjUtMi45IDYuNiAwIDExLjQgMi45IDQuOCAyLjggNy40IDcuOCAyLjYgNS4xIDIuNiAxMS45IDAgNi43LTIuNiAxMS44LTIuNiA1LTcuNCA3LjktNC44IDIuOC0xMS40IDIuOHptMC05LjRxMyAwIDUuMS0xLjcgMi0xLjcgMy00LjcgMS0zIDEtNi44IDAtMy44LTEtNi44LTEtMy0zLTQuNy0yLjEtMS43LTUuMS0xLjctMyAwLTUuMSAxLjctMiAxLjctMy4xIDQuNy0xIDMtMSA2LjggMCAzLjggMSA2LjggMS4xIDMgMy4xIDQuNyAyLjEgMS43IDUuMSAxLjd6bTczLjIgOC41aC0xMmwtMTYuNi01OC4yaDEzLjRsOS42IDQwLjVoLjVsMTAuNi00MC41aDExLjZsMTAuNSA0MC42aC42bDkuNi00MC42aDEzLjRsLTE2LjYgNTguMmgtMTJsLTExLjEtMzhoLS40em03Ny4zLjlxLTYuNiAwLTExLjUtMi44LTQuOC0yLjktNy40LTcuOS0yLjYtNS4xLTIuNi0xMS44IDAtNi44IDIuNi0xMS45IDIuNi01IDcuNC03LjggNC45LTIuOSAxMS41LTIuOSA2LjYgMCAxMS40IDIuOSA0LjggMi44IDcuNCA3LjggMi43IDUuMSAyLjcgMTEuOSAwIDYuNy0yLjcgMTEuOC0yLjYgNS03LjQgNy45LTQuOCAyLjgtMTEuNCAyLjh6bTAtOS40cTMgMCA1LjEtMS43IDItMS43IDMtNC43IDEuMS0zIDEuMS02LjggMC0zLjgtMS4xLTYuOC0xLTMtMy00LjctMi4xLTEuNy01LjEtMS43LTMgMC01LjEgMS43LTIgMS43LTMuMSA0LjctMSAzLTEgNi44IDAgMy44IDEgNi44IDEuMSAzIDMuMSA0LjcgMi4xIDEuNyA1LjEgMS43em00MS41IDguNWgtMTIuMXYtNDMuNmgxMS43djcuNmguNHExLjItNC4xIDQtNi4xIDIuOS0yLjEgNi41LTIuMS45IDAgMiAuMSAxIC4xIDEuOC4zdjEwLjdxLS44LS4yLTIuMy0uNC0xLjUtLjItMi44LS4yLTIuNyAwLTQuNyAxLjEtMi4xIDEuMi0zLjMgMy4yLTEuMiAyLjEtMS4yIDQuN3ptMjAuNi01OC4yaDEyLjF2NTguMmgtMTIuMXptMzcuOCA1OC45cS01IDAtOS0yLjUtNC0yLjYtNi40LTcuNi0yLjMtNS0yLjMtMTIuMyAwLTcuNSAyLjQtMTIuNSAyLjQtNSA2LjQtNy41IDQuMS0yLjUgOC45LTIuNSAzLjYgMCA2LjEgMS4zIDIuNCAxLjIgNCAzIDEuNSAxLjkgMi4zIDMuNmguNHYtMjEuOWgxMnY1OC4yaC0xMS45di03aC0uNXEtLjkgMS45LTIuNCAzLjYtMS42IDEuOC00IDMtMi41IDEuMS02IDEuMXptMy44LTkuNnEzIDAgNS0xLjYgMi0xLjYgMy4xLTQuNSAxLjEtMi45IDEuMS02LjggMC0zLjktMS4xLTYuNy0xLjEtMi45LTMuMS00LjUtMi0xLjUtNS0xLjUtMyAwLTUgMS42LTIgMS42LTMuMSA0LjUtMSAyLjgtMSA2LjYgMCAzLjggMSA2LjcgMS4xIDIuOSAzLjEgNC42IDIgMS42IDUgMS42em0zMi44LTQ5LjNoMTIuNmwtMS4xIDQwLjhoLTEwLjR6bTYuMyA1OXEtMi44IDAtNC44LTItMi4xLTItMi00LjgtLjEtMi44IDItNC44IDItMiA0LjgtMiAyLjcgMCA0LjcgMiAyLjEgMiAyLjEgNC44IDAgMS44LTEgMy40LS45IDEuNS0yLjUgMi40LTEuNSAxLTMuMyAxeiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==" />
<figcaption>Resulting OG image, resolution and file type are configurable</figcaption>
</figure>

The `ogImage` shortcode generates the following HTML into the compiled `_site/example-page/index.html` to actually embed
your OG image:

```html
<meta property="og:image" content="/og-images/s0m3h4sh.png"/>
```

For more configuration and usage options see
the [docs](https://github.com/KiwiKilian/eleventy-plugin-og-image?tab=readme-ov-file#readme). A basic example is
also [included in the project](https://github.com/KiwiKilian/eleventy-plugin-og-image/tree/main/example) or find a
rather more complex example in
the [implementation of this blog](https://github.com/KiwiKilian/kilianfinger.com/blob/main/src/blog/posts/post.og.njk).
I'm happy to hear your
[feedback in the repository](https://github.com/KiwiKilian/eleventy-plugin-og-image/discussions)!
