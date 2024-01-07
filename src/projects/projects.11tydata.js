export default {
  eleventyComputed: {
    metaImage: {
      path: './blog/posts/post.og.njk',
      data: {
        title: (data) => data.title,
      },
    },
  },
};
