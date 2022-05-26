import '../styles/fonts.css'
import '../styles/global/tokens.scss'
import '../styles/global/resets.scss'
import '../styles/global/typography.scss'
import '../styles/global/layout.scss'
import '../styles/global/components.scss'

import { CartProvider, SessionProvider, UIProvider } from '@faststore/sdk'
import NextNProgress from 'nextjs-progressbar'
import type { AppProps } from 'next/app'

import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import { validateCart } from 'src/sdk/cart/validate'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import { uiActions, uiEffects, uiInitialState } from 'src/sdk/ui'
import { ModalProvider } from 'src/sdk/ui/modal'

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

      <UIProvider
        initialState={uiInitialState}
        actions={uiActions}
        effects={uiEffects}
      >
        <SessionProvider
          initialState={{
            channel: storeConfig.channel,
            locale: storeConfig.locale,
          }}
        >
          <CartProvider mode="optimistic" onValidateCart={validateCart}>
            <ModalProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ModalProvider>
          </CartProvider>
        </SessionProvider>
      </UIProvider>
    </ErrorBoundary>
  )
}

export default App
