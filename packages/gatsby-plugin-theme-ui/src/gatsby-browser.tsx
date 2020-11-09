import { WrapRootElementBrowserArgs } from 'gatsby'
import React from 'react'

const { ThemeProvider } = require('./src/components/Provider')

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => (
  <ThemeProvider>{element}</ThemeProvider>
)
