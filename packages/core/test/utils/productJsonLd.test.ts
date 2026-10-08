import { describe, expect, it } from 'vitest'
import {
  toProductJsonLdIdentifiers,
  toProductJsonLdOffer,
  toProductJsonLdReleaseDate,
} from '../../src/utils/productJsonLd'

const OBJECT_LEVEL = { priceCurrency: 'USD', url: 'https://store.example/p' }

// Mirrors what actually reaches getStaticProps: the PDP query's Schema.org
// fields merged with the UI-only fields ProductDetailsFragment_product selects
// on the same `offers.offers` field.
const makeServerOffer = (overrides: Record<string, unknown> = {}) =>
  ({
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    price: 12.5,
    priceValidUntil: '2027-08-24T19:48:25Z',
    // UI-only fields that must never reach the markup
    listPrice: 20,
    listPriceWithTaxes: 22,
    priceWithTaxes: 13.75,
    quantity: 10000,
    priceToken: 'a-short-lived-pricing-token',
    seller: { identifier: '1' },
    ...overrides,
  }) as any

describe('toProductJsonLdOffer', () => {
  it('emits exactly the allowed Schema.org keys', () => {
    const offer = toProductJsonLdOffer(makeServerOffer(), OBJECT_LEVEL)

    expect(Object.keys(offer!).sort()).toEqual([
      'availability',
      'itemCondition',
      'price',
      'priceCurrency',
      'priceValidUntil',
      'url',
    ])
  })

  it.each([
    'listPrice',
    'listPriceWithTaxes',
    'priceWithTaxes',
    'quantity',
    'priceToken',
    'seller',
  ])('does not leak %s into the markup', (field) => {
    const offer = toProductJsonLdOffer(makeServerOffer(), OBJECT_LEVEL)

    expect(offer).not.toHaveProperty(field)
  })

  // The regression guarantee: the mapper picks by allowlist, so a field added
  // to any fragment selecting offers.offers cannot reach public markup.
  it('ignores a field a future fragment might add', () => {
    const offer = toProductJsonLdOffer(
      makeServerOffer({ someFutureInternalField: 'leaked' }),
      OBJECT_LEVEL
    )

    expect(offer).not.toHaveProperty('someFutureInternalField')
  })

  it('carries the allowed values through unchanged', () => {
    const offer = toProductJsonLdOffer(makeServerOffer(), OBJECT_LEVEL)

    expect(offer).toEqual({
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      price: 12.5,
      priceValidUntil: '2027-08-24T19:48:25Z',
      priceCurrency: 'USD',
      url: 'https://store.example/p',
    })
  })

  it.each([
    ['priceValidUntil', ''],
    ['priceValidUntil', null],
    ['availability', null],
  ])('drops %s when it resolves to %p', (field, value) => {
    const offer = toProductJsonLdOffer(
      makeServerOffer({ [field]: value }),
      OBJECT_LEVEL
    )

    expect(offer).not.toHaveProperty(field)
    expect(offer).toHaveProperty('price')
  })

  // Emptiness, not falsiness — a free item still has a price.
  it('keeps a price of 0', () => {
    const offer = toProductJsonLdOffer(
      makeServerOffer({ price: 0 }),
      OBJECT_LEVEL
    )

    expect(offer).toHaveProperty('price', 0)
  })

  it('drops an empty priceCurrency', () => {
    const offer = toProductJsonLdOffer(makeServerOffer(), {
      ...OBJECT_LEVEL,
      priceCurrency: '',
    })

    expect(offer).not.toHaveProperty('priceCurrency')
  })

  // An Offer with only a currency and a URL is invalid Schema.org, so the
  // property is omitted entirely rather than emitted priceless.
  it('returns undefined when the product has no offer', () => {
    expect(toProductJsonLdOffer(undefined, OBJECT_LEVEL)).toBeUndefined()
  })

  // StoreOffer.price resolves to null outside the search and order-form roots.
  // Dropping the key alone would leave a priceless Offer, which is exactly the
  // invalid markup the no-offer case avoids.
  it.each([
    ['null', null],
    ['an empty string', ''],
  ])('returns undefined when the price is %s', (_label, price) => {
    expect(
      toProductJsonLdOffer(makeServerOffer({ price }), OBJECT_LEVEL)
    ).toBeUndefined()
  })
})

describe('toProductJsonLdReleaseDate', () => {
  const resolve = toProductJsonLdReleaseDate

  it('converts epoch milliseconds to an ISO calendar date', () => {
    expect(resolve('1774224000000')).toBe('2026-03-23')
  })

  it('converts epoch seconds to the same date as its millisecond form', () => {
    expect(resolve('1774224000')).toBe(resolve('1774224000000'))
  })

  it('reads a value at the millisecond threshold as milliseconds', () => {
    expect(resolve('100000000000')).toBe('1973-03-03')
  })

  it('reads a value just below the threshold as seconds', () => {
    expect(resolve('99999999999')).toBe('5138-11-16')
  })

  it('accepts a numeric epoch, not only its string form', () => {
    expect(resolve(1774224000000)).toBe('2026-03-23')
  })

  it('passes an ISO date through unchanged', () => {
    expect(resolve('2026-03-23')).toBe('2026-03-23')
  })

  it('truncates an ISO datetime to its calendar date', () => {
    expect(resolve('2026-03-23T14:30:00Z')).toBe('2026-03-23')
  })

  // UTC is deliberate: preserving the source calendar day would make the
  // output depend on the offset embedded in each record.
  it('resolves an offset that crosses midnight to the UTC day', () => {
    expect(resolve('2026-03-23T21:00:00-05:00')).toBe('2026-03-24')
  })

  // `new Date(...)` reads an ISO date-time with no timezone designator as
  // host-local, so without explicit handling this value resolves to the day
  // before in any zone ahead of UTC. The build machine must not change the
  // markup.
  it('reads an ISO date-time with no timezone as UTC, not host-local', () => {
    expect(resolve('2026-03-23T00:30:00')).toBe('2026-03-23')
  })

  it('reads an end-of-day ISO date-time with no timezone as UTC', () => {
    expect(resolve('2026-03-23T23:30:00')).toBe('2026-03-23')
  })

  it.each([
    ['an empty string', ''],
    ['whitespace', '   '],
    ['an unparseable value', 'not-a-date'],
    ['null', null],
    ['undefined', undefined],
  ])('returns an empty string for %s', (_label, input) => {
    expect(resolve(input)).toBe('')
  })

  it('never returns "Invalid Date"', () => {
    expect(resolve('garbage')).not.toContain('Invalid')
  })
})

describe('toProductJsonLdIdentifiers', () => {
  it('normalizes an epoch releaseDate to an ISO calendar date', () => {
    expect(
      toProductJsonLdIdentifiers({
        gtin: '0012345678905',
        mpn: 'MPN-1',
        releaseDate: '1774224000000',
      })
    ).toEqual({
      gtin: '0012345678905',
      mpn: 'MPN-1',
      releaseDate: '2026-03-23',
    })
  })

  it('omits every identifier that is empty', () => {
    expect(
      toProductJsonLdIdentifiers({ gtin: '', mpn: '', releaseDate: '' })
    ).toEqual({})
  })

  it('omits a releaseDate that cannot be parsed', () => {
    expect(
      toProductJsonLdIdentifiers({
        gtin: '',
        mpn: '',
        releaseDate: 'not-a-date',
      })
    ).toEqual({})
  })
})
