import React from 'react'
import { ThemeProvider } from 'theme-ui'
import type { Theme } from 'theme-ui'

import baseTheme from './theme'
import { Breadcrumb } from './index'

export default {
  title: 'product|Breadcrumb',
  component: Breadcrumb,
}

export const ProductBreadcrumb = () => (
  <ThemeProvider theme={{ ...baseTheme } as Theme}>
    <Breadcrumb
      breadcrumb={[
        {
          href: '/Cubas-e-Tanques',
          name: 'Cubas e Tanques',
        },
        {
          href: '/Cubas-e-Tanques/Cubas',
          name: 'Cubas',
        },
      ]}
      type="PRODUCT"
    />
  </ThemeProvider>
)

export const SearchBreadcrumb = () => (
  <ThemeProvider theme={{ ...baseTheme } as Theme}>
    <Breadcrumb
      breadcrumb={[
        {
          name: 'Apparel & Accessories',
          href: '/apparel---accessories',
        },
        {
          name: 'Clothing',
          href: '/apparel---accessories/clothing',
        },
      ]}
      type="SEARCH"
    />
  </ThemeProvider>
)
