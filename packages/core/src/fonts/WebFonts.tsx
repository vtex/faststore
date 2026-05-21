/**
 * WebFonts is kept for store-level overrides via customizations/src/fonts/WebFonts.tsx.
 * The Inter font is now self-hosted via next/font/google (see src/fonts/inter.ts),
 * which eliminates the render-blocking request to fonts.googleapis.com.
 * Stores should NOT add a <link rel="stylesheet"> to Google Fonts here.
 */
function WebFonts() {
  return null
}

export default WebFonts
