import { join } from 'path'

import { CreateBabelConfigArgs } from 'gatsby'

const root = process.cwd()

const name = 'gatsby-plugin-theme-ui'
const inPath = join(root, 'src', name)
const inFile = join(inPath, 'index.ts')

export const onPostBootstrap = () => {
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
  setBabelPlugin({
    name: require.resolve('./babel'),
    options: {
      inFile,
      inPath,
    },
  })
}
