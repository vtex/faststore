/**
 * @jest-environment jsdom
 */

jest.mock('discovery.config', () => ({
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
    jest.restoreAllMocks()
  })

  it('should clear storage and return null when auth cookie is missing', () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    const result = getClientCacheBustingValue()

    expect(result).toBeNull()
    expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_KEY_AUTH_COOKIE_VALUE)
    expect(removeItemSpy).toHaveBeenCalledWith(
      STORAGE_KEY_CACHE_BUST_LAST_VALUE
    )
  })

  it('should return a new timestamp and persist values when auth cookie changed', () => {
    setAuthCookie('token-1')

    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1700000000000)
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000000')
    expect(nowSpy).toHaveBeenCalled()
    expect(setItemSpy).toHaveBeenCalledWith(
      STORAGE_KEY_AUTH_COOKIE_VALUE,
      'token-1'
    )
    expect(setItemSpy).toHaveBeenCalledWith(
      STORAGE_KEY_CACHE_BUST_LAST_VALUE,
      '1700000000000'
    )
  })

  it('should return last cached value when auth cookie is the same and last value exists', () => {
    setAuthCookie('token-1')
    sessionStorage.setItem(STORAGE_KEY_AUTH_COOKIE_VALUE, 'token-1')
    sessionStorage.setItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE, 'prev')

    const nowSpy = jest.spyOn(Date, 'now')
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const result = getClientCacheBustingValue()

    expect(result).toBe('prev')
    expect(nowSpy).not.toHaveBeenCalled()
    expect(setItemSpy).not.toHaveBeenCalled()
  })

  it('should create and persist a new last value when auth cookie is the same but last value is missing', () => {
    setAuthCookie('token-1')
    sessionStorage.setItem(STORAGE_KEY_AUTH_COOKIE_VALUE, 'token-1')

    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1700000000123)
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000123')
    expect(nowSpy).toHaveBeenCalled()
    expect(setItemSpy).toHaveBeenCalledWith(
      STORAGE_KEY_CACHE_BUST_LAST_VALUE,
      '1700000000123'
    )
    expect(setItemSpy).not.toHaveBeenCalledWith(
      STORAGE_KEY_AUTH_COOKIE_VALUE,
      'token-1'
    )
  })

  it('should keep "=" characters in cookie value', () => {
    setAuthCookie('a=b=c')

    jest.spyOn(Date, 'now').mockReturnValue(1700000000456)

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000456')
    expect(sessionStorage.getItem(STORAGE_KEY_AUTH_COOKIE_VALUE)).toBe('a=b=c')
  })
})
