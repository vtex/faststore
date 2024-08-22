import { Head, Html, Main, NextScript } from 'next/document'
import storeConfig from '../../faststore.config'

import ThirdPartyScripts from 'src/components/ThirdPartyScripts'
import { WebFonts } from 'src/customizations/src/GlobalOverrides'

function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="preconnect"
          href={`https://${storeConfig.api.storeId}.vtexassets.com`}
        />
        <link
          rel="dns-prefetch"
          href={`https://${storeConfig.api.storeId}.vtexassets.com`}
        />
        {!process.env.DISABLE_3P_SCRIPTS && <ThirdPartyScripts />}
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
