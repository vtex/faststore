/**
 * @jsx jsx
 * */
import { FC } from 'react'
import { jsx, ThemeProvider as ThemeUIProvider } from 'theme-ui'

import theme from '../index'

const getTheme = () => theme

export const ThemeProvider: FC = ({ children }) => (
  <ThemeUIProvider theme={getTheme}>{children}</ThemeUIProvider>
)
