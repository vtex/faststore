import { afterEach, describe, expect, it, vi } from 'vitest'

import { toRevalidate } from 'src/utils/toRevalidate'

const KEY = 'experimental.revalidatePLP'

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

    toRevalidate('300', KEY)
    toRevalidate(Number.NaN, KEY)
    toRevalidate({ seconds: 300 }, KEY)

    expect(warn).toHaveBeenNthCalledWith(1, expect.stringContaining('"300"'))
    expect(warn).toHaveBeenNthCalledWith(2, expect.stringContaining(': NaN.'))
    expect(warn).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('{"seconds":300}')
    )
  })
})
