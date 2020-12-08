import type { Options } from './gatsby-node'

const root = process.cwd()

module.exports = ({ locales, defaultLocale }: Options) => ({
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
      resolve: require.resolve('gatsby-plugin-react-helmet-async'),
    },
    {
      resolve: require.resolve('@vtex/gatsby-plugin-theme-ui'),
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
      resolve: '@vtex/gatsby-plugin-i18n',
      options: {
        locales,
        defaultLocale,
      },
    },
  ],
})
