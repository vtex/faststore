import ThemeProvider from './decorators/ThemeProvider'
import GatsbyIntlProvider from './decorators/GatsbyIntlProvider'
import { addDecorator } from '@storybook/react'
import { withContexts } from '@storybook/addon-contexts/react'
import { contexts } from './contexts'

export const parameters = {
  a11y: {
    element: '#root',
    config: {},
    options: {},
    manual: true,
  },
  layout: 'fullscreen',
}

addDecorator(withContexts(contexts))
addDecorator(GatsbyIntlProvider)
addDecorator(ThemeProvider)
