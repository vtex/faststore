import type { Session } from '@faststore/sdk'
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockValidateSession = vi.hoisted(() => vi.fn())
const mockSessionSet = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/session', () => ({
  validateSession: mockValidateSession,
  sessionStore: { set: mockSessionSet },
}))

vi.mock('src/sdk/product', () => ({
  getProductCount: vi.fn().mockResolvedValue(1),
}))

import useRegion from '../../../src/components/region/RegionModal/useRegion'

const session: Session = {
  locale: 'en-US',
  currency: { code: 'USD', symbol: '$' },
  country: 'USA',
  channel: '{"salesChannel":"1","regionId":""}',
  deliveryMode: null,
  addressType: null,
  city: null,
  postalCode: null,
  geoCoordinates: null,
  person: null,
  b2b: null,
  marketingData: null,
  refreshAfter: null,
}

describe('useRegion', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('keeps the UI state from useSession() out of the new session', async () => {
    mockValidateSession.mockResolvedValue(null)
    const { result } = renderHook(() => useRegion())

    await act(() =>
      result.current.setRegion({
        session: {
          ...session,
          isValidating: false,
          isSessionReady: true,
          hasValidated: true,
        } as Session,
        postalCode: '10001',
        errorMessage: 'error',
      })
    )

    const expected = { ...session, postalCode: '10001' }

    expect(mockValidateSession).toHaveBeenCalledWith(expected)
    expect(mockSessionSet).toHaveBeenCalledWith(expected)
  })
})
