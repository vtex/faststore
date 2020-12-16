interface Params {
  server?: string
  urls: string[]
}

/**
 * Some values, we took from the default lighthouse config
 * throttling mobileSlow4G: https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/constants.js#L22
 */

const lhConfig = ({ urls, server }: Params) => {
  const url = urls.map((path) => `${server}${path}`)

  return {
    ci: {
      collect: {
        url,
        settings: {
          formFactor: 'mobile',
          throttling: {
            rttMs: 150,
            throughputKbps: 1638.4,
            requestLatencyMs: 562.5,
            downloadThroughputKbps: 1474.56,
            uploadThroughputKbps: 675,
            cpuSlowdownMultiplier: 4,
          },
          throttlingMethod: 'simulate',
          screenEmulation: {
            mobile: true,
            width: 360,
            height: 640,
            deviceScaleFactor: 2.625,
            disabled: false,
          },
          emulatedUserAgent:
            'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4143.7 Mobile Safari/537.36 Chrome-Lighthouse',
        },
      },
      assert: {
        preset: 'lighthouse:no-pwa',
        assertions: {
          'categories:accessibility': ['error', { minScore: 0.95 }],
          'categories:best-practices': ['error', { minScore: 0.95 }],
          'categories:performance': ['error', { minScore: 0.95 }],
          'categories:pwa': 'off',
          'categories:seo': ['error', { minScore: 0.9 }],
          'cumulative-layout-shift': ['error', { maxNumericValue: 0.2 }],
          'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
          'is-crawlable': 'off', // preview pages are not crawlable
          'largest-contentful-paint': ['error', { maxNumericValue: 3500 }],
          'max-potential-fid': ['error', { maxNumericValue: 300 }],
          'total-blocking-time': ['error', { maxNumericValue: 200 }],
          'unused-javascript': ['error', { maxLength: 10 }],
          'uses-long-cache-ttl': 'off',
          'uses-rel-preconnect': 'warn', // somehow lighthouse ci can't find the dns-prefetch tags we are adding
          'uses-text-compression': ['warn', { maxLength: 1 }],
          bypass: 'off',
          interactive: ['error', { maxNumericValue: 3000 }],
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
