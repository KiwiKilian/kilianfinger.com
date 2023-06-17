const { readableDate } = require('../../../utils/filters');

module.exports = {
  layout: 'layouts/post.njk',
  tags: ['posts'],
  eleventyComputed: {
    metaImage: {
      path: './src/blog/posts/post.og.njk',
      data: {
        title: (data) => data.title,
        date: (data) => readableDate(data.date),
      },
    },
  },
};
