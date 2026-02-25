/**
 * @jest-environment jsdom
 */

jest.mock('src/sdk/sessionAuthState', () => ({
  getSessionPersonId: jest.fn(),
  setCacheBustingSource: jest.fn(),
}))

import {
  getClientCacheBustingValue,
  STORAGE_KEY_PERSON_ID,
  STORAGE_KEY_CACHE_BUST_LAST_VALUE,
} from '../../src/utils/cookieCacheBusting'
import { getSessionPersonId } from '../../src/sdk/sessionAuthState'

const setSessionPerson = (personId: string) => {
  ;(getSessionPersonId as jest.Mock).mockReturnValue(personId)
}

const clearSessionPerson = () => {
  ;(getSessionPersonId as jest.Mock).mockReturnValue(null)
}

describe('cookieCacheBusting', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    sessionStorage.clear()
    clearSessionPerson()
  })

  it('should clear storage and return null when user is not logged in (no person?.id)', () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    const result = getClientCacheBustingValue()

    expect(result).toBeNull()
    expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_KEY_PERSON_ID)
    expect(removeItemSpy).toHaveBeenCalledWith(
      STORAGE_KEY_CACHE_BUST_LAST_VALUE
    )
  })

  it('should return a new timestamp and persist values when auth state changed (login)', () => {
    setSessionPerson('user-id-1')

    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1700000000000)
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000000')
    expect(nowSpy).toHaveBeenCalled()
    expect(setItemSpy).toHaveBeenCalledWith(STORAGE_KEY_PERSON_ID, 'user-id-1')
    expect(setItemSpy).toHaveBeenCalledWith(
      STORAGE_KEY_CACHE_BUST_LAST_VALUE,
      '1700000000000'
    )
  })

  it('should return last cached value when auth state is the same and last value exists', () => {
    setSessionPerson('user-id-1')
    sessionStorage.setItem(STORAGE_KEY_PERSON_ID, 'user-id-1')
    sessionStorage.setItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE, 'prev')

    const nowSpy = jest.spyOn(Date, 'now')
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const result = getClientCacheBustingValue()

    expect(result).toBe('prev')
    expect(nowSpy).not.toHaveBeenCalled()
    expect(setItemSpy).not.toHaveBeenCalled()
  })

  it('should create and persist a new last value when auth state is the same but last value is missing', () => {
    setSessionPerson('user-id-1')
    sessionStorage.setItem(STORAGE_KEY_PERSON_ID, 'user-id-1')

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
      STORAGE_KEY_PERSON_ID,
      'user-id-1'
    )
  })

  it('should detect user change and return new timestamp', () => {
    setSessionPerson('user-id-1')
    sessionStorage.setItem(STORAGE_KEY_PERSON_ID, 'user-id-1')
    sessionStorage.setItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE, 'prev')

    // Simulate user switch (e.g. re-login with different account)
    setSessionPerson('user-id-2')

    jest.spyOn(Date, 'now').mockReturnValue(1700000000456)

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000456')
    expect(sessionStorage.getItem(STORAGE_KEY_PERSON_ID)).toBe('user-id-2')
    expect(sessionStorage.getItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)).toBe(
      '1700000000456'
    )
  })
})
