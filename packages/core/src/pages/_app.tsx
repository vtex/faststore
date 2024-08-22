// FastStore UI's base styles
import '../styles/global/index.scss'

import '../customizations/src/themes/index.scss'

import type { AppProps } from 'next/app'

import { UIProvider } from '@faststore/ui'
import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'

import storeConfig from '../../faststore.config'

import { DefaultSeo } from 'next-seo'

function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <DefaultSeo norobots={storeConfig.experimental.noRobots} />

      <AnalyticsHandler />

      <UIProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UIProvider>
    </ErrorBoundary>
  )
}

export default App
