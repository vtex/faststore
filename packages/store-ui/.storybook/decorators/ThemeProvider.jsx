import React from 'react'
import { ThemeProvider } from 'theme-ui'
import globalTheme from '../themes'

const Provider = (Story) => {
  return <ThemeProvider theme={globalTheme}>{Story()}</ThemeProvider>
}

export default Provider
