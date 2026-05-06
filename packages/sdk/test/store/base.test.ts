import { expect, test, vi } from 'vitest'
import { createBaseStore } from '../../src'

test('Store: Returns initial value', () => {
  const store = createBaseStore(1)

  expect(store.read()).toEqual(1)
})

test('Store: Broadcasts after set', async () => {
  const store = createBaseStore(1)
  const mocked = vi.fn()

  store.subscribe(mocked)
  store.set(2)

  expect(mocked).toBeCalledTimes(1)
  expect(store.read()).toEqual(2)
})

test('Store: Returns initial value after set', async () => {
  const store = createBaseStore(1)
  const mocked = vi.fn()

  store.subscribe(mocked)
  store.set(2)

  expect(mocked).toBeCalledTimes(1)
  expect(store.read()).toEqual(2)
  expect(store.readInitial()).toEqual(1)
})
