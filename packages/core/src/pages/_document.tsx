import { Head, Html, Main, NextScript } from 'next/document'

import WebFonts from 'src/fonts/WebFonts'
import ThirdPartyScripts from 'src/components/ThirdPartyScripts'

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
