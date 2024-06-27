// @ts-check
const path = require('path')
const storeConfig = require('./faststore.config')

/**
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
  /* config options here */
  /* Replaces terser by swc for minifying. It's the default in NextJS 13 */
  swcMinify: true,
  images: {
    domains: [`${storeConfig.api.storeId}.vtexassets.com`],
    deviceSizes: [360, 540, 768, 1280, 1440],
    imageSizes: [34, 68, 154, 320],
  },
  i18n: {
    locales: [storeConfig.session.locale],
    defaultLocale: storeConfig.session.locale,
  },
  sassOptions: {
    additionalData: `@import "src/customizations/src/styles/custom-mixins.scss";`,
  },
  // TODO: We won't need to enable this experimental feature when migrating to Next.js 13
  experimental: {
    scrollRestoration: true,
    // Trace user's `node_modules` dir
    outputFileTracingRoot: path.join(__dirname, '../'),
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
  redirects: storeConfig.redirects,
  async rewrites() {
    return [
      ...(storeConfig.rewrites ? await storeConfig.rewrites : []),
      {
        source: '/login',
        destination: `https://${storeConfig.api.storeId}.${storeConfig.api.environment}.com.br/api/io/login`,
      },
      {
        source: '/checkout',
        destination: `https://${storeConfig.api.storeId}.${storeConfig.api.environment}.com.br/checkout`,
      },
      {
        source: '/files/:path*',
        destination: `https://${storeConfig.api.storeId}.${storeConfig.api.environment}.com.br/files/:path*`,
      },
      {
        source: '/arquivos/:path*',
        destination: `https://${storeConfig.api.storeId}.${storeConfig.api.environment}.com.br/arquivos/:path*`,
      },
      {
        source: '/api/:source((?!graphql))/:rest*',
        destination: `https://${storeConfig.api.storeId}.${storeConfig.api.environment}.com.br/api/:source/:rest*`,
      },
    ]
  },
}

module.exports = nextConfig
