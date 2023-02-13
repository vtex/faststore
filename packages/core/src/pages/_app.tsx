// FastStore UI's base styles
import '@faststore/ui/src/styles/global.scss'

import '../styles/global/components.scss'

import '../customizations/themes/index.scss'

import NextNProgress from 'nextjs-progressbar'
import type { AppProps } from 'next/app'

import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import { UIProvider } from '@faststore/ui'

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
