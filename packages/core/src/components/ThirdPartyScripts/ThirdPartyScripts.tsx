import { Partytown } from '@builder.io/partytown/react'
import OverrideComponents from 'src/customizations/src/GlobalOverrides'
import storeConfig from '../../../faststore.config'
import GoogleTagManager, { GTM_DEBUG_QUERY_STRING } from './GoogleTagManager'
import VTEX from './vtex'

const gtmContainerId = storeConfig.analytics?.gtmContainerId

const includeGTM = typeof gtmContainerId === 'string'
const includeVTEX = storeConfig.platform === 'vtex'

if (process.env.NODE_ENV === 'development' && !includeGTM) {
  console.warn(
    'No GTM container id found. Check the analytics section on your faststore.config.js file for enhanced observability of your store.'
  )
}

function ThirdPartyScripts() {
  const forwards = []
  if (includeVTEX) forwards.push('sendrc', 'vtexaf')

  return (
    <>
      {/* We're setting the partytown config (forward property) dynamicly based on the gtm_debug query string
       * This helps users see the GTM events properly when using GTM preview. All it does is NOT forward dataLayer.push
       * calls to partytown when the gtm_debug query string is present.
       *
       * This is not done in the component because the window var is not available yet.
       */}
      <script
        dangerouslySetInnerHTML={{
          __html: `var partytown={forward:[...${JSON.stringify(
            forwards
          )},!window.location.search.includes('${GTM_DEBUG_QUERY_STRING}=')&&${includeGTM}?'dataLayer.push':null].filter(Boolean)}`,
        }}
      />
      {includeGTM && <GoogleTagManager containerId={gtmContainerId} />}
      {includeVTEX && <VTEX />}
      <OverrideComponents.ThirdPartyScripts />
      <Partytown key="partytown" />
    </>
  )
}

export default ThirdPartyScripts
