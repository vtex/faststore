import { afterEach, describe, expect, it, vi } from 'vitest'

const mockDel = vi.hoisted(() => vi.fn())

vi.mock('idb-keyval', () => ({ del: mockDel }))

import { clearPersistedSessionState } from '../../../src/sdk/account/clearPersistedSessionState'

describe('clearPersistedSessionState (node)', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('clears IndexedDB session when sessionStorage is unavailable', async () => {
    mockDel.mockResolvedValue(undefined)

    await expect(clearPersistedSessionState()).resolves.toBeUndefined()
    expect(mockDel).toHaveBeenCalledWith('fs::session')
  })
})
