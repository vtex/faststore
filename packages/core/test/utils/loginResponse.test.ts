import { describe, expect, it } from 'vitest'

import { isLoginResponse } from '../../src/utils/loginResponse'

describe('isLoginResponse', () => {
  it('returns false for null', () => {
    expect(isLoginResponse(null)).toBe(false)
  })

  it('returns false for an array', () => {
    expect(isLoginResponse([])).toBe(false)
  })

  it('returns false for a string', () => {
    expect(isLoginResponse('ok')).toBe(false)
  })

  it('returns false for a number', () => {
    expect(isLoginResponse(42)).toBe(false)
  })

  it('returns false for an empty object', () => {
    expect(isLoginResponse({})).toBe(false)
  })

  it('returns true for a valid success payload', () => {
    expect(isLoginResponse({ success: true, redirectUrl: '/home' })).toBe(true)
  })

  it('returns true for a valid error payload', () => {
    expect(isLoginResponse({ success: false, error: 'Invalid password' })).toBe(
      true
    )
  })

  it('returns false when success is not a boolean', () => {
    expect(isLoginResponse({ success: 'yes' })).toBe(false)
  })

  it('returns false when redirectUrl is not a string', () => {
    expect(isLoginResponse({ redirectUrl: 123 })).toBe(false)
  })

  it('returns false when error is not a string', () => {
    expect(isLoginResponse({ error: true })).toBe(false)
  })

  it('returns false when all fields are undefined', () => {
    expect(
      isLoginResponse({
        success: undefined,
        redirectUrl: undefined,
        error: undefined,
      })
    ).toBe(false)
  })
})
