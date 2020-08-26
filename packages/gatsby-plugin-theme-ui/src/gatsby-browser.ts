import { createElement } from 'react'
import { WrapRootElementBrowserArgs } from 'gatsby'

const { ThemeProvider } = require('./src/components/browser')

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) =>
  createElement(ThemeProvider, { children: element })
