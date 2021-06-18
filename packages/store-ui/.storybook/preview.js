import customTheme from './theme'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    theme: customTheme,
  },
  docs: {
    theme: customTheme,
  },
  options: {
    theme: customTheme,
    storySort: {
      order: ['Getting Started', 'Atoms', 'Molecules', 'Organisms'],
    },
  },
}
