import { set } from 'idb-keyval'
import { expect, test } from 'vitest'
import { waitFor } from '../waitFor'

import { type Reconcile, createBaseStore, persisted } from '../../src'

const getStore = <T>(initial: T, key: string, reconcile?: Reconcile<T>) =>
  persisted<T>(key, reconcile)(createBaseStore(initial))

const key = 'k'
const storedValue = { a: 1 }
const initialValue = { a: 2 }

test('Persisted Store: Hydrate with initial value', () => {
  const store = getStore(initialValue, key)

  expect(store.read()).toEqual(initialValue)
})

test('Persisted Store: Read value from localStorage after hydration', async () => {
  set(key, storedValue)

  const store = getStore(initialValue, key)

  await waitFor(() => expect(store.read()).toEqual(storedValue))
})

type Doc = { a: string; b: string }

// Forces `a` to come from an external source of truth (e.g. URL-derived
// locale) while preserving the rest of the persisted payload.
const forceA: Reconcile<Doc> = (fromIDB) => ({ ...fromIDB, a: 'url' })

test('Persisted Store: reconcile is applied on hydration', async () => {
  const hydrateKey = 'reconcile-hydrate'
  set(hydrateKey, { a: 'stale', b: 'keep' })

  const store = getStore<Doc>({ a: 'init', b: 'init' }, hydrateKey, forceA)

  await waitFor(() => expect(store.read()).toEqual({ a: 'url', b: 'keep' }))
})

test('Persisted Store: reconcile is applied on focus sync from IDB', async () => {
  const focusKey = 'reconcile-focus'
  set(focusKey, { a: 'url', b: 'first' })

  const store = getStore<Doc>({ a: 'init', b: 'init' }, focusKey, forceA)
  await waitFor(() => expect(store.read()).toEqual({ a: 'url', b: 'first' }))

  // Another tab wrote a stale `a` to IDB.
  set(focusKey, { a: 'stale', b: 'second' })
  window.dispatchEvent(new Event('focus'))

  // The stale `a` must be reconciled back to the external source of truth,
  // while the cross-tab `b` update is preserved.
  await waitFor(() => expect(store.read()).toEqual({ a: 'url', b: 'second' }))
})

test('Persisted Store: reconcile is applied on visibilitychange sync from IDB', async () => {
  const visKey = 'reconcile-visibility'
  set(visKey, { a: 'url', b: 'first' })

  const store = getStore<Doc>({ a: 'init', b: 'init' }, visKey, forceA)
  await waitFor(() => expect(store.read()).toEqual({ a: 'url', b: 'first' }))

  set(visKey, { a: 'stale', b: 'second' })
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => 'visible',
  })
  document.dispatchEvent(new Event('visibilitychange'))

  await waitFor(() => expect(store.read()).toEqual({ a: 'url', b: 'second' }))
})

test('Persisted Store: without reconcile, focus sync writes the raw IDB payload', async () => {
  const rawKey = 'reconcile-none'
  set(rawKey, { a: 'one', b: 'one' })

  const store = getStore<Doc>({ a: 'init', b: 'init' }, rawKey)
  await waitFor(() => expect(store.read()).toEqual({ a: 'one', b: 'one' }))

  set(rawKey, { a: 'two', b: 'two' })
  window.dispatchEvent(new Event('focus'))

  await waitFor(() => expect(store.read()).toEqual({ a: 'two', b: 'two' }))
})
