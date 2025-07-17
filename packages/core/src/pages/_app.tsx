import { DefaultSeo } from 'next-seo'
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'

import { UIProvider } from '@faststore/ui'
import { useSearch } from '@faststore/sdk'

import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import useGeolocation from 'src/sdk/geolocation/useGeolocation'
import { DeliveryPromiseProvider } from 'src/sdk/deliveryPromise'

import SEO from 'next-seo.config'

// FastStore UI's base styles
import '../styles/main.scss'

import { ITEMS_PER_PAGE } from 'src/constants'

function App({ Component, pageProps }: AppProps) {
  useGeolocation()
  const router = useRouter()
  const { start: startGlobalSearchState } = useSearch()

  // Initialize global Search state
  startGlobalSearchState(router.asPath, { itemsPerPage: ITEMS_PER_PAGE })

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
