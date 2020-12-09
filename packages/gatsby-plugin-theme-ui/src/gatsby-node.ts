import { join } from 'path'

import type { CreateBabelConfigArgs, CreateWebpackConfigArgs } from 'gatsby'

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
  if (process.env.NODE_ENV !== 'production') {
    return
  }

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
}: CreateWebpackConfigArgs) => {
  setWebpackConfig({
    resolve: {
      alias: {
        '@emotion/is-prop-valid': require.resolve(
          './@emotion/is-prop-valid/index.js'
        ),
      },
    },
  })
}
