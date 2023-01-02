import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

const config: DocsThemeConfig = {
  logo: <span>FastStore</span>,
  useNextSeoProps() {
    const { route } = useRouter()
    if (route !== '/') {
      return {
        titleTemplate: '%s – FastStore',
      }
    }
  },
  project: {
    link: 'https://github.com/vtex/faststore',
  },
  docsRepositoryBase:
    'https://github.com/vtex/faststore/tree/main/packages/site',
  footer: {
    text: 'FastStore',
  },
}

export default config
