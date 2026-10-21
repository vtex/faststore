import DataLoader from 'dataloader'
import type { Options } from '../../../typings/globals'

import { NotFoundError } from '../../errors'
import type { Clients } from '../clients'
import type { EnhancedSku } from '../utils/enhanceSku'
import { enhanceSku } from '../utils/enhanceSku'

export const getSkuLoader = ({ flags }: Options, clients: Clients) => {
  const loader = async (keys: readonly string[]) => {
    const skuIds = keys.map((key) => key.split('-')[0])
    const showInvisibleItems = keys.some(
      (key) => key.split('-')[1] === 'invisibleItems'
    )

    const products = await clients.search.productsByIdentifier({
      field: 'sku',
      values: skuIds,
      showInvisibleItems,
      ...(flags?.enableUnavailableItemsOnCart && {
        hideUnavailableItems: false,
      }),
    })

    const skuBySkuId = products.reduce(
      (acc, product) => {
        for (const sku of product.items) {
          acc[sku.itemId] = enhanceSku(sku, product)
        }

        return acc
      },
      {} as Record<string, EnhancedSku>
    )

    // Reject only the keys Search did not return: one hidden SKU (e.g. a
    // service sold as an assembly option) must not fail the other keys of the
    // batch, such as the rest of a cart.
    return skuIds.map(
      (skuId) =>
        skuBySkuId[skuId] ??
        new NotFoundError(
          `Search API did not found the following skus: ${skuId}`
        )
    )
  }

  return new DataLoader<string, EnhancedSku>(loader, {
    maxBatchSize: 99, // Max allowed batch size of Search API
  })
}
