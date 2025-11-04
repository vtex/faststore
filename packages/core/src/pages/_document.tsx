import { Head, Html, Main, NextScript } from 'next/document'
import storeConfig from '../../discovery.config'

import { WebFonts } from 'src/customizations/src/GlobalOverrides'

function Document() {
  const direction = storeConfig.direction || 'ltr'

  return (
    <Html dir={direction}>
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
