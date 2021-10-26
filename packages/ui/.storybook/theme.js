import { create } from '@storybook/theming/create'
import { version } from '../package.json'
import Logo from '../static/logo.png'

export default create({
  base: 'light',

  colorPrimary: '#F71963',
  colorSecondary: '#F71963',

  // UI
  appBg: 'white',
  appContentBg: 'white',
  appBorderColor: '#F71963',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textInverseColor: 'rgba(0,0,0,0.9)',

  // Toolbar default and active colors
  barTextColor: 'black',
  barSelectedColor: '#F71963',
  barBg: 'white',
  barBorder: '#F71963',

  // Form colors
  inputBg: 'white',
  inputBorder: '#F71963',
  inputTextColor: 'black',
  inputBorderRadius: 4,

  brandTitle: `FastStore UI v${version}`,
  brandUrl: 'https://github.com/vtex/faststore/tree/master/packages/ui',
  brandImage: Logo,
})
