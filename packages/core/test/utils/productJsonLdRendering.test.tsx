import { ProductJsonLd } from 'next-seo'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { toProductJsonLdOffer } from '../../src/utils/productJsonLd'

/**
 * Pins the next-seo behaviour the PDP's JSON-LD depends on.
 *
 * `p.tsx` omits `mpn`, `gtin` and `releaseDate` by conditional spread rather
 * than passing empty strings, and drops `seller` from the offer allowlist. Both
 * choices only work because of how next-seo builds the script — it forwards
 * unknown props untouched (so `""` would be published) and turns any truthy
 * `seller` into an `Organization`, even when it has no name. A next-seo upgrade
 * that changed either would silently reintroduce the defects from ticket
 * #1449246, so the behaviour is asserted here instead of assumed.
 */

// `useAppDir` renders the script directly; without it next-seo emits through
// next/head, which produces no markup outside a Next document.
const renderJsonLd = (props: Record<string, unknown>) => {
  const html = renderToStaticMarkup(
    <ProductJsonLd useAppDir productName="Product" images={[]} {...props} />
  )

  return JSON.parse(html.replace(/^[\s\S]*?>([\s\S]*)<\/script>[\s\S]*$/, '$1'))
}

describe('next-seo ProductJsonLd contract', () => {
  it('publishes an empty string when a prop is passed empty', () => {
    expect(renderJsonLd({ mpn: '' })).toHaveProperty('mpn', '')
  })

  it('omits the key when the prop is absent — what the conditional spread relies on', () => {
    expect(renderJsonLd({})).not.toHaveProperty('mpn')
  })

  it('emits a nameless Organization for a seller that has no name', () => {
    const jsonLd = renderJsonLd({
      offers: { price: 1, seller: { identifier: '1' } },
    })

    expect(jsonLd.offers.seller).toEqual({ '@type': 'Organization' })
  })

  it('leaves the mapper output intact, adding only @type', () => {
    const offers = toProductJsonLdOffer(
      {
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        price: 0.2,
        priceValidUntil: '2027-08-24T19:48:25Z',
        priceWithTaxes: 0.2,
        listPrice: 0.2,
        listPriceWithTaxes: 0.2,
        quantity: 10000,
        priceToken: 'a-short-lived-pricing-token',
        seller: { identifier: '1' },
      } as any,
      { priceCurrency: 'USD', url: 'https://store.example/p' }
    )

    const jsonLd = renderJsonLd({ offers })

    expect(jsonLd.offers).toEqual({
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      price: 0.2,
      priceCurrency: 'USD',
      priceValidUntil: '2027-08-24T19:48:25Z',
      url: 'https://store.example/p',
    })
  })
})
