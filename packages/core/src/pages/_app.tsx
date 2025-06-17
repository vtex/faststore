import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'

import { UIProvider } from '@faststore/ui'

import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import useGeolocation from 'src/sdk/geolocation/useGeolocation'
import { DeliveryProvider } from 'src/sdk/delivery'
import { ITEMS_PER_PAGE } from 'src/constants'
import { useRouter } from 'next/router'
import { useSearch } from '@faststore/sdk'
import { useEffect } from 'react'
import SEO from 'next-seo.config'

// FastStore UI's base styles
import '../styles/main.scss'

function App({ Component, pageProps }: AppProps) {
  useGeolocation()
  const router = useRouter()
  const { state: searchState } = useSearch()
  searchState.start(router.asPath)

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const currentState = searchState.serializedState()
      const newState = new URL(url, window.location.origin)
      for (const [key, value] of Array.from(
        currentState.searchParams.entries()
      )) {
        if (newState.searchParams.has(key) === false)
          newState.searchParams.set(key, value)
      }
      // update state on navigation
      searchState.parseURL(newState)
    }

    router.events.on('beforeHistoryChange', handleRouteChange)
    searchState.setItemsPerPage(ITEMS_PER_PAGE)

    return () => router.events.off('beforeHistoryChange', handleRouteChange)
  }, [])

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
