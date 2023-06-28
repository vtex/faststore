const lhConfig = require('@faststore/lighthouse').default

const { lighthouse: lh } = require('./faststore.config')

module.exports = lhConfig({
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
    'resource-summary:stylesheet:count': ['warn', { maxNumericValue: 400 }],
    'resource-summary:script:count': ['warn', { maxNumericValue: 20 }],
    'resource-summary:script:size': ['error', { maxNumericValue: 220 * 1024 }],
  },
})
