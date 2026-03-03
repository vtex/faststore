import { Head, Html, Main, NextScript } from 'next/document'
import storeConfig from '../../discovery.config'

import { GTM_DEBUG_QUERY_STRING } from 'src/components/ThirdPartyScripts/GoogleTagManager'
import { WebFonts } from 'src/customizations/src/GlobalOverrides'

function Document() {
  const direction = storeConfig.direction || 'ltr'
  const gtmContainerId = storeConfig.analytics?.gtmContainerId
  const includeGTM = typeof gtmContainerId === 'string'
  const includeVTEX = storeConfig.platform === 'vtex'
  const enableScriptsLogs = storeConfig.experimental?.enableScriptsLogs === true
  const forwards = []
  if (includeVTEX) forwards.push('sendrc')

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
        {/* Partytown config must be set before loading the library.
         * We're setting the partytown config (forward property) dynamically based on the gtm_debug query string
         * This helps users see the GTM events properly when using GTM preview. All it does is NOT forward dataLayer.push
         * calls to partytown when the gtm_debug query string is present.
         *
         * This is not done in the component because the window var is not available yet.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `var partytown={
              debug:${enableScriptsLogs},
              logCalls:${enableScriptsLogs},
              forward:[...${JSON.stringify(
                forwards
              )},!window.location.search.includes('${GTM_DEBUG_QUERY_STRING}=')&&${includeGTM}?'dataLayer.push':null].filter(Boolean)
            }`,
          }}
        />
        {/* Only load Partytown when not in an iframe to prevent cross-origin errors.
         * https://github.com/vtex/faststore/pull/3155
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.self === window.top) {
                var partytownScript = document.createElement('script');
                partytownScript.async = true;
                partytownScript.src = '/~partytown/partytown.js';
                document.head.appendChild(partytownScript);
              }
            `,
          }}
        />
      </Head>
      <body className="theme">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
