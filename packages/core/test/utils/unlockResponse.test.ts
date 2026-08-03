import { describe, expect, it } from 'vitest'

import { isUnlockResponse } from '../../src/utils/unlockResponse'

describe('isUnlockResponse', () => {
  it('returns false for null', () => {
    expect(isUnlockResponse(null)).toBe(false)
  })

  it('returns false for an array', () => {
    expect(isUnlockResponse([])).toBe(false)
  })

  it('returns false for a string', () => {
    expect(isUnlockResponse('ok')).toBe(false)
  })

  it('returns false for a number', () => {
    expect(isUnlockResponse(42)).toBe(false)
  })

  it('returns false for an empty object', () => {
    expect(isUnlockResponse({})).toBe(false)
  })

  it('returns true for a valid success payload', () => {
    expect(isUnlockResponse({ success: true, redirectUrl: '/home' })).toBe(true)
  })

  it('returns true for a valid error payload', () => {
    expect(
      isUnlockResponse({ success: false, error: 'Invalid password' })
    ).toBe(true)
  })

  it('returns false when success is not a boolean', () => {
    expect(isUnlockResponse({ success: 'yes' })).toBe(false)
  })

  it('returns false when redirectUrl is not a string', () => {
    expect(isUnlockResponse({ redirectUrl: 123 })).toBe(false)
  })

  it('returns false when error is not a string', () => {
    expect(isUnlockResponse({ error: true })).toBe(false)
  })

  it('returns false when all fields are undefined', () => {
    expect(
      isUnlockResponse({
        success: undefined,
        redirectUrl: undefined,
        error: undefined,
      })
    ).toBe(false)
  })
})
