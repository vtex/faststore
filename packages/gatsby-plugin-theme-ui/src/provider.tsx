/**
 * @jsx jsx
 * */
import { useState, useCallback, useEffect, FC } from 'react'
import { jsx, ThemeProvider as ThemeUIProvider } from 'theme-ui'

import mergedTheme from './index'

const isServer = typeof window === 'undefined'

export const ThemeProvider: FC = ({ children }) => {
  const [theme, setTheme] = useState(() => (isServer ? mergedTheme : {}))
  const getTheme = useCallback(() => theme, [theme])

  useEffect(() => {
    setTheme(mergedTheme)
  }, [])

  return <ThemeUIProvider theme={getTheme}>{children}</ThemeUIProvider>
}
