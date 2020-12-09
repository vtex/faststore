import React from 'react'
import type { WrapRootElementBrowserArgs } from 'gatsby'

const { ThemeProvider } = require('./src/components/Provider')

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => (
  <ThemeProvider>{element}</ThemeProvider>
)
