import { readableDate } from '../../../utils/filters.js';

export default {
  layout: 'layouts/post.njk',
  tags: ['posts'],
  eleventyComputed: {
    metaImage: {
      path: './blog/posts/post.og.njk',
      data: {
        title: (data) => data.title,
        date: (data) => readableDate(data.date),
      },
    },
  },
};
