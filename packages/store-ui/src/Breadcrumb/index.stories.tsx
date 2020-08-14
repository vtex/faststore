import React from 'react'
import { ThemeProvider } from 'theme-ui'

import { baseTheme } from '../theme'
import { Breadcrumb } from './index'

export default {
  title: 'product|Breadcrumb',
  component: Breadcrumb,
}

export const ProductBreadcrumb = () => (
  <ThemeProvider theme={{ ...baseTheme }}>
    <Breadcrumb
      categoryTree={[
        {
          href: '/Cubas-e-Tanques',
          name: 'Cubas e Tanques',
        },
        {
          href: '/Cubas-e-Tanques/Cubas',
          name: 'Cubas',
        },
      ]}
    />
  </ThemeProvider>
)

export const SearchBreadcrumb = () => (
  <ThemeProvider theme={{ ...baseTheme }}>
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
    />
  </ThemeProvider>
)
