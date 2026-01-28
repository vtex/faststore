/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('discovery.config', () => ({
  __esModule: true,
  default: {
    api: {
      storeId: 'store',
    },
  },
}))

import {
  getClientCacheBustingValue,
  STORAGE_KEY_AUTH_COOKIE_VALUE,
  STORAGE_KEY_CACHE_BUST_LAST_VALUE,
} from '../../src/utils/cookieCacheBusting'

const setAuthCookie = (value: string) => {
  document.cookie = `VtexIdclientAutCookie_store=${value}; path=/`
}

const clearAllCookies = () => {
  const cookies = document.cookie
    .split(';')
    .map((c) => c.trim())
    .filter(Boolean)

  for (const cookie of cookies) {
    const [name] = cookie.split('=')
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  }
}

describe('cookieCacheBusting', () => {
  beforeEach(() => {
    clearAllCookies()
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('should clear storage and return null when auth cookie is missing', () => {
    // Set some initial values in storage
    sessionStorage.setItem(STORAGE_KEY_AUTH_COOKIE_VALUE, 'some-value')
    sessionStorage.setItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE, 'some-timestamp')

    const result = getClientCacheBustingValue()

    expect(result).toBeNull()
    // Verify storage was cleared
    expect(sessionStorage.getItem(STORAGE_KEY_AUTH_COOKIE_VALUE)).toBeNull()
    expect(sessionStorage.getItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)).toBeNull()
  })

  it('should return a new timestamp and persist values when auth cookie changed', () => {
    setAuthCookie('token-1')

    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1700000000000)

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000000')
    expect(nowSpy).toHaveBeenCalled()
    // Verify values were persisted
    expect(sessionStorage.getItem(STORAGE_KEY_AUTH_COOKIE_VALUE)).toBe(
      'token-1'
    )
    expect(sessionStorage.getItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)).toBe(
      '1700000000000'
    )
  })

  it('should return last cached value when auth cookie is the same and last value exists', () => {
    setAuthCookie('token-1')
    sessionStorage.setItem(STORAGE_KEY_AUTH_COOKIE_VALUE, 'token-1')
    sessionStorage.setItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE, 'prev')

    const result = getClientCacheBustingValue()

    // Should return the cached value without generating a new timestamp
    expect(result).toBe('prev')
    // Verify storage values remained unchanged
    expect(sessionStorage.getItem(STORAGE_KEY_AUTH_COOKIE_VALUE)).toBe(
      'token-1'
    )
    expect(sessionStorage.getItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)).toBe(
      'prev'
    )
  })

  it('should create and persist a new last value when auth cookie is the same but last value is missing', () => {
    setAuthCookie('token-1')
    sessionStorage.setItem(STORAGE_KEY_AUTH_COOKIE_VALUE, 'token-1')

    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1700000000123)

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000123')
    expect(nowSpy).toHaveBeenCalled()
    // Verify new last value was persisted
    expect(sessionStorage.getItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)).toBe(
      '1700000000123'
    )
    // Verify auth cookie value wasn't updated (it was already correct)
    expect(sessionStorage.getItem(STORAGE_KEY_AUTH_COOKIE_VALUE)).toBe(
      'token-1'
    )
  })

  it('should keep "=" characters in cookie value', () => {
    setAuthCookie('a=b=c')

    vi.spyOn(Date, 'now').mockReturnValue(1700000000456)

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000456')
    expect(sessionStorage.getItem(STORAGE_KEY_AUTH_COOKIE_VALUE)).toBe('a=b=c')
  })
})
