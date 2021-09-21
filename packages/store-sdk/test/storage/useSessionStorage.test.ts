import { renderHook } from '@testing-library/react-hooks'

import { useSessionStorage } from '../../src'

test('useSessionStorage: Hydrate with initial value', async () => {
  const hook = renderHook(() => useSessionStorage('k', { a: 1 }))

  expect(hook.result.current[0].a).toBe(1)
})

test('useSessionStorage: Read value from sessionStorage', async () => {
  const key = 'k'
  const storedValue = { a: 4 }
  const initialValue = { a: 2 }

  sessionStorage.setItem(key, JSON.stringify(storedValue))

  const run = renderHook(() => useSessionStorage(key, initialValue))

  expect(run.result.current[0]).toEqual(storedValue)
})
