import { jsx, ThemeProvider } from '@theme-ui/core'
import { WrapRootElementBrowserArgs } from 'gatsby'

import theme from './index'

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) =>
  jsx(
    ThemeProvider,
    {
      theme: () => theme,
    },
    element
  )
