require('dotenv').config({
  path: `${process.cwd()}/vtex.env`,
})

export interface Options {
  title: string
  description: string
  tenant: string
  environment: 'vtexcommercestable' | 'vtexcommercebeta'
}

const defaultTenant = process.env.GATSBY_VTEX_TENANT ?? 'storecomponents'
const defaultEnvironment =
  (process.env.GATSBY_VTEX_ENVIRONMENT as any) || 'vtexcommercestable'

module.exports = ({
  title,
  description,
  tenant = defaultTenant,
  environment = defaultEnvironment,
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
      resolve: require.resolve('gatsby-plugin-react-helmet'),
    },
    {
      resolve: require.resolve('gatsby-plugin-theme-ui'),
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
  ],
})
