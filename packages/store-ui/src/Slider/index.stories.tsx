/* eslint-disable no-console */
import React from 'react'
import { ThemeProvider } from 'theme-ui'
import type { Theme } from 'theme-ui'

import { baseTheme } from '../theme'
import { createTheme } from '../createTheme'
import SliderPaginationDots from './PaginationDots'

export default {
  title: 'slider|PaginationDots',
  component: SliderPaginationDots,
}

export const Default = () => (
  <ThemeProvider theme={createTheme(baseTheme) as Theme}>
    <SliderPaginationDots
      totalPages={3}
      selectedPage={0}
      onSelect={(index) => console.log(index)}
    />
  </ThemeProvider>
)
