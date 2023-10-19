// @ts-check
const storeConfig = require('./faststore.config')

/**
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
  /* config options here */
  images: {
    domains: [`${storeConfig.api.storeId}.vtexassets.com`],
    deviceSizes: [360, 540, 768, 1280, 1440],
    imageSizes: [34, 68, 154, 320],
  },
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  sassOptions: {
    additionalData: `@import "src/customizations/src/styles/custom-mixins.scss";`,
  },
  // TODO: We won't need to enable this experimental feature when migrating to Next.js 13
  experimental: {
    scrollRestoration: true,
  },
  webpack: (config, { isServer, dev }) => {
    // https://github.com/vercel/next.js/discussions/11267#discussioncomment-2479112
    // camel-case style names from css modules
    config.module.rules
      .find(({ oneOf }) => !!oneOf)
      .oneOf.filter(({ use }) => JSON.stringify(use)?.includes('css-loader'))
      .reduce((acc, { use }) => acc.concat(use), [])
      .forEach(({ options }) => {
        if (options.modules) {
          options.modules.exportLocalsConvention = 'camelCase'
        }
      })

    // Reduce the number of chunks so we ship a smaller first bundle.
    // This should help reducing TBT
    if (!isServer && !dev && config.optimization?.splitChunks) {
      config.optimization.splitChunks.maxInitialRequests = 1
    }

    return config
  },
  redirects:
    typeof storeConfig.redirects === 'function'
      ? // Ignoring ts for the next line so it doesn't complain BASE_PATH isn't being used
        // if user declares a redirects function that doesn't use BASE_PATH
        // @ts-ignore
        async () => storeConfig.redirects({ BASE_PATH: './src/customizations' })
      : storeConfig.redirects,
}

module.exports = nextConfig
