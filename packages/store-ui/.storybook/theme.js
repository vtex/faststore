import { create } from '@storybook/theming/create'
import { version } from '../package.json'

export default create({
  base: 'light',

  colorPrimary: '#05a0c7',
  colorSecondary: '#05a0c7',

  // UI
  appBg: 'white',
  appContentBg: 'white',
  appBorderColor: '#05a0c7',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textInverseColor: 'rgba(0,0,0,0.9)',

  // Toolbar default and active colors
  barTextColor: 'black',
  barSelectedColor: '#05a0c7',
  barBg: 'white',
  barBorder: '#05a0c7',

  // Form colors
  inputBg: 'white',
  inputBorder: '#05a0c7',
  inputTextColor: 'black',
  inputBorderRadius: 4,

  brandTitle: `Store UI v${version}`,
  brandUrl: 'https://github.com/vtex/faststore/tree/master/packages/store-ui',
})
