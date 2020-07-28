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

const defaultTenant = process.env.GATSBY_VTEX_TENANT ?? 'storecomponents'
const defaultEnvironment =
  (process.env.GATSBY_VTEX_ENVIRONMENT as Environment) ?? 'vtexcommercestable'

module.exports = ({
  title,
  description,
  tenant = defaultTenant,
  environment = defaultEnvironment,
  getStaticPaths,
}: Options) => ({
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
        getStaticPaths,
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
})
