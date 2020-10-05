import assert from 'assert'

const root = process.cwd()

require('dotenv').config({
  path: `${root}/vtex.env`,
})

export type Environment = 'vtexcommercestable' | 'vtexcommercebeta'

interface LocalizationThemeOptions {
  messagesPath?: string
  locales?: string[]
  defaultLocale?: string
}

const defaultLocalizationThemeOptions: Required<LocalizationThemeOptions> = {
  messagesPath: './i18n/messages',
  locales: ['en'],
  defaultLocale: 'en',
}

export interface Options {
  title: string
  description: string
  getStaticPaths?: () => Promise<string[]>
  localizationThemeOptions?: LocalizationThemeOptions
}

const tenant = process.env.GATSBY_VTEX_TENANT as string
const environment = process.env.GATSBY_VTEX_ENVIRONMENT as Environment
const workspace = process.env.GATSBY_VTEX_IO_WORKSPACE as string

module.exports = ({
  title,
  description,
  localizationThemeOptions,
}: Options) => {
  assert(
    tenant,
    `Tenant not found in gatsby-theme-vtex. Do you have a vtex.env configuration file ?`
  )
  assert(
    environment,
    `Environment not found in gatsby-theme-vtex. Do you have a vtex.env configuration file ?`
  )
  assert(
    workspace,
    `Workspace not found in gatsby-theme-vtex. Do you have a vtex.env configuration file ?`
  )

  return {
    siteMetadata: {
      title,
      description,
      vtex: {
        tenant,
      },
    },
    plugins: [
      {
        resolve: require.resolve('gatsby-plugin-bundle-stats'),
        options: {
          compare: true,
          baseline: true,
          html: true,
          json: true,
          outDir: `.`,
          stats: {
            context: `${root}/src`,
          },
        },
      },
      {
        resolve: require.resolve('@vtex/gatsby-plugin-theme-ui'),
      },
      {
        resolve: require.resolve('gatsby-plugin-react-helmet'),
      },
      {
        // Makes it possible to share graphql queries between
        // client/server side queries
        //
        // Since graphql-js library must be a singleton, we resolve
        // this path not relative to this folder but to the app
        // using this theme, that's why this odd way of requiring the
        // plugin
        resolve: require.resolve(
          `${root}/node_modules/@vtex/gatsby-plugin-graphql`
        ),
      },
      {
        // Transform cms's json files into .tsx nodes so other
        // scripts can use it to generate files or templates
        resolve: require.resolve('@vtex/gatsby-transformer-vtex-cms'),
      },
      {
        // Adds search info into the Gatsby's source graph. This is
        // the plugin responsible for adding Product/Category/Brand
        // info into the gatsby's source graph
        //
        // Since graphql-js library must be a singleton, we resolve
        // this path not relative to this folder but to the app
        // using this theme, that's why this odd way of requiring the
        // plugin
        resolve: require.resolve(
          `${root}/node_modules/@vtex/gatsby-source-vtex`
        ),
        options: {
          tenant,
          environment,
          workspace,
        },
      },
      {
        resolve: '@vtex/gatsby-plugin-i18n',
        options: localizationThemeOptions ?? defaultLocalizationThemeOptions,
      },
    ],
    proxy: [
      {
        prefix: '/api',
        url: `https://${tenant}.${environment}.com.br`,
      },
      {
        prefix: '/graphql',
        url: `https://${workspace}--${tenant}.myvtex.com`,
      },
      {
        prefix: '/checkout',
        url: `https://${workspace}--${tenant}.myvtex.com`,
      },
    ],
  }
}
