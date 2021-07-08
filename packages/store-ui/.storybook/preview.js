// import { useEffect } from "react"
import { withThemes } from 'storybook-addon-themes/react'
import SBTheme from './theme'
import ThemeProvider from './themes'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    theme: SBTheme,
  },
  docs: {
    theme: SBTheme,
  },
  options: {
    theme: SBTheme,
    storySort: {
      order: ['Getting Started', 'Atoms', 'Molecules', 'Organisms', 'Releases'],
    },
  },
  themes: {
    clearable: false,
    default: 'basic-theme',
    list: [
      { name: 'none', class: 'no-theme', color: '#FFFFFF' },
      { name: 'basic-theme', class: 'basic-theme', color: '#999999' },
    ],
  },
  Decorator: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
}

export const decorators = [withThemes]
