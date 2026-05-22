import { Inter } from 'next/font/google'

/**
 * Inter font loaded via next/font/google for automatic self-hosting.
 * This eliminates the render-blocking external request to fonts.googleapis.com
 * and fonts.gstatic.com when `experimental.optimizedFonts` is enabled in
 * discovery.config.
 *
 * Only `latin` and `latin-ext` subsets are bundled by default. Stores that
 * need additional scripts (cyrillic, greek, vietnamese, etc) should override
 * this module via customizations/src/fonts/inter.ts.
 *
 * The font is applied via CSS variable --font-inter on <body> in _document.tsx,
 * but only when the experimental flag is on.
 */
export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap',
  variable: '--font-inter',
})
