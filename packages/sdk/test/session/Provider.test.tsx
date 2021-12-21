import { renderHook, act } from '@testing-library/react-hooks'
import { set } from 'idb-keyval'

import { SessionProvider, useSession } from '../../src'

test('Session Provider: Set initial session values', async () => {
  const { result } = renderHook(useSession, {
    wrapper: SessionProvider,
    initialProps: { initialState: { channel: 'test-channel' } },
  })

  expect(result.current.channel).toBe('test-channel')
})

test('Session Provider: Hydrate values from storage', async () => {
  // Renders once with a custom initial state
  const storedState = { channel: 'test-channel' }

  await set('main::store::session', storedState)

  // We should have stored the past session on storage and we should be able to hydrate from it
  const run = renderHook(useSession, {
    wrapper: SessionProvider,
  })

  await run.waitForValueToChange(() => run.result.current.channel)

  expect(run.result.current.channel).toBe(storedState.channel)
})

test('Session Provider: sets Region successfully', async () => {
  const { result } = renderHook(useSession, {
    wrapper: SessionProvider,
  })

  act(() => result.current.setSession({ ...result.current, region: 'abc123' }))

  expect(result.current.region).toBe('abc123')
})
