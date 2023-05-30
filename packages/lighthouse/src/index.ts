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
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const baseSiteUrl = process.env.BASE_SITE_URL || server
  const url = urls.map((path) => `${baseSiteUrl}${path}`)

  return {
    ci: {
      collect: {
        url,
      },
      assert: {
        preset: 'lighthouse:no-pwa',
        assertions: {
          // Final Ligthouse score Budgets
          'categories:accessibility': ['error', { minScore: 1 }],
          'categories:best-practices': ['error', { minScore: 1 }],
          'categories:performance': ['error', { minScore: 0.95 }],
          'categories:seo': ['error', { minScore: 1 }],
          'categories:pwa': 'off',

          // Lighthouse Metrics Budgets
          // Minimal score for perf 90 on each metric
          'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
          'speed-index': ['error', { maxNumericValue: 3387 }],
          'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
          interactive: ['error', { maxNumericValue: 3785 }],
          'total-blocking-time': ['error', { maxNumericValue: 350 }],
          'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

          // Number of Requests Budgets
          'resource-summary:font:count': ['error', { maxNumericValue: 3 }],
          'resource-summary:image:count': ['error', { maxNumericValue: 20 }],
          'resource-summary:script:count': ['error', { maxNumericValue: 20 }],
          'resource-summary:stylesheet:count': [
            'error',
            { maxNumericValue: 3 },
          ],
          'resource-summary:third-party:count': [
            'error',
            { maxNumericValue: 100 },
          ],

          // Resource sizes Budgets
          // To learn where this 1024 comes from: https://github.com/GoogleChrome/lighthouse-ci/blob/fe181b61b20205dba5962c40094b1c90983f1c5e/packages/utils/src/budgets-converter.js#L49
          'resource-summary:document:size': [
            'error',
            { maxNumericValue: 40 * 1024 },
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
          'bf-cache': ['warn', {}],

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
