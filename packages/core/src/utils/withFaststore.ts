import type { NextConfig } from 'next'
import path from 'path'
import finalConfig from '../../discovery.config.js'

/**
 * https://github.com/vercel/next.js/discussions/78170 - Do not use webpack aliases
 */
const withAliases =
  (aliases: any) => (userConfig: any) => (baseConfig: any, _context: any) => {
    const config = { ...baseConfig, ...userConfig?.(baseConfig, _context) }

    Object.entries(aliases).forEach(([k, v]) => {
      config.resolve.alias[k] = v
    })

    return config
  }

const withCamelCaseCss =
  (userConfig: any) => (baseConfig: any, _context: any) => {
    const config = { ...baseConfig, ...userConfig?.(baseConfig, _context) }
    config.module.rules
      .find(({ oneOf }: any) => !!oneOf)
      .oneOf.filter(({ use }: any) =>
        JSON.stringify(use)?.includes('css-loader')
      )
      .reduce((acc: any, { use }: any) => acc.concat(use), [])
      .forEach(({ options }: any) => {
        if (options.modules) {
          options.modules.exportLocalsConvention = 'camelCase'
        }
      })

    return config
  }

const withOptimizations =
  (userConfig: any) => (baseConfig: any, _context: any) => {
    const { isServer, dev } = _context
    const config = { ...baseConfig, ...userConfig?.(baseConfig, _context) }
    // Reduce the number of chunks so we ship a smaller first bundle.
    // This should help reducing TBT
    if (!isServer && !dev && config.optimization?.splitChunks) {
      config.optimization.splitChunks.maxInitialRequests = 1
    }

    return config
  }

const filterWarnings =
  (userConfig: any) => (baseConfig: any, _context: any) => {
    const config = { ...baseConfig, ...userConfig?.(baseConfig, _context) }
    config.ignoreWarnings = [
      ...(config?.ignoreWarnings ?? []),
      { message: /autoprefixer:/ },
      { message: /Deprecation Warning/ },
    ]
    return config
  }

const root = process.env.PWD ?? process.cwd()

export async function withFastStore(config: NextConfig): Promise<NextConfig> {
  const withGraphqlLoader = addRule({
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: '@graphql-tools/webpack-loader',
  })

  const addAliases = withAliases({
    // https://github.com/vercel/next.js/issues/50391
    react: path.resolve(root, 'node_modules/react'),
  })

  return {
    ...config,
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
    outputFileTracingRoot: path.join(__dirname, '../'),
    experimental: {
      scrollRestoration: true,
    },
    redirects: (finalConfig as any).redirects,
    rewrites: (finalConfig as any).rewrites,
    eslint: {
      ignoreDuringBuilds: true,
    },
    webpack: withGraphqlLoader(
      withOptimizations(
        withCamelCaseCss(
          // withVirtualConfig(
          addAliases(filterWarnings(config.webpack))
          // )
        )
      )
    ),
    transpilePackages: ['@faststore/core', ...(config.transpilePackages ?? [])],
  }
}

function addRule(rule: any) {
  return (userConfig: any) => (baseConfig: any, _context: any) => {
    const config = Object.assign(
      {},
      baseConfig,
      userConfig?.(baseConfig, _context) ?? {}
    )

    config.module.rules.push(rule)

    return config
  }
}
