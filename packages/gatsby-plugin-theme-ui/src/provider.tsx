/** @jsx jsx */
import { jsx, ThemeProvider } from 'theme-ui'
import { WrapRootElementBrowserArgs } from 'gatsby'

import theme from './index'

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) =>
  jsx(
    ThemeProvider,
    {
      theme,
    },
    element
  )
