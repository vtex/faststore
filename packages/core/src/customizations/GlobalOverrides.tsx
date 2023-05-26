import WebFontsOverrides from 'src/customizations/components/overrides/WebFonts'
import { default as CoreWebFonts } from 'src/fonts/WebFonts'

const Components = {
  WebFonts: CoreWebFonts,
  ...WebFontsOverrides.components,
}

export const WebFonts = Components.WebFonts

export default Components
