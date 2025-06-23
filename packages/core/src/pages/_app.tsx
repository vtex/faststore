import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'

import { UIProvider } from '@faststore/ui'

import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import useGeolocation from 'src/sdk/geolocation/useGeolocation'
import { DeliveryPromiseProvider } from 'src/sdk/deliveryPromise'

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
        <DeliveryPromiseProvider>
          <Layout>
            <Component {...pageProps} key={pageProps?.key} />
          </Layout>
        </DeliveryPromiseProvider>
      </UIProvider>
    </ErrorBoundary>
  )
}

export default App
