import React from 'react'
import { WrapRootElementBrowserArgs } from 'gatsby'

const { ThemeProvider } = require('./src/components/provider')

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => (
  <ThemeProvider>{element}</ThemeProvider>
)
