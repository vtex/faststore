import { WrapRootElementBrowserArgs } from 'gatsby'

import theme from './index'

export const wrap = ({ element }: WrapRootElementBrowserArgs) => {
  const { jsx, ThemeProvider } = require('theme-ui')

  return jsx(
    ThemeProvider,
    {
      // It has to be a function so the great theme-ui
      // implementation does not try to deep merge unecessarily
      theme: () => theme,
    },
    element
  )
}
