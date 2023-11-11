module.exports = {
  ci: {
    upload: {
      target: 'temporary-public-storage',
    },
    collect: {
      autodiscoverUrlBlocklist: ['/404.html', '/imprint/index.html', '/privacy/index.html'],
    },
    assert: {
      preset: 'lighthouse:no-pwa',
    },
  },
};
