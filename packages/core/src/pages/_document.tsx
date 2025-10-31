import { Head, Html, Main, NextScript } from 'next/document'
import storeConfig from '../../discovery.config'

import { WebFonts } from 'src/customizations/src/GlobalOverrides'
import { getTextDirection } from 'src/utils/rtl'

function Document() {
  // Determine text direction based on locale or config
  const locale = storeConfig.session?.locale || 'en-US'
  const rtlConfig = storeConfig.session?.rtl
  // Use explicit config if set to 'rtl' or 'ltr', otherwise auto-detect from locale
  const textDirection =
    rtlConfig === 'rtl' || rtlConfig === 'ltr'
      ? rtlConfig
      : getTextDirection(locale)

  return (
    <Html dir={textDirection}>
      <Head>
        <link
          rel="preconnect"
          href={`https://${storeConfig.api.storeId}.vtexassets.com`}
        />
        <link
          rel="dns-prefetch"
          href={`https://${storeConfig.api.storeId}.vtexassets.com`}
        />
        <meta name="storefront" content="fast_store" />
        <WebFonts />
      </Head>
      <body className="theme">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
