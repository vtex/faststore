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
  STORAGE_KEY_PERSON_ID,
  STORAGE_KEY_CACHE_BUST_LAST_VALUE,
} from '../../src/utils/cookieCacheBusting'

const setSessionPerson = (personId: string) => {
  const session = { person: { id: personId } }
  mockRead.mockReturnValue(session)
  mockReadInitial.mockReturnValue(session)
}

const clearSessionPerson = () => {
  mockRead.mockReturnValue(null)
  mockReadInitial.mockReturnValue(null)
}

describe('cookieCacheBusting', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
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

  it('should return a new timestamp and persist values when auth state changed (login)', () => {
    setSessionPerson('user-id-1')

    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1700000000000)

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000000::user-id-1')
    expect(nowSpy).toHaveBeenCalled()
    // Verify values were persisted
    expect(sessionStorage.getItem(STORAGE_KEY_AUTH_COOKIE_VALUE)).toBe(
      'token-1'
    )
    expect(sessionStorage.getItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)).toBe(
      '1700000000000'
    )
  })

  it('should return last cached value when auth state is the same and last value exists', () => {
    setSessionPerson('user-id-1')
    sessionStorage.setItem(STORAGE_KEY_PERSON_ID, 'user-id-1')
    sessionStorage.setItem(
      STORAGE_KEY_CACHE_BUST_LAST_VALUE,
      '1700000000000::user-id-1'
    )

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

  it('should create and persist a new last value when auth state is the same but last value is missing', () => {
    setSessionPerson('user-id-1')
    sessionStorage.setItem(STORAGE_KEY_PERSON_ID, 'user-id-1')

    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1700000000123)

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000123::user-id-1')
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

  it('should detect user change and return new timestamp', () => {
    setSessionPerson('user-id-1')
    sessionStorage.setItem(STORAGE_KEY_PERSON_ID, 'user-id-1')
    sessionStorage.setItem(
      STORAGE_KEY_CACHE_BUST_LAST_VALUE,
      '1700000000000::user-id-1'
    )

    vi.spyOn(Date, 'now').mockReturnValue(1700000000456)

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000456::user-id-2')
    expect(sessionStorage.getItem(STORAGE_KEY_PERSON_ID)).toBe('user-id-2')
    expect(sessionStorage.getItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)).toBe(
      '1700000000456::user-id-2'
    )
  })
})
