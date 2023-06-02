import { Head, Html, Main, NextScript } from 'next/document'

import ThirdPartyScripts from 'src/components/ThirdPartyScripts'
import { WebFonts } from 'src/customizations/GlobalOverrides'

function Document() {
  return (
    <Html>
      <Head>
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
