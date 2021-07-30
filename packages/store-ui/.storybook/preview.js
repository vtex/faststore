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
    default: 'theme-default',
    list: [
      { name: 'none', class: 'no-theme', color: '#FFFFFF' },
      { name: 'theme-default', class: 'theme-default', color: '#999999' },
    ],
    onChange: (theme) => {
      document
        .getElementById('storybook-preview-iframe')
        .contentDocument.querySelector('body').className =
        'sb-show-main sb-main-padded'
      document
        .getElementById('storybook-preview-iframe')
        .contentDocument.querySelector('body')
        .classList.add(theme.class)
    },
  },
  Decorator: ({ children }) => {
    return <ThemeProvider>{children}</ThemeProvider>
  },
}

export const decorators = [withThemes]
