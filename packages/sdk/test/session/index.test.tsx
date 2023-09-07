import { set } from 'idb-keyval'

import { createSessionStore } from '../../src'
import { waitFor } from '../waitFor'

const initialSession = {
  currency: {
    code: 'USD',
    symbol: '$',
  },
  country: 'USA',
  locale: 'en-US',
  channel: 'test-channel',
  deliveryMode: null,
  addressType: null,
  postalCode: null,
  geoCoordinates: null,
  person: null,
}

test('Session Provider: Set initial session values', async () => {
  const store = createSessionStore(initialSession)

  expect(store.read()).toEqual(initialSession)
})

test('Session Provider: Hydrate values from storage', async () => {
  const stored = { ...initialSession, channel: 'fake-channel' }

  set('fs::session', stored)

  // Renders once with a custom initial state
  const store = createSessionStore(initialSession)

  await waitFor(() => expect(store.read()).toEqual(stored))
})
