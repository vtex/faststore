import base from '@theme-ui/preset-base'

import { createTheme } from './createTheme'

const customBase = {
  useCustomProperties: false,
  initialColorModeName: false,
  initialColorMode: false,
  useLocalStorage: false,
  colors: {
    text: '#3f3f40',
    textMuted: '#979899',
    textBold: '#03003d',
    background: '#fff',
    primary: '#0f3e99',
    muted: '#f0f0f0',
    gray: '#e3e4e6',
  },
  sizes: {
    container: '96rem',
  },
  layout: {
    container: {
      px: [1, 2, 3],
    },
  },
}

export const baseTheme = createTheme(base, customBase as any)
