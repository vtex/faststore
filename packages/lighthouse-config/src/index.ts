interface Params {
  server?: string
  urls: string[]
  assertions?: any
}

/**
 * Some values, we took from the default lighthouse config
 * throttling mobileSlow4G: https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/constants.js#L22
 */

const lhConfig = ({ urls, server, assertions = {} }: Params) => {
  const url = urls.map((path) => `${server}${path}`)

  return {
    ci: {
      collect: {
        url,
      },
      assert: {
        preset: 'lighthouse:no-pwa',
        assertions: {
          // Final Ligthouse score Budgets
          'categories:accessibility': ['error', { minScore: 0.95 }],
          'categories:best-practices': ['error', { minScore: 0.95 }],
          'categories:performance': ['error', { minScore: 0.95 }],
          'categories:seo': ['error', { minScore: 0.9 }],
          'categories:pwa': 'off',

          // Lighthouse Metrics Budgets
          'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
          'speed-index': ['error', { maxNumericValue: 3387 }],
          'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
          interactive: ['error', { maxNumericValue: 3785 }],
          'total-blocking-time': ['error', { maxNumericValue: 200 }],
          'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

          // Number of Requests Budgets
          'resource-summary:font:count': ['error', { maxNumericValue: 3 }],
          'resource-summary:image:count': ['error', { maxNumericValue: 20 }],
          'resource-summary:script:count': ['error', { maxNumericValue: 15 }],
          'resource-summary:stylesheet:count': [
            'error',
            { maxNumericValue: 3 },
          ],
          'resource-summary:third-party:count': [
            'error',
            { maxNumericValue: 100 },
          ],

          // Resource sizes Budgeets
          'resource-summary:document:size': [
            'error',
            { maxNumericValue: 20 * 1024 },
          ],
          'resource-summary:font:size': [
            'error',
            { maxNumericValue: 70 * 1024 },
          ],
          'resource-summary:image:size': [
            'error',
            { maxNumericValue: 500 * 1024 },
          ],
          'resource-summary:script:size': [
            'error',
            { maxNumericValue: 200 * 1024 },
          ],
          'resource-summary:stylesheet:size': [
            'error',
            { maxNumericValue: 100 * 1024 },
          ],
          'resource-summary:third-party:size': [
            'error',
            { maxNumericValue: 500 * 1024 },
          ],
          'resource-summary:total:size': [
            'error',
            { maxNumericValue: 600 * 1024 },
          ],

          // Extra Lighthouse Assertion rules
          'unused-javascript': ['error', { maxLength: 10 }],

          ...assertions,
        },
      },
      upload: {
        target: 'temporary-public-storage',
        urlReplacementPatterns: 's/.*app//',
      },
    },
  }
}

export default lhConfig
