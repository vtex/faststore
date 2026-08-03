/**
 * When localization is disabled, `reconcileSessionLocale` must be a no-op so
 * the persisted middleware behaves exactly as before (raw IDB payload flows
 * into memory untouched).
 */
import type { Session } from '@faststore/sdk'
import { describe, expect, it, vi } from 'vitest'

vi.mock(import('../../../discovery.config.js'), async (original) => ({
  default: {
    ...((await original()).default ?? (await original())),
    localization: undefined,
  },
}))

import { reconcileSessionLocale } from '../../../src/sdk/session/initialSession'

const PAYLOAD: Session = {
  locale: 'en-US',
  currency: { code: 'USD', symbol: '$' },
  channel: '{"salesChannel":"2","regionId":"region-xyz"}',
  country: 'USA',
  deliveryMode: null,
  addressType: null,
  city: null,
  postalCode: null,
  geoCoordinates: null,
  b2b: null,
  person: null,
  marketingData: null,
  refreshAfter: null,
}

describe('reconcileSessionLocale (localization disabled)', () => {
  it('returns the payload unchanged', () => {
    expect(reconcileSessionLocale(PAYLOAD)).toBe(PAYLOAD)
  })
})
