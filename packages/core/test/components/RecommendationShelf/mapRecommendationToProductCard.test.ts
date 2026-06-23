import { describe, expect, it } from 'vitest'

import { mapRecommendationToProductCard } from 'src/components/RecommendationShelf/mapRecommendationToProductCard'

const fullProduct = {
  productId: 'p-1',
  productName: 'Cool Shoes',
  brand: 'Acme',
  linkText: 'cool-shoes',
  items: [
    {
      itemId: 'sku-1',
      name: 'Cool Shoes',
      nameComplete: 'Cool Shoes - Blue',
      images: [{ imageUrl: 'https://img/1.png', imageText: 'blue shoe' }],
      sellers: [
        {
          sellerId: '2',
          sellerDefault: false,
          commertialOffer: { Price: 50, ListPrice: 80, AvailableQuantity: 0 },
        },
        {
          sellerId: '1',
          sellerDefault: true,
          commertialOffer: { Price: 100, ListPrice: 120, AvailableQuantity: 5 },
        },
      ],
    },
  ],
} as any

describe('mapRecommendationToProductCard', () => {
  it('maps the default seller commercial offer and product data', () => {
    const card = mapRecommendationToProductCard(fullProduct)

    expect(card.id).toBe('p-1')
    expect(card.sku).toBe('sku-1')
    expect(card.slug).toBe('cool-shoes')
    expect(card.name).toBe('Cool Shoes - Blue')
    expect(card.brand).toEqual({ name: 'Acme', brandName: 'Acme' })
    expect(card.isVariantOf.productGroupID).toBe('p-1')
    expect(card.image).toEqual([
      { url: 'https://img/1.png', alternateName: 'blue shoe' },
    ])

    const offer = card.offers.offers[0]
    expect(card.offers.lowPrice).toBe(100)
    expect(offer.price).toBe(100)
    expect(offer.listPrice).toBe(120)
    expect(offer.quantity).toBe(5)
    expect(offer.availability).toBe('https://schema.org/InStock')
    expect(offer.seller.identifier).toBe('1')
  })

  it('uses the first seller when none is marked as default', () => {
    const product = {
      productId: 'p-2',
      items: [
        {
          itemId: 'sku-2',
          sellers: [
            {
              sellerId: '9',
              commertialOffer: { Price: 10, AvailableQuantity: 1 },
            },
          ],
        },
      ],
    } as any

    const card = mapRecommendationToProductCard(product)

    expect(card.offers.offers[0].seller.identifier).toBe('9')
    expect(card.offers.offers[0].price).toBe(10)
  })

  it('falls back to safe defaults when data is missing', () => {
    const card = mapRecommendationToProductCard({ productId: 'p-3' } as any)

    expect(card.id).toBe('p-3')
    expect(card.sku).toBe('p-3')
    expect(card.name).toBe('')
    expect(card.image).toEqual([])
    expect(card.brand).toEqual({ name: '', brandName: '' })

    const offer = card.offers.offers[0]
    expect(offer.price).toBe(0)
    expect(offer.quantity).toBe(0)
    expect(offer.availability).toBe('https://schema.org/OutOfStock')
    expect(offer.seller.identifier).toBe('1')
  })
})
