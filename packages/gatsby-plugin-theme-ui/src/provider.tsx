/** @jsx jsx */
import { WrapRootElementBrowserArgs } from 'gatsby'
import { jsx, ThemeProvider } from '@vtex/store-ui'

import theme from './index'

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => (
  <ThemeProvider theme={theme}>{element}</ThemeProvider>
)
