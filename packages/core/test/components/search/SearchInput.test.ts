import { describe, expect, it } from 'vitest'

import { mapOrderFormItemsToProducts } from '../../../src/components/search/SearchInput/SearchInput'

const makeItem = (overrides = {}) => ({
  id: 'sku-1',
  name: 'Product A',
  price: 100,
  listPrice: 120,
  quantity: 2,
  imageUrl: 'https://example.com/img.jpg',
  availability: 'available',
  seller: '1',
  unitMultiplier: 1,
  ...overrides,
})

describe('mapOrderFormItemsToProducts', () => {
  it('maps a single available item correctly', () => {
    const result = mapOrderFormItemsToProducts([makeItem()])

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      id: 'sku-1',
      name: 'Product A',
      price: 100,
      quantityUpdated: false,
      image: { url: 'https://example.com/img.jpg', alternateName: 'Product A' },
      inventory: 9999,
      availability: 'available',
      selectedCount: 2,
    })
  })

  it('sets inventory to 0 and availability to outOfStock for unavailable items', () => {
    const result = mapOrderFormItemsToProducts([
      makeItem({ availability: 'unavailable' }),
    ])

    expect(result[0].inventory).toBe(0)
    expect(result[0].availability).toBe('outOfStock')
  })

  it('falls back to empty string when imageUrl is null', () => {
    const result = mapOrderFormItemsToProducts([makeItem({ imageUrl: null })])

    expect(result[0].image.url).toBe('')
  })

  it('returns empty array for empty input', () => {
    expect(mapOrderFormItemsToProducts([])).toEqual([])
  })

  it('maps multiple items preserving order', () => {
    const items = [
      makeItem({ id: 'a', name: 'A', quantity: 1 }),
      makeItem({ id: 'b', name: 'B', quantity: 3 }),
    ]

    const result = mapOrderFormItemsToProducts(items)

    expect(result[0].id).toBe('a')
    expect(result[1].id).toBe('b')
    expect(result[0].selectedCount).toBe(1)
    expect(result[1].selectedCount).toBe(3)
  })

  it('always sets quantityUpdated to false', () => {
    const result = mapOrderFormItemsToProducts([makeItem()])
    expect(result[0].quantityUpdated).toBe(false)
  })
})
