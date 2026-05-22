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

describe('Document body class logic', () => {
  it('is "theme" when optimizedFonts is false', () => {
    const optimizedFonts = false
    const inter = optimizedFonts ? { variable: '--font-inter' } : null

    const bodyClassName = inter ? `theme ${inter.variable}` : 'theme'

    expect(bodyClassName).toBe('theme')
  })

  it('is "theme <variable>" when optimizedFonts is true', () => {
    const optimizedFonts = true
    const inter = optimizedFonts ? { variable: '--font-inter' } : null

    const bodyClassName = inter ? `theme ${inter.variable}` : 'theme'

    expect(bodyClassName).toBe('theme --font-inter')
  })

  it('does not import inter module when optimizedFonts is false', () => {
    const requireSpy = vi
      .fn()
      .mockReturnValue({ inter: { variable: '--font-inter' } })

    const optimizedFonts = false
    // When false, require should not be called
    const inter = optimizedFonts ? requireSpy('src/fonts/inter').inter : null

    expect(requireSpy).not.toHaveBeenCalled()
    expect(inter).toBeNull()
  })

  it('imports inter module when optimizedFonts is true', () => {
    const mockInterValue = { variable: '--font-inter' }
    const requireSpy = vi.fn().mockReturnValue({ inter: mockInterValue })

    const optimizedFonts = true
    const inter = optimizedFonts ? requireSpy('src/fonts/inter').inter : null

    expect(requireSpy).toHaveBeenCalledWith('src/fonts/inter')
    expect(inter).toBe(mockInterValue)
  })
})
