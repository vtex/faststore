import { writeFile } from 'fs'
import { join } from 'path'

require('@babel/register')({
  extensions: ['.ts'],
  presets: ['@babel/preset-typescript'],
})

const root = process.cwd()

const getThemeFile = (publicPath: string) => join(root, publicPath)

const { default: theme } = require(getThemeFile('src/theme/index.ts'))

writeFile(
  'node_modules/@vtex/gatsby-theme-vtex/theme.js',
  `export default ${JSON.stringify(theme)}`,
  () => console.log('THEME CREATED')
)
