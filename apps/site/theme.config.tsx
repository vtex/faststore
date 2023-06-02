import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import { VtexLogo, VtexIcon } from './components/Logos/'

const Footer = (
  <footer className="nx-footer">
    <div className="nx-lading-grid">
      <VtexLogo />
      <p>
        Copyright © {new Date().getFullYear()} FastStore Docs, Inc.{' '}
        <span>
          Built with {''}
          <a href="https://nextra.site" target="_blank" rel="noreferrer">
            Nextra
          </a>
          .
        </span>
      </p>
    </div>
  </footer>
)

const config: DocsThemeConfig = {
  nextThemes: {
    defaultTheme: 'light',
  },
  darkMode: false,
  logo: (
    <span className="nx-header-logo">
      <VtexIcon />
      <strong>FastStore</strong>
    </span>
  ),
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
  banner: {
    key: '2.0-release',
    text: (
      <p>🎉 We are thrilled to introduce FastStore v2. If you are looking for documentation of the previous version of FastStore, please refer to <a href="https://v1.faststore.dev/" target="_blank">FastStore v1.</a></p>
    )
  }
}

export default config
