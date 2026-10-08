import type { Session } from '@faststore/sdk'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockRequest = vi.hoisted(() => vi.fn())

vi.mock('../../../src/sdk/graphql/request', () => ({
  request: mockRequest,
}))

import { validateSession } from '../../../src/sdk/session'

const session: Session = {
  locale: 'en-US',
  currency: { code: 'USD', symbol: '$' },
  country: 'USA',
  channel: '{"salesChannel":"1","regionId":""}',
  deliveryMode: null,
  addressType: null,
  city: null,
  postalCode: '10001',
  geoCoordinates: null,
  person: null,
  b2b: null,
  marketingData: null,
  refreshAfter: null,
}

describe('validateSession', () => {
  beforeEach(async () => {
    mockRequest.mockResolvedValue({ validateSession: null })
    // The store validates its initial session on load; let it settle first
    await vi.waitFor(() => expect(mockRequest).toHaveBeenCalled())
    mockRequest.mockClear()
  })

  it('does not send the UI state persisted with the session', async () => {
    await validateSession({
      ...session,
      isValidating: false,
      isSessionReady: true,
      hasValidated: true,
    } as Session)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest.mock.calls[0][1].session).toStrictEqual(session)
  })
})
