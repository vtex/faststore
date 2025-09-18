import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useSearch } from '@vtex/faststore-sdk'
import { UIProvider } from '@vtex/faststore-ui'

import ThirdPartyScripts from '../../components/ThirdPartyScripts'
import Layout from '../../Layout'
import AnalyticsHandler from '../../sdk/analytics'
import { DeliveryPromiseProvider } from '../../sdk/deliveryPromise'
import ErrorBoundary from '../../sdk/error/ErrorBoundary'
import useGeolocation from '../../sdk/geolocation/useGeolocation'

import SEO from '../../../next-seo.config'

// FastStore UI's base styles
import '../../styles/main.scss'

import { ITEMS_PER_PAGE } from '../../constants'

export function App({ Component, pageProps }: AppProps) {
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
