/** @jsx jsx */
import { WrapRootElementBrowserArgs } from 'gatsby'
import { jsx, ThemeProvider } from 'theme-ui'

import theme from './index'

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => (
  <ThemeProvider theme={theme}>{element}</ThemeProvider>
)
