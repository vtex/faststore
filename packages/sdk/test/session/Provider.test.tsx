import { renderHook } from '@testing-library/react-hooks'
import { set } from 'idb-keyval'

import { createSessionStore, useStore } from '../../src'

const initialSession = {
  currency: {
    code: 'USD',
    symbol: '$',
  },
  country: 'USA',
  locale: 'en-US',
  channel: 'test-channel',
  postalCode: null,
  person: null,
}

test('Session Provider: Set initial session values', async () => {
  const store = createSessionStore(initialSession)

  const { result } = renderHook(useStore, {
    initialProps: store,
  })

  expect(result.current.channel).toBe(initialSession.channel)
})

test('Session Provider: Hydrate values from storage', async () => {
  const stored = { ...initialSession, channel: 'fake-channel' }

  set('fs::session', stored)

  // Renders once with a custom initial state
  const store = createSessionStore(initialSession)

  // We should have stored the past session on storage and we should be able to hydrate from it
  const run = renderHook(useStore, {
    initialProps: store,
  })

  await run.waitFor(() =>
    expect(run.result.current.channel).toBe('fake-channel')
  )
})
