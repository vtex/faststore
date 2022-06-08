import '../styles/fonts.css'
import '../styles/global/tokens.scss'
import '../styles/global/resets.scss'
import '../styles/global/typography.scss'
import '../styles/global/layout.scss'
import '../styles/global/components.scss'

import { CartProvider, SessionProvider } from '@faststore/sdk'
import NextNProgress from 'nextjs-progressbar'
import type { AppProps } from 'next/app'

import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import { validateCart } from 'src/sdk/cart/validate'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import { validateSession } from 'src/sdk/session/validate'
import UIProvider from 'src/sdk/ui/Provider'

import storeConfig from '../../store.config'

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
        <SessionProvider
          initialState={{
            channel: storeConfig.channel,
            locale: storeConfig.locale,
          }}
          onValidateSession={validateSession}
        >
          <CartProvider mode="optimistic" onValidateCart={validateCart}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </CartProvider>
        </SessionProvider>
      </UIProvider>
    </ErrorBoundary>
  )
}

export default App
