// FastStore UI's base styles
import '../styles/global/index.scss'

import '../customizations/themes/index.scss'

import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'

import { UIProvider } from '@faststore/ui'
import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'

function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <NextNProgress
        color="var(--fs-color-primary-bkg);"
        showOnShallow={false}
        options={{ showSpinner: false }}
      />

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
