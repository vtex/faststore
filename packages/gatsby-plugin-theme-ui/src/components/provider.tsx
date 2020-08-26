/**
 * @jsx jsx
 * */
import { FC } from 'react'
import { jsx, ThemeProvider as ThemeUIProvider } from 'theme-ui'

import theme from '../index'

const getTheme = () => theme

const ThemeProvider: FC = ({ children }) => (
  <ThemeUIProvider theme={getTheme}>{children}</ThemeUIProvider>
)

export default ThemeProvider
