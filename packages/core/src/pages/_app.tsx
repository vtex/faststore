import { UIProvider } from '@faststore/ui'
import type { AppProps } from 'next/app'
import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import SEO from '../../next-seo.config'

// FastStore UI's base styles
import '../styles/global/index.scss'
import '../customizations/src/themes/index.scss'

import { DefaultSeo } from 'next-seo'
import { useEffect } from 'react'

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    window.dataLayer.push({
      event: 'Page Loaded',
      // page: url,
    })
  }, [])
  return (
    <ErrorBoundary>
      <DefaultSeo {...SEO} />

      <AnalyticsHandler />

      <UIProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UIProvider>
    </ErrorBoundary>
  )
}

export default App
