import type { Session } from '@faststore/sdk'
import { afterEach, describe, expect, it, vi } from 'vitest'

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
  afterEach(() => {
    mockRequest.mockReset()
  })

  it('does not send the UI state persisted with the session', async () => {
    mockRequest.mockResolvedValue({ validateSession: null })

    await validateSession({
      ...session,
      isValidating: false,
      isSessionReady: true,
      hasValidated: true,
    } as Session)

    // The store also validates its initial session on load, possibly after
    // this call, so pick the request by the postal code under test
    const sent = mockRequest.mock.calls
      .map(([, variables]) => variables.session)
      .filter((sentSession) => sentSession.postalCode === session.postalCode)

    expect(sent).toHaveLength(1)
    expect(sent[0]).toStrictEqual(session)
  })
})
