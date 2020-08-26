import { createElement } from 'react'
import { WrapRootElementBrowserArgs } from 'gatsby'

const { ThemeProvider } = require('./src/provider')

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) =>
  createElement(ThemeProvider, { children: element })
