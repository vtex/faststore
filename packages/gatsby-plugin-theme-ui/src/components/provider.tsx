import React, { FC } from 'react'
import { ThemeProvider as ThemeUIProvider } from 'theme-ui'

import theme from '../index'

const getTheme = () => theme

export const ThemeProvider: FC = ({ children }) => (
  <ThemeUIProvider theme={getTheme}>{children}</ThemeUIProvider>
)
