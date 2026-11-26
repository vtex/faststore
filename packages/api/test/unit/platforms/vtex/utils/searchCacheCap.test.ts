import { describe, expect, it } from 'vitest'

import type { CacheControl } from '../../../../../src/directives/cacheControl'
import { applySearchCacheCap } from '../../../../../src/platforms/vtex/utils/searchCacheCap'

const now = Date.parse('2026-11-26T15:00:00.000Z')

const at = (seconds: number) => new Date(now + seconds * 1000).toISOString()

const hint = (overrides: Partial<CacheControl> = {}): CacheControl => ({
  sMaxAge: 300,
  staleWhileRevalidate: 3600,
  scope: 'public',
  ...overrides,
})

const item = (
  priceValidUntil: string,
  priceState?: unknown,
  includePriceState = true
) => ({
  sellers: [
    {
      commertialOffer: {
        PriceValidUntil: priceValidUntil,
        ...(includePriceState ? { priceState } : {}),
      },
    },
  ],
})

const apply = (
  items: Parameters<typeof applySearchCacheCap>[1],
  cacheControl: CacheControl = hint()
) => {
  const ctx = { cacheControl }
  applySearchCacheCap(ctx, items, now)
  return ctx.cacheControl
}

describe('applySearchCacheCap', () => {
  it('keeps 300 and 3600 when no offer has a priceState object', () => {
    const cacheControl = apply([item(at(120), undefined, false)])

    expect(cacheControl).toEqual(hint())
  })

  it('keeps the hint when priceState is null', () => {
    expect(apply([item(at(120), null)])).toEqual(hint())
  })

  it('keeps the hint when priceState is an array', () => {
    expect(apply([item(at(120), [{ available: true }])])).toEqual(hint())
  })

  it('keeps the hint when priceState is a primitive', () => {
    expect(apply([item(at(120), true), item(at(60), 'available')])).toEqual(
      hint()
    )
  })

  it('lowers both numbers for an empty object with a date under 300 seconds', () => {
    expect(apply([item(at(120), {})])).toEqual(
      hint({ sMaxAge: 120, staleWhileRevalidate: 120 })
    )
  })

  it('lowers the hint when the source object looks like the BFF default', () => {
    expect(
      apply([item(at(120), { available: true, reasonKey: null })])
    ).toEqual(hint({ sMaxAge: 120, staleWhileRevalidate: 120 }))
  })

  it('does not write when the only date is unparseable', () => {
    expect(apply([item('not-a-date', {})])).toEqual(hint())
  })

  it('ignores an unparseable date and uses the valid one beside it', () => {
    expect(
      apply([item('not-a-date', {}), item(at(120), { available: false })])
    ).toEqual(hint({ sMaxAge: 120, staleWhileRevalidate: 120 }))
  })

  it('keeps both ceilings when the date is more than 3600 seconds away', () => {
    expect(apply([item(at(7200), {})])).toEqual(hint())
  })

  it('caps sMaxAge at 300 and staleWhileRevalidate at the seconds between the ceilings', () => {
    expect(apply([item(at(1000), {})])).toEqual(
      hint({ sMaxAge: 300, staleWhileRevalidate: 1000 })
    )
  })

  it('uses the earliest parseable date among offers that carry the object', () => {
    const cacheControl = apply([
      {
        sellers: [
          {
            commertialOffer: {
              PriceValidUntil: at(200),
              priceState: {},
            },
          },
          {
            commertialOffer: {
              PriceValidUntil: at(120),
              priceState: { available: true },
            },
          },
        ],
      },
    ])

    expect(cacheControl).toEqual(
      hint({ sMaxAge: 120, staleWhileRevalidate: 120 })
    )
  })

  it('writes 0 and 0 when a past date is earlier than a future date', () => {
    expect(apply([item(at(-30), {}), item(at(500), {})])).toEqual(
      hint({ sMaxAge: 0, staleWhileRevalidate: 0 })
    )
  })

  it('writes 0 and 0 when less than one second remains', () => {
    const priceValidUntil = new Date(now + 999).toISOString()

    expect(apply([item(priceValidUntil, {})])).toEqual(
      hint({ sMaxAge: 0, staleWhileRevalidate: 0 })
    )
  })

  it('does not raise a hint that is already below the cap', () => {
    const cacheControl = hint({
      sMaxAge: 40,
      staleWhileRevalidate: 90,
      scope: 'private',
    })

    applySearchCacheCap({ cacheControl }, [item(at(120), {})], now)

    expect(cacheControl).toEqual({
      sMaxAge: 40,
      staleWhileRevalidate: 90,
      scope: 'private',
    })
  })

  it('leaves scope unchanged when it lowers the numbers', () => {
    expect(apply([item(at(120), {})], hint({ scope: 'private' })).scope).toBe(
      'private'
    )
  })

  it('does not invent a cache number that was not already stored', () => {
    const ctx: { cacheControl?: CacheControl } = {
      cacheControl: { sMaxAge: 300, scope: 'public' },
    }

    applySearchCacheCap(ctx, [item(at(120), {})], now)

    expect(ctx.cacheControl).toEqual({ sMaxAge: 120, scope: 'public' })
  })

  it('ignores a nearer date on an offer without the object', () => {
    expect(apply([item(at(-30), undefined, false), item(at(120), {})])).toEqual(
      hint({ sMaxAge: 120, staleWhileRevalidate: 120 })
    )
  })

  it('does not create cacheControl when the context has none', () => {
    const ctx: { cacheControl?: CacheControl } = {}

    applySearchCacheCap(
      ctx,
      [item(at(120), { available: true, reasonKey: null })],
      now
    )

    expect(ctx).toEqual({})
  })

  it('returns without throwing when the items list is missing or empty', () => {
    const missing = hint()
    const empty = hint()

    expect(() =>
      applySearchCacheCap({ cacheControl: missing }, undefined, now)
    ).not.toThrow()
    expect(() =>
      applySearchCacheCap({ cacheControl: empty }, [], now)
    ).not.toThrow()
    expect(missing).toEqual(hint())
    expect(empty).toEqual(hint())
  })
})
