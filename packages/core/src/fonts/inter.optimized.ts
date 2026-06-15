// Real Inter font self-hosting via @fontsource/inter.
//
// This module lives inside src/ on purpose. Next.js only extracts global CSS
// (including the @font-face rules shipped by @fontsource/inter) when the
// importing module stays in the global-CSS chain reachable from _app.tsx within
// src/. When experimental.optimizedFonts is true, next.config.js redirects the
// empty src/fonts/inter stub to this file via NormalModuleReplacementPlugin
// (webpack) / resolveAlias (Turbopack), keeping it in that chain so both the
// @font-face declarations and the .woff2 assets are emitted.
//
// Each weight CSS file from @fontsource/inter ships @font-face declarations
// for every supported subset (latin, latin-ext, cyrillic, greek, vietnamese)
// gated by unicode-range, so browsers only download the .woff2 files they
// actually need for the characters on the page.
//
// Because these are plain CSS imports (not next/font), they work with both
// Babel and SWC and never trigger the next/font/google compiler requirement.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/900.css'
