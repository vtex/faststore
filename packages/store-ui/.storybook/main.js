module.exports = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mdx|ts|tsx)',
    './**/*.stories.@(js|jsx|mdx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-storysource',
      options: {
        loaderOptions: {
          injectStoryParameters: false,
        },
      },
    },
  ],
}
