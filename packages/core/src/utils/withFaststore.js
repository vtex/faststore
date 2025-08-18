const path = require('path')
const fs = require('fs')
const configuration = require('../../discovery.config')
const VirtualModulePlugin = require('webpack-virtual-modules')

const root = process.env.PWD ?? process.cwd()

/**
 * @type {AnotateWebpack}
 * https://github.com/vercel/next.js/discussions/78170 - Do not use webpack aliases
 */
const withAliases = (aliases) => (userConfig) => (baseConfig, _context) => {
  const config = { ...baseConfig, ...userConfig?.(baseConfig, _context) }

  Object.entries(aliases).forEach(([k, v]) => {
    config.resolve.alias[k] = v
  })

  return config
}

/**
 * @type {AnotateWebpack}
 */
const withCamelCaseCss = (userConfig) => (baseConfig, _context) => {
  const config = { ...baseConfig, ...userConfig?.(baseConfig, _context) }
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
}

/**
 * @param {Object} overrideConfig
 * @returns {AnotateWebpack}
 */
const withVirtualPlugin =
  (finalConfig = {}) =>
    (userConfig) =>
      (baseConfig, _context) => {
        const config = { ...baseConfig, ...userConfig?.(baseConfig, _context) }
          ; (config.plugins ?? []).push(
            new VirtualModulePlugin({
              'faststore-config': `module.exports = ${JSON.stringify(finalConfig)};`,
            })
          )

        return config
      }

/**
 * @type {AnotateWebpack}
 */
const withOptimizations = (userConfig) => (baseConfig, _context) => {
  const { isServer, dev } = _context
  const config = { ...baseConfig, ...userConfig?.(baseConfig, _context) }
  // Reduce the number of chunks so we ship a smaller first bundle.
  // This should help reducing TBT
  if (!isServer && !dev && config.optimization?.splitChunks) {
    config.optimization.splitChunks.maxInitialRequests = 1
  }

  return config
}

module.exports = {
  /**
   * @param {import('next').NextConfig} config
   */
  withFastStore(config) {
    // const withVirtualConfig = withVirtualPlugin(finalConfig)
    const finalConfig = configuration.extendsConfig(getUserConfig())

    const withGraphqlLoader = addRule({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: '@graphql-tools/webpack-loader'
    })

    const addAliases = withAliases({
      // https://github.com/vercel/next.js/issues/50391
      'react': path.resolve(root, 'node_modules/react'),
    })

    return {
      ...config,
      swcMinify: true,
      images: {
        domains: [`${finalConfig.api.storeId}.vtexassets.com`],
        deviceSizes: [360, 412, 540, 768, 1280, 1440],
        imageSizes: [34, 68, 154, 320],
      },
      i18n: {
        locales: [finalConfig.session.locale],
        defaultLocale: finalConfig.session.locale,
      },
      sassOptions: {
        additionalData: `@import "@faststore/ui/src/styles/base/utilities.scss";`,
      },
      experimental: {
        scrollRestoration: true,
        outputFileTracingRoot: path.join(__dirname, '../'),
      },
      redirects: finalConfig.redirects,
      rewrites: finalConfig.rewrites,
      eslint: {
        ignoreDuringBuilds: true,
      },
      webpack: withGraphqlLoader(
        withOptimizations(
          withCamelCaseCss(
            // withVirtualConfig(
            addAliases(config.webpack)
            // )
          )
        )
      ),
      transpilePackages: [
        '@faststore/core',
        ...(config.transpilePackages ?? []),
      ],
    }
  },
}

/** @typedef {(next: import('next').NextConfig['webpack']) => import('next').NextConfig['webpack']} AnotateWebpack */


function addRule(rule) {
  return (userConfig) => (baseConfig, _context) => {
    const config = Object.assign({}, baseConfig, userConfig?.(baseConfig, _context) ?? {})

    config.module.rules.push(rule)

    return config
  }
}

function getUserConfig() {
  const finalConfig = require(
    path.relative(
      path.dirname(__filename),
      path.resolve(root, 'discovery.config.js')
    )
  )

  return finalConfig?.default ?? finalConfig
}
