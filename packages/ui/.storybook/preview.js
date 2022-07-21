import { withThemes } from 'storybook-addon-themes/react'
import SBTheme from './theme'

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
    default: 'styles',
    list: [
      { name: 'none', class: 'no-theme', color: '#FFFFFF' },
      {
        name: 'styles',
        class: 'styles',
        color: '#999999',
      },
    ],
    onChange: ({ class: themeName }) => {
      const currentTheme = document
        .getElementById('storybook-preview-iframe')
        .contentDocument.querySelector('link[rel=stylesheet]')

      if (currentTheme) {
        currentTheme.remove()
      }

      if (themeName !== 'no-theme') {
        var theme = document.createElement('link')
        theme.rel = 'stylesheet'
        theme.type = 'text/css'
        theme.href = `./dist/index.css`

        document
          .getElementById('storybook-preview-iframe')
          .contentDocument.querySelector('head')
          .appendChild(theme)
      }
    },
  },
}

export const decorators = [withThemes]
