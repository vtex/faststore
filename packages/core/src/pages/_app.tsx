import { UIProvider } from '@faststore/ui'
import type { AppProps } from 'next/app'
import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import useGeolocation from 'src/sdk/geolocation/useGeolocation'
import SEO from '../../next-seo.config'

// FastStore UI's base styles
import '../styles/main.scss'

import { DefaultSeo } from 'next-seo'

function App({ Component, pageProps }: AppProps) {
  const { key } = pageProps
  useGeolocation()

  return (
    <ErrorBoundary>
      <DefaultSeo {...SEO} />

      <AnalyticsHandler />

      <UIProvider>
        <Layout>
          <Component {...pageProps} key={key} />
        </Layout>
      </UIProvider>
    </ErrorBoundary>
  )
}

export default App
