import { UIProvider } from '@faststore/ui'
import type { AppProps } from 'next/app'
import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import SEO from '../../next-seo.config'

// FastStore UI's base styles
import '../styles/main.scss'

import { DefaultSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useSearch } from '@faststore/sdk'
import { ITEMS_PER_PAGE } from 'src/constants'

function App({ Component, pageProps }: AppProps) {
  const { key } = pageProps
  const router = useRouter()
  const { start: startGlobalSearchState } = useSearch()

  // Initialize global Search state
  startGlobalSearchState(router.asPath, { itemsPerPage: ITEMS_PER_PAGE })

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
