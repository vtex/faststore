import { describe, expect, it } from 'vitest'
import type { Product } from '../../../../../src/platforms/vtex/clients/search/types/ProductSearchResult'
import { canonicalFromProduct } from '../../../../../src/platforms/vtex/utils/canonical'

describe('canonicalFromProduct', () => {
  it('Should return proper link', () => {
    const product = {
      linkText: 'product-name',
    }
    expect(canonicalFromProduct(product as Product)).toBe('/product-name/p')
  })
})
