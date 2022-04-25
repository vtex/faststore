import { Head, Html, Main, NextScript } from 'next/document'

import ThirdPartyScripts from 'src/components/ThirdPartyScripts'

function Document() {
  return (
    <Html>
      <Head>
        <ThirdPartyScripts />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
