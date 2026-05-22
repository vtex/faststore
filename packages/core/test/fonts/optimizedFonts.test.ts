import { describe, expect, it, vi } from 'vitest'

describe('discovery config default: optimizedFonts', () => {
  it('defaults to false so existing stores are unaffected', async () => {
    vi.resetModules()
    vi.unmock('discovery.config')

    const config = await import('discovery.config')
    const storeConfig = config.default ?? config

    expect(storeConfig.experimental?.optimizedFonts).toBe(false)
  })
})
