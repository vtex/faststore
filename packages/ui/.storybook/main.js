const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const { resolve } = require('path')

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|mdx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
        outline: false,
      },
    },
    '@storybook/addon-a11y',
    {
      name: '@storybook/preset-scss',
      options: {
        rule: {
          sideEffects: true,
        },
      },
    },
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config) => {
    config.module.rules[0].use[0].options.plugins.push(
      require.resolve('@faststore/graphql-utils/babel')
    )

    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
        configFile: resolve(__dirname, '../tsconfig.json'),
      }),
    ]

    // SCSS import and camelCase support for CSS files
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            modules: {
              exportLocalsConvention: 'camelCase',
            },
          },
        },
        {
          loader: 'sass-loader',
        },
      ],
      include: resolve(__dirname, '../'),
    })

    return config
  },
}
