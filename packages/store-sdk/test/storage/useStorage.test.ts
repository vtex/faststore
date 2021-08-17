import { renderHook } from '@testing-library/react-hooks'
import { set } from 'idb-keyval'

import { useStorage } from '../../src'

test('useStorage: Hydrate with initial value', async () => {
  const hook = renderHook(() => useStorage('k', { a: 1 }))

  expect(hook.result.current[0].a).toBe(1)
})

test('useStorage: Read value from localStorage after hydration', async () => {
  const key = 'k'
  const storedValue = { a: 1 }
  const initialValue = { a: 2 }

  set(key, storedValue)

  const run = renderHook(() => useStorage(key, initialValue))

  await run.waitForValueToChange(() => run.result.current[0].a)

  expect(run.result.current[0]).toEqual(storedValue)
})
