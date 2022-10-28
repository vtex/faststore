import '../styles/global/tokens.scss'
import '../styles/global/resets.scss'
import '../styles/global/typography.scss'
import '../styles/global/layout.scss'
import '../styles/global/components.scss'

import '../customizations/themes/index.scss'

import NextNProgress from 'nextjs-progressbar'
import type { AppProps } from 'next/app'

import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import UIProvider from 'src/sdk/ui/Provider'

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
