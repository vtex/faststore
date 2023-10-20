import WebFontsOverrides from 'src/customizations/src/components/overrides/WebFonts'
import { default as CoreWebFonts } from 'src/fonts/WebFonts'
import ThirdPartyScriptsOverrides from 'src/customizations/src/components/overrides/ThirdPartyScripts'

const Components = {
  WebFonts: CoreWebFonts,
  ...WebFontsOverrides.components,
  ...ThirdPartyScriptsOverrides.components,
}

export const WebFonts = Components.WebFonts

export default Components
