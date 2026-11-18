import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { toRevalidate as ToRevalidate } from 'src/utils/toRevalidate'

const KEY = 'experimental.revalidatePLP'

// The helper warns once per key per process, so each test loads a fresh
// module to start with no warnings recorded.
let toRevalidate: typeof ToRevalidate

beforeEach(async () => {
  vi.resetModules()
  ;({ toRevalidate } = await import('src/utils/toRevalidate'))
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('toRevalidate', () => {
  it('returns the number of seconds when it is a positive integer', () => {
    expect(toRevalidate(300, KEY)).toBe(300)
    expect(toRevalidate(1, KEY)).toBe(1)
  })

  it('returns false without a warning when the window is disabled or unset', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(toRevalidate(false, KEY)).toBe(false)
    expect(toRevalidate(undefined, KEY)).toBe(false)
    expect(toRevalidate(null, KEY)).toBe(false)
    expect(warn).not.toHaveBeenCalled()
  })

  it.each([
    // Next.js throws for these.
    0,
    -60,
    90.5,
    0.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    '300',
    // Next.js reads `true` as 1 second; the config expects explicit seconds.
    true,
  ])('returns false and warns for %s', (value) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(toRevalidate(value, KEY)).toBe(false)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(KEY))
  })

  it('prints the received value in the warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    toRevalidate('300', 'a')
    toRevalidate(Number.NaN, 'b')
    toRevalidate({ seconds: 300 }, 'c')

    expect(warn).toHaveBeenNthCalledWith(1, expect.stringContaining('"300"'))
    expect(warn).toHaveBeenNthCalledWith(2, expect.stringContaining(': NaN.'))
    expect(warn).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('a value of type object')
    )
  })

  it('does not throw for values JSON.stringify rejects', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    const circular: Record<string, unknown> = {}
    circular.self = circular

    expect(toRevalidate(circular, 'a')).toBe(false)
    expect(toRevalidate({ seconds: BigInt(300) }, 'b')).toBe(false)
    expect(toRevalidate(BigInt(300), 'c')).toBe(false)
  })

  it('warns about an invalid value once per key', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    toRevalidate('300', KEY)
    toRevalidate('300', KEY)

    expect(warn).toHaveBeenCalledTimes(1)
  })

  describe('with a minimum', () => {
    it('raises a lower window to the minimum and warns once', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      expect(toRevalidate(30, KEY, { min: 60 })).toBe(60)
      expect(toRevalidate(30, KEY, { min: 60 })).toBe(60)
      expect(toRevalidate(1, KEY, { min: 60 })).toBe(60)
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(
        `[FastStore] ${KEY} is 30s. Using the minimum of 60s.`
      )
    })

    it('keeps windows at or above the minimum', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      expect(toRevalidate(60, KEY, { min: 60 })).toBe(60)
      expect(toRevalidate(120, KEY, { min: 60 })).toBe(120)
      expect(warn).not.toHaveBeenCalled()
    })

    it('still returns false for invalid values', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})

      expect(toRevalidate(0, KEY, { min: 60 })).toBe(false)
      expect(toRevalidate(30.5, 'a', { min: 60 })).toBe(false)
      expect(toRevalidate('30', 'b', { min: 60 })).toBe(false)
      expect(toRevalidate(false, 'c', { min: 60 })).toBe(false)
    })
  })
})
