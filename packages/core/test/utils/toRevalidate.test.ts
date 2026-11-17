import { describe, expect, it } from 'vitest'

import { toRevalidate } from 'src/utils/toRevalidate'

describe('toRevalidate', () => {
  it('returns the number of seconds when it is positive', () => {
    expect(toRevalidate(300)).toBe(300)
    expect(toRevalidate(1)).toBe(1)
  })

  it('returns false when the window is disabled or unset', () => {
    expect(toRevalidate(false)).toBe(false)
    expect(toRevalidate(undefined)).toBe(false)
    expect(toRevalidate(null)).toBe(false)
  })

  it('returns false for values Next.js would reject', () => {
    expect(toRevalidate(0)).toBe(false)
    expect(toRevalidate(-60)).toBe(false)
    expect(toRevalidate(Number.NaN)).toBe(false)
    expect(toRevalidate(Number.POSITIVE_INFINITY)).toBe(false)
    expect(toRevalidate('300')).toBe(false)
    expect(toRevalidate(true)).toBe(false)
  })
})
