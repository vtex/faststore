import { UIProvider } from '@faststore/ui'
import type { AppProps } from 'next/app'
import ThirdPartyScripts from 'src/components/ThirdPartyScripts'
import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import useGeolocation from 'src/sdk/geolocation/useGeolocation'
import SEO from '../../next-seo.config'

// FastStore UI's base styles
import '../styles/main.scss'

import { useSearch } from '@faststore/sdk'
import { DefaultSeo } from 'next-seo'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ITEMS_PER_PAGE } from 'src/constants'

function App({ Component, pageProps }: AppProps) {
  const { key } = pageProps
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
        <Layout>
          <Component {...pageProps} key={key} />
        </Layout>
      </UIProvider>
    </ErrorBoundary>
  )
}

export default App
