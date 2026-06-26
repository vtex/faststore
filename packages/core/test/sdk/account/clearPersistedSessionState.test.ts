/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockDel = vi.hoisted(() => vi.fn())

vi.mock('idb-keyval', () => ({
  del: mockDel,
}))

import { SESSION_READY_KEY } from '../../../src/sdk/session/storageKeys'
import {
  STORAGE_KEY_CACHE_BUST_LAST_VALUE,
  STORAGE_KEY_PERSON_ID,
} from '../../../src/utils/cookieCacheBusting'
import { clearPersistedSessionState } from '../../../src/sdk/account/clearPersistedSessionState'

describe('clearPersistedSessionState', () => {
  beforeEach(() => {
    mockDel.mockResolvedValue(undefined)
    sessionStorage.setItem(SESSION_READY_KEY, '1')
    sessionStorage.setItem(STORAGE_KEY_PERSON_ID, 'person-1')
    sessionStorage.setItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE, 'abc')
  })

  afterEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('clears IndexedDB session and sessionStorage keys', async () => {
    await clearPersistedSessionState()

    expect(mockDel).toHaveBeenCalledWith('fs::session')
    expect(sessionStorage.getItem(SESSION_READY_KEY)).toBeNull()
    expect(sessionStorage.getItem(STORAGE_KEY_PERSON_ID)).toBeNull()
    expect(sessionStorage.getItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)).toBeNull()
  })
})
