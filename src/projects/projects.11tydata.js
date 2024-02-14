export default {
  eleventyComputed: {
    metaImage: {
      path: './projects/project.og.njk',
      data: {
        title: (data) => data.title,
        projectSlug: (data) => data.projectSlug,
        themeColor: (data) => data.themeColor,
      },
    },
  },
};
