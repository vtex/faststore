import { UIProvider } from '@faststore/ui'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import SEO from '../../next-seo.config'

// FastStore UI's base styles
import '../styles/global/index.scss'
import '../customizations/src/themes/index.scss'

import { DefaultSeo } from 'next-seo'

function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <NextNProgress
        color="var(--fs-color-primary-bkg);"
        showOnShallow={false}
        options={{ showSpinner: false }}
      />

      <DefaultSeo {...SEO} />

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
