import WebFontsOverrides from 'src/customizations/src/components/overrides/WebFonts'
import { default as CoreWebFonts } from 'src/fonts/WebFonts'
import ThirdPartyScriptsOverrides from 'src/customizations/src/components/overrides/ThirdPartyScripts'
import ThirdPartyScriptsPluginsOverrides from 'src/plugins/overrides/ThirdPartyScripts'
import WebFontsOverridesPlugins from 'src/plugins/overrides/WebFonts'

const Components = {
  WebFonts: CoreWebFonts,

  ...ThirdPartyScriptsPluginsOverrides.components,
  ...WebFontsOverridesPlugins.components,

  ...WebFontsOverrides.components,
  ...ThirdPartyScriptsOverrides.components,
}

export const WebFonts = Components.WebFonts

export default Components
