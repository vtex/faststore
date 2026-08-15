const { babelOptimizerPlugin } = require('@graphql-codegen/client-preset')

module.exports = {
  presets: ['next/babel'],
  plugins: [
    /** Replaces gql function calls for imports to the document data */
    [
      babelOptimizerPlugin,
      { artifactDirectory: './@generated', gqlTagName: 'gql' },
    ],
    /**
     * With modern browserslist targets, `next/babel` skips the private-methods
     * transform but still applies class-properties, which then throws on
     * `#method()`. Middleware dependencies get transpiled too, so a private
     * method in a dependency such as `jose` is enough to fail the build.
     * Enabling this unconditionally keeps the build off caniuse-lite drift.
     */
    '@babel/plugin-transform-private-methods',
  ],
}
