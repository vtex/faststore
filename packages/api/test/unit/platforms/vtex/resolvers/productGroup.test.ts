import { describe, expect, it } from 'vitest'

import { StoreProductGroup } from '../../../../../src/platforms/vtex/resolvers/productGroup'

describe('StoreProductGroup', () => {
  describe('productClusters', () => {
    it('returns product clusters from Intelligent Search', () => {
      const productClusters = [{ id: '140', name: 'Most Wanted' }]
      const root = { isVariantOf: { productClusters } } as any

      expect((StoreProductGroup.productClusters as any)(root)).toEqual(
        productClusters
      )
    })

    it('returns an empty list when Intelligent Search omits product clusters', () => {
      const root = { isVariantOf: {} } as any

      expect((StoreProductGroup.productClusters as any)(root)).toEqual([])
    })
  })
})
