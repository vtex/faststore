import { create } from '@storybook/theming/create'
import { version } from '../package.json'

export default create({
  base: 'light',

  colorPrimary: '#f71963',
  colorSecondary: '#f71963',

  // UI
  appBg: 'white',
  appContentBg: 'white',
  appBorderColor: '#f71963',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textInverseColor: 'rgba(0,0,0,0.9)',

  // Toolbar default and active colors
  barTextColor: 'black',
  barSelectedColor: '#f71963',
  barBg: 'white',
  barBorder: '#f71963',

  // Form colors
  inputBg: 'white',
  inputBorder: '#f71963',
  inputTextColor: 'black',
  inputBorderRadius: 4,

  brandTitle: `Store UI v${version}`,
  brandUrl: 'https://github.com/vtex/faststore/tree/master/packages/store-ui',
})
