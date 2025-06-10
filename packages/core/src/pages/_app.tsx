import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'

import { UIProvider } from '@faststore/ui'

import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import useGeolocation from 'src/sdk/geolocation/useGeolocation'
import { DeliveryProvider } from 'src/sdk/delivery'

import SEO from 'next-seo.config'

// FastStore UI's base styles
import '../styles/main.scss'

function App({ Component, pageProps }: AppProps) {
  useGeolocation()

  return (
    <ErrorBoundary>
      <DefaultSeo {...SEO} />

      <AnalyticsHandler />

      <UIProvider>
        <DeliveryProvider>
          <Layout>
            <Component {...pageProps} key={pageProps?.key} />
          </Layout>
        </DeliveryProvider>
      </UIProvider>
    </ErrorBoundary>
  )
}

export default App
