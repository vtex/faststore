import storeConfig from 'discovery.config'
import OverrideComponents from 'src/customizations/src/GlobalOverrides'
import GoogleTagManager from './GoogleTagManager'
import VTEX from './vtex'

const gtmContainerId = storeConfig.analytics?.gtmContainerId

const includeGTM = typeof gtmContainerId === 'string'
const includeVTEX = storeConfig.platform === 'vtex'

if (process.env.NODE_ENV === 'development' && !includeGTM) {
  console.warn(
    'No GTM container id found. Check the analytics section on your discovery.config.js file for enhanced observability of your store.'
  )
}

function ThirdPartyScripts() {
  return (
    <>
      {includeGTM && <GoogleTagManager containerId={gtmContainerId} />}
      {includeVTEX && <VTEX />}
      <OverrideComponents.ThirdPartyScripts />
    </>
  )
}

export default ThirdPartyScripts
