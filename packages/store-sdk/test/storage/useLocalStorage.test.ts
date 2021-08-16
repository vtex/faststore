import { renderHook } from '@testing-library/react-hooks'

import { useLocalStorage } from '../../src'

test('useLocalStorage: Hydrate with initial value', async () => {
  const hook = renderHook(() => useLocalStorage('k', { a: 1 }))

  expect(hook.result.current[0].a).toBe(1)
})

test('useLocalStorage: Read value from localStorage after hydration', async () => {
  const key = 'k'
  const storedValue = { a: 1 }
  const initialValue = { a: 2 }

  localStorage.setItem(key, JSON.stringify(storedValue))

  const hook = renderHook(() => useLocalStorage(key, initialValue))

  expect(hook.result.current[0]).toEqual(storedValue)
})
