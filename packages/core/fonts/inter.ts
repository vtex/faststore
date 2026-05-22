// Real Inter font self-hosting via @fontsource/inter.
//
// This file lives outside src/ on purpose, so it never enters the TypeScript
// scan or the webpack module graph unless next.config.js explicitly redirects
// src/fonts/inter to here (which only happens when experimental.optimizedFonts
// is true in discovery.config).
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
