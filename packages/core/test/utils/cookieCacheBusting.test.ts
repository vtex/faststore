/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockRead = vi.fn()
const mockReadInitial = vi.fn()

vi.mock('discovery.config', () => ({
  __esModule: true,
  default: {
    api: {
      storeId: 'store',
    },
    deliveryPromise: { enabled: true },
  },
}))

vi.mock('src/sdk/session', () => ({
  sessionStore: {
    read: (...args: unknown[]) => mockRead(...args),
    readInitial: (...args: unknown[]) => mockReadInitial(...args),
  },
}))

jest.mock('discovery.config', () => ({
  deliveryPromise: { enabled: true },
}))

import {
  getClientCacheBustingValue,
  STORAGE_KEY_CACHE_BUST_LAST_VALUE,
  STORAGE_KEY_PERSON_ID,
  STORAGE_KEY_POSTAL_CODE,
} from '../../src/utils/cookieCacheBusting'

const setSession = ({
  personId = null,
  postalCode = null,
}: {
  personId?: string | null
  postalCode?: string | null
}) => {
  const session = {
    person: personId ? { id: personId } : null,
    postalCode,
  }
  mockRead.mockReturnValue(session)
  mockReadInitial.mockReturnValue(session)
}

const clearSession = () => {
  mockRead.mockReturnValue(null)
  mockReadInitial.mockReturnValue(null)
}

describe('cookieCacheBusting', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
    clearSession()
  })

  describe('returns null (shared public CDN cache)', () => {
    it('should clear storage and return null when neither person nor postalCode is set', () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')

      const result = getClientCacheBustingValue()

      expect(result).toBeNull()
      expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_KEY_PERSON_ID)
      expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_KEY_POSTAL_CODE)
      expect(removeItemSpy).toHaveBeenCalledWith(
        STORAGE_KEY_CACHE_BUST_LAST_VALUE
      )
    })
  })

  describe('auth state (person.id)', () => {
    it('should return a new timestamp value and persist when person logs in', () => {
      setSession({ personId: 'user-id-1' })

      const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1700000000000)
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

      const result = getClientCacheBustingValue()

      expect(result).toBe('1700000000000::user-id-1')
      expect(nowSpy).toHaveBeenCalled()
      expect(setItemSpy).toHaveBeenCalledWith(
        STORAGE_KEY_PERSON_ID,
        'user-id-1'
      )
      expect(setItemSpy).toHaveBeenCalledWith(
        STORAGE_KEY_CACHE_BUST_LAST_VALUE,
        '1700000000000::user-id-1'
      )
    })

    it('should return last cached value when auth state is the same', () => {
      setSession({ personId: 'user-id-1' })
      sessionStorage.setItem(STORAGE_KEY_PERSON_ID, 'user-id-1')
      sessionStorage.setItem(
        STORAGE_KEY_CACHE_BUST_LAST_VALUE,
        '1700000000000::user-id-1'
      )

      const nowSpy = vi.spyOn(Date, 'now')
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

      const result = getClientCacheBustingValue()

      expect(result).toBe('1700000000000::user-id-1')
      expect(nowSpy).not.toHaveBeenCalled()
      expect(setItemSpy).not.toHaveBeenCalled()
    })

    it('should create and persist a new value when auth state is the same but last value is missing', () => {
      setSession({ personId: 'user-id-1' })
      sessionStorage.setItem(STORAGE_KEY_PERSON_ID, 'user-id-1')

      const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1700000000123)
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

      const result = getClientCacheBustingValue()

      expect(result).toBe('1700000000123::user-id-1')
      expect(nowSpy).toHaveBeenCalled()
      expect(setItemSpy).toHaveBeenCalledWith(
        STORAGE_KEY_CACHE_BUST_LAST_VALUE,
        '1700000000123::user-id-1'
      )
      expect(setItemSpy).not.toHaveBeenCalledWith(
        STORAGE_KEY_PERSON_ID,
        'user-id-1'
      )
    })

    it('should detect user change and return a new timestamp', () => {
      setSession({ personId: 'user-id-2' })
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

  describe('postalCode (delivery promise / regional facets)', () => {
    it('should return a value for anonymous users who have a postalCode set', () => {
      setSession({ postalCode: '24230220' })

      vi.spyOn(Date, 'now').mockReturnValue(1700000001000)

      const result = getClientCacheBustingValue()

      expect(result).toBe('1700000001000::24230220')
    })

    it('should return last cached value when postalCode is the same', () => {
      setSession({ postalCode: '24230220' })
      sessionStorage.setItem(STORAGE_KEY_POSTAL_CODE, '24230220')
      sessionStorage.setItem(
        STORAGE_KEY_CACHE_BUST_LAST_VALUE,
        '1700000001000::24230220'
      )

      const nowSpy = vi.spyOn(Date, 'now')

      const result = getClientCacheBustingValue()

      expect(result).toBe('1700000001000::24230220')
      expect(nowSpy).not.toHaveBeenCalled()
    })

    it('should return a new value when postalCode changes', () => {
      setSession({ postalCode: '24230220' })
      sessionStorage.setItem(STORAGE_KEY_POSTAL_CODE, '50030260')
      sessionStorage.setItem(
        STORAGE_KEY_CACHE_BUST_LAST_VALUE,
        '1700000001000::50030260'
      )

      vi.spyOn(Date, 'now').mockReturnValue(1700000002000)

      const result = getClientCacheBustingValue()

      expect(result).toBe('1700000002000::24230220')
      expect(sessionStorage.getItem(STORAGE_KEY_POSTAL_CODE)).toBe('24230220')
      expect(sessionStorage.getItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)).toBe(
        '1700000002000::24230220'
      )
    })

    it('should combine personId and postalCode for logged-in users', () => {
      setSession({ personId: 'user-id-1', postalCode: '24230220' })

      vi.spyOn(Date, 'now').mockReturnValue(1700000003000)

      const result = getClientCacheBustingValue()

      expect(result).toBe('1700000003000::user-id-1::24230220')
    })

    it('should generate a new value when postalCode changes for a logged-in user', () => {
      setSession({ personId: 'user-id-1', postalCode: '24230220' })
      sessionStorage.setItem(STORAGE_KEY_PERSON_ID, 'user-id-1')
      sessionStorage.setItem(STORAGE_KEY_POSTAL_CODE, '50030260')
      sessionStorage.setItem(
        STORAGE_KEY_CACHE_BUST_LAST_VALUE,
        '1700000003000::user-id-1::50030260'
      )

      vi.spyOn(Date, 'now').mockReturnValue(1700000004000)

      const result = getClientCacheBustingValue()

      expect(result).toBe('1700000004000::user-id-1::24230220')
    })
  })
})
