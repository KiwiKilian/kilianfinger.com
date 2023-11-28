module.exports = {
  ci: {
    upload: {
      target: 'temporary-public-storage',
    },
    collect: {
      autodiscoverUrlBlocklist: ['/404.html', '/blog/index.html', '/imprint/index.html', '/privacy/index.html'],
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'bf-cache': 'off',
        'color-contrast': 'off',
        'csp-xss': 'off',

        'render-blocking-resources': ['warning', { maxLength: 1 }],
      },
    },
  },
};
