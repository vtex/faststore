/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockRead, mockSet, mockValidateSession } = vi.hoisted(() => ({
  mockRead: vi.fn(),
  mockSet: vi.fn(),
  mockValidateSession: vi.fn(),
}))

vi.mock('src/sdk/session', async () => ({
  sessionStore: { read: mockRead, set: mockSet },
  validateSession: mockValidateSession,
  toSessionInput: (await import('src/sdk/session/toSessionInput'))
    .toSessionInput,
}))
vi.mock('discovery.config', () => ({ deliveryPromise: { enabled: false } }))
vi.mock('src/sdk/product', () => ({ getProductCount: vi.fn() }))

import useRegion from '../../../src/components/region/RegionModal/useRegion'

// What `useSession()` hands to region components: `filterChannel` already
// stripped the session-only keys.
const filteredSession = {
  locale: 'en-US',
  currency: { code: 'USD', symbol: '$' },
  country: 'USA',
  channel: JSON.stringify({ salesChannel: '4', regionId: '' }),
  postalCode: null,
} as any

const storedChannel = JSON.stringify({
  salesChannel: '4',
  regionId: '',
  hasOnlyDefaultSalesChannel: false,
  rejectedSalesChannel: '6',
})

describe('useRegion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRead.mockReturnValue({ ...filteredSession, channel: storedChannel })
    mockValidateSession.mockImplementation(async (session) => session)
  })

  it('validates the new postal code with the stored channel, keeping session-only keys', async () => {
    const { result } = renderHook(() => useRegion())

    await act(() =>
      result.current.setRegion({
        session: filteredSession,
        postalCode: '10001',
        errorMessage: 'error',
      })
    )

    expect(mockValidateSession).toHaveBeenCalledWith(
      expect.objectContaining({ channel: storedChannel, postalCode: '10001' })
    )
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({ channel: storedChannel })
    )
  })
})
