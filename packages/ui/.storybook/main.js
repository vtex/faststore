const { resolve } = require('path')

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|mdx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
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
