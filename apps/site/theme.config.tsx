import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import { VtexLogo } from './components/Logos/'

const Footer = (
  <footer className="nx-footer">
    <div className="nx-lading-grid">
      <VtexLogo />
      <p>
        Copyright © {new Date().getFullYear()} FastStore Docs, Inc. Built with{' '}
        {''}
        <a href="https://nextra.site" target="_blank" rel="noreferrer">
          Nextra
        </a>
        .
      </p>
    </div>
  </footer>
)

const config: DocsThemeConfig = {
  nextThemes: {
    defaultTheme: 'light',
  },
  darkMode: false,
  logo: <strong>FastStore</strong>,
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
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
  docsRepositoryBase: 'https://github.com/vtex/faststore/tree/main/apps/site',
  footer: {
    component: Footer,
  },
}

export default config
