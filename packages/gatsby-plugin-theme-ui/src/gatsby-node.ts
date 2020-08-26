import { join } from 'path'

import { CreateBabelConfigArgs, CreateWebpackConfigArgs } from 'gatsby'

const root = process.cwd()
const name = '@vtex/gatsby-plugin-theme-ui'

const base = join(root, 'src', name)
const filepath = join(base, 'index.ts')

export const onPostBootstrap = () => {
  require('@babel/register')({
    extensions: ['.ts'],
    presets: ['@babel/preset-typescript'],
  })
  const { default: theme } = require(filepath)

  ;(global as any).theme = theme
}

export const onCreateBabelConfig = ({
  actions: { setBabelPlugin },
}: CreateBabelConfigArgs) => {
  setBabelPlugin({
    name: require.resolve('./babel'),
    options: {
      inFile: filepath,
      inPath: base,
    },
  })
}

export const onCreateWebpackConfig = ({
  actions: { setWebpackConfig },
  stage,
}: CreateWebpackConfigArgs) => {
  if (stage === 'build-javascript' || stage === 'develop') {
    setWebpackConfig({
      optimization: {
        // minimize: false,
        // nodeEnv: 'development',
        // splitChunks: {
        //   cacheGroups: {
        //     'theme-ui': {
        //       maxSize: 1e6,
        //       name: 'theme-ui',
        //       test: /(.*)theme-ui(.*)/,
        //     },
        //     emotion: {
        //       maxSize: 1e6,
        //       name: 'emotion',
        //       test: /(.*)emotion(.*)/,
        //     },
        //   },
        // },
      },
    })
  }
}
