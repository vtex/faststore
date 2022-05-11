const VTEXLHConfig = require('@vtex/lighthouse-config').default

const { lighthouse: lh } = require('./store.config')

module.exports = VTEXLHConfig({
  urls: Object.values(lh.pages),
  server: lh.server,
  assertions: {
    'csp-xss': 'off',

    // The following rules should be removed one this is fixed:
    // https://github.com/BuilderIO/partytown/issues/178
    'categories:best-practices': [
      'error',
      {
        minScore: 0.9,
      },
    ],
    deprecations: 'warn',
  },
})
