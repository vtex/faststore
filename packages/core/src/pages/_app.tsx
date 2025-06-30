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
import { useRouter } from 'next/router'
import { useSearch } from '@faststore/sdk'
import { ITEMS_PER_PAGE } from 'src/constants'
import { useEffect } from 'react'

function App({ Component, pageProps }: AppProps) {
  const { key } = pageProps
  useGeolocation()
  const router = useRouter()
  const {
    start: startGlobalSearchState,
    reset: resetSearchState,
    serializedState,
  } = useSearch()

  // Initialize global Search state
  startGlobalSearchState(router.asPath, { itemsPerPage: ITEMS_PER_PAGE })

  // checks wether the route changed to clear the searchState.
  useEffect(() => {
    const routeChangeComplete = (url: string) => {
      if (
        new URL(url, 'http://localhost:3000').pathname !==
        serializedState().pathname
      ) {
        resetSearchState()
      }
    }

    router.events.on('beforeHistoryChange', routeChangeComplete)

    return () => router.events.off('beforeHistoryChange', routeChangeComplete)
  }, [router])

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
