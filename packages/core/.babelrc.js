const { babelOptimizerPlugin } = require('@graphql-codegen/client-preset')

module.exports = {
  presets: ['next/babel'],
  /** Replaces gql function calls for imports to the document data */
  plugins: [
    [
      babelOptimizerPlugin,
      { artifactDirectory: './@generated', gqlTagName: 'gql' },
    ],
  ],
}
