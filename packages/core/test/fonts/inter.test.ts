import { describe, expect, it, vi } from 'vitest'

const mockInter = vi.fn()

vi.mock('next/font/google', () => ({
  Inter: (options: Record<string, unknown>) => {
    mockInter(options)
    return {
      className: 'inter-class',
      variable: '--font-inter',
      style: { fontFamily: 'Inter' },
    }
  },
}))

describe('inter.ts (default stub — Babel-safe)', () => {
  it('exports null so builds with Babel never load next/font/google', async () => {
    const { inter } = await import('src/fonts/inter')
    expect(inter).toBeNull()
  })
})

describe('inter.optimized.ts (SWC-only, loaded when optimizedFonts: true)', () => {
  it('exports an inter font object with the expected variable', async () => {
    const { inter } = await import('src/fonts/inter.optimized')

    expect(inter).toBeDefined()
    expect(inter.variable).toBe('--font-inter')
  })

  it('configures only latin and latin-ext subsets', async () => {
    await import('src/fonts/inter.optimized')

    expect(mockInter).toHaveBeenCalledWith(
      expect.objectContaining({
        subsets: ['latin', 'latin-ext'],
      })
    )
  })

  it('configures display: swap for performance', async () => {
    await import('src/fonts/inter.optimized')

    expect(mockInter).toHaveBeenCalledWith(
      expect.objectContaining({
        display: 'swap',
      })
    )
  })
})
