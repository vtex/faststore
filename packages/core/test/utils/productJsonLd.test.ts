import { describe, expect, it } from 'vitest'
import { toProductJsonLdOffer } from '../../src/utils/productJsonLd'

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
})
