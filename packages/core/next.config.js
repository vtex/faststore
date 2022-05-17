// @ts-check

/**
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
  /* config options here */
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  webpack: (config) => {
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

    return config
  },
}

module.exports = nextConfig
