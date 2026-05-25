/**
 * Tests for the localization race-condition fix.
 *
 * The `optimistic` middleware enqueues `onValidate(value)` as a microtask
 * (capturing a `cancel` flag in closure). When the persisted middleware
 * hydrates the store from IDB with a stale locale, the corrector subscriber
 * (installed after `optimistic`) detects the mismatch and re-enters
 * `store.set(corrected)`. The base store cancels in-flight optimistic handlers
 * via `cancelations.forEach(cancel)` BEFORE the stale handler ever runs,
 * preventing the stale `validateSession` from hitting the network.
 *
 * We deliberately skip `persisted` here and simulate IDB hydration by calling
 * `store.set(stale)` directly: persisted's only effect for this test is to
 * trigger that same set() asynchronously, which would only add timing noise.
 */
import type { Session } from '@faststore/sdk'
import { compose, createBaseStore, optimistic } from '@faststore/sdk'
import { describe, expect, it, vi } from 'vitest'

import { installLocaleCorrector } from '../../../src/sdk/session/initialSession'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const URL_AWARE: Session = {
  locale: 'pt-BR',
  currency: { code: 'BRL', symbol: 'R$' },
  channel: '{"salesChannel":"1","regionId":"region-abc"}',
  country: 'BRA',
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

const STALE: Session = {
  ...URL_AWARE,
  locale: 'en-US',
  currency: { code: 'USD', symbol: '$' },
  channel: '{"salesChannel":"2","regionId":"region-xyz"}',
}

/**
 * NOTE on `onValidate` returning `null`:
 * The `optimistic` middleware re-enters `store.set(validated)` whenever
 * `onValidate` returns a non-null value, which would cause an infinite loop in
 * tests (see `packages/sdk/test/store/optimistic.test.ts` for the same
 * pattern). Returning `null` short-circuits that re-entry while still letting
 * us inspect the arguments the handler was called with.
 */
function makeStore(initial: Session) {
  const onValidate = vi.fn(async (_: Session): Promise<Session | null> => null)
  const store = compose([optimistic(onValidate)], createBaseStore(initial))
  return { store, onValidate }
}

describe('installLocaleCorrector', () => {
  it('cancels stale validation and emits only one with the corrected locale on IDB hydration with stale data', async () => {
    const { store, onValidate } = makeStore(URL_AWARE)
    installLocaleCorrector(store, URL_AWARE)

    // Simulates `persisted.hydrateFromIDB` resolving with a stale payload.
    store.set(STALE)
    await sleep(50)

    expect(onValidate).toHaveBeenCalledTimes(1)
    expect(onValidate.mock.calls[0][0].locale).toBe('pt-BR')
    expect(onValidate.mock.calls[0][0].currency).toEqual({
      code: 'BRL',
      symbol: 'R$',
    })

    // Local store state should also reflect the corrected locale.
    expect(store.read().locale).toBe('pt-BR')
  })

  it('preserves unrelated session fields from the hydrated payload (e.g. person)', async () => {
    const { store } = makeStore(URL_AWARE)
    installLocaleCorrector(store, URL_AWARE)

    const stalePayload: Session = {
      ...STALE,
      person: {
        id: 'p1',
        email: 'a@b.com',
        givenName: 'A',
        familyName: 'B',
      },
    }
    store.set(stalePayload)
    await sleep(50)

    const corrected = store.read()
    expect(corrected.locale).toBe('pt-BR')
    expect(corrected.person).toEqual({
      id: 'p1',
      email: 'a@b.com',
      givenName: 'A',
      familyName: 'B',
    })
  })

  it('replaces salesChannel inside channel JSON while preserving non-locale channel fields from the hydrated payload', async () => {
    const { store } = makeStore(URL_AWARE)
    installLocaleCorrector(store, URL_AWARE)

    const stalePayload: Session = {
      ...STALE,
      channel:
        '{"salesChannel":"2","regionId":"region-xyz","customKey":"keep-me"}',
    }
    store.set(stalePayload)
    await sleep(50)

    const channel = JSON.parse(store.read().channel ?? '{}')
    expect(channel.salesChannel).toBe('1')
    expect(channel.regionId).toBe('region-xyz')
    expect(channel.customKey).toBe('keep-me')
  })

  it('does not trigger an extra correction when IDB hydrates with a matching locale', async () => {
    const { store, onValidate } = makeStore(URL_AWARE)
    installLocaleCorrector(store, URL_AWARE)

    // Simulates IDB hydration with the SAME locale as the URL-aware default.
    store.set(URL_AWARE)
    await sleep(50)

    expect(onValidate).toHaveBeenCalledTimes(1)
    expect(onValidate.mock.calls[0][0].locale).toBe('pt-BR')
    expect(store.read().locale).toBe('pt-BR')
  })

  it('only fires once: subsequent user-driven locale changes are NOT intercepted', async () => {
    const { store, onValidate } = makeStore(URL_AWARE)
    installLocaleCorrector(store, URL_AWARE)

    // First hydration triggers the corrector.
    store.set(STALE)
    await sleep(50)
    expect(store.read().locale).toBe('pt-BR')
    onValidate.mockClear()

    // Now simulate a user changing locale via LocalizationSelector.
    store.set(STALE)
    await sleep(50)

    // The corrector must NOT undo this user-driven change.
    expect(store.read().locale).toBe('en-US')
    expect(onValidate).toHaveBeenCalledTimes(1)
    expect(onValidate.mock.calls[0][0].locale).toBe('en-US')
  })

  it('returns an unsubscribe function that prevents future corrections', async () => {
    const { store, onValidate } = makeStore(URL_AWARE)
    const unsubscribe = installLocaleCorrector(store, URL_AWARE)
    unsubscribe()

    store.set(STALE)
    await sleep(50)

    // Without the corrector active, the stale value stays in the store.
    expect(store.read().locale).toBe('en-US')
    expect(onValidate).toHaveBeenCalledTimes(1)
    expect(onValidate.mock.calls[0][0].locale).toBe('en-US')
  })
})
