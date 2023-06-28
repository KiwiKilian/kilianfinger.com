---
title: Generating OG Images in Eleventy
subTitle: Using HTML and CSS without harming a headless browser
description: ...
date: 2023-03-20
---

Open Graph (OG) Images represent your content on the web when being shared. They are those little preview images
displayed next to your link on social media, messengers or your journaling app.

If you're not keen to create an OG Image manually for each of your pages on your Eleventy site, there are mainly two
approaches to generating them:

1. Create a HTML template, style with CSS and take a screenshot with a headless browser
2. Create a SVG template, render it to a bitmap

First approach is easy to style but hard to render. Managing a headless browser can be a hassle at times. Second
approach might be a bit harder to style, depending on your level of SVG knowledge, but is much more consistent to
render.

Combining the best of both worlds I would like to
introduce [`eleventy-plugin-og-image`](https://github.com/KiwiKilian/eleventy-plugin-og-image) – it's a shameless plug
of my very first open source project. It allows to create OG images from HTML (or any template language supported by
Eleventy) and CSS. Instead of using a headless browser, `satori` is used to transform your HTML to SVG allowing a simple
rendering to bitmap afterward.

```
┌─────────────┐             ┌─────────────┐
│  Template   │──Eleventy──▶│    HTML     │
└─────────────┘             └─────────────┘
                                   │       
                                satori     
                                   │       
                                   ▼       
┌─────────────┐             ┌─────────────┐
│   Bitmap    │◀──resvg-js──│     SVG     │
└─────────────┘             └─────────────┘
```


Happy to hear you feedback 