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
    textOnPrimary: '#ffffff',
    textOnSecondary: '#0f3e99',
    background: '#fff',
    primary: '#0f3e99',
    secondary: '#eef3f7',
    emphasis: '#f71963',
    disabled: '#f2f4f5',
    muted: '#f0f0f0',
    muted1: '#727273',
    muted2: '#979899',
    muted3: '#cacbcc',
    muted4: '#e3e4e6',
    muted5: '#f2f4f5',
    gray: '#e3e4e6',
    success: '#8bc34a',
    successFaded: '#eafce3',
    warning: '#e19d00',
    warningFaded: '#fff6e0',
    danger: '#ff4c4c',
    dangerFaded: '#ffe6e6',
  },
  fontSizes: [
    '.75rem',
    '.875rem',
    '1rem',
    '1.25rem',
    '1.5rem',
    '2.25rem',
    '3rem',
  ],
  lineHeights: {
    copy: 1.5,
    title: 1.25,
  },
  sizes: {
    container: '96rem',
  },
  layout: {
    container: {
      px: [1, 2, 3],
    },
  },
  buttons: {
    primary: {
      bg: 'primary',
      color: 'textOnPrimary',
    },
    secondary: {
      color: 'textOnSecondary',
      bg: 'secondary',
    },
  },
  forms: {
    select: {
      borderWidth: 2,
      borderColor: 'muted4',
      paddingLeft: 3,
      paddingRight: 2,
      '&:hover': {
        borderColor: 'muted3',
      },
      '&:focus': {
        borderColor: 'muted2',
        outline: 'none',
      },
    },
  },
}

export const baseTheme = createTheme(base, customBase as any)
