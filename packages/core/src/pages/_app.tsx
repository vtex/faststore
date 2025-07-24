import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useSearch } from '@faststore/sdk'
import { UIProvider } from '@faststore/ui'

import ThirdPartyScripts from 'src/components/ThirdPartyScripts'
import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import { DeliveryPromiseProvider } from 'src/sdk/deliveryPromise'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import useGeolocation from 'src/sdk/geolocation/useGeolocation'

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
      <Head> {!process.env.DISABLE_3P_SCRIPTS && <ThirdPartyScripts />}</Head>
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
