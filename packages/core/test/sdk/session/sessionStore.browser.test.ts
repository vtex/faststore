import type { Session } from '@faststore/sdk'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockRequest = vi.hoisted(() => vi.fn())

vi.mock('../../../src/sdk/graphql/request', () => ({
  request: mockRequest,
}))

import { sessionStore } from '../../../src/sdk/session'

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

const withUIState = {
  isValidating: false,
  isSessionReady: true,
  hasValidated: true,
}

describe('sessionStore', () => {
  beforeEach(async () => {
    mockRequest.mockResolvedValue({ validateSession: null })
    // The store validates its initial session on load; let it settle first
    await vi.waitFor(() => expect(mockRequest).toHaveBeenCalled())
    mockRequest.mockClear()
  })

  it('does not store the UI state from useSession()', () => {
    sessionStore.set({ ...session, ...withUIState } as Session)

    expect(sessionStore.read()).toStrictEqual(session)
  })

  it('does not store the UI state on a silent update', () => {
    sessionStore.setSilent({
      ...session,
      postalCode: '10002',
      ...withUIState,
    } as Session)

    expect(sessionStore.read()).toStrictEqual({
      ...session,
      postalCode: '10002',
    })
  })
})
