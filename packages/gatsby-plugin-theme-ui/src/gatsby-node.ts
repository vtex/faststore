import { join } from 'path'

import { CreateBabelConfigArgs } from 'gatsby'

const root = process.cwd()

const name = '@vtex/gatsby-plugin-theme-ui'
const inPath = join(root, 'src', name)
const inFile = join(inPath, 'index.ts')

export const onPostBootstrap = () => {
  console.log('onPostBootstrap')

  require('@babel/register')({
    extensions: ['.ts'],
    presets: ['@babel/preset-typescript'],
  })
  const { default: theme } = require(inFile)

  ;(global as any).theme = theme
}

export const onCreateBabelConfig = ({
  actions: { setBabelPlugin },
}: CreateBabelConfigArgs) => {
  console.log('onCreateBabelConfig')

  setBabelPlugin({
    name: require.resolve('./babel'),
    options: {
      inFile,
      inPath,
    },
  })
}
