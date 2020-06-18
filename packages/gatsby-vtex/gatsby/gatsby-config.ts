import dotenv from 'dotenv'

dotenv.config({
  path: '.vtex-config',
})

module.exports = {
  siteMetadata: {
    title: 'Store Theme - VTEX Base Store',
    description: 'Store created with gatsby for a POC using VTEX API',
    author: 'Emerson Laurentino',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-theme-ui',
    'gatsby-plugin-loadable-components-ssr',
    {
      resolve: require.resolve('@vtex/gatsby-source-vtex'),
      options: {
        tenant: process.env.GATSBY_VTEX_TENANT,
        environment: process.env.GATSBY_VTEX_ENVIRONMENT,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Store Theme - VTEX Base Store',
        short_name: 'Store Theme',
        start_url: '/',
        background_color: '#0a034e',
        theme_color: '#0a034e',
        display: 'minimal-ui',
      },
    },
  ],
}
