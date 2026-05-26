import { describe, expect, it, vi } from 'vitest'

vi.mock('@fontsource/inter/400.css', () => ({}))
vi.mock('@fontsource/inter/500.css', () => ({}))
vi.mock('@fontsource/inter/600.css', () => ({}))
vi.mock('@fontsource/inter/700.css', () => ({}))
vi.mock('@fontsource/inter/900.css', () => ({}))

describe('src/fonts/inter.ts (default Babel-safe stub)', () => {
  it('is an empty side-effect-free module so no CSS is bundled when optimizedFonts is off', async () => {
    const mod = await import('src/fonts/inter')
    expect(Object.keys(mod)).toEqual([])
  })
})

describe('fonts/inter.ts (real, loaded only when optimizedFonts: true)', () => {
  it('imports the @fontsource/inter weight files for self-hosting', async () => {
    const mod = await import('../../fonts/inter')
    expect(Object.keys(mod)).toEqual([])
  })
})
