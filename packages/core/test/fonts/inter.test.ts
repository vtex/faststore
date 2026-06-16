import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)

// Weights that next.config.js appends to main.scss as
// `@import '@fontsource/inter/<weight>.css'` when experimental.optimizedFonts
// is enabled. This test guards the dependency contract that injection relies on:
// if @fontsource/inter ever stops shipping one of these stylesheets, the
// optimizedFonts build would fail to resolve the @import, so we want to catch it
// here rather than in a downstream store build.
const INTER_WEIGHTS = [400, 500, 600, 700, 900]

describe('optimizedFonts: @fontsource/inter weight stylesheets', () => {
  it.each(INTER_WEIGHTS)(
    'resolves the %s weight stylesheet injected into main.scss',
    (weight) => {
      expect(() =>
        require.resolve(`@fontsource/inter/${weight}.css`)
      ).not.toThrow()
    }
  )
})
