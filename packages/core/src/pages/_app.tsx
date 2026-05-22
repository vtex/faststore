import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useSearch } from '@faststore/sdk'
import { UIProvider } from '@faststore/ui'

import { useReloadAfterLogoutReturn } from 'src/components/account/MyAccountDrawer/OrganizationDrawer/useReloadAfterLogoutReturn'
import ThirdPartyScripts from 'src/components/ThirdPartyScripts'
import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import { DeliveryPromiseProvider } from 'src/sdk/deliveryPromise'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import useGeolocation from 'src/sdk/geolocation/useGeolocation'
import useScrollRestoration from 'src/sdk/ui/useScrollRestoration'

import storeConfig from 'discovery.config'
import SEO from 'next-seo.config'

// FastStore UI's base styles
import '../styles/main.scss'

// Opt-in self-hosted Inter font.
// Resolves to an empty stub by default (no .woff2 files bundled).
// When experimental.optimizedFonts is true in discovery.config,
// next.config.js redirects this import to fonts/inter.ts (outside src/),
// which side-effect-imports the @fontsource/inter CSS files and ships the
// .woff2 assets. The Next.js global-CSS rule requires this import to live
// in _app.tsx; it is intentionally placed here for that reason.
import 'src/fonts/inter'

import { ITEMS_PER_PAGE } from 'src/constants'
import { useLocalizationConfig } from 'src/sdk/localization/useLocalizationConfig'

function LocalizationConfigUpdater() {
  // Update session with localization config
  useLocalizationConfig()
  return null
}

function App({ Component, pageProps }: AppProps) {
  useGeolocation()
  useReloadAfterLogoutReturn()
  storeConfig.experimental?.scrollRestoration && useScrollRestoration()
  const router = useRouter()
  const { start: startGlobalSearchState } = useSearch()

  // Initialize global Search state
  startGlobalSearchState(router.asPath, { itemsPerPage: ITEMS_PER_PAGE })

  return (
    <ErrorBoundary>
      {storeConfig.localization?.enabled && <LocalizationConfigUpdater />}
      <Head> {!process.env.DISABLE_3P_SCRIPTS && <ThirdPartyScripts />}</Head>
      <DefaultSeo {...SEO} />

      <AnalyticsHandler />

      <UIProvider>
        <DeliveryPromiseProvider>
          <Layout>
            <Component {...pageProps} key={pageProps?.key} />
          </Layout>
        </DeliveryPromiseProvider>
      </UIProvider>
    </ErrorBoundary>
  )
}

export default App
