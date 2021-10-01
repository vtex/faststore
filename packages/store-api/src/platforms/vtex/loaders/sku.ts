import DataLoader from 'dataloader'

import { enhanceSku } from '../utils/enhanceSku'
import type { EnhancedSku } from '../utils/enhanceSku'
import type { Options } from '..'
import type { Clients } from '../clients'

export const getSkuLoader = (_: Options, clients: Clients) => {
  const loader = async (skuIds: readonly string[]) => {
    const indexById = skuIds.reduce(
      (acc, id, index) => ({ ...acc, [id]: index }),
      {} as Record<string, number>
    )

    const { products } = await clients.search.products({
      query: `sku:${skuIds.join(';')}`,
      page: 0,
      count: skuIds.length,
    })

    if (products.length !== skuIds.length) {
      throw new Error(
        `Sku batching went wrong. Asked for ${skuIds.length} sku(s) but search api returned ${products.length} sku(s)`
      )
    }

    const sorted = new Array<EnhancedSku>(products.length)

    // O(n*m) sort, where n = skuIds.length and m is the number of skus per product
    for (const product of products) {
      const sku = product.skus.find((item) => indexById[item.id] != null)

      if (sku == null) {
        throw new Error(`Could not find sku for product ${product.id}`)
      }

      const index = indexById[sku.id]

      sorted[index] = enhanceSku(sku, product)
    }

    return sorted
  }

  return new DataLoader<string, EnhancedSku>(loader, {
    maxBatchSize: 50, // Warning: Don't change this value, this the max allowed batch size of Search API
  })
}
