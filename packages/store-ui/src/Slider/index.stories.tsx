/* eslint-disable no-console */
import React from 'react'
import { ThemeProvider } from 'theme-ui'

import { baseTheme } from '../theme'
import { createTheme } from '../createTheme'
import { PaginationDots } from './PaginationDots'

export default {
  title: 'slider|PaginationDots',
  component: PaginationDots,
}

export const Default = () => (
  <ThemeProvider theme={createTheme(baseTheme)}>
    <PaginationDots
      totalItems={3}
      selectedIndex={0}
      onSelect={(index) => console.log(index)}
    />
  </ThemeProvider>
)
