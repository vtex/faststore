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
  toc: {
    float: false,
  },
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
        titleTemplate: '%s – FastStore Docs',
      }
    }
  },
  project: {
    link: 'https://github.com/vtex/faststore',
  },
  docsRepositoryBase: 'https://github.com/vtex/faststore/tree/main/apps/site',
  head: (
    <>
      <title>FastStore Documentation</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="FastStore Documentation" />
      <meta
        property="og:description"
        content="Welcome to the FastStore documentation, the toolkit for building blazing-fast storefronts."
      />
      <meta
        property="og:image"
        content="https://vtexhelp.vtexassets.com/assets/docs/src/preview-doc-page___4c5004e8a020c8b4841e5ad1a5c781d7.png"
      />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    </>
  ),
  footer: {
    component: Footer,
  },
  banner: {
    key: '2.0-release',
    text: (
      <p>
        ⚠️ After March 18, 2024, the FastStore documentation will be migrated to the Developer Portal. For more information, access the official{' '}
        <a href="https://developers.vtex.com/updates/release-notes/2024-03-07-faststore-content-in-the-developer-portal" target="_blank" rel="noreferrer">
          release note.
        </a>
      </p>
    ),
  },
}

export default config
