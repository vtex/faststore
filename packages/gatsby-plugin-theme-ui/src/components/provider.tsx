import React, { FC } from 'react'
import { ThemeProvider as ThemeUIProvider } from 'theme-ui'

import theme from '../index'

// Add this function so theme-ui does not try to deep merge the theme in here
// https://github.com/system-ui/theme-ui/blob/bfba2df8fdd01119c3af6a233355db1955c54ba0/packages/core/src/index.js#L87
const getTheme = (t: any) => (typeof theme === 'function' ? theme(t) : theme)

export const ThemeProvider: FC = ({ children }) => (
  <ThemeUIProvider theme={getTheme}>{children}</ThemeUIProvider>
)
