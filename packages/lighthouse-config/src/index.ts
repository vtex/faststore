interface Params {
  server?: string
  urls: string[]
}

const lhConfig = ({ urls, server }: Params) => {
  const url = urls.map((path) => `${server}${path}`)

  return {
    ci: {
      collect: {
        url,
        numberOfRuns: 5,
      },
      assert: {
        preset: 'lighthouse:no-pwa',
        assertions: {
          // We still don't have a pwa capable app
          'categories:pwa': 'off',

          // Preview pages are not crawlable
          'is-crawlable': 'off',

          // Somehow lighthouse ci can't find the dns-prefetch tags we are adding
          'uses-rel-preconnect': 'warn',

          // Some images break this even after 4days of cache time
          'uses-long-cache-ttl': 'off',

          bypass: 'off',

          // Minimal scope for categories
          'categories:accessibility': ['error', { minScore: 0.95 }],
          'categories:best-practices': ['error', { minScore: 0.95 }],
          'categories:performance': ['error', { minScore: 0.95 }],
          'categories:seo': ['error', { minScore: 0.9 }],

          // Max values for metrics
          'cumulative-layout-shift': ['error', { maxNumericValue: 0.2 }],
          'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
          'largest-contentful-paint': ['error', { maxNumericValue: 3500 }],
          'max-potential-fid': ['error', { maxNumericValue: 300 }],
          'total-blocking-time': ['error', { maxNumericValue: 200 }],
          interactive: ['error', { maxNumericValue: 3000 }],

          // Somehow we can't get rid of this
          'unused-javascript': ['error', { maxLength: 10 }],
          'uses-text-compression': ['warn', { maxLength: 1 }],
        },
      },
      upload: {
        target: 'temporary-public-storage',
        urlReplacementPatterns: 's/*.vtex.io//',
      },
    },
  }
}

export default lhConfig
