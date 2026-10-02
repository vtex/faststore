import type { Session } from '@faststore/sdk'
import { describe, expect, it } from 'vitest'

import { toSessionInput } from '../../../src/sdk/session/toSessionInput'

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

describe('toSessionInput', () => {
  it('drops the UI state useSession() adds, which IStoreSession rejects', () => {
    expect(
      toSessionInput({
        ...session,
        isValidating: false,
        isSessionReady: true,
        hasValidated: true,
      })
    ).toEqual(session)
  })

  it('heals a session persisted with the UI state', () => {
    const persisted = { ...session, hasValidated: true } as Session

    expect(toSessionInput(persisted)).not.toHaveProperty('hasValidated')
  })

  it('keeps a clean session as is', () => {
    expect(toSessionInput(session)).toEqual(session)
  })
})
