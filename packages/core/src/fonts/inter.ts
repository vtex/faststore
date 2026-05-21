import { Inter } from 'next/font/google'

/**
 * Inter font loaded via next/font/google for automatic self-hosting.
 * This eliminates the render-blocking external request to fonts.googleapis.com
 * and fonts.gstatic.com, improving FCP by ~660ms on mobile.
 *
 * All subsets supported by Inter are included so FastStore works correctly
 * across all languages and regions. The browser only downloads the .woff2
 * files for subsets it actually encounters in the page content.
 *
 * The font is applied via CSS variable --font-inter on <body> in _document.tsx.
 * Stores that previously loaded Inter via a <link> tag in WebFonts.tsx should
 * remove that link and rely on this module instead.
 */
export const inter = Inter({
  subsets: [
    'latin',
    'latin-ext',
    'cyrillic',
    'cyrillic-ext',
    'greek',
    'greek-ext',
    'vietnamese',
  ],
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap',
  variable: '--font-inter',
})
