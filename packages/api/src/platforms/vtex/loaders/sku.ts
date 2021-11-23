import DataLoader from 'dataloader'

import { enhanceSku } from '../utils/enhanceSku'
import type { EnhancedSku } from '../utils/enhanceSku'
import type { Options } from '..'
import type { Clients } from '../clients'
import type { SelectedFacet } from '../utils/facets'
import { BadRequestError } from '../utils/errors'

export const getSkuLoader = (_: Options, clients: Clients) => {
  const loader = async (facetsList: readonly SelectedFacet[][]) => {
    const skuIds = facetsList.map((facets) => {
      const maybeFacet = facets.find(({ key }) => key === 'id')

      if (!maybeFacet) {
        throw new BadRequestError(
          'Error while loading SKU. Needs to pass an id to selected facets'
        )
      }

      return maybeFacet.value
    })

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
      throw new BadRequestError(
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

  return new DataLoader<SelectedFacet[], EnhancedSku>(loader, {
    maxBatchSize: 99, // Max allowed batch size of Search API
  })
}
