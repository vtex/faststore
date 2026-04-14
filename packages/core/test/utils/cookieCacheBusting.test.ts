/**
 * @jest-environment jsdom
 */

const mockRead = jest.fn()
const mockReadInitial = jest.fn()

jest.mock('src/sdk/session', () => ({
  sessionStore: {
    read: () => mockRead(),
    readInitial: () => mockReadInitial(),
  },
}))

import {
  getClientCacheBustingValue,
  STORAGE_KEY_PERSON_ID,
  STORAGE_KEY_POSTAL_CODE,
  STORAGE_KEY_CACHE_BUST_LAST_VALUE,
} from '../../src/utils/cookieCacheBusting'

const setSession = (opts: {
  personId?: string
  postalCode?: string | null
}) => {
  const session: Record<string, unknown> = {}
  if (opts.personId) {
    session.person = { id: opts.personId }
  }
  if (opts.postalCode !== undefined && opts.postalCode !== null) {
    session.postalCode = opts.postalCode
  }
  mockRead.mockReturnValue(session)
  mockReadInitial.mockReturnValue(session)
}

const setSessionPerson = (personId: string) => {
  setSession({ personId })
}

const clearSessionPerson = () => {
  mockRead.mockReturnValue(null)
  mockReadInitial.mockReturnValue(null)
}

describe('cookieCacheBusting', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    sessionStorage.clear()
    clearSessionPerson()
  })

  it('should clear storage and return null when there is no person?.id and no postalCode', () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    const result = getClientCacheBustingValue()

    expect(result).toBeNull()
    expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_KEY_PERSON_ID)
    expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_KEY_POSTAL_CODE)
    expect(removeItemSpy).toHaveBeenCalledWith(
      STORAGE_KEY_CACHE_BUST_LAST_VALUE
    )
  })

  it('should return a cache bust value when there is postalCode but no logged-in person', () => {
    setSession({ postalCode: '01310-100' })

    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1700000000999)

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000999::::01310-100')
    expect(sessionStorage.getItem(STORAGE_KEY_POSTAL_CODE)).toBe('01310-100')
    expect(nowSpy).toHaveBeenCalled()
  })

  it('should return a new timestamp and persist values when auth state changed (login)', () => {
    setSessionPerson('user-id-1')

    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1700000000000)
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000000::user-id-1::')
    expect(nowSpy).toHaveBeenCalled()
    expect(setItemSpy).toHaveBeenCalledWith(STORAGE_KEY_PERSON_ID, 'user-id-1')
    expect(setItemSpy).toHaveBeenCalledWith(
      STORAGE_KEY_CACHE_BUST_LAST_VALUE,
      '1700000000000::user-id-1::'
    )
  })

  it('should return last cached value when auth state is the same and last value exists', () => {
    setSessionPerson('user-id-1')
    sessionStorage.setItem(STORAGE_KEY_PERSON_ID, 'user-id-1')
    sessionStorage.setItem(
      STORAGE_KEY_CACHE_BUST_LAST_VALUE,
      '1700000000000::user-id-1::'
    )

    const nowSpy = jest.spyOn(Date, 'now')
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000000::user-id-1::')
    expect(nowSpy).not.toHaveBeenCalled()
    expect(setItemSpy).not.toHaveBeenCalled()
  })

  it('should create and persist a new last value when auth state is the same but last value is missing', () => {
    setSessionPerson('user-id-1')
    sessionStorage.setItem(STORAGE_KEY_PERSON_ID, 'user-id-1')

    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1700000000123)
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000123::user-id-1::')
    expect(nowSpy).toHaveBeenCalled()
    expect(setItemSpy).toHaveBeenCalledWith(
      STORAGE_KEY_CACHE_BUST_LAST_VALUE,
      '1700000000123::user-id-1::'
    )
    expect(setItemSpy).not.toHaveBeenCalledWith(
      STORAGE_KEY_PERSON_ID,
      'user-id-1'
    )
  })

  it('should detect user change and return new timestamp', () => {
    setSessionPerson('user-id-1')
    sessionStorage.setItem(STORAGE_KEY_PERSON_ID, 'user-id-1')
    sessionStorage.setItem(
      STORAGE_KEY_CACHE_BUST_LAST_VALUE,
      '1700000000000::user-id-1::'
    )

    // Simulate user switch (e.g. re-login with different account)
    setSessionPerson('user-id-2')

    jest.spyOn(Date, 'now').mockReturnValue(1700000000456)

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000456::user-id-2::')
    expect(sessionStorage.getItem(STORAGE_KEY_PERSON_ID)).toBe('user-id-2')
    expect(sessionStorage.getItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)).toBe(
      '1700000000456::user-id-2::'
    )
  })

  it('should return new timestamp when postalCode changes for the same user', () => {
    setSession({ personId: 'user-id-1', postalCode: '01310-100' })
    sessionStorage.setItem(STORAGE_KEY_PERSON_ID, 'user-id-1')
    sessionStorage.setItem(STORAGE_KEY_POSTAL_CODE, '01310-100')
    sessionStorage.setItem(
      STORAGE_KEY_CACHE_BUST_LAST_VALUE,
      '1700000000000::user-id-1::01310-100'
    )

    setSession({ personId: 'user-id-1', postalCode: '04000-000' })

    jest.spyOn(Date, 'now').mockReturnValue(1700000000888)

    const result = getClientCacheBustingValue()

    expect(result).toBe('1700000000888::user-id-1::04000-000')
    expect(sessionStorage.getItem(STORAGE_KEY_POSTAL_CODE)).toBe('04000-000')
  })
})
