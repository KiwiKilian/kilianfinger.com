export default {
  eleventyComputed: {
    metaImage: {
      path: './projects/project.og.njk',
      data: {
        title: (data) => data.title,
        projectSlug: (data) => data.projectSlug,
        themeColor: (data) => data.themeColor,
        projectImage: {
          width: (data) => data.metaImage.projectImage.width,
          height: (data) => data.metaImage.projectImage.height,
          style: (data) => data.metaImage.projectImage.style,
        },
      },
    },
  },
};
