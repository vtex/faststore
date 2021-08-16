import { renderHook } from '@testing-library/react-hooks'

import { SessionProvider, useSession } from '../../src'

test('Session Provider: Set initial session values', async () => {
  const { result } = renderHook(useSession, {
    wrapper: SessionProvider,
    initialProps: { initialState: { channel: 'test-channel' } },
  })

  expect(result.current.channel).toBe('test-channel')
})

test('Session Provider: Hydrate values from localstorage', async () => {
  // Renders once with a custom initial state
  const initialState = { channel: 'test-channel' }
  const { result: r1 } = renderHook(useSession, {
    wrapper: SessionProvider,
    initialProps: { initialState },
  })

  expect(r1.current.channel).toBe(initialState.channel)

  // Renders again. Now we should have stored the past session
  // on localstorage and we should be able to hydrate from it
  const { result: r2 } = renderHook(useSession, {
    wrapper: SessionProvider,
  })

  expect(r2.current.channel).toBe(initialState.channel)
})

test('Session Provider: Different namespaces', async () => {
  const { result: r1 } = renderHook(useSession, {
    wrapper: SessionProvider,
    initialProps: { namespace: 'n1 ' },
  })

  const { result: r2 } = renderHook(useSession, {
    wrapper: SessionProvider,
    initialProps: { namespace: 'n2 ', initialState: { channel: '1' } },
  })

  expect(r1.current.channel).toBeNull()
  expect(r2.current.channel).toBe('1')

  const { result: r3 } = renderHook(useSession, {
    wrapper: SessionProvider,
    initialProps: { namespace: 'n2 ' },
  })

  expect(r3.current.channel).toBe('1')
})
