import assert from 'assert'

require('dotenv').config({
  path: `${process.cwd()}/vtex.env`,
})

export type Environment = 'vtexcommercestable' | 'vtexcommercebeta'

export interface Options {
  title: string
  description: string
  tenant: string
  environment: Environment
  getStaticPaths?: () => Promise<string[]>
}

const defaultTenant = process.env.GATSBY_VTEX_TENANT as string
const defaultEnvironment = process.env.GATSBY_VTEX_ENVIRONMENT as Environment

module.exports = ({
  title,
  description,
  tenant = defaultTenant,
  environment = defaultEnvironment,
}: Options) => {
  assert(
    tenant,
    `Tenant not found in gatsby-theme-vtex. Do you have a vtex.env configuration file ?`
  )
  assert(
    environment,
    `Environment not found in gatsby-theme-vtex. Do you have a vtex.env configuration file ?`
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
        resolve: require.resolve('gatsby-plugin-theme-ui'),
      },
      {
        resolve: require.resolve('gatsby-plugin-react-helmet'),
      },
      {
        // Makes it possible to share graphql queries between
        // client/server side queries
        resolve: require.resolve('@vtex/gatsby-plugin-graphql'),
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
        resolve: require.resolve('@vtex/gatsby-source-vtex'),
        options: {
          tenant,
          environment,
        },
      },
    ],
    proxy: [
      {
        prefix: '/api',
        url: `https://${tenant}.${environment}.com.br`,
      },
      {
        prefix: '/graphql',
        url: `https://gimenes--${tenant}.myvtex.com`,
      },
    ],
  }
}
