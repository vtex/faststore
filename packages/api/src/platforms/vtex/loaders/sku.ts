import DataLoader from 'dataloader'

import { enhanceSku } from '../utils/enhanceSku'
import { NotFoundError } from '../../errors'
import type { EnhancedSku } from '../utils/enhanceSku'
import type { Options } from '..'
import type { Clients } from '../clients'

export const getSkuLoader = (_: Options, clients: Clients) => {
  const loader = async (keys: readonly string[]) => {
    const skuIds = keys.map((key) => key.split('-')[0]);
    const showInvisibleItems = keys.some((key) => key.split('-')[1] === 'invisibleItems')

    const { products } = await clients.search.products({
      query: `sku:${skuIds.join(';')}`,
      page: 0,
      count: skuIds.length,
      showInvisibleItems
    })

    const skuBySkuId = products.reduce((acc, product) => {
      for (const sku of product.items) {
        acc[sku.itemId] = enhanceSku(sku, product)
      }

      return acc
    }, {} as Record<string, EnhancedSku>)

    const skus = skuIds.map((skuId) => skuBySkuId[skuId])
    const missingSkus = skuIds.filter((skuId) => !skuBySkuId[skuId])

    if (missingSkus.length > 0) {
      throw new NotFoundError(
        `Search API did not found the following skus: ${missingSkus.join(',')}`
      )
    }

    return skus
  }

  return new DataLoader<string, EnhancedSku>(loader, {
    maxBatchSize: 99, // Max allowed batch size of Search API
  })
}
