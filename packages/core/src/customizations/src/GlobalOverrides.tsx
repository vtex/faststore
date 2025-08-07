import WebFontsOverrides from './components/overrides/WebFonts'
import { default as CoreWebFonts } from '../../fonts/WebFonts'
import ThirdPartyScriptsOverrides from './components/overrides/ThirdPartyScripts'
import ThirdPartyScriptsPluginsOverrides from '../../plugins/overrides/ThirdPartyScripts'
import WebFontsOverridesPlugins from '../../plugins/overrides/WebFonts'

const Components = {
  WebFonts: CoreWebFonts,

  ...ThirdPartyScriptsPluginsOverrides.components,
  ...WebFontsOverridesPlugins.components,

  ...WebFontsOverrides.components,
  ...ThirdPartyScriptsOverrides.components,
}

export const WebFonts = Components.WebFonts

export default Components
